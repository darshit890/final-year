"use client"

import { useState, useEffect } from "react"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2, Download, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define a base interface for article data
interface Article {
  id: string;
  // Add other common article properties here
  [key: string]: unknown;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
}

export function ArticlesDataTable<TData extends Article, TValue>({ columns, data: initialData }: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [data, setData] = useState<TData[]>([])
  const [loading, setLoading] = useState(true)
  
  // Add state for pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  // Fetch data from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/articles')
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles')
        }
        
        const articlesData = await response.json()
        setData(articlesData as TData[])
      } catch (error) {
        console.error('Error fetching articles:', error)
        toast({
          title: "Error",
          description: "Failed to load articles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (initialData && initialData.length > 0) {
      setData(initialData)
      setLoading(false)
    } else {
      fetchArticles()
    }
    
    setIsMounted(true)
  }, [initialData])

  // Handle delete selected rows
  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    // Use the Article interface instead of any
    const selectedIds = selectedRows.map(row => (row.original).id)
    
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected articles?`)) {
      try {
        setLoading(true)
        
        // Delete each selected article
        await Promise.all(
          selectedIds.map(id => 
            fetch(`/api/articles/${id}`, {
              method: 'DELETE',
            })
          )
        )
        
        // Refresh the data
        const response = await fetch('/api/articles')
        const refreshedData = await response.json()
        setData(refreshedData as TData[])
        
        // Clear selection
        setRowSelection({})
        
        toast({
          title: "Success",
          description: `${selectedIds.length} articles deleted successfully.`,
        })
      } catch (error) {
        console.error('Error deleting articles:', error)
        toast({
          title: "Error",
          description: "Failed to delete articles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      globalFilter,
      rowSelection,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    manualPagination: false,
  })

  // Return null during server-side rendering or initial client render
  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search articles..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 w-[280px] bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
            />
          </div>
        </div>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={handleDeleteSelected}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-slate-100 border-slate-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-slate-600 font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-slate-500">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && "selected"} 
                  className={`hover:bg-slate-50 border-slate-200 ${row.getIsSelected() ? 'bg-blue-50' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-slate-500">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <span className="font-medium">{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} rows selected</span>
          ) : (
            <span>Showing {table.getState().pagination.pageSize * table.getState().pagination.pageIndex + 1}-{Math.min(table.getState().pagination.pageSize * (table.getState().pagination.pageIndex + 1), table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries</span>
          )}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-slate-600">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px] border-slate-200">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-slate-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-slate-200"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-slate-200"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-slate-200"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-slate-200"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

