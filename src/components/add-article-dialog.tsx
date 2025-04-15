"use client"

// Add the missing imports
import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AddItemSheet } from "./add-item-sheet"
import { Plus, FileText } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  url: z.string().url("Please enter a valid URL"),
  author: z.string().min(1, "Author is required"),
  channel: z.string().min(1, "Channel is required"),
  category: z.string().min(1, "Category is required"),
  newsletter: z.string().min(1, "Newsletter is required"),
  topic: z.string().min(1, "Topic is required"),
})

type FormValues = z.infer<typeof formSchema>
type ItemType = "author" | "channel" | "category" | "newsletter" | "topic"

// Add a refreshArticles prop to your component
export function AddArticleDialog({ refreshArticles }: { refreshArticles?: () => void }) {
  const [open, setOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeItemType, setActiveItemType] = useState<ItemType>("author")

  // State for dropdown options
  const [authors, setAuthors] = useState([
    { value: "john-smith", label: "John Smith" },
    { value: "sarah-johnson", label: "Sarah Johnson" },
    { value: "michael-chen", label: "Michael Chen" },
    { value: "lisa-williams", label: "Lisa Williams" },
  ])

  const [channels, setChannels] = useState([
    { value: "corporate", label: "Corporate" },
    { value: "finance", label: "Finance" },
    { value: "marketing", label: "Marketing" },
    { value: "hr", label: "HR" },
    { value: "it", label: "IT" },
  ])

  const [categories, setCategories] = useState([
    { value: "news", label: "News" },
    { value: "update", label: "Update" },
    { value: "announcement", label: "Announcement" },
    { value: "feature", label: "Feature" },
  ])

  const [newsletters, setNewsletters] = useState([
    { value: "NL-2023-001", label: "NL-2023-001" },
    { value: "NL-2023-002", label: "NL-2023-002" },
    { value: "NL-2023-003", label: "NL-2023-003" },
    { value: "NL-2023-004", label: "NL-2023-004" },
  ])

  const [topics, setTopics] = useState([
    { value: "company-culture", label: "Company Culture" },
    { value: "financial-updates", label: "Financial Updates" },
    { value: "product-launches", label: "Product Launches" },
    { value: "employee-wellness", label: "Employee Wellness" },
  ])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      url: "",
      author: "",
      channel: "",
      category: "",
      newsletter: "",
      topic: "",
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  
// Add this useEffect to fetch options
useEffect(() => {
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const optionTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
      const responses = await Promise.all(
        optionTypes.map(type => 
          fetch(`/api/options/${type}`).then(res => res.json())
        )
      );
      
      setAuthors(responses[0]);
      setChannels(responses[1]);
      setCategories(responses[2]);
      setNewsletters(responses[3]);
      setTopics(responses[4]);
    } catch (error) {
      console.error('Error fetching options:', error);
      toast({
        title: "Error",
        description: "Failed to load form options. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  fetchOptions();
}, []);

  // Update the onSubmit function in the AddArticleDialog component
  
  function onSubmit(values: FormValues) {
    setSubmitting(true);
    
    fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create article');
        }
        return response.json();
      })
      .then(() => {
        toast({
          title: "Success",
          description: "Article created successfully",
        });
        setOpen(false);
        form.reset();
        
        // Call the refresh function after successful submission
        if (refreshArticles) {
          refreshArticles();
        }
      })
      .catch(error => {
        console.error('Error creating article:', error);
        toast({
          title: "Error",
          description: "Failed to create article. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const handleAddButtonClick = (type: ItemType) => {
    setActiveItemType(type)
    setSheetOpen(true)
  }

  const handleItemAdded = (type: ItemType, value: string, label: string) => {
    switch (type) {
      case "author":
        setAuthors([...authors, { value, label }])
        break
      case "channel":
        setChannels([...channels, { value, label }])
        break
      case "category":
        setCategories([...categories, { value, label }])
        break
      case "newsletter":
        setNewsletters([...newsletters, { value, label }])
        break
      case "topic":
        setTopics([...topics, { value, label }])
        break
    }

    // Optionally set the newly added item as the selected value in the form
    form.setValue(type, value)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-4 py-2 rounded-md shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Add Article</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white dark:bg-slate-800 border-none shadow-xl">
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">Add New Article</DialogTitle>
            </div>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1">
              Fill in the details to create a new article for your newsletter.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter article title" 
                          {...field} 
                          className="border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Subtitle</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter article subtitle" 
                          className="resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/article" 
                          {...field} 
                          className="border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Author</FormLabel>
                        <div className="flex space-x-2 w-full">
                          <FormControl className="flex-1">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full border-slate-200 dark:border-slate-700 focus:ring-blue-500">
                                <SelectValue placeholder="Select author" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {authors.map((author) => (
                                  <SelectItem key={author.value} value={author.value}>
                                    {author.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => handleAddButtonClick("author")}
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Channel</FormLabel>
                        <div className="flex space-x-2 w-full">
                          <FormControl className="flex-1">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full border-slate-200 dark:border-slate-700 focus:ring-blue-500">
                                <SelectValue placeholder="Select channel" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {channels.map((channel) => (
                                  <SelectItem key={channel.value} value={channel.value}>
                                    {channel.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => handleAddButtonClick("channel")}
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Category</FormLabel>
                        <div className="flex space-x-2 w-full">
                          <FormControl className="flex-1">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full border-slate-200 dark:border-slate-700 focus:ring-blue-500">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => handleAddButtonClick("category")}
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Newsletter</FormLabel>
                        <div className="flex space-x-2 w-full">
                          <FormControl className="flex-1">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full border-slate-200 dark:border-slate-700 focus:ring-blue-500">
                                <SelectValue placeholder="Select newsletter" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {newsletters.map((newsletter) => (
                                  <SelectItem key={newsletter.value} value={newsletter.value}>
                                    {newsletter.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => handleAddButtonClick("newsletter")}
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Topic</FormLabel>
                      <div className="flex space-x-2 w-full">
                        <FormControl className="flex-1">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full border-slate-200 dark:border-slate-700 focus:ring-blue-500">
                              <SelectValue placeholder="Select topic" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {topics.map((topic) => (
                                <SelectItem key={topic.value} value={topic.value}>
                                  {topic.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleAddButtonClick("topic")}
                          className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            )}
          </div>

          <DialogFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t flex-row space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddItemSheet type={activeItemType} open={sheetOpen} onOpenChange={setSheetOpen} onItemAdded={handleItemAdded} />
    </>
  )
}


