import { ApiHandler } from '@/lib/utils/api-handler';

// Setup global fetch mock with proper typing
global.fetch = jest.fn() as jest.Mock;

export const setupTestEnv = () => {
  const baseUrl = 'http://localhost:8794';
  const apiHandler = new ApiHandler(baseUrl);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFetchResponse = (data: any, status = 200) => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
      })
    );
  };

  return { apiHandler, mockFetchResponse, baseUrl };
};
