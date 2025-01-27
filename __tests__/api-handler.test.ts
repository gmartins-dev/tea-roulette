import { NextResponse } from 'next/server';
import { createApiHandler } from '../lib/utils/api-handler';

describe('API Handler', () => {
  it('returns a response with status 200', async () => {
    const req = new Request('http://localhost:8794/api/test', { method: 'GET' }); // Mock request
    const res = await createApiHandler(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);
  });
});
