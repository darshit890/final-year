"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

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

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  
  // Filter options
  const [authors, setAuthors] = useState<FilterOption[]>([])
  const [channels, setChannels] = useState<FilterOption[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [topics, setTopics] = useState<FilterOption[]>([])
  
  // Selected filters
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")

  // Fetch articles and filter options
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch articles
        const articlesRes = await fetch('/api/articles')
        const articlesData = await articlesRes.json()
        
        // Fetch filter options
        const optionTypes = ['authors', 'channels', 'categories', 'topics']
        const optionsRes = await Promise.all(
          optionTypes.map(type => fetch(`/api/options/${type}`).then(res => res.json()))
        )
        
        setArticles(articlesData)
        setFilteredArticles(articlesData)
        setAuthors(optionsRes[0])
        setChannels(optionsRes[1])
        setCategories(optionsRes[2])
        setTopics(optionsRes[3])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...articles]
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.subtitle.toLowerCase().includes(term)
      )
    }
    
    // Apply filters
    if (selectedAuthor) {
      result = result.filter(article => article.author === selectedAuthor)
    }
    
    if (selectedChannel) {
      result = result.filter(article => article.channel === selectedChannel)
    }
    
    if (selectedCategory) {
      result = result.filter(article => article.category === selectedCategory)
    }
    
    if (selectedTopic) {
      result = result.filter(article => article.topic === selectedTopic)
    }
    
    setFilteredArticles(result)
  }, [articles, searchTerm, selectedAuthor, selectedChannel, selectedCategory, selectedTopic])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedAuthor("")
    setSelectedChannel("")
    setSelectedCategory("")
    setSelectedTopic("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          The Byte Highlight
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Your source for the latest tech news and insights
        </p>
      </header>
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Welcome to our Newsletter Platform</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Browse our collection of articles, filter by topics of interest, and stay up-to-date with the latest news and insights.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/articles" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
