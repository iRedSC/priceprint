import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const productFields = {
  sku: v.optional(v.string()),
  upc: v.optional(v.string()),
  name: v.string(),
  img: v.optional(v.string()),
  type: v.optional(v.string()),
  vendor: v.optional(v.string()),
  price: v.number(),
  meta: v.optional(v.any()),
};

const hashValue = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const getSessionUserId = async (
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
): Promise<Id<"users">> => {
  const tokenHash = await hashValue(sessionToken);
  const session = await ctx.db
    .query("authSessions")
    .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.revokedAt || session.expiresAt < Date.now()) {
    throw new ConvexError("Sign in again to view products.");
  }

  return session.userId;
};

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);

    return await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    product: v.object(productFields),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await getSessionUserId(ctx, args.sessionToken);

    return await ctx.db.insert("products", {
      ...args.product,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createMany = mutation({
  args: {
    sessionToken: v.string(),
    products: v.array(v.object(productFields)),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await getSessionUserId(ctx, args.sessionToken);

    return await Promise.all(
      args.products.map((product) =>
        ctx.db.insert("products", {
          ...product,
          userId,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    );
  },
});
