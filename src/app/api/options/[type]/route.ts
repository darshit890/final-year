import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { type: unknown } }
  ) {
    // Safely resolve params (works for both regular and Promise-based params)
    const resolvedParams = await Promise.resolve(params);
    const type = resolvedParams.type;
  
    const validTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
    
    if (!validTypes.includes(type as string)) {
      return NextResponse.json({ error: 'Invalid option type' }, { status: 400 });
    }

  // Mock data for demonstration - replace with actual database calls later
  const options = {
    authors: [
      { value: 'john-doe', label: 'John Doe' },
      { value: 'jane-smith', label: 'Jane Smith' },
      { value: 'alex-johnson', label: 'Alex Johnson' },
    ],
    channels: [
      { value: 'web', label: 'Web' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'email', label: 'Email' },
    ],
    categories: [
      { value: 'technology', label: 'Technology' },
      { value: 'business', label: 'Business' },
      { value: 'health', label: 'Health & Wellness' },
      { value: 'science', label: 'Science' },
    ],
    newsletters: [
      { value: 'weekly-digest', label: 'Weekly Digest' },
      { value: 'monthly-update', label: 'Monthly Update' },
      { value: 'tech-trends', label: 'Tech Trends' },
    ],
    topics: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'react', label: 'React' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'ai', label: 'Artificial Intelligence' },
    ],
  };

  // Return the options for the requested type
  return NextResponse.json(options[type as keyof typeof options] || []);
}

// Optional: Add POST method to create new options
export async function POST(
    request: NextRequest,
    { params }: { params: { type: unknown } }
  ) {
    const resolvedParams = await Promise.resolve(params);
    const type = resolvedParams.type;
  
    const validTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
    
    if (!validTypes.includes(type as string)) {
      return NextResponse.json({ error: 'Invalid option type' }, { status: 400 });
    }

  try {
    const item = await request.json();
    
    // For now, just return a success response
    // In a real app, you would save this to your database
    return NextResponse.json({ ...item, id: crypto.randomUUID() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: `Failed to create ${(type as string).slice(0, -1)}` }, { status: 500 });
  }
}