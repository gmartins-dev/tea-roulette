import { ValidationError } from '@/app/api/api-errors';
import { setupTestEnv } from '../test-utils';

describe('User Management', () => {
  const { apiHandler, mockFetchResponse } = setupTestEnv();

  describe('User CRUD Operations', () => {
    test('should validate user data before creation', async () => {
      const invalidCases = [
        { firstName: '', lastName: 'Doe' },
        { firstName: 'John', lastName: '' },
        { firstName: '   ', lastName: 'Doe' },
        { firstName: 'John123', lastName: 'Doe' },
        undefined,
        null,
        {},
        { firstName: 'John' },
        { lastName: 'Doe' }
      ];

      for (const invalidUser of invalidCases) {
        await expect(apiHandler.createUser(invalidUser as any))
          .rejects.toThrowError(ValidationError);
      }

      // Verify no API calls were made
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should update user details', async () => {
      const user = { id: '123', firstName: 'John', lastName: 'Doe' };
      const update = { firstName: 'Johnny' };
      mockFetchResponse({ ...user, ...update }, 200);

      const updated = await apiHandler.updateUser('123', update);
      expect(updated.firstName).toBe('Johnny');
    });

    test('should handle duplicate users', async () => {
      mockFetchResponse({ error: 'User already exists' }, 409);
      const newUser = { firstName: 'John', lastName: 'Doe' };

      await expect(apiHandler.createUser(newUser))
        .rejects.toThrow('User already exists');
    });
  });
});
