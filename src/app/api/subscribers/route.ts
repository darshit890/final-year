import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    // Parse the subscriber ID from the request body
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Subscriber ID is required' 
      }, { status: 400 });
    }

    // Delete the subscriber from the database
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      message: 'Subscriber deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({ 
      error: 'Failed to delete subscriber' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all subscribers from the database
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    // Format the data to match the expected interface
    const formattedSubscribers = subscribers.map(sub => ({
      id: sub.id,
      email: sub.email,
      status: sub.status || 'pending',
      joinedAt: sub.created_at 
    }));
    
    return NextResponse.json(formattedSubscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch subscribers'
    }, { status: 500 });
  }
}