"use client"

import Link from "next/link"

export default function Home() {
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
