import { TeaRoulette } from '../src/tea-roulette';

// Setup global fetch mock
global.fetch = jest.fn();

export const setupTestEnv = () => {
  const baseUrl = 'http://localhost:8794';
  const teaRoulette = new TeaRoulette(baseUrl);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFetchResponse = (data: any, status = 200) => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
      })
    );
  };

  return { teaRoulette, mockFetchResponse, baseUrl };
};
