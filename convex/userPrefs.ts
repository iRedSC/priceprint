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
    throw new ConvexError("Sign in again to manage settings.");
  }

  return session.userId;
};

export const getLabelLiveDesign = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const user = await ctx.db.get(userId);

    return user?.labelLiveDesignName?.trim() ?? null;
  },
});

export const getLabelLiveSettings = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const user = await ctx.db.get(userId);
    const legacyDesignName = user?.labelLiveDesignName?.trim() ?? null;

    return {
      designName: legacyDesignName,
      upcDesignName: user?.labelLiveUpcDesignName?.trim() ?? legacyDesignName,
      skuDesignName: user?.labelLiveSkuDesignName?.trim() ?? legacyDesignName,
      printerId: user?.labelLivePrinterId?.trim() ?? null,
    };
  },
});

export const setLabelLiveDesignName = mutation({
  args: { sessionToken: v.string(), designName: v.string() },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const trimmed = args.designName.trim();

    await ctx.db.patch(userId, {
      labelLiveDesignName: trimmed || undefined,
      updatedAt: Date.now(),
    });
  },
});

export const setLabelLiveSettings = mutation({
  args: {
    sessionToken: v.string(),
    upcDesignName: v.string(),
    skuDesignName: v.string(),
    printerId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getSessionUserId(ctx, args.sessionToken);
    const upcDesignName = args.upcDesignName.trim();
    const skuDesignName = args.skuDesignName.trim();
    const printerId = args.printerId.trim();

    await ctx.db.patch(userId, {
      labelLiveDesignName: upcDesignName || skuDesignName || undefined,
      labelLiveUpcDesignName: upcDesignName || undefined,
      labelLiveSkuDesignName: skuDesignName || undefined,
      labelLivePrinterId: printerId || undefined,
      updatedAt: Date.now(),
    });
  },
});
