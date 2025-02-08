import { TeaRoulette } from '../../src/tea-roulette';
import { setupTestEnv } from '../test-utils';
import { APIError } from '../../src/errors/api-errors';

describe('API Integration', () => {
  const { teaRoulette, mockFetchResponse } = setupTestEnv();

  describe('Error Handling', () => {
    test('should handle API errors with proper status codes', async () => {
      const errorCases = [
        { status: 404, message: 'Resource not found' },
        { status: 429, message: 'Rate limit exceeded' },
        { status: 409, message: 'User already exists' },
        { status: 500, message: 'API request failed' }
      ];

      for (const { status, message } of errorCases) {
        mockFetchResponse({ error: message }, status);
        await expect(teaRoulette.getUsers())
          .rejects.toThrow(message);
      }
    });

    test('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      await expect(teaRoulette.getUsers())
        .rejects.toThrow('Failed to connect to API');
    });
  });

  describe('Response Handling', () => {
    test('should properly parse successful responses', async () => {
      const mockData = { id: '123', name: 'Test' };
      mockFetchResponse(mockData, 200);
      const result = await teaRoulette.getUser('123');
      expect(result).toEqual(mockData);
    });

    test('should handle empty responses', async () => {
      mockFetchResponse(null, 204);
      const result = await teaRoulette.getUsers();
      expect(result).toBeNull();
    });
  });
});
