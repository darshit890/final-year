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

export async function DELETE(request: NextRequest) {
  try {
    // Get the article ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' }, 
        { status: 400 }
      );
    }
    
    // Delete the article from Supabase
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
      
    if (error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Article deleted successfully' }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete article: ${error}` }, 
      { status: 500 }
    );
  }
}