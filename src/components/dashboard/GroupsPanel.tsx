import ActionCard from "./ActionCard"

const groups = [
  {
    title: "Front cooler refresh",
    detail: "32 products scanned. Ready for label review.",
    action: "Open",
  },
  {
    title: "Weekend endcap",
    detail: "18 products scanned. 4 need product data.",
    action: "Review",
  },
  {
    title: "Bakery markdowns",
    detail: "9 products scanned today. In progress.",
    action: "Continue",
  },
]

function GroupsPanel() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {groups.map((group) => (
        <ActionCard key={group.title} {...group} />
      ))}
    </section>
  )
}

export default GroupsPanel
