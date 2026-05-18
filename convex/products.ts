import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const productFields = {
  sku: v.optional(v.string()),
  upc: v.optional(v.string()),
  name: v.string(),
  img: v.optional(v.string()),
  type: v.optional(v.string()),
  variant: v.optional(v.string()),
  vendor: v.optional(v.string()),
  price: v.number(),
  meta: v.optional(v.any()),
};

const uploadDuplicateModes = v.union(v.literal("ignore"), v.literal("overwrite"));

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

const normalizeOptionalCode = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length ? trimmed : undefined;
};

function normalizeProductCodes<T extends { sku?: string; upc?: string }>(
  product: T,
): Omit<T, "sku" | "upc"> & { sku?: string; upc?: string } {
  return {
    ...product,
    sku: normalizeOptionalCode(product.sku),
    upc: normalizeOptionalCode(product.upc),
  };
}

function assertUniqueCodesInBatch(products: Array<{ sku?: string; upc?: string }>) {
  const seenSkus = new Set<string>();
  const seenUpcs = new Set<string>();

  for (const product of products) {
    if (product.upc) {
      if (seenUpcs.has(product.upc)) {
        throw new ConvexError(`UPC "${product.upc}" is duplicated in this import.`);
      }
      seenUpcs.add(product.upc);
    }

    if (product.sku) {
      if (seenSkus.has(product.sku)) {
        throw new ConvexError(`SKU "${product.sku}" is duplicated in this import.`);
      }
      seenSkus.add(product.sku);
    }
  }
}

async function findDuplicateProductByCode(
  ctx: MutationCtx,
  userId: Id<"users">,
  field: "sku" | "upc",
  value: string,
  exceptProductId?: Id<"products">,
): Promise<Doc<"products"> | null> {
  const rows =
    field === "upc"
      ? await ctx.db
          .query("products")
          .withIndex("by_user_upc", (q) => q.eq("userId", userId).eq("upc", value))
          .collect()
      : await ctx.db
          .query("products")
          .withIndex("by_user_sku", (q) => q.eq("userId", userId).eq("sku", value))
          .collect();

  return rows.find((row) => row._id !== exceptProductId) ?? null;
}

async function assertUniqueProductCodes(
  ctx: MutationCtx,
  userId: Id<"users">,
  product: { sku?: string; upc?: string },
  exceptProductId?: Id<"products">,
) {
  if (product.upc) {
    const duplicate = await findDuplicateProductByCode(ctx, userId, "upc", product.upc, exceptProductId);

    if (duplicate) {
      throw new ConvexError(`UPC "${product.upc}" is already used by another product.`);
    }
  }

  if (product.sku) {
    const duplicate = await findDuplicateProductByCode(ctx, userId, "sku", product.sku, exceptProductId);

    if (duplicate) {
      throw new ConvexError(`SKU "${product.sku}" is already used by another product.`);
    }
  }
}

async function findExistingProductByCode(
  ctx: MutationCtx,
  userId: Id<"users">,
  normalized: { sku?: string; upc?: string },
): Promise<Doc<"products"> | null> {
  if (normalized.upc) {
    const row = await findDuplicateProductByCode(ctx, userId, "upc", normalized.upc);

    if (row) {
      return row;
    }
  }

  if (normalized.sku) {
    return await findDuplicateProductByCode(ctx, userId, "sku", normalized.sku);
  }

  return null;
}

async function findExistingProductForScan(
  ctx: MutationCtx,
  userId: Id<"users">,
  normalized: { sku?: string; upc?: string },
): Promise<Doc<"products"> | null> {
  if (normalized.upc) {
    const rows = await ctx.db
      .query("products")
      .withIndex("by_user_upc", (q) => q.eq("userId", userId).eq("upc", normalized.upc))
      .collect();

    if (rows.length) {
      return rows.reduce((best, row) => (row.createdAt > best.createdAt ? row : best));
    }
  }

  if (normalized.sku) {
    const rows = await ctx.db
      .query("products")
      .withIndex("by_user_sku", (q) => q.eq("userId", userId).eq("sku", normalized.sku))
      .collect();

    if (rows.length) {
      return rows.reduce((best, row) => (row.createdAt > best.createdAt ? row : best));
    }
  }

  return null;
}

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const products = await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return await Promise.all(
      products.map(async (product) => {
        const printData = await ctx.db
          .query("printData")
          .withIndex("by_user_product", (q) =>
            q.eq("userId", userId).eq("productId", product._id),
          )
          .unique();

        return { ...product, printData };
      }),
    );
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
    const product = normalizeProductCodes(args.product);

    await assertUniqueProductCodes(ctx, userId, product);

    return await ctx.db.insert("products", {
      ...product,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Same shape as create, but updates an existing row when UPC or SKU matches (scan refresh). */
export const upsertFromScan = mutation({
  args: {
    sessionToken: v.string(),
    product: v.object(productFields),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const product = normalizeProductCodes(args.product);

    const existing = await findExistingProductForScan(ctx, userId, product);

    if (existing) {
      await assertUniqueProductCodes(ctx, userId, product, existing._id);

      await ctx.db.patch(existing._id, {
        ...product,
        updatedAt: now,
      });

      return existing._id;
    }

    await assertUniqueProductCodes(ctx, userId, product);

    return await ctx.db.insert("products", {
      ...product,
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
    duplicateMode: uploadDuplicateModes,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const products = args.products.map(normalizeProductCodes);
    const result = { inserted: 0, updated: 0, ignored: 0 };

    assertUniqueCodesInBatch(products);

    for (const product of products) {
      const existing = await findExistingProductByCode(ctx, userId, product);

      if (existing && args.duplicateMode === "ignore") {
        result.ignored += 1;
        continue;
      }

      if (existing) {
        await assertUniqueProductCodes(ctx, userId, product, existing._id);
        await ctx.db.patch(existing._id, {
          ...product,
          updatedAt: now,
        });
        result.updated += 1;
        continue;
      }

      await assertUniqueProductCodes(ctx, userId, product);
      await ctx.db.insert("products", {
        ...product,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      result.inserted += 1;
    }

    return result;
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    productId: v.id("products"),
    product: v.object(productFields),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new ConvexError("Product not found.");
    }

    const nextProduct = normalizeProductCodes(args.product);
    await assertUniqueProductCodes(ctx, userId, nextProduct, args.productId);

    await ctx.db.patch(args.productId, {
      ...nextProduct,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const product = await ctx.db.get(args.productId);

    if (!product || product.userId !== userId) {
      throw new ConvexError("Product not found.");
    }

    const productGroups = await ctx.db
      .query("productGroups")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    const printRows = await ctx.db
      .query("printData")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    await Promise.all([
      ...productGroups
        .filter((productGroup) => productGroup.userId === userId)
        .map((productGroup) => ctx.db.delete(productGroup._id)),
      ...printRows
        .filter((printRow) => printRow.userId === userId)
        .map((printRow) => ctx.db.delete(printRow._id)),
      ctx.db.delete(args.productId),
    ]);
  },
});
