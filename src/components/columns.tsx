"use client"

import { type Article, truncateText } from "@/lib/data"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Edit, Copy, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

export const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return <span className="font-medium text-slate-800 dark:text-slate-200">{title}</span>
    }
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
    cell: ({ row }) => {
      const subtitle = row.getValue("subtitle") as string
      return <span className="text-slate-600 dark:text-slate-400">{truncateText(subtitle, 50)}</span>
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as string
      return <span className="text-slate-700 dark:text-slate-300">{author}</span>
    }
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => {
      const channel = row.getValue("channel") as string
      const getChannelColor = (channel: string) => {
        const colors: Record<string, string> = {
          "Web": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          "Mobile": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          "Email": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
          "Social": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
          "Print": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        }
        return colors[channel] || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
      }
      
      return (
        <Badge variant="outline" className={`font-medium ${getChannelColor(channel)}`}>
          {channel}
        </Badge>
      )
    }
  },
  {
    accessorKey: "newsletter",
    header: "Newsletter ID",
    cell: ({ row }) => {
      const newsletter = row.getValue("newsletter") as string
      return <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{newsletter}</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original
      
      const handleView = () => {
        window.open(article.url, '_blank');
      };
      
      const handleEdit = () => {
        // This would typically open an edit dialog
        toast({
          title: "Edit Article",
          description: `Editing article: ${article.title}`,
        });
      };
      
      const handleDuplicate = async () => {
        try {
          const duplicatedArticle = {
            ...article,
            id: undefined, // Remove ID so a new one is generated
            title: `${article.title} (Copy)`,
          };
          
          const response = await fetch('/api/articles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(duplicatedArticle),
          });
          
          if (!response.ok) {
            throw new Error('Failed to duplicate article');
          }
          
          toast({
            title: "Success",
            description: "Article duplicated successfully",
          });
          
          // Refresh the data (this would typically be handled by a context or state management)
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error('Error duplicating article:', error);
          toast({
            title: "Error",
            description: "Failed to duplicate article",
            variant: "destructive",
          });
        }
      };
      
      const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
          try {
            const response = await fetch(`/api/articles/${article.id}`, {
              method: 'DELETE',
            });
            
            if (!response.ok) {
              throw new Error('Failed to delete article');
            }
            
            toast({
              title: "Success",
              description: "Article deleted successfully",
            });
            
            // Refresh the data (this would typically be handled by a context or state management)
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } catch (error) {
            console.error('Error deleting article:', error);
            toast({
              title: "Error",
              description: "Failed to delete article",
              variant: "destructive",
            });
          }
        }
      };
      
      return (
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            onClick={handleView}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2 cursor-pointer">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2 cursor-pointer">
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
              >
                <Trash className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

