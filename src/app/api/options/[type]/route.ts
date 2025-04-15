// src/app/api/options/[type]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = { params: { type: string } };
type HandlerContext = { params: RouteParams['params'] | Promise<RouteParams['params']> };

// Generic param resolver for Edge/Node compatibility
async function resolveParams(params: HandlerContext['params']) {
  return await Promise.resolve(params);
}

// Shared validation logic
function validateType(type: string) {
  const validTypes = ['authors', 'channels', 'categories', 'newsletters', 'topics'];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Valid types: ${validTypes.join(', ')}` },
      { status: 400 }
    );
  }
}

// Mock data factory
function getOptions(type: string) {
  const data = {
    authors: [
      { value: 'john-doe', label: 'John Doe' },
      { value: 'jane-smith', label: 'Jane Smith' }
    ],
    channels: [
      { value: 'web', label: 'Web' },
      { value: 'mobile', label: 'Mobile' }
    ],
    categories: [
      { value: 'technology', label: 'Technology' },
      { value: 'business', label: 'Business' }
    ],
    newsletters: [
      { value: 'weekly-digest', label: 'Weekly Digest' },
      { value: 'monthly-update', label: 'Monthly Update' }
    ],
    topics: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'react', label: 'React' }
    ]
  };

  return data[type as keyof typeof data] || [];
}

export async function GET(request: NextRequest, context: RouteParams) {
  const resolvedParams = await resolveParams(context.params);
  const validation = validateType(resolvedParams.type);
  if (validation) return validation;

  return NextResponse.json(getOptions(resolvedParams.type));
}

export async function POST(request: NextRequest, context: RouteParams) {
  const resolvedParams = await resolveParams(context.params);
  const validation = validateType(resolvedParams.type);
  if (validation) return validation;

  try {
    const body = await request.json();
    return NextResponse.json(
      { ...body, id: crypto.randomUUID() },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: `Failed to create ${resolvedParams.type.slice(0, -1)}` },
      { status: 500 }
    );
  }
}