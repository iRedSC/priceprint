import { useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { readStoredSession } from "@/authSession"

import DashboardHomeDesktop from "./DashboardHomeDesktop"
import DashboardHomeMobile from "./DashboardHomeMobile"
import type { DashboardSection } from "./DashboardPage"
import { api } from "../../../convex/_generated/api"

type DashboardPanelProps = {
  onSelectSection: (section: DashboardSection) => void
}

function DashboardPanel({ onSelectSection }: DashboardPanelProps) {
  const [session] = useState(readStoredSession)
  const summary = useQuery(
    api.dashboard.summary,
    session ? { sessionToken: session.sessionToken } : "skip",
  )
  const createGroup = useMutation(api.groups.create)
  const [addGroupOpen, setAddGroupOpen] = useState(false)

  const pending = summary === undefined
  const resume = summary ?? {
    groupCount: 0,
    scannedIntoGroupsToday: 0,
    productCount: 0,
    shopifyConnected: false,
    groupsWithPrintAttention: 0,
    shopDomain: undefined as string | undefined,
    recentGroups: [],
  }

  const recentGroups =
    resume.recentGroups?.map((group) => ({
      _id: group._id,
      name: group.name,
      productCount: group.productCount,
    })) ?? []

  const addGroupMobile = async (name: string) => {
    if (!session) {
      return
    }

    await createGroup({ sessionToken: session.sessionToken, name })
  }

  const mobileResume = {
    groupCount: resume.groupCount,
    scannedIntoGroupsToday: resume.scannedIntoGroupsToday,
    productCount: resume.productCount,
    shopifyConnected: resume.shopifyConnected,
    shopDomain: resume.shopDomain,
  }

  const desktopResume = {
    ...mobileResume,
    groupsWithPrintAttention: resume.groupsWithPrintAttention,
  }

  return (
    <section className="grid gap-5">
      <div className="grid gap-5 md:hidden">
        <DashboardHomeMobile
          resume={mobileResume}
          pending={pending}
          recentGroups={recentGroups}
          onNavigate={onSelectSection}
          onAddGroup={addGroupMobile}
          addGroupOpen={addGroupOpen}
          onAddGroupOpenChange={setAddGroupOpen}
        />
      </div>

      <div className="hidden gap-5 md:grid">
        <DashboardHomeDesktop
          resume={desktopResume}
          pending={pending}
          recentGroups={recentGroups}
          onNavigate={onSelectSection}
        />
      </div>
    </section>
  )
}

export default DashboardPanel
