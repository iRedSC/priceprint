import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

export function compareProductGroupJoins(
  a: Doc<"productGroups">,
  b: Doc<"productGroups">,
): number {
  const keyA = a.sortOrder ?? a.createdAt;
  const keyB = b.sortOrder ?? b.createdAt;

  if (keyA !== keyB) {
    return keyA - keyB;
  }

  return String(a._id).localeCompare(String(b._id));
}

export function sortProductGroupJoins<T extends Doc<"productGroups">>(joins: T[]): T[] {
  return [...joins].sort(compareProductGroupJoins);
}

export async function ensureDenseSortOrders(
  ctx: MutationCtx,
  args: { groupId: Id<"groups">; userId: Id<"users"> },
): Promise<void> {
  const joins = sortProductGroupJoins(
    (
      await ctx.db
        .query("productGroups")
        .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
        .collect()
    ).filter((join) => join.userId === args.userId),
  );

  await Promise.all(joins.map((join, index) => ctx.db.patch(join._id, { sortOrder: index })));
}
