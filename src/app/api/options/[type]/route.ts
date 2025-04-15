import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Update parameter structure to match Next.js 15 requirements
export async function GET(
  request: NextRequest,
  context: { params: { type: string } }
) {
  const validTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
  
  // Access type through context
  const type = context.params.type;

  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid option type' }, { status: 400 });
  }

  // Mock data for demonstration
  const options = {
    authors: [
      { value: 'john-doe', label: 'John Doe' },
      { value: 'jane-smith', label: 'Jane Smith' },
    ],
    channels: [
      { value: 'web', label: 'Web' },
      { value: 'mobile', label: 'Mobile' },
    ],
    categories: [
      { value: 'technology', label: 'Technology' },
      { value: 'business', label: 'Business' },
    ],
    newsletters: [
      { value: 'weekly-digest', label: 'Weekly Digest' },
      { value: 'monthly-update', label: 'Monthly Update' },
    ],
    topics: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'react', label: 'React' },
    ],
  };

  // Type assertion to safely access the options
  return NextResponse.json(options[type as keyof typeof options] || []);
}

export async function POST(
  request: Request,
  context: { params: { type: string } }
) {
  const validTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
  
  // Access type through context
  const type = context.params.type;

  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid option type' }, { status: 400 });
  }

  try {
    const item = await request.json();
    
    const { data, error } = await supabase
      .from(type)
      .insert([item])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: `Failed to create ${type.slice(0, -1)}` }, { status: 500 });
  }
}