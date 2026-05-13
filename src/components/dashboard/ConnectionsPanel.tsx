import ActionCard from "./ActionCard"

const connections = [
  {
    title: "Shopify",
    detail: "Connected. Last sync completed 3 minutes ago.",
    action: "Manage",
  },
  {
    title: "Label printer",
    detail: "Ready. Default format is shelf tag 2 x 1.",
    action: "Test",
  },
  {
    title: "Barcode scanner",
    detail: "Use the device camera on mobile or a USB scanner on desktop.",
    action: "Setup",
  },
]

function ConnectionsPanel() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {connections.map((connection) => (
        <ActionCard key={connection.title} {...connection} />
      ))}
    </section>
  )
}

export default ConnectionsPanel
