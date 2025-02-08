import { TeaRoulette } from '../../src/tea-roulette';
import { setupTestEnv } from '../test-utils';

describe('User Management', () => {
  const { teaRoulette, mockFetchResponse } = setupTestEnv();

  describe('User CRUD Operations', () => {
    test('should validate user data before creation', async () => {
      const invalidCases = [
        { firstName: '', lastName: 'Doe' },
        { firstName: 'John', lastName: '' },
        { firstName: '   ', lastName: 'Doe' },
        { firstName: 'John123', lastName: 'Doe' }, // Invalid characters
      ];

      for (const invalidUser of invalidCases) {
        await expect(teaRoulette.createUser(invalidUser))
          .rejects.toThrow('Invalid user data');
      }
    });

    test('should update user details', async () => {
      const user = { id: '123', firstName: 'John', lastName: 'Doe' };
      const update = { firstName: 'Johnny' };
      mockFetchResponse({ ...user, ...update }, 200);

      const updated = await teaRoulette.updateUser('123', update);
      expect(updated.firstName).toBe('Johnny');
    });

    test('should handle duplicate users', async () => {
      mockFetchResponse({ error: 'User already exists' }, 409);
      const newUser = { firstName: 'John', lastName: 'Doe' };

      await expect(teaRoulette.createUser(newUser))
        .rejects.toThrow('User already exists');
    });
  });
});
