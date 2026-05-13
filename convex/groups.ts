import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

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
    throw new ConvexError("Sign in again to view groups.");
  }

  return session.userId;
};

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const groups = await ctx.db
      .query("groups")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return await Promise.all(
      groups.map(async (group) => {
        const joins = await ctx.db
          .query("productGroups")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();
        const products = await Promise.all(
          joins
            .filter((join) => join.userId === userId)
            .map(async (join) => {
              const product = await ctx.db.get(join.productId);
              if (!product || product.userId !== userId) {
                return null;
              }

              const printData = await ctx.db
                .query("printData")
                .withIndex("by_user_product", (q) =>
                  q.eq("userId", userId).eq("productId", product._id),
                )
                .unique();

              return { ...product, printData };
            }),
        );

        return {
          ...group,
          products: products.filter((product): product is NonNullable<typeof product> =>
            Boolean(product),
          ),
        };
      }),
    );
  },
});

export const create = mutation({
  args: { sessionToken: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    if (!name) {
      throw new ConvexError("Group name is required.");
    }

    const now = Date.now();
    const userId = await getSessionUserId(ctx, args.sessionToken);

    return await ctx.db.insert("groups", {
      userId,
      name,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addProduct = mutation({
  args: {
    sessionToken: v.string(),
    groupId: v.id("groups"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const [group, product] = await Promise.all([
      ctx.db.get(args.groupId),
      ctx.db.get(args.productId),
    ]);

    if (!group || group.userId !== userId) {
      throw new ConvexError("Group not found.");
    }

    if (!product || product.userId !== userId) {
      throw new ConvexError("Product not found.");
    }

    const existing = await ctx.db
      .query("productGroups")
      .withIndex("by_group_product", (q) =>
        q.eq("groupId", args.groupId).eq("productId", args.productId),
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    await ctx.db.patch(args.groupId, { updatedAt: Date.now() });

    return await ctx.db.insert("productGroups", {
      userId,
      groupId: args.groupId,
      productId: args.productId,
      createdAt: Date.now(),
    });
  },
});

export const addProducts = mutation({
  args: {
    sessionToken: v.string(),
    groupId: v.id("groups"),
    productIds: v.array(v.id("products")),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const group = await ctx.db.get(args.groupId);

    if (!group || group.userId !== userId) {
      throw new ConvexError("Group not found.");
    }

    const now = Date.now();
    const joinIds = [];

    for (const productId of args.productIds) {
      const product = await ctx.db.get(productId);

      if (!product || product.userId !== userId) {
        throw new ConvexError("Product not found.");
      }

      const existing = await ctx.db
        .query("productGroups")
        .withIndex("by_group_product", (q) =>
          q.eq("groupId", args.groupId).eq("productId", productId),
        )
        .unique();

      if (existing) {
        joinIds.push(existing._id);
        continue;
      }

      joinIds.push(
        await ctx.db.insert("productGroups", {
          userId,
          groupId: args.groupId,
          productId,
          createdAt: now,
        }),
      );
    }

    if (args.productIds.length) {
      await ctx.db.patch(args.groupId, { updatedAt: now });
    }

    return joinIds;
  },
});

export const removeProduct = mutation({
  args: {
    sessionToken: v.string(),
    groupId: v.id("groups"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const group = await ctx.db.get(args.groupId);

    if (!group || group.userId !== userId) {
      throw new ConvexError("Group not found.");
    }

    const join = await ctx.db
      .query("productGroups")
      .withIndex("by_group_product", (q) =>
        q.eq("groupId", args.groupId).eq("productId", args.productId),
      )
      .unique();

    if (join && join.userId === userId) {
      await Promise.all([
        ctx.db.delete(join._id),
        ctx.db.patch(args.groupId, { updatedAt: Date.now() }),
      ]);
    }
  },
});
