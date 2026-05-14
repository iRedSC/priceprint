import { useMemo, useState } from "react"
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
import { createGroupColumns } from "./groupColumns"
import { filterGroups } from "./groupSearch"
import type { GroupPrintScope } from "./groupPrintSelection"
import { selectGroupProductsForPrint } from "./groupPrintSelection"
import EditGroupDialog from "./EditGroupDialog"
import type { GroupProduct, GroupRow } from "./groupTableData"
import GroupMobileActions from "./GroupMobileActions"
import GroupMobileList from "./GroupMobileList"
import GroupProductsDialog from "./GroupProductsDialog"
import GroupRowContextMenu from "./GroupRowContextMenu"
import GroupScanDialog from "./GroupScanDialog"
import GroupTaskBar from "./GroupTaskBar"
import LabelLiveDebugDialog from "./LabelLiveDebugDialog"
import type { ProductInput, ProductRow } from "./productTableData"

const EMPTY_GROUPS: GroupRow[] = []
const EMPTY_PRODUCTS: ProductRow[] = []

function GroupsPanel() {
  const [search, setSearch] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState<GroupRow["_id"] | null>(null)
  const [scanningGroupId, setScanningGroupId] = useState<GroupRow["_id"] | null>(null)
  const [editingGroup, setEditingGroup] = useState<GroupRow | null>(null)
  const [labelLiveDebug, setLabelLiveDebug] = useState<LabelLiveDebugMessage | null>(null)
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
  const recordGroupPrintMutation = useMutation(api.printJobs.recordGroupPrint)
  const lookupScannedProduct = useAction(api.shopify.lookupProductByScannedCode)
  const groupRows = groups ?? EMPTY_GROUPS
  const productRows = products ?? EMPTY_PRODUCTS
  const filteredGroups = useMemo(() => filterGroups(groupRows, search), [groupRows, search])
  const selectedGroup = useMemo(
    () => groupRows.find((group) => group._id === selectedGroupId) ?? null,
    [groupRows, selectedGroupId]
  )
  const scanningGroup = useMemo(
    () => groupRows.find((group) => group._id === scanningGroupId) ?? null,
    [groupRows, scanningGroupId]
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
      <div className="md:hidden">
        <GroupMobileList
          groups={filteredGroups}
          emptyMessage={getGroupsMessage(session, groups)}
          onOpen={openGroup}
          onEdit={setEditingGroup}
          onDelete={deleteGroup}
          onScan={(group) => setScanningGroupId(group._id)}
          onPrintGroup={printGroupToLabelLive}
        />
      </div>
      <GroupMobileActions sessionToken={session?.sessionToken ?? null} onAddGroup={addGroup} />
      <div className="hidden min-w-0 md:block">
        <VirtualDataTable
          columns={columns}
          data={filteredGroups}
          emptyMessage={getGroupsMessage(session, groups)}
          height={460}
          rowHeight={56}
          onRowClick={openGroup}
          renderRowMenu={(group) => (
            <GroupRowContextMenu
              group={group}
              onOpen={openGroup}
              onEdit={setEditingGroup}
              onDelete={deleteGroup}
              onPrintGroup={printGroupToLabelLive}
            />
          )}
        />
      </div>
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
