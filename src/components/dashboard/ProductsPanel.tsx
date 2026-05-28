import { useCallback, useMemo, useState } from "react"
import { useAction, useMutation } from "convex/react"
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
import { isValidUpc } from "@/lib/upc"
import { api } from "../../../convex/_generated/api"
import { getProductActionMenuItems } from "./actionMenuData"
import { ActionContextMenuItems, ActionTrayMenuItems } from "./actionMenuItems"
import DashboardResponsiveList from "./DashboardResponsiveList"
import EditProductDialog from "./EditProductDialog"
import LabelLiveDebugDialog from "./LabelLiveDebugDialog"
import ProductLabelCountDialog from "./ProductLabelCountDialog"
import ProductMobileActions from "./ProductMobileActions"
import ProductMobileList from "./ProductMobileList"
import ProductTaskBar from "./ProductTaskBar"
import UndoPrintConfirmDialog from "./UndoPrintConfirmDialog"
import { createProductColumns } from "./productColumns"
import { filterProducts } from "./productSearch"
import { sortProducts, type ProductSort } from "./productSort"
import type {
  ProductEditableField,
  ProductInput,
  ProductRow,
  ProductUploadDuplicateMode,
  ProductUploadResult,
} from "./productTableData"
import type { LabelLiveSettings, UndoablePrintTargets } from "./useDashboardData"

const PRODUCT_EDITABLE_FIELDS: ProductEditableField[] = [
  "sku",
  "upc",
  "name",
  "img",
  "type",
  "variant",
  "vendor",
  "price",
]
type OptimisticProductFieldPatch = {
  baseValue: ProductRow[ProductEditableField]
  value: ProductRow[ProductEditableField]
  updatedAt: number
}
type OptimisticProductPatch = Partial<Record<ProductEditableField, OptimisticProductFieldPatch>>
type OptimisticProductPatches = Partial<Record<ProductRow["_id"], OptimisticProductPatch>>

type ProductsPanelProps = {
  products: ProductRow[]
  labelLiveSettings: LabelLiveSettings
  undoablePrintTargets: UndoablePrintTargets
}

function ProductsPanel({
  products,
  labelLiveSettings,
  undoablePrintTargets,
}: ProductsPanelProps) {
  const [search, setSearch] = useState("")
  const [mobileSort, setMobileSort] = useState<ProductSort>("updated")
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null)
  const [labelLiveDebug, setLabelLiveDebug] = useState<LabelLiveDebugMessage | null>(null)
  const [labelCountProduct, setLabelCountProduct] = useState<ProductRow | null>(null)
  const [productUndoTarget, setProductUndoTarget] = useState<ProductRow | null>(null)
  const [productUndoBusy, setProductUndoBusy] = useState(false)
  const [optimisticPatches, setOptimisticPatches] = useState<OptimisticProductPatches>({})
  const [isRefreshingProducts, setIsRefreshingProducts] = useState(false)
  const [session] = useState(readStoredSession)
  const createProduct = useMutation(api.products.create)
  const createProducts = useMutation(api.products.createMany)
  const updateProductMutation = useMutation(api.products.update)
  const deleteProductMutation = useMutation(api.products.remove)
  const recordProductPrintMutation = useMutation(api.printJobs.recordProductPrint)
  const undoProductPrintMutation = useMutation(api.printJobs.undoPrintForProduct)
  const markProductUpToDateMutation = useMutation(api.printJobs.markProductUpToDate)
  const refreshProductPrices = useAction(api.shopify.refreshProductPrices)
  const productRows = useMemo(
    () => products.map((product) => applyOptimisticPatches(product, optimisticPatches[product._id])),
    [optimisticPatches, products]
  )
  const undoableProductIds = useMemo(
    () => new Set(undoablePrintTargets.productIds),
    [undoablePrintTargets.productIds]
  )
  const addProduct = async (product: ProductInput) => {
    if (!session) {
      return
    }

    try {
      await createProduct({ sessionToken: session.sessionToken, product })
    } catch (error) {
      toast.error("Could not add product.", {
        description: error instanceof Error ? error.message : "Try again.",
      })
      throw error
    }
  }
  const uploadProducts = async (
    newProducts: ProductInput[],
    duplicateMode: ProductUploadDuplicateMode
  ): Promise<ProductUploadResult | void> => {
    if (!session) {
      return
    }

    try {
      const result = await createProducts({ sessionToken: session.sessionToken, products: newProducts, duplicateMode })
      toast.success(formatUploadResultToast(result))
      return result
    } catch (error) {
      toast.error("Could not import products.", {
        description: error instanceof Error ? error.message : "Try again.",
      })
      throw error
    }
  }
  const updateProduct = async (productId: ProductRow["_id"], product: ProductInput) => {
    if (!session) {
      return
    }

    try {
      await updateProductMutation({ sessionToken: session.sessionToken, productId, product })
    } catch (error) {
      toast.error("Could not update product.", {
        description: error instanceof Error ? error.message : "Try again.",
      })
      throw error
    }
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
    setOptimisticPatches((patches) => {
      const fieldPatch = patches[product._id]?.[field]
      const baseValue = fieldPatch && fieldPatch.value === product[field] ? fieldPatch.baseValue : product[field]

      return {
        ...patches,
        [product._id]: {
          ...patches[product._id],
          [field]: {
            baseValue,
            value: fieldValue,
            updatedAt,
          },
        },
      }
    })

    try {
      await updateProductMutation({
        sessionToken: session.sessionToken,
        productId: product._id,
        product: nextProduct,
      })
      setOptimisticPatches((patches) => removeOptimisticFieldPatch(patches, product._id, field, updatedAt))
      return true
    } catch (error) {
      setOptimisticPatches((patches) => removeOptimisticFieldPatch(patches, product._id, field, updatedAt))
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

  const refreshProducts = async () => {
    if (!session) {
      toast.error("Sign in again to refresh prices.")
      return
    }

    setIsRefreshingProducts(true)

    try {
      const result = await refreshProductPrices({ sessionToken: session.sessionToken })
      toast.success(`Updated ${result.updated} product price${result.updated === 1 ? "" : "s"}.`, {
        description:
          result.failed > 0
            ? `${result.failed} product${result.failed === 1 ? "" : "s"} could not refresh.`
            : `${result.checked} product${result.checked === 1 ? "" : "s"} checked.`,
      })
    } catch (error) {
      toast.error("Could not refresh Shopify prices.", {
        description: error instanceof Error ? error.message : "Try again in a moment.",
      })
    } finally {
      setIsRefreshingProducts(false)
    }
  }

  const markProductUpToDate = useCallback(
    async (product: ProductRow) => {
      if (!session) {
        toast.error("Sign in again to update print status.")
        return
      }

      try {
        await markProductUpToDateMutation({
          sessionToken: session.sessionToken,
          productId: product._id,
        })
        toast.success(`Marked "${product.name}" up to date.`)
      } catch (error) {
        toast.error("Could not mark product up to date.", {
          description: error instanceof Error ? error.message : "Try again in a moment.",
        })
      }
    },
    [markProductUpToDateMutation, session],
  )

  const printProductToLabelLive = useCallback(
    async (product: ProductRow, labelCount: number) => {
      if (!session) {
        toast.error("Sign in again to print.")
        return
      }

      const trimmedUpcDesign = labelLiveSettings.upcDesignName?.trim()
      const trimmedSkuDesign = labelLiveSettings.skuDesignName?.trim()
      const trimmedPrinterId = labelLiveSettings.printerId?.trim()
      const design = isValidUpc(product.upc) ? trimmedUpcDesign : trimmedSkuDesign

      if (!design) {
        toast.error(
          isValidUpc(product.upc)
            ? "Add your Label LIVE UPC design in Settings first."
            : "Add your Label LIVE SKU design in Settings first."
        )
        return
      }

      if (!trimmedPrinterId) {
        toast.error("Add your Label LIVE printer ID in Settings first.")
        return
      }

      const variables = productToLabelLiveVariables(product)
      const jobs = Array.from({ length: labelCount }, () => ({
        design,
        printerId: trimmedPrinterId,
        variables,
      }))

      try {
        const { openedLabelliveFallback } = await sendLabelLiveJobs(jobs)

        let historyNote = ""
        try {
          await recordProductPrintMutation({
            sessionToken: session.sessionToken,
            productId: product._id,
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
    },
    [labelLiveSettings, recordProductPrintMutation, session],
  )

  const startProductPrint = useCallback(
    (product: ProductRow, opts?: { skipLabelCountModal?: boolean }) => {
      if (opts?.skipLabelCountModal) {
        void printProductToLabelLive(product, 1)
        return
      }
      setLabelCountProduct(product)
    },
    [printProductToLabelLive],
  )

  const requestUndoProductPrint = useCallback((product: ProductRow) => {
    setProductUndoTarget(product)
  }, [])

  const confirmUndoProductPrint = useCallback(async () => {
    if (!session || !productUndoTarget) {
      return
    }

    const name = productUndoTarget.name
    setProductUndoBusy(true)

    try {
      await undoProductPrintMutation({
        sessionToken: session.sessionToken,
        productId: productUndoTarget._id,
      })
      setProductUndoTarget(null)
      toast.success(`Undid last print for "${name}".`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not undo.")
    } finally {
      setProductUndoBusy(false)
    }
  }, [productUndoTarget, session, undoProductPrintMutation])

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
    <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
      <ProductTaskBar
        search={search}
        onSearchChange={setSearch}
        onAddProduct={addProduct}
        onUploadProducts={uploadProducts}
        isRefreshingProducts={isRefreshingProducts}
        onRefreshProducts={refreshProducts}
        sort={mobileSort}
        onSortChange={setMobileSort}
      />
      <DashboardResponsiveList
        fillHeight
        mobile={
          <ProductMobileList
            products={mobileProducts}
            emptyMessage={getProductsMessage(session)}
            onEdit={setEditingProduct}
            onDelete={deleteProduct}
            onMarkUpToDate={markProductUpToDate}
          />
        }
        desktop={
          <VirtualDataTable
            columns={columns}
            data={filteredProducts}
            emptyMessage={getProductsMessage(session)}
            height="fill"
            rowHeight={56}
            renderRowMenu={(product) => ({
              title: `Actions for ${product.name}`,
              desktopContent: ({ shiftKey }) => (
                <ActionContextMenuItems
                  items={getProductActionMenuItems({
                    product,
                    onEdit: setEditingProduct,
                    onDelete: deleteProduct,
                    onPrint: startProductPrint,
                    onMarkUpToDate: markProductUpToDate,
                    canUndoPrint: shiftKey && undoableProductIds.has(product._id),
                    onUndoPrint: requestUndoProductPrint,
                  })}
                />
              ),
              mobileContent: (close) => (
                <ActionTrayMenuItems
                  items={getProductActionMenuItems({
                    product,
                    onEdit: setEditingProduct,
                    onDelete: deleteProduct,
                    onMarkUpToDate: markProductUpToDate,
                  })}
                  onAction={close}
                />
              ),
            })}
          />
        }
      />
      <ProductMobileActions onAddProduct={addProduct} />
      <EditProductDialog
        product={editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null)
          }
        }}
        onUpdateProduct={updateProduct}
      />
      <LabelLiveDebugDialog
        message={labelLiveDebug}
        onOpenChange={(open) => {
          if (!open) {
            setLabelLiveDebug(null)
          }
        }}
      />
      <ProductLabelCountDialog
        product={labelCountProduct}
        onOpenChange={(open) => {
          if (!open) {
            setLabelCountProduct(null)
          }
        }}
        onConfirm={(count) => {
          if (labelCountProduct) {
            void printProductToLabelLive(labelCountProduct, count)
          }
        }}
      />
      <UndoPrintConfirmDialog
        open={productUndoTarget !== null}
        onOpenChange={(open) => {
          if (!open && !productUndoBusy) {
            setProductUndoTarget(null)
          }
        }}
        title={productUndoTarget ? `Undo last print for ${productUndoTarget.name}?` : "Undo last print?"}
        description="Print status for this product will revert to what it was before the last recorded print."
        busy={productUndoBusy}
        onConfirm={confirmUndoProductPrint}
      />
    </section>
  )
}

function formatUploadResultToast(result: ProductUploadResult) {
  const parts = [
    `${result.inserted} added`,
    `${result.updated} overwritten`,
    `${result.ignored} ignored`,
  ]

  return `Import complete: ${parts.join(", ")}.`
}

function getProductsMessage(session: AuthResult | null) {
  if (!session) {
    return "Sign in to load products."
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
    variant: product.variant,
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

function applyOptimisticPatches(product: ProductRow, patches: OptimisticProductPatch | undefined): ProductRow {
  if (!patches) {
    return product
  }

  let nextProduct = product
  let latestUpdatedAt: number | undefined

  for (const field of PRODUCT_EDITABLE_FIELDS) {
    const patch = patches[field]

    if (!patch || product[field] !== patch.baseValue) {
      continue
    }

    nextProduct = { ...nextProduct, [field]: patch.value }
    latestUpdatedAt = Math.max(latestUpdatedAt ?? 0, patch.updatedAt)
  }

  if (latestUpdatedAt !== undefined) {
    nextProduct = { ...nextProduct, updatedAt: Math.max(nextProduct.updatedAt ?? 0, latestUpdatedAt) }
  }

  return nextProduct
}

function removeOptimisticFieldPatch(
  patches: OptimisticProductPatches,
  productId: ProductRow["_id"],
  field: ProductEditableField,
  updatedAt: number
): OptimisticProductPatches {
  const productPatch = patches[productId]

  if (!productPatch || productPatch[field]?.updatedAt !== updatedAt) {
    return patches
  }

  const nextProductPatch = { ...productPatch }
  delete nextProductPatch[field]

  const nextPatches = { ...patches }

  if (Object.keys(nextProductPatch).length > 0) {
    nextPatches[productId] = nextProductPatch
  } else {
    delete nextPatches[productId]
  }

  return nextPatches
}

export default ProductsPanel
