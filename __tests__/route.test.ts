import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '../app/api/proxy/[...path]/route';

describe('Proxy Request', () => {
  it('proxies a request and returns a response', async () => {
    const req = new NextRequest('http://localhost:8794/v1/DrinkOrder', { method: 'GET' });
    const res = await proxyRequest(req.url, { method: 'GET' });
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);
  });
});
