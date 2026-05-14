import type { GroupProduct, GroupRow } from "./groupTableData"

export type OptimisticGroupOrderPatch = {
  orderedProductIds: GroupProduct["_id"][]
  updatedAt: number
}

export type OptimisticGroupOrders = Partial<Record<GroupRow["_id"], OptimisticGroupOrderPatch>>

function sortedIdKey(ids: readonly GroupProduct["_id"][]) {
  return [...ids].map(String).sort((a, b) => a.localeCompare(b)).join("\0")
}

function sameProductMultiset(
  serverIds: readonly GroupProduct["_id"][],
  candidateIds: readonly GroupProduct["_id"][],
): boolean {
  return serverIds.length === candidateIds.length && sortedIdKey(serverIds) === sortedIdKey(candidateIds)
}

export function applyOptimisticGroupProductOrder(
  group: GroupRow,
  patch: OptimisticGroupOrderPatch | undefined,
): GroupRow {
  if (!patch) {
    return group
  }

  const serverIds = group.products.map((p) => p._id)

  if (!sameProductMultiset(serverIds, patch.orderedProductIds)) {
    return group
  }

  const byId = new Map(group.products.map((p) => [p._id, p]))
  const nextProducts: GroupProduct[] = []

  for (const id of patch.orderedProductIds) {
    const product = byId.get(id)

    if (!product) {
      return group
    }

    nextProducts.push(product)
  }

  return { ...group, products: nextProducts }
}

export function pruneStaleGroupOrderPatches(
  patches: OptimisticGroupOrders,
  serverGroups: GroupRow[],
): OptimisticGroupOrders {
  if (Object.keys(patches).length === 0) {
    return patches
  }

  const byId = new Map(serverGroups.map((g) => [g._id, g]))
  let next: OptimisticGroupOrders | null = null

  for (const groupId of Object.keys(patches) as GroupRow["_id"][]) {
    const patch = patches[groupId]
    const group = byId.get(groupId)

    if (
      !group ||
      !patch ||
      !sameProductMultiset(
        group.products.map((p) => p._id),
        patch.orderedProductIds,
      )
    ) {
      if (!next) {
        next = { ...patches }
      }

      delete next[groupId]
    }
  }

  return next ?? patches
}

export function removeOptimisticGroupOrderPatch(
  patches: OptimisticGroupOrders,
  groupId: GroupRow["_id"],
  updatedAt: number,
): OptimisticGroupOrders {
  const patch = patches[groupId]

  if (!patch || patch.updatedAt !== updatedAt) {
    return patches
  }

  const next = { ...patches }
  delete next[groupId]
  return next
}
