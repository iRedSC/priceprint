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

type ShopifyVariantNode = {
  sku?: string | null;
  barcode?: string | null;
  price?: string | null;
  image?: { url?: string | null } | null;
  product?: {
    title?: string | null;
    vendor?: string | null;
    productType?: string | null;
    featuredImage?: { url?: string | null } | null;
  } | null;
};

type ShopifyVariantSearchResponse = {
  data?: {
    productVariants?: {
      nodes?: ShopifyVariantNode[];
    };
  };
  errors?: { message?: string }[];
};

type ShopifyLookupProduct = {
  sku?: string;
  upc?: string;
  name: string;
  img?: string;
  type?: string;
  vendor?: string;
  price: number;
  meta: {
    source: "shopify-scan";
    scannedCode: string;
    matchedField: "barcode" | "sku";
  };
};

type ShopifyVariantMatch = {
  field: "barcode" | "sku";
  variant: ShopifyVariantNode;
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

export const myConnections = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const connections = await ctx.db
      .query("shopifyConnections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return connections
      .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt))
      .map((connection) => ({
        shopDomain: connection.shopDomain,
        isActive: connection.isActive,
        scopes: connection.scopes,
        lastSyncAt: connection.lastSyncAt,
        updatedAt: connection.updatedAt,
        createdAt: connection.createdAt,
      }));
  },
});

export const lookupProductByScannedCode = action({
  args: {
    sessionToken: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args): Promise<ShopifyLookupProduct> => {
    const code = args.code.trim();
    if (!code) {
      throw new ConvexError("Scan a barcode before looking up a product.");
    }

    const connection: { shopDomain: string; accessToken: string } | null = await ctx.runQuery(internal.shopifyModel.currentActiveConnection, {
      sessionToken: args.sessionToken,
    });

    if (!connection) {
      throw new ConvexError("Connect Shopify before scanning products.");
    }

    const match: ShopifyVariantMatch | null =
      (await findShopifyVariant(connection.shopDomain, connection.accessToken, "barcode", code)) ??
      (await findShopifyVariant(connection.shopDomain, connection.accessToken, "sku", code));

    if (!match) {
      throw new ConvexError(`No Shopify product found for ${code}.`);
    }

    return toProductInput(match.variant, match.field, code);
  },
});

async function findShopifyVariant(
  shopDomain: string,
  accessToken: string,
  field: "barcode" | "sku",
  code: string,
): Promise<ShopifyVariantMatch | null> {
  const response = await fetch(`https://${shopDomain}/admin/api/2025-10/graphql.json`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-shopify-access-token": accessToken,
    },
    body: JSON.stringify({
      query: `query ProductVariantByCode($query: String!) {
        productVariants(first: 1, query: $query) {
          nodes {
            sku
            barcode
            price
            image {
              url
            }
            product {
              title
              vendor
              productType
              featuredImage {
                url
              }
            }
          }
        }
      }`,
      variables: { query: `${field}:"${escapeShopifyQueryValue(code)}"` },
    }),
  });

  if (!response.ok) {
    throw new ConvexError("Shopify product lookup failed. Try again.");
  }

  const result = (await response.json()) as ShopifyVariantSearchResponse;
  if (result.errors?.length) {
    throw new ConvexError(result.errors[0]?.message ?? "Shopify product lookup failed.");
  }

  const variant = result.data?.productVariants?.nodes?.[0];
  return variant ? { field, variant } : null;
}

function escapeShopifyQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toProductInput(
  variant: ShopifyVariantNode,
  matchedField: "barcode" | "sku",
  scannedCode: string,
): ShopifyLookupProduct {
  const product = variant.product;
  const price = Number(variant.price ?? 0);

  return {
    sku: variant.sku || (matchedField === "sku" ? scannedCode : undefined),
    upc: variant.barcode || (matchedField === "barcode" ? scannedCode : undefined),
    name: product?.title || variant.sku || scannedCode,
    img: variant.image?.url || product?.featuredImage?.url || undefined,
    type: product?.productType || undefined,
    vendor: product?.vendor || undefined,
    price: Number.isFinite(price) ? price : 0,
    meta: {
      source: "shopify-scan",
      scannedCode,
      matchedField,
    },
  };
}

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
