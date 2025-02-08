import { ApiHandler } from '@/lib/utils/api-handler';
import { ValidationError, APIError } from '@/app/api/api-errors';

describe('ApiHandler', () => {
  let apiHandler: ApiHandler;

  beforeEach(() => {
    apiHandler = new ApiHandler('http://test-api');
    global.fetch = jest.fn() as jest.Mock;
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockResponse = { id: '123', firstName: 'Jane', lastName: 'Doe' };
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await apiHandler.updateUser('123', { firstName: 'Jane' });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-api/v1/Users/123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ firstName: 'Jane' })
        })
      );
    });

    it('should throw validation error for invalid input', async () => {
      await expect(apiHandler.updateUser('', {}))
        .rejects
        .toThrow(ValidationError);

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // Add more test cases for other methods
  // ...
});
