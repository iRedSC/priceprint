import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { sortProductGroupJoins } from "./groupProductOrder";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

const hashValue = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const getSessionUserId = async (
  ctx: MutationCtx | QueryCtx,
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

type GroupMember = {
  product: Doc<"products">;
  printData: Doc<"printData"> | null;
};

async function fetchGroupMembers(
  ctx: MutationCtx,
  userId: Id<"users">,
  groupId: Id<"groups">,
): Promise<GroupMember[]> {
  const group = await ctx.db.get(groupId);

  if (!group || group.userId !== userId) {
    throw new ConvexError("Group not found.");
  }

  const joins = sortProductGroupJoins(
    (
      await ctx.db
        .query("productGroups")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .collect()
    ).filter((join) => join.userId === userId),
  );

  const out: GroupMember[] = [];

  for (const join of joins) {
    const product = await ctx.db.get(join.productId);

    if (!product || product.userId !== userId) {
      continue;
    }

    const printData = await ctx.db
      .query("printData")
      .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", product._id))
      .unique();

    out.push({ product, printData: printData ?? null });
  }

  return out;
}

function memberMatchesScope(
  member: GroupMember,
  scope: "all" | "out-of-date" | "unprinted",
): boolean {
  const { printData } = member;

  switch (scope) {
    case "all":
      return true;
    case "out-of-date":
      return (
        typeof printData?.lastPrintedPrice === "number" &&
        printData.lastPrintedPrice !== member.product.price
      );
    case "unprinted":
      return typeof printData?.lastPrintedPrice !== "number";
  }
}

export const hasUndoablePrintBatch = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);

    const job = await ctx.db
      .query("printJobs")
      .withIndex("by_user_status_created", (q) =>
        q.eq("userId", userId).eq("status", "active"),
      )
      .order("desc")
      .first();

    return job !== null;
  },
});

export const recordGroupPrint = mutation({
  args: {
    sessionToken: v.string(),
    groupId: v.id("groups"),
    scope: v.union(v.literal("all"), v.literal("out-of-date"), v.literal("unprinted")),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const members = await fetchGroupMembers(ctx, userId, args.groupId);
    const picks = members.filter((m) => memberMatchesScope(m, args.scope));

    if (!picks.length) {
      throw new ConvexError("No matching products in this group.");
    }

    const now = Date.now();

    type LineItem = {
      productId: Id<"products">;
      hadPrintDataRowBefore: boolean;
      previousLastPrintedAt: number | undefined;
      previousLastPrintedPrice: number | undefined;
      printedAt: number;
      printedPrice: number;
    };

    const items: LineItem[] = [];

    for (const { product, printData: existingPrint } of picks) {
      items.push({
        productId: product._id,
        hadPrintDataRowBefore: Boolean(existingPrint),
        previousLastPrintedAt: existingPrint?.lastPrintedAt,
        previousLastPrintedPrice: existingPrint?.lastPrintedPrice,
        printedAt: now,
        printedPrice: product.price,
      });

      if (existingPrint) {
        await ctx.db.patch(existingPrint._id, {
          lastPrintedAt: now,
          lastPrintedPrice: product.price,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("printData", {
          userId,
          productId: product._id,
          lastPrintedAt: now,
          lastPrintedPrice: product.price,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    const jobId = await ctx.db.insert("printJobs", {
      userId,
      groupId: args.groupId,
      scope: args.scope,
      status: "active",
      createdAt: now,
      lineItems: items,
    });

    return { jobId, printedCount: items.length };
  },
});

export const recordProductPrint = mutation({
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

    const existingPrint = await ctx.db
      .query("printData")
      .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", product._id))
      .unique();

    const now = Date.now();

    type LineItem = {
      productId: Id<"products">;
      hadPrintDataRowBefore: boolean;
      previousLastPrintedAt: number | undefined;
      previousLastPrintedPrice: number | undefined;
      printedAt: number;
      printedPrice: number;
    };

    const lineItem: LineItem = {
      productId: product._id,
      hadPrintDataRowBefore: Boolean(existingPrint),
      previousLastPrintedAt: existingPrint?.lastPrintedAt,
      previousLastPrintedPrice: existingPrint?.lastPrintedPrice,
      printedAt: now,
      printedPrice: product.price,
    };

    if (existingPrint) {
      await ctx.db.patch(existingPrint._id, {
        lastPrintedAt: now,
        lastPrintedPrice: product.price,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("printData", {
        userId,
        productId: product._id,
        lastPrintedAt: now,
        lastPrintedPrice: product.price,
        createdAt: now,
        updatedAt: now,
      });
    }

    const jobId = await ctx.db.insert("printJobs", {
      userId,
      scope: "single",
      status: "active",
      createdAt: now,
      lineItems: [lineItem],
    });

    return { jobId, printedCount: 1 };
  },
});

/** Sets last printed price to the current product price without recording a print job (e.g. shelf already correct). */
export const markProductUpToDate = mutation({
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

    const existingPrint = await ctx.db
      .query("printData")
      .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", product._id))
      .unique();

    const now = Date.now();

    if (existingPrint) {
      await ctx.db.patch(existingPrint._id, {
        lastPrintedAt: now,
        lastPrintedPrice: product.price,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("printData", {
        userId,
        productId: product._id,
        lastPrintedAt: now,
        lastPrintedPrice: product.price,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const undoLatestPrintJob = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);

    const job = await ctx.db
      .query("printJobs")
      .withIndex("by_user_status_created", (q) =>
        q.eq("userId", userId).eq("status", "active"),
      )
      .order("desc")
      .first();

    if (!job) {
      throw new ConvexError("No active print batch to undo.");
    }

    const undoAt = Date.now();

    for (const line of job.lineItems) {
      const doc = await ctx.db
        .query("printData")
        .withIndex("by_user_product", (q) => q.eq("userId", userId).eq("productId", line.productId))
        .unique();

      if (!line.hadPrintDataRowBefore) {
        if (!doc) {
          throw new ConvexError(
            "Cannot undo — print rows changed unexpectedly. Try refreshing the app.",
          );
        }

        if (doc.lastPrintedPrice !== line.printedPrice || doc.lastPrintedAt !== line.printedAt) {
          throw new ConvexError("Cannot undo — a newer print was recorded after this batch.");
        }

        await ctx.db.delete(doc._id);
        continue;
      }

      if (!doc) {
        throw new ConvexError("Cannot undo — print rows changed unexpectedly.");
      }

      if (doc.lastPrintedPrice !== line.printedPrice || doc.lastPrintedAt !== line.printedAt) {
        throw new ConvexError("Cannot undo — a newer print was recorded after this batch.");
      }

      await ctx.db.patch(doc._id, {
        lastPrintedPrice: line.previousLastPrintedPrice,
        lastPrintedAt: line.previousLastPrintedAt,
        updatedAt: undoAt,
      });
    }

    await ctx.db.patch(job._id, {
      status: "undone",
      undoneAt: undoAt,
    });

    return { undoneJobId: job._id };
  },
});
