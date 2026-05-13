"use node";

import crypto from "node:crypto";
import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";

const SHOPIFY_SCOPES = ["read_products"];

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

export const startShopifyInstall = action({
  args: {
    shopDomain: v.string(),
    redirectUri: v.string(),
  },
  handler: async (_, args) => {
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new ConvexError(
        "Missing Shopify Convex env vars: SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.",
      );
    }

    const params = new URLSearchParams({
      client_id: clientId,
      scope: SHOPIFY_SCOPES.join(","),
      redirect_uri: args.redirectUri,
      state: crypto.randomUUID(),
    });

    return {
      authUrl: `https://${normalizeShopDomain(args.shopDomain)}/admin/oauth/authorize?${params.toString()}`,
    };
  },
});
