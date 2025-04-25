"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {  
  Search, 
  Filter, 
  MoreHorizontal,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Subscriber {
  id: string
  email: string
  name?: string
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
  preferences?: string[]
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState<'all' | 'email' | 'status'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Fetch subscribers
  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscribers')
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers')
      }
      const data = await response.json()
      setSubscribers(data)
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      toast({
        title: "Error",
        description: "Failed to load subscribers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSubscribers()
  }, [])
  
  // Filter subscribers based on search 
  const filteredSubscribers = subscribers.filter((subscriber: Subscriber) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    switch (searchBy) {
      case 'email':
        return subscriber.email.toLowerCase().includes(term);
      case 'status':
        return subscriber.status.toLowerCase().includes(term);
      case 'all':
      default:
        return (
          subscriber.email.toLowerCase().includes(term) ||
          subscriber.status.toLowerCase().includes(term)
        );
    }
  });
  
  // Handle delete subscriber
  const handleDeleteClick = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber)
    setDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!subscriberToDelete) return
    
    setIsDeleting(true)
    try {
      const response = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: subscriberToDelete.id }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete subscriber')
      }
      
      // Remove the deleted subscriber from the state
      setSubscribers(prev => prev.filter(sub => sub.id !== subscriberToDelete.id))
      
      toast({
        title: "Success",
        description: `Subscriber ${subscriberToDelete.email} has been deleted.`,
      })
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      toast({
        title: "Error",
        description: "Failed to delete subscriber. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubscriberToDelete(null)
    }
  }
  
  // Utility function for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
    }
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Subscribers</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your newsletter subscribers</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Subscribers</CardTitle>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  type="search" 
                  placeholder="Search subscribers..." 
                  className="pl-9 w-full md:w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Search by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSearchBy('all')} className={searchBy === 'all' ? 'bg-slate-100 dark:bg-slate-700' : ''}>
                    All Fields
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchBy('email')} className={searchBy === 'email' ? 'bg-slate-100 dark:bg-slate-700' : ''}>
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchBy('status')} className={searchBy === 'status' ? 'bg-slate-100 dark:bg-slate-700' : ''}>
                    Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-500">Loading subscribers...</span>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? `No subscribers match your search${searchBy !== 'all' ? ` by ${searchBy}` : ''}` : "No subscribers found"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscriber.status)}>
                          {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{subscriber.joinedAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteClick(subscriber)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-500">
              Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            </div>
            {filteredSubscribers.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className={!searchTerm ? 'hidden' : ''}
              >
                Clear Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {subscriberToDelete?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}