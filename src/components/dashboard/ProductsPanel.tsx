import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { readStoredSession, type AuthResult } from "@/authSession"
import VirtualDataTable from "@/components/data-table/VirtualDataTable"
import { api } from "../../../convex/_generated/api"
import ProductMobileActions from "./ProductMobileActions"
import ProductMobileList from "./ProductMobileList"
import ProductTaskBar from "./ProductTaskBar"
import { productColumns } from "./productColumns"
import { filterProducts } from "./productSearch"
import { sortProducts, type ProductSort } from "./productSort"
import type { ProductInput, ProductRow } from "./productTableData"

function ProductsPanel() {
  const [search, setSearch] = useState("")
  const [mobileSort, setMobileSort] = useState<ProductSort>("updated")
  const [session] = useState(readStoredSession)
  const products = useQuery(
    api.products.list,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const createProduct = useMutation(api.products.create)
  const createProducts = useMutation(api.products.createMany)
  const productRows = products ?? []
  const addProduct = async (product: ProductInput) => {
    if (!session) {
      return
    }

    await createProduct({ sessionToken: session.sessionToken, product })
  }
  const uploadProducts = async (newProducts: ProductInput[]) => {
    if (!session) {
      return
    }

    await createProducts({ sessionToken: session.sessionToken, products: newProducts })
  }
  const filteredProducts = useMemo(
    () => filterProducts(productRows, search),
    [productRows, search]
  )
  const mobileProducts = useMemo(
    () => sortProducts(filteredProducts, mobileSort),
    [filteredProducts, mobileSort]
  )

  return (
    <section className="grid min-w-0 gap-3">
      <ProductTaskBar
        search={search}
        onSearchChange={setSearch}
        onAddProduct={addProduct}
        onUploadProducts={uploadProducts}
      />
      <div className="md:hidden">
        <ProductMobileList
          products={mobileProducts}
          emptyMessage={getProductsMessage(session, products)}
        />
      </div>
      <ProductMobileActions
        onAddProduct={addProduct}
        sort={mobileSort}
        onSortChange={setMobileSort}
      />
      <div className="hidden min-w-0 md:block">
        <VirtualDataTable
          columns={productColumns}
          data={filteredProducts}
          emptyMessage={getProductsMessage(session, products)}
          height={460}
        />
      </div>
    </section>
  )
}

function getProductsMessage(
  session: AuthResult | null,
  products: ProductRow[] | undefined
) {
  if (!session) {
    return "Sign in to load products."
  }

  if (products === undefined) {
    return "Loading products..."
  }

  return "No products scanned yet."
}

export default ProductsPanel
