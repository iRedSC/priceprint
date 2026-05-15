import { useCallback, useMemo, useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { toast } from "sonner"

import { readStoredSession, type AuthResult } from "@/authSession"
import VirtualDataTable from "@/components/data-table/VirtualDataTable"
import { sendLabelLiveJobs } from "@/lib/labelLiveBatch"
import {
  buildLabelLiveProtocolFallbackMessage,
  buildLabelLiveSendFailedMessage,
  type LabelLiveDebugMessage,
} from "@/lib/labelLiveDebug"
import { productToLabelLiveVariables } from "@/lib/productLabelVariables"
import { api } from "../../../convex/_generated/api"
import { getGroupActionMenuItems } from "./actionMenuData"
import { ActionContextMenuItems, ActionTrayMenuItems } from "./actionMenuItems"
import DashboardResponsiveList from "./DashboardResponsiveList"
import { createGroupColumns } from "./groupColumns"
import { filterGroups } from "./groupSearch"
import type { GroupPrintScope } from "./groupPrintSelection"
import { selectGroupProductsForPrint } from "./groupPrintSelection"
import EditGroupDialog from "./EditGroupDialog"
import type { GroupProduct, GroupRow } from "./groupTableData"
import GroupMobileActions from "./GroupMobileActions"
import GroupMobileList from "./GroupMobileList"
import GroupProductsDialog from "./GroupProductsDialog"
import GroupScanDialog from "./GroupScanDialog"
import GroupTaskBar from "./GroupTaskBar"
import LabelLiveDebugDialog from "./LabelLiveDebugDialog"
import {
  applyOptimisticGroupProductOrder,
  pruneStaleGroupOrderPatches,
  removeOptimisticGroupOrderPatch,
  type OptimisticGroupOrders,
} from "./optimisticGroupProductOrder"
import type { ProductInput, ProductRow } from "./productTableData"

const EMPTY_GROUPS: GroupRow[] = []
const EMPTY_PRODUCTS: ProductRow[] = []

function GroupsPanel() {
  const [search, setSearch] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState<GroupRow["_id"] | null>(null)
  const [scanningGroupId, setScanningGroupId] = useState<GroupRow["_id"] | null>(null)
  const [editingGroup, setEditingGroup] = useState<GroupRow | null>(null)
  const [labelLiveDebug, setLabelLiveDebug] = useState<LabelLiveDebugMessage | null>(null)
  const [optimisticGroupOrders, setOptimisticGroupOrders] = useState<OptimisticGroupOrders>({})
  const [session] = useState(readStoredSession)
  const groups = useQuery(
    api.groups.list,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const products = useQuery(
    api.products.list,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const labelLiveSettings = useQuery(
    api.userPrefs.getLabelLiveSettings,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const createGroup = useMutation(api.groups.create)
  const upsertProductFromScan = useMutation(api.products.upsertFromScan)
  const updateGroupMutation = useMutation(api.groups.update)
  const deleteGroupMutation = useMutation(api.groups.remove)
  const addGroupProducts = useMutation(api.groups.addProducts)
  const removeGroupProduct = useMutation(api.groups.removeProduct)
  const reorderGroupProductsMutation = useMutation(api.groups.reorderProducts)
  const recordGroupPrintMutation = useMutation(api.printJobs.recordGroupPrint)
  const lookupScannedProduct = useAction(api.shopify.lookupProductByScannedCode)
  const groupRows = groups ?? EMPTY_GROUPS
  const productRows = products ?? EMPTY_PRODUCTS


  const effectiveOptimisticGroupOrders = useMemo(() => {
    if (groups === undefined) {
      return optimisticGroupOrders
    }
    return pruneStaleGroupOrderPatches(optimisticGroupOrders, groups)
  }, [groups, optimisticGroupOrders])

  const displayGroupRows = useMemo(
    () =>
      groupRows.map((group) =>
        applyOptimisticGroupProductOrder(group, effectiveOptimisticGroupOrders[group._id]),
      ),
    [groupRows, effectiveOptimisticGroupOrders],
  )

  const filteredGroups = useMemo(() => filterGroups(displayGroupRows, search), [displayGroupRows, search])
  const selectedGroup = useMemo(
    () => displayGroupRows.find((group) => group._id === selectedGroupId) ?? null,
    [displayGroupRows, selectedGroupId],
  )
  const scanningGroup = useMemo(
    () => displayGroupRows.find((group) => group._id === scanningGroupId) ?? null,
    [displayGroupRows, scanningGroupId],
  )
  const columns = useMemo(() => createGroupColumns(), [])
  const openGroup = (group: GroupRow) => setSelectedGroupId(group._id)

  const addGroup = async (name: string) => {
    if (!session) {
      return
    }

    await createGroup({ sessionToken: session.sessionToken, name })
  }

  const updateGroup = async (groupId: GroupRow["_id"], name: string) => {
    if (!session) {
      return
    }

    await updateGroupMutation({ sessionToken: session.sessionToken, groupId, name })
  }

  const deleteGroup = async (group: GroupRow) => {
    if (!session) {
      return
    }

    const shouldDelete = window.confirm(`Delete "${group.name}"?`)
    if (!shouldDelete) {
      return
    }

    await deleteGroupMutation({ sessionToken: session.sessionToken, groupId: group._id })
    setEditingGroup((current) => (current?._id === group._id ? null : current))
    setSelectedGroupId((current) => (current === group._id ? null : current))
  }

  const addProducts = async (group: GroupRow, productIds: ProductRow["_id"][]) => {
    if (!session) {
      return
    }

    await addGroupProducts({ sessionToken: session.sessionToken, groupId: group._id, productIds })
  }

  const addScannedProduct = async (group: GroupRow, code: string): Promise<ProductInput> => {
    if (!session) {
      throw new Error("Sign in to scan products.")
    }

    const product = await lookupScannedProduct({
      sessionToken: session.sessionToken,
      code,
    }) as ProductInput
    const productId = await upsertProductFromScan({ sessionToken: session.sessionToken, product })
    await addGroupProducts({ sessionToken: session.sessionToken, groupId: group._id, productIds: [productId] })

    return product
  }

  const removeProduct = async (group: GroupRow, product: GroupProduct) => {
    if (!session) {
      return
    }

    await removeGroupProduct({
      sessionToken: session.sessionToken,
      groupId: group._id,
      productId: product._id,
    })
  }

  const reorderGroupProducts = useCallback(
    async (group: GroupRow, orderedProductIds: GroupProduct["_id"][]) => {
      if (!session) {
        return
      }

      const updatedAt = Date.now()
      const groupId = group._id
      setOptimisticGroupOrders((prev) => ({
        ...prev,
        [groupId]: { orderedProductIds, updatedAt },
      }))

      try {
        await reorderGroupProductsMutation({
          sessionToken: session.sessionToken,
          groupId,
          orderedProductIds,
        })
        setOptimisticGroupOrders((prev) => removeOptimisticGroupOrderPatch(prev, groupId, updatedAt))
      } catch (error) {
        setOptimisticGroupOrders((prev) => removeOptimisticGroupOrderPatch(prev, groupId, updatedAt))
        toast.error("Could not save product order.", {
          description: error instanceof Error ? error.message : "Try again.",
        })
      }
    },
    [session, reorderGroupProductsMutation],
  )

  const printGroupToLabelLive = async (group: GroupRow, scope: GroupPrintScope) => {
    if (!session) {
      toast.error("Sign in again to print.")
      return
    }

    if (labelLiveSettings === undefined) {
      toast.info("Loading printer settings. Try again in a moment.")
      return
    }

    const trimmedDesign = labelLiveSettings?.designName?.trim()
    const trimmedPrinterId = labelLiveSettings?.printerId?.trim()

    if (!trimmedDesign) {
      toast.error("Add your Label LIVE design name in Settings first.")
      return
    }

    if (!trimmedPrinterId) {
      toast.error("Add your Label LIVE printer ID in Settings first.")
      return
    }

    const picks = selectGroupProductsForPrint(group, scope)

    if (!picks.length) {
      toast.info("No products match this print option.")
      return
    }

    const jobs = picks.map((product) => ({
      design: trimmedDesign,
      printerId: trimmedPrinterId,
      variables: productToLabelLiveVariables(product),
    }))

    try {
      const { openedLabelliveFallback } = await sendLabelLiveJobs(jobs)

      let historyNote = ""
      try {
        await recordGroupPrintMutation({
          sessionToken: session.sessionToken,
          groupId: group._id,
          scope,
        })
      } catch (historyError) {
        historyNote =
          `Print history failed to save: ${
            historyError instanceof Error ? historyError.message : "Unknown error"
          }`
      }

      if (openedLabelliveFallback) {
        const debugMessage = buildLabelLiveProtocolFallbackMessage(
          jobs,
          historyNote
            ? `${historyNote}\n\n(${jobs.length} job(s) triggered.)`
            : `(${jobs.length} job(s) triggered.)`,
        )
        setLabelLiveDebug(debugMessage)
        toast.warning(debugMessage.title, {
          description: debugMessage.description,
        })
        return
      }

      if (historyNote) {
        toast.warning(`Sent ${jobs.length} label job(s), but history did not save.`, {
          description: historyNote,
        })
        return
      }

      toast.success(`Sent ${jobs.length} label job(s) to Label LIVE.`)
    } catch (error) {
      const debugMessage = buildLabelLiveSendFailedMessage(error, jobs)
      setLabelLiveDebug(debugMessage)
      toast.error(debugMessage.title, {
        description: debugMessage.description,
      })
    }
  }

  return (
    <section className="grid min-w-0 gap-3">
      <GroupTaskBar
        sessionToken={session?.sessionToken ?? null}
        search={search}
        onSearchChange={setSearch}
        onAddGroup={addGroup}
      />
      <DashboardResponsiveList
        mobile={
          <GroupMobileList
            groups={filteredGroups}
            emptyMessage={getGroupsMessage(session, groups)}
            onOpen={openGroup}
            onEdit={setEditingGroup}
            onDelete={deleteGroup}
            onScan={(group) => setScanningGroupId(group._id)}
            onPrintGroup={printGroupToLabelLive}
          />
        }
        desktop={
          <VirtualDataTable
            columns={columns}
            data={filteredGroups}
            emptyMessage={getGroupsMessage(session, groups)}
            height={460}
            rowHeight={56}
            onRowClick={openGroup}
            renderRowMenu={(group) => {
              const items = getGroupActionMenuItems({
                group,
                onEdit: setEditingGroup,
                onDelete: deleteGroup,
                onPrintGroup: printGroupToLabelLive,
              })

              return {
                title: `Actions for ${group.name}`,
                desktopContent: <ActionContextMenuItems items={items} />,
                mobileContent: (close) => <ActionTrayMenuItems items={items} onAction={close} />,
              }
            }}
          />
        }
      />
      <GroupMobileActions onAddGroup={addGroup} />
      <EditGroupDialog
        group={editingGroup}
        onOpenChange={(open) => {
          if (!open) {
            setEditingGroup(null)
          }
        }}
        onUpdateGroup={updateGroup}
      />
      <GroupScanDialog
        key={scanningGroupId ?? "scan-closed"}
        group={scanningGroup}
        onOpenChange={(open) => {
          if (!open) {
            setScanningGroupId(null)
          }
        }}
        onScanProduct={addScannedProduct}
      />
      <GroupProductsDialog
        group={selectedGroup}
        products={productRows}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGroupId(null)
          }
        }}
        onAddProducts={addProducts}
        onRemoveProduct={removeProduct}
        onReorderProducts={reorderGroupProducts}
      />
      <LabelLiveDebugDialog
        message={labelLiveDebug}
        onOpenChange={(open) => {
          if (!open) {
            setLabelLiveDebug(null)
          }
        }}
      />
    </section>
  )
}

function getGroupsMessage(session: AuthResult | null, groups: GroupRow[] | undefined) {
  if (!session) {
    return "Sign in to load groups."
  }

  if (groups === undefined) {
    return "Loading groups..."
  }

  return "No groups yet."
}

export default GroupsPanel
