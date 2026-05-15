import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type Header,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ResponsiveContextMenu } from "@/components/ui/responsive-context-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type VirtualDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
  emptyMessage?: string
  height?: number
  rowHeight?: number
  onRowClick?: (row: TData) => void
  renderRowMenu?: (row: TData) => VirtualRowMenu
}

type VirtualRowMenu = {
  title?: string
  desktopContent: React.ReactNode
  mobileContent: (close: () => void) => React.ReactNode
}

function VirtualDataTable<TData, TValue>({
  columns,
  data,
  className,
  emptyMessage = "No results.",
  height = 420,
  rowHeight = 48,
  onRowClick,
  renderRowMenu,
}: VirtualDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  // TanStack Table intentionally returns stable instance functions that React Compiler flags.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  const rows = table.getRowModel().rows
  const tableWidth = `max(100%, ${table.getTotalSize()}px)`
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  })

  return (
    <div className={cn("min-w-0 overflow-hidden rounded-xl border bg-card", className)}>
      <div
        ref={scrollRef}
        className="overflow-auto touch-manipulation"
        style={{ height }}
      >
        <Table className="grid" style={{ width: tableWidth }}>
          <TableHeader className="sticky top-0 z-10 grid bg-card">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="flex hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="flex items-center"
                    style={{ flex: `${header.getSize()} 1 0` }}
                  >
                    {header.isPlaceholder ? null : (
                      <SortHeader header={header}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </SortHeader>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className="relative grid"
            style={{ height: rows.length ? virtualizer.getTotalSize() : rowHeight * 2 }}
          >
            {rows.length ? (
              virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                const rowMenu = renderRowMenu?.(row.original)
                const tableRow = (
                  <TableRow
                    key={row.id}
                    className={cn("absolute flex w-full", onRowClick && "cursor-pointer")}
                    onClick={() => onRowClick?.(row.original)}
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="flex min-w-0 items-center overflow-hidden text-ellipsis"
                        style={{ flex: `${cell.column.getSize()} 1 0` }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )

                return rowMenu ? (
                  <ResponsiveContextMenu
                    key={row.id}
                    title={rowMenu.title}
                    desktopContent={rowMenu.desktopContent}
                    mobileContent={rowMenu.mobileContent}
                  >
                    {tableRow}
                  </ResponsiveContextMenu>
                ) : (
                  tableRow
                )
              })
            ) : (
              <TableRow className="flex hover:bg-transparent">
                <TableCell className="flex h-24 w-full items-center justify-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

type SortHeaderProps<TData, TValue> = {
  header: Header<TData, TValue>
  children: React.ReactNode
}

function SortHeader<TData, TValue>({ header, children }: SortHeaderProps<TData, TValue>) {
  if (!header.column.getCanSort()) {
    return children
  }

  const direction = header.column.getIsSorted()
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ChevronsUpDown

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 touch-manipulation px-2"
      aria-sort={direction === false ? "none" : direction === "asc" ? "ascending" : "descending"}
      onClick={header.column.getToggleSortingHandler()}
    >
      <span className="truncate">{children}</span>
      <Icon className="size-3.5" />
    </Button>
  )
}

export default VirtualDataTable
