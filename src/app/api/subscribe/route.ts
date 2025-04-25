import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate email
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    
    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', data.email)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingSubscriber) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
    }
    
    // Add new subscriber to database
    const newSubscriber = {
      email: data.email,
      status: 'active',
      // Remove the joinedAt field or use a field that exists in your schema
      // If you want to track when users subscribe, consider adding this column to your table
    };
    
    const { data: savedSubscriber, error: saveError } = await supabase
      .from('subscribers')
      .insert([newSubscriber])
      .select()
      .single();
      
    if (saveError) {
      throw saveError;
    }
    
    return NextResponse.json({
      message: "Successfully subscribed!",
      subscriber: savedSubscriber
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json({ 
      error: 'Failed to subscribe. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all subscribers from the database
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*');
      
    if (error) throw error;

    // Calculate statistics for dashboard cards
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Format the data to match the expected interface
    const formattedSubscribers = subscribers.map(sub => ({
      id: sub.id,
      email: sub.email,
      status: sub.status || 'pending',
      joinedAt: sub.created_at,
      lastActive: sub.last_active_at
    }));

    // Calculate statistics
    const totalSubscribers = formattedSubscribers.length;
    
    // New subscribers this month
    const newSubscribers = formattedSubscribers.filter(
      sub => new Date(sub.joinedAt) >= firstDayOfMonth
    ).length;
    
    // Active subscribers (active in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeSubscribers = formattedSubscribers.filter(
      sub => sub.lastActive && new Date(sub.lastActive) >= thirtyDaysAgo
    ).length;
    
    // Calculate growth rate (comparing current month to previous month)
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    
    const lastMonthNew = formattedSubscribers.filter(
      sub => new Date(sub.joinedAt) >= lastMonthStart && new Date(sub.joinedAt) < firstDayOfMonth
    ).length;
    
    const previousMonthNew = formattedSubscribers.filter(
      sub => new Date(sub.joinedAt) >= twoMonthsAgo && new Date(sub.joinedAt) < lastMonthStart
    ).length;
    
    // Calculate growth rate as percentage
    const growthRate = previousMonthNew === 0 
      ? 100 // If there were 0 subscribers in the previous month, growth rate is 100%
      : ((lastMonthNew - previousMonthNew) / previousMonthNew) * 100;
    
    // Calculate month-over-month change
    const momChange = lastMonthNew === 0
      ? 0
      : ((newSubscribers - lastMonthNew) / lastMonthNew) * 100;
    
    // Calculate active percentage
    const activePercentage = totalSubscribers === 0
      ? 0
      : (activeSubscribers / totalSubscribers) * 100;

    // Return both the subscribers list and statistics
    return NextResponse.json({
      subscribers: formattedSubscribers,
      stats: {
        totalSubscribers,
        newSubscribers,
        activeSubscribers,
        activePercentage: Math.round(activePercentage),
        growthRate: growthRate.toFixed(1),
        momChange: momChange.toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({
      error: 'Failed to fetch subscribers'
    }, { status: 500 });
  }
}