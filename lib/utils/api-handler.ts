import { NextResponse } from 'next/server';
import { ErrorResponse } from '@/app/api/api-client.types';

export function createApiHandler(handler: (req: Request) => Promise<NextResponse>) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);

      const errorResponse: ErrorResponse = {
        message: error instanceof Error ? error.message : 'Internal Server Error',
        status: 500,
      };

      return NextResponse.json(errorResponse, { status: errorResponse.status });
    }
  };
}
