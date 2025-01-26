import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorResponse } from '@/types/api';

async function proxyRequest(
  apiUrl: string,
  options: RequestInit
): Promise<NextResponse> {
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();

    if (!response.ok) {
      const error: ApiErrorResponse = {
        detail: data.detail || 'API request failed',
        status: response.status
      };
      return NextResponse.json(error, { status: response.status });
    }

    return NextResponse.json({ data, status: response.status });
  } catch (error) {
    const errorResponse: ApiErrorResponse = {
      detail: error instanceof Error ? error.message : 'Internal Server Error',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/proxy', '');
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  return proxyRequest(apiUrl, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/proxy', '');
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const body = await req.json();

  return proxyRequest(apiUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function PUT(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/proxy', '');
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const body = await req.json();

  return proxyRequest(apiUrl, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
