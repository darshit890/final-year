"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

type ItemType = "author" | "channel" | "category" | "newsletter" | "topic"

interface AddItemSheetProps {
  type: ItemType
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded: (type: ItemType, value: string, label: string) => void
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
})

type FormValues = z.infer<typeof formSchema>

export function AddItemSheet({ type, open, onOpenChange, onItemAdded }: AddItemSheetProps) {
  // Moved the submitting state inside the component
  const [submitting, setSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  })

  const getTitle = () => {
    switch (type) {
      case "author":
        return "Add New Author"
      case "channel":
        return "Add New Channel"
      case "category":
        return "Add New Category"
      case "newsletter":
        return "Add New Newsletter"
      case "topic":
        return "Add New Topic"
      default:
        return "Add New Item"
    }
  }

  const getDescription = () => {
    switch (type) {
      case "author":
        return "Add a new author to the system."
      case "channel":
        return "Create a new channel for content distribution."
      case "category":
        return "Add a new category for articles."
      case "newsletter":
        return "Create a new newsletter."
      case "topic":
        return "Add a new topic for articles."
      default:
        return "Add a new item to the system."
    }
  }

  // Update the onSubmit function in the AddItemSheet component
  
  function onSubmit(values: FormValues) {
    setSubmitting(true);
    
    fetch(`/api/options/${type}s`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: values.value,
        label: values.name,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to create ${type}`);
        }
        return response.json();
      })
      .then(data => {
        onItemAdded(type, data.value, data.label);
        form.reset();
        onOpenChange(false);
        toast({
          title: "Success",
          description: `${getTitle()} successfully created.`,
        });
      })
      .catch(error => {
        console.error(`Error creating ${type}:`, error);
        toast({
          title: "Error",
          description: `Failed to create ${type}. Please try again.`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
          <SheetDescription>{getDescription()}</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${type} name`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (ID)</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${type} ID or value`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding..." : `Add ${type}`}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

