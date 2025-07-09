"use client"
import { useEffect, useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { MoreHorizontal, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination'
import { AdminApi } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Supplier {
  id: string
  businessName: string
  businessDescription: string
  country: string
  servicesProvided: string[]
  businessCategories: string[]
  user: {
    name: string
    email: string
  }
  businessTypes?: string[]
  annualRevenue?: string
  teamSize?: string
  minimumOrderQuantity?: string
}

interface SupplierTableProps {
  data: Supplier[]
  isLoading?: boolean
  onRowClick?: (supplier: Supplier) => void
  onEdit?: (supplier: Supplier) => void
  onDelete?: (supplierId: string) => void
}

const SupplierTable = ({
  data,
  isLoading = false,
  onRowClick,
  onEdit,
  onDelete
}: SupplierTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Filter data based on search input
  const filteredData = useMemo(() => {
    return data.filter(supplier =>
      supplier.businessName?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      supplier.businessDescription?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      supplier.user?.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      supplier.user?.email?.toLowerCase().includes(globalFilter.toLowerCase())
    )
  }, [data, globalFilter])

  // Paginate the filtered data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredData.slice(start, start + pagination.pageSize)
  }, [filteredData, pagination])

  const totalPages = Math.ceil(filteredData.length / pagination.pageSize)

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map(supplier => supplier.id))
    }
  }

  const handlePreviousPage = () => {
    if (pagination.pageIndex > 0) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))
    }
  }

  const handleNextPage = () => {
    if (pagination.pageIndex < totalPages - 1) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
    }
  }

  const columns = useMemo(() => [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={
            paginatedData.length > 0 &&
            selectedRows.length === paginatedData.length
          }
          onCheckedChange={toggleAllRows}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }: { row: { original: Supplier } }) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onCheckedChange={() => toggleRowSelection(row.original.id)}
          aria-label={`Select ${row.original.businessName}`}
          className="translate-y-[2px]"
          onClick={e => e.stopPropagation()}
        />
      ),
    },
    {
      accessorKey: 'businessName',
      header: 'Business Name',
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="font-medium flex flex-col">
          <span>{row.original.businessName || 'N/A'}</span>
          {row.original.businessTypes?.length > 0 && (
            <span className="text-xs text-gray-500 mt-1">
              {row.original.businessTypes.join(', ')}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'businessDescription',
      header: 'Description',
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="text-sm text-gray-600 line-clamp-2">
          {row.original.businessDescription || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="text-sm space-y-1">
          <div>
            <span className="font-medium">Country:</span> {row.original.country || 'N/A'}
          </div>
          <div>
            <span className="font-medium">MOQ:</span> {row.original.minimumOrderQuantity || 'N/A'}
          </div>
          {row.original.annualRevenue && (
            <div>
              <span className="font-medium">Revenue:</span> {row.original.annualRevenue}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'services',
      header: 'Services',
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.servicesProvided?.map((service, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {service}
            </span>
          )) || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.businessCategories?.slice(0, 3).map((category, i) => (
            <span key={i} className="px-2 py-1 bg-blue-50 rounded-full text-xs">
              {category}
            </span>
          ))}
          {row.original.businessCategories?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              +{row.original.businessCategories.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'user',
      header: 'Contact',
      cell: ({ row }: { row: { original: Supplier } }) => (
        <div className="text-sm">
          <div className="font-medium">{row.original.user?.name || 'N/A'}</div>
          <div className="text-gray-500">{row.original.user?.email}</div>
        </div>
      ),
    },
  ], [paginatedData.length, selectedRows, onRowClick, onEdit, onDelete])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter suppliers..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value)
            setPagination(prev => ({ ...prev, pageIndex: 0 }))
          }}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          {selectedRows.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Selected rows:', selectedRows)
              }}
            >
              Bulk Actions ({selectedRows.length})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-8">
              {columns.map((column) => (
                <TableHead
                  key={column.id || column.accessorKey}
                  className={`
                    px-4 py-3
                    ${column.id === 'actions' ? 'text-right' : ''}
                    ${column.id === 'select' ? 'w-12' : ''}
                  `}
                >
                  {typeof column.header === 'function' ? column.header() : column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="grid grid-cols-8">
                  {columns.map((column) => (
                    <TableCell
                      key={`skeleton-${column.id || column.accessorKey}`}
                      className={`
                        px-4 py-3
                        ${column.id === 'actions' ? 'text-right' : ''}
                        ${column.id === 'select' ? 'w-12' : ''}
                      `}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="grid grid-cols-8 cursor-pointer hover:bg-gray-50"
                  onClick={() => onRowClick?.(supplier)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${supplier.id}-${column.id || column.accessorKey}`}
                      className={`
                        px-4 py-3
                        ${column.id === 'actions' ? 'text-right' : ''}
                        ${column.id === 'select' ? 'w-12' : ''}
                      `}
                    >
                      {column.cell ? column.cell({ row: { original: supplier } }) : supplier[column.accessorKey as keyof Supplier]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1}-
          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length)} of{' '}
          {filteredData.length} suppliers
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePreviousPage()
                }}
                className={pagination.pageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPagination(prev => ({ ...prev, pageIndex: i }))
                    }}
                    isActive={pagination.pageIndex === i}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleNextPage()
                }}
                className={pagination.pageIndex >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

const transformSupplierData = (rawData: any): Supplier[] => {
  if (!rawData) return []
  if (!Array.isArray(rawData)) {
    console.error('Expected array but received:', rawData)
    return []
  }

  return rawData.map(item => ({
    id: item.id?.toString() || '',
    businessName: item.businessName || '',
    businessDescription: item.businessDescription || '',
    country: item.country || '',
    servicesProvided: Array.isArray(item.servicesProvided) ? item.servicesProvided : [],
    businessCategories: Array.isArray(item.businessCategories) ? item.businessCategories : [],
    businessTypes: Array.isArray(item.businessTypes) ? item.businessTypes : [],
    annualRevenue: item.annualRevenue || '',
    teamSize: item.teamSize || '',
    minimumOrderQuantity: item.minimumOrderQuantity || '',
    user: {
      name: item.user?.name || '',
      email: item.user?.email || ''
    }
  }))
}

const SupplierManagementPage = () => {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true)
        const response = await AdminApi.getAllSuppliers()
        // Ensure we're working with the data array from the response
        const data = response?.data || response || []
        setSuppliers(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching suppliers:', err)
        setError('Failed to load suppliers. Please try again later.')
        setSuppliers([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchSuppliers()
  }, [])

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      // Call API to delete supplier
      // await AdminApi.deleteSupplier(supplierId)
      // For now, just remove from local state
      setSuppliers(prev => prev.filter(s => s.id !== supplierId))
    } catch (err) {
      console.error('Error deleting supplier:', err)
      alert('Failed to delete supplier')
    }
  }

  const supplierData = transformSupplierData(suppliers)

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Supplier Management</h1>
            <p className="text-muted-foreground">
              Manage your suppliers and their details
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            <SupplierTable
              data={supplierData}
              isLoading={isLoading}
              onRowClick={setSelectedSupplier}
              onEdit={(supplier) => {
                console.log('Edit supplier:', supplier)
              }}
              onDelete={handleDeleteSupplier}
            />
          </CardContent>
        </Card>

        {selectedSupplier && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Supplier Details</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSupplier(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Business Information</h3>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">{selectedSupplier.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country</span>
                        <Badge variant="outline">{selectedSupplier.country}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual Revenue</span>
                        <span>{selectedSupplier.annualRevenue || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span>{selectedSupplier.teamSize || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Description</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">
                      {selectedSupplier.businessDescription || 'No description provided'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Contact Information</h3>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact Name</span>
                        <span className="font-medium">{selectedSupplier.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span>{selectedSupplier.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MOQ</span>
                        <span>{selectedSupplier.minimumOrderQuantity || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Services</h3>
                    <Separator className="my-2" />
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.servicesProvided.map((service, i) => (
                        <Badge key={i} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Categories</h3>
                    <Separator className="my-2" />
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.businessCategories.map((category, i) => (
                        <Badge key={i} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SupplierManagementPage