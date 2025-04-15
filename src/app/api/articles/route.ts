import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({ error: `Failed to fetch articles ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const article = await request.json();
    
    // Add created_at if not provided
    if (!article.created_at) {
      article.created_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create article ${error}` }, { status: 500 });
  }
}