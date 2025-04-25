'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { columns } from "@/components/columns"
import { ArticlesDataTable } from "@/components/articles-data-table"
import { TrendingUp, Users, UserPlus, BarChart, Bell  } from "lucide-react"
import { AddArticleDialog } from "@/components/add-article-dialog"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

// Interface for subscriber stats
interface SubscriberStats {
  totalSubscribers: number;
  newSubscribers: number;
  activeSubscribers: number;
  activePercentage: number;
  growthRate: string;
  momChange: string;
}

export default function AdminDashboard() {
  // Add state for subscriber stats
  const [subscriberStats, setSubscriberStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    newSubscribers: 0,
    activeSubscribers: 0,
    activePercentage: 0,
    growthRate: '0.0',
    momChange: '0.0'
  });

  // Add state to track if options are loaded
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add effect to preload options and fetch subscriber data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all option types to ensure they're cached
        const optionTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
        await Promise.all(
          optionTypes.map(type => 
            fetch(`/api/options/${type}`).then(res => {
              if (!res.ok) throw new Error(`Failed to load ${type}`);
              return res.json();
            })
          )
        );
        setOptionsLoaded(true);
        
        // Fetch subscriber stats
        const subscribersResponse = await fetch('/api/subscribe');
        if (!subscribersResponse.ok) throw new Error('Failed to load subscriber data');
        
        const data = await subscribersResponse.json();
        setSubscriberStats(data.stats);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900">
      {/* Improved header with search and better spacing */}
      <div className="border-b bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
        <div className="flex h-16 items-center px-6 justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TBH Admin Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors relative">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-medium shadow-sm">DR</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-6 p-6">
        {/* Page title and action button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Newsletter Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage your newsletter content and subscribers</p>
          </div>
          {/* Only show dialog when options are loaded */}
          {optionsLoaded ? (
            <AddArticleDialog />
          ) : (
            <div className="px-4 py-2 bg-slate-100 rounded-md text-slate-500">
              Loading options...
            </div>
          )}
        </div>
        
        {/* Stats cards with real data */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-6 w-20 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{subscriberStats.totalSubscribers.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    {parseFloat(subscriberStats.momChange) > 0 ? '+' : ''}{subscriberStats.momChange}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Subscribers</CardTitle>
              <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300">
                <UserPlus className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-6 w-20 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">+{subscriberStats.newSubscribers.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 mt-1">This month</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
                <BarChart className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-6 w-20 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{subscriberStats.activeSubscribers.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 mt-1">{subscriberStats.activePercentage}% of total subscribers</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <div className="rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-6 w-20 bg-slate-200 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">+{subscriberStats.growthRate}%</div>
                  <p className="text-xs text-slate-500 mt-1">
                    {parseFloat(subscriberStats.momChange) > 0 ? '+' : ''}{subscriberStats.momChange}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Articles table with improved styling */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-slate-200 flex items-center">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-2 inline-block"></span>
              Articles Management
            </h2>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ArticlesDataTable columns={columns as any} data={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}