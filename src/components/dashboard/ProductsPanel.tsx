import ActionCard from "./ActionCard"

const products = [
  {
    title: "Organic apple juice",
    detail: "UPC 092834761203. Label updated 8 minutes ago.",
    action: "Edit",
  },
  {
    title: "Sourdough loaf",
    detail: "Missing shelf location before printing.",
    action: "Fix",
  },
  {
    title: "Cold brew concentrate",
    detail: "Synced from Shopify. Ready for labels.",
    action: "View",
  },
]

function ProductsPanel() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {products.map((product) => (
        <ActionCard key={product.title} {...product} />
      ))}
    </section>
  )
}

export default ProductsPanel
