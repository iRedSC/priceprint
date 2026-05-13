import { useCallback, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { readStoredSession, type AuthResult } from "@/authSession"
import VirtualDataTable from "@/components/data-table/VirtualDataTable"
import { sendLabelLiveJobs } from "@/lib/labelLiveBatch"
import { productToLabelLiveVariables } from "@/lib/productLabelVariables"
import { api } from "../../../convex/_generated/api"
import EditProductDialog from "./EditProductDialog"
import ProductMobileActions from "./ProductMobileActions"
import ProductMobileList from "./ProductMobileList"
import ProductRowContextMenu from "./ProductRowContextMenu"
import ProductTaskBar from "./ProductTaskBar"
import { createProductColumns } from "./productColumns"
import { filterProducts } from "./productSearch"
import { sortProducts, type ProductSort } from "./productSort"
import type { ProductEditableField, ProductInput, ProductRow } from "./productTableData"

const EMPTY_PRODUCTS: ProductRow[] = []
type OptimisticProductPatches = Partial<Record<ProductRow["_id"], Partial<ProductRow>>>

function ProductsPanel() {
  const [search, setSearch] = useState("")
  const [mobileSort, setMobileSort] = useState<ProductSort>("updated")
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)
  const [optimisticPatches, setOptimisticPatches] = useState<OptimisticProductPatches>({})
  const [session] = useState(readStoredSession)
  const products = useQuery(
    api.products.list,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const labelLiveDesignName = useQuery(
    api.userPrefs.getLabelLiveDesign,
    session ? { sessionToken: session.sessionToken } : "skip"
  )
  const createProduct = useMutation(api.products.create)
  const createProducts = useMutation(api.products.createMany)
  const updateProductMutation = useMutation(api.products.update)
  const deleteProductMutation = useMutation(api.products.remove)
  const recordProductPrintMutation = useMutation(api.printJobs.recordProductPrint)
  const productRows = useMemo(
    () => (products ?? EMPTY_PRODUCTS).map((product) => ({ ...product, ...optimisticPatches[product._id] })),
    [optimisticPatches, products]
  )
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
  const updateProduct = async (productId: ProductRow["_id"], product: ProductInput) => {
    if (!session) {
      return
    }

    await updateProductMutation({ sessionToken: session.sessionToken, productId, product })
  }
  const updateProductField = useCallback(async (
    product: ProductRow,
    field: ProductEditableField,
    value: string
  ) => {
    if (!session) {
      return false
    }

    const fieldValue = parseProductField(field, value)
    if (fieldValue === null) {
      return false
    }

    const nextProduct = { ...toProductInput(product), [field]: fieldValue }
    const updatedAt = Date.now()
    setOptimisticPatches((patches) => ({
      ...patches,
      [product._id]: { ...patches[product._id], [field]: fieldValue, updatedAt },
    }))

    try {
      await updateProductMutation({
        sessionToken: session.sessionToken,
        productId: product._id,
        product: nextProduct,
      })
      return true
    } catch (error) {
      setOptimisticPatches((patches) => {
        const rest = { ...patches }
        delete rest[product._id]
        return rest
      })
      window.alert(error instanceof Error ? error.message : "Could not update product.")
      return false
    }
  }, [session, updateProductMutation])
  const deleteProduct = useCallback(async (product: ProductRow) => {
    if (!session) {
      return
    }

    const shouldDelete = window.confirm(`Delete "${product.name}"?`)
    if (!shouldDelete) {
      return
    }

    await deleteProductMutation({
      sessionToken: session.sessionToken,
      productId: product._id,
    })
  }, [deleteProductMutation, session])

  const printProductToLabelLive = async (product: ProductRow) => {
    if (!session) {
      window.alert("Sign in again to print.")
      return
    }

    if (labelLiveDesignName === undefined) {
      window.alert("Loading printer settings. Try again in a moment.")
      return
    }

    const trimmedDesign = labelLiveDesignName?.trim()

    if (!trimmedDesign) {
      window.alert("Add your Label LIVE design name under Connections first.")
      return
    }

    const jobs = [
      {
        design: trimmedDesign,
        variables: productToLabelLiveVariables(product),
      },
    ]

    try {
      await sendLabelLiveJobs(jobs)

      let historyNote = ""
      try {
        await recordProductPrintMutation({
          sessionToken: session.sessionToken,
          productId: product._id,
        })
      } catch (historyError) {
        historyNote =
          `\n\nPrint history failed to save: ${
            historyError instanceof Error ? historyError.message : "Unknown error"
          }`
      }

      window.alert(`Sent ${jobs.length} label job(s) to Label LIVE.${historyNote}`)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not reach Label LIVE.")
    }
  }

  const filteredProducts = useMemo(
    () => filterProducts(productRows, search),
    [productRows, search]
  )
  const mobileProducts = useMemo(
    () => sortProducts(filteredProducts, mobileSort),
    [filteredProducts, mobileSort]
  )
  const columns = useMemo(
    () => createProductColumns({ onFieldCommit: updateProductField }),
    [updateProductField]
  )

  return (
    <section className="grid min-w-0 gap-3">
      <ProductTaskBar
        search={search}
        onSearchChange={setSearch}
        onAddProduct={addProduct}
        onUploadProducts={uploadProducts}
        sort={mobileSort}
        onSortChange={setMobileSort}
      />
      <div className="md:hidden">
        <ProductMobileList
          products={mobileProducts}
          emptyMessage={getProductsMessage(session, products)}
          onEdit={setEditingProduct}
          onDelete={deleteProduct}
          onPrint={printProductToLabelLive}
        />
      </div>
      <ProductMobileActions onAddProduct={addProduct} />
      <div className="hidden min-w-0 md:block">
        <VirtualDataTable
          columns={columns}
          data={filteredProducts}
          emptyMessage={getProductsMessage(session, products)}
          height={460}
          rowHeight={56}
          renderRowMenu={(product) => (
            <ProductRowContextMenu
              product={product}
              onEdit={setEditingProduct}
              onDelete={deleteProduct}
              onPrint={printProductToLabelLive}
            />
          )}
        />
      </div>
      <EditProductDialog
        product={editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null)
          }
        }}
        onUpdateProduct={updateProduct}
      />
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

function toProductInput(product: ProductRow): ProductInput {
  return {
    sku: product.sku,
    upc: product.upc,
    name: product.name,
    img: product.img,
    type: product.type,
    vendor: product.vendor,
    price: product.price,
    meta: product.meta,
  }
}

function parseProductField(field: ProductEditableField, value: string) {
  if (field === "price") {
    const price = Number(value)
    return value.trim() && Number.isFinite(price) ? price : null
  }

  if (field === "name") {
    return value.trim() || null
  }

  return value.trim() || undefined
}

export default ProductsPanel
