"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

interface Article {
  id: string
  title: string
  subtitle: string
  url: string
  author: string
  channel: string
  category: string
  newsletter: string
  topic: string
  created_at: string
}

interface FilterOption {
  value: string
  label: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(9)
  
  // Filter options
  const [authors, setAuthors] = useState<FilterOption[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [topics, setTopics] = useState<FilterOption[]>([])
  
  // Selected filters
  const [selectedAuthor, setSelectedAuthor] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  
  // Function to fetch articles
  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles')
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }
      const data = await response.json()
      setArticles(data)
      setFilteredArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const optionTypes = ['authors', 'categories', 'topics'];
      const optionsPromises = optionTypes.map(type => 
        fetch(`/api/options/${type}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch ${type} options`);
            }
            return res.json();
          })
          .catch(error => {
            console.error(`Error fetching ${type} options:`, error);
            return []; // Return empty array on error
          })
      );
      
      const optionsRes = await Promise.all(optionsPromises);
      
      setAuthors(optionsRes[0] || []);
      setCategories(optionsRes[1] || []);
      setTopics(optionsRes[2] || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  }
  
  // Fetch articles and filter options on component mount
  useEffect(() => {
    fetchArticles()
    fetchFilterOptions()
  }, [])
  
  // Apply filters and search
  useEffect(() => {
    let result = [...articles]
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article => 
        article.title?.toLowerCase().includes(term) || 
        article.subtitle?.toLowerCase().includes(term)
      )
    }
    
    // Apply filters
    if (selectedAuthor && selectedAuthor !== "all") {
      result = result.filter(article => article.author === selectedAuthor)
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory)
    }
    
    if (selectedTopic && selectedTopic !== "all") {
      result = result.filter(article => article.topic === selectedTopic)
    }
    
    setFilteredArticles(result)
  }, [articles, searchTerm, selectedAuthor, selectedCategory, selectedTopic])
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedAuthor("all")
    setSelectedCategory("all")
    setSelectedTopic("all")
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Articles</h1>
      
      {/* Search and filters */}
      <div className="mb-8 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 dark:border-slate-700"
              suppressHydrationWarning
            />
          </div>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="border-slate-200 dark:border-slate-700"
            suppressHydrationWarning
          >
            Reset Filters
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="border-slate-200 dark:border-slate-700" suppressHydrationWarning>
                <SelectValue placeholder="Filter by Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author.value} value={author.value}>
                    {author.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-slate-200 dark:border-slate-700" suppressHydrationWarning>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="border-slate-200 dark:border-slate-700" suppressHydrationWarning>
                <SelectValue placeholder="Filter by Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Articles grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredArticles.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map(article => (
              <div key={article.id} className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.subtitle}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {article.category} | {article.topic}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-200 dark:border-slate-700"
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className={currentPage === number 
                        ? "" 
                        : "border-slate-200 dark:border-slate-700"}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-200 dark:border-slate-700"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500">
          <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-1">No articles found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
        </div>
      )}
    </div>
  )
}