import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Update the parameter structure to match Next.js 15 requirements
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch article ${error}` }, { status: 500 });
  }
}

// Update the PUT handler with the correct parameter structure
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', context.params.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (err: unknown) {
    return NextResponse.json({ error: `Failed to update article ${err}` }, { status: 500 });
  }
}

// Update the DELETE handler with the correct parameter structure
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', context.params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (err: unknown) {
    return NextResponse.json({ error: `Failed to delete article ${err}` }, { status: 500 });
  }
}