import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { readStoredSession, type AuthResult } from "@/authSession"
import VirtualDataTable from "@/components/data-table/VirtualDataTable"
import { api } from "../../../convex/_generated/api"
import { createGroupColumns } from "./groupColumns"
import { filterGroups } from "./groupSearch"
import EditGroupDialog from "./EditGroupDialog"
import type { GroupProduct, GroupRow } from "./groupTableData"
import GroupMobileActions from "./GroupMobileActions"
import GroupMobileList from "./GroupMobileList"
import GroupProductsDialog from "./GroupProductsDialog"
import GroupRowContextMenu from "./GroupRowContextMenu"
import GroupTaskBar from "./GroupTaskBar"
import type { ProductRow } from "./productTableData"

const EMPTY_GROUPS: GroupRow[] = []
const EMPTY_PRODUCTS: ProductRow[] = []

function GroupsPanel() {
  const [search, setSearch] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState<GroupRow["_id"] | null>(null)
  const [editingGroup, setEditingGroup] = useState<GroupRow | null>(null)
  const [session] = useState(readStoredSession)
  const groups = useQuery(
    api.groups.list,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const products = useQuery(
    api.products.list,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const createGroup = useMutation(api.groups.create)
  const updateGroupMutation = useMutation(api.groups.update)
  const deleteGroupMutation = useMutation(api.groups.remove)
  const addGroupProducts = useMutation(api.groups.addProducts)
  const removeGroupProduct = useMutation(api.groups.removeProduct)
  const groupRows = groups ?? EMPTY_GROUPS
  const productRows = products ?? EMPTY_PRODUCTS
  const filteredGroups = useMemo(() => filterGroups(groupRows, search), [groupRows, search])
  const selectedGroup = useMemo(
    () => groupRows.find((group) => group._id === selectedGroupId) ?? null,
    [groupRows, selectedGroupId]
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

  return (
    <section className="grid min-w-0 gap-3">
      <GroupTaskBar search={search} onSearchChange={setSearch} onAddGroup={addGroup} />
      <div className="md:hidden">
        <GroupMobileList
          groups={filteredGroups}
          emptyMessage={getGroupsMessage(session, groups)}
          onOpen={openGroup}
          onEdit={setEditingGroup}
          onDelete={deleteGroup}
        />
      </div>
      <GroupMobileActions onAddGroup={addGroup} />
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
