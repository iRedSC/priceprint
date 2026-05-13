import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { query, type MutationCtx, type QueryCtx } from "./_generated/server";

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
    throw new ConvexError("Sign in again.");
  }

  return session.userId;
};

/** Same rules as frontend `getProductPrintStatus` / `productPrintData`. */
function productNeedsPrinting(product: Doc<"products">, printRow: Doc<"printData"> | null): boolean {
  if (!printRow || typeof printRow.lastPrintedPrice !== "number") {
    return true;
  }

  return printRow.lastPrintedPrice !== product.price;
}

function startUtcDayMs(at: number) {
  const d = new Date(at);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export const summary = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const now = Date.now();
    const utcDayStart = startUtcDayMs(now);

    const [groupsDocs, productsDocs, joins, connections, printRows] = await Promise.all([
      ctx.db
        .query("groups")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("products")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("productGroups")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("shopifyConnections")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("printData")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    const printsByProduct = new Map(printRows.map((row) => [row.productId, row]));

    let scannedIntoGroupsToday = 0;
    for (const join of joins) {
      if (join.createdAt >= utcDayStart) {
        scannedIntoGroupsToday++;
      }
    }

    const joinCountByGroup = new Map<string, number>();
    const joinsByGroup = new Map<string, typeof joins>();
    for (const join of joins) {
      joinCountByGroup.set(join.groupId, (joinCountByGroup.get(join.groupId) ?? 0) + 1);
      const bucket = joinsByGroup.get(join.groupId);
      if (bucket) {
        bucket.push(join);
      } else {
        joinsByGroup.set(join.groupId, [join]);
      }
    }

    let groupsWithPrintAttention = 0;
    for (const group of groupsDocs) {
      const gj = joinsByGroup.get(group._id);
      let attention = false;
      if (gj) {
        for (const join of gj) {
          const product = await ctx.db.get(join.productId);
          if (!product || product.userId !== userId) {
            continue;
          }
          const printRow = printsByProduct.get(join.productId) ?? null;
          if (productNeedsPrinting(product, printRow)) {
            attention = true;
            break;
          }
        }
      }
      if (attention) {
        groupsWithPrintAttention++;
      }
    }

    const sortedGroups = [...groupsDocs].sort(
      (a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt),
    );
    const recentGroups = sortedGroups.slice(0, 5).map((g) => ({
      _id: g._id,
      name: g.name,
      productCount: joinCountByGroup.get(g._id) ?? 0,
    }));

    let activeShopDomain: string | undefined;
    let shopifyConnected = false;
    if (connections.length) {
      const best = [...connections].sort(
        (a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt),
      )[0]!;
      shopifyConnected = best.isActive;
      activeShopDomain = best.shopDomain;
    }

    return {
      groupCount: groupsDocs.length,
      productCount: productsDocs.length,
      scannedIntoGroupsToday,
      groupsWithPrintAttention,
      shopifyConnected,
      shopDomain: activeShopDomain,
      recentGroups,
    };
  },
});
