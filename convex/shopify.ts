import { ConvexError, v } from "convex/values";
import { action, httpAction, query, type QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

const SHOPIFY_SCOPES = ["read_products"];
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

type ShopifyAccessTokenResponse = {
  access_token?: string;
  scope?: string;
};

const normalizeShopDomain = (value: string) => {
  const domain = value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();

  if (!domain) {
    throw new ConvexError("Enter a Shopify store domain.");
  }

  return domain.endsWith(".myshopify.com")
    ? domain
    : `${domain.replace(/\.myshopify\.com$/, "")}.myshopify.com`;
};

const assertShopifyEnv = () => {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new ConvexError(
      "Missing Shopify Convex env vars: SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.",
    );
  }

  return { clientId, clientSecret };
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const hashValue = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return toHex(digest);
};

const getSessionUserId = async (ctx: QueryCtx, sessionToken: string): Promise<Id<"users">> => {
  const tokenHash = await hashValue(sessionToken);
  const session = await ctx.db
    .query("authSessions")
    .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.revokedAt || session.expiresAt < Date.now()) {
    throw new ConvexError("Sign in again to view Shopify connection.");
  }

  return session.userId;
};

const constantTimeEqual = (a: string, b: string) => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
};

const verifyShopifyHmac = async (url: URL, clientSecret: string) => {
  const hmac = url.searchParams.get("hmac");

  if (!hmac) {
    return false;
  }

  const message = Array.from(url.searchParams.entries())
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(clientSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));

  return constantTimeEqual(toHex(signature), hmac);
};

const htmlResponse = (title: string, message: string, status = 200) =>
  new Response(
    `<!doctype html><html><head><title>${title}</title></head><body><h1>${title}</h1><p>${message}</p></body></html>`,
    {
      status,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );

export const startShopifyInstall = action({
  args: {
    shopDomain: v.string(),
    redirectUri: v.string(),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { clientId } = assertShopifyEnv();
    const now = Date.now();
    const shopDomain = normalizeShopDomain(args.shopDomain);
    const state = crypto.randomUUID();

    await ctx.runMutation(internal.shopifyModel.createOAuthState, {
      sessionToken: args.sessionToken,
      shopDomain,
      state,
      expiresAt: now + OAUTH_STATE_TTL_MS,
      now,
    });

    const params = new URLSearchParams({
      client_id: clientId,
      scope: SHOPIFY_SCOPES.join(","),
      redirect_uri: args.redirectUri,
      state,
    });

    return {
      authUrl: `https://${shopDomain}/admin/oauth/authorize?${params.toString()}`,
    };
  },
});

export const currentConnection = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const connections = await ctx.db
      .query("shopifyConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const currentConnection = connections
      .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt))
      .at(0);

    if (!currentConnection) {
      return null;
    }

    return {
      shopDomain: currentConnection.shopDomain,
      isActive: currentConnection.isActive,
      scopes: currentConnection.scopes,
      lastSyncAt: currentConnection.lastSyncAt,
      updatedAt: currentConnection.updatedAt,
      createdAt: currentConnection.createdAt,
    };
  },
});

export const handleShopifyCallback = httpAction(async (ctx, request) => {
  const { clientId, clientSecret } = assertShopifyEnv();
  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  if (error) {
    return htmlResponse("Shopify connection failed", error, 400);
  }

  if (!(await verifyShopifyHmac(url, clientSecret))) {
    return htmlResponse("Shopify connection failed", "Invalid Shopify callback signature.", 400);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const shop = url.searchParams.get("shop");

  if (!code || !state || !shop) {
    return htmlResponse("Shopify connection failed", "Missing Shopify callback parameters.", 400);
  }

  const shopDomain = normalizeShopDomain(shop);
  const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!tokenResponse.ok) {
    return htmlResponse(
      "Shopify connection failed",
      "Could not exchange the Shopify authorization code.",
      400,
    );
  }

  const tokenResult = (await tokenResponse.json()) as ShopifyAccessTokenResponse;

  if (!tokenResult.access_token) {
    return htmlResponse("Shopify connection failed", "Shopify did not return an access token.", 400);
  }

  await ctx.runMutation(internal.shopifyModel.storeConnectionFromOAuth, {
    state,
    shopDomain,
    accessToken: tokenResult.access_token,
    scopes: tokenResult.scope ? tokenResult.scope.split(",") : SHOPIFY_SCOPES,
    now: Date.now(),
  });

  return htmlResponse("Shopify connected", "You can close this tab and return to PricePrint.");
});
