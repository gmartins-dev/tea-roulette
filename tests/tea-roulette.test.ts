import { TeaRoulette } from '../src/tea-roulette';
import { User, DrinkOrder, DrinkRun } from '../src/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('TeaRoulette API Integration', () => {
  let teaRoulette: TeaRoulette;
  const baseUrl = 'http://localhost:8794';

  beforeEach(() => {
    teaRoulette = new TeaRoulette(baseUrl);
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Updated mock helper function
  const mockFetchResponse = (data: any, status = 200) => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
      })
    );
  };

  describe('User Management', () => {
    test('should create new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe'
      };
      const mockResponse = { ...newUser, id: '123' };
      mockFetchResponse(mockResponse, 201);

      const response = await teaRoulette.createUser(newUser);
      expect(response).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/Users`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newUser),
        })
      );
    });

    test('should get user by id', async () => {
      const mockUser = { id: '123', firstName: 'John', lastName: 'Doe' };
      mockFetchResponse(mockUser);

      const user = await teaRoulette.getUser('123');
      expect(user).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/Users/123`,
        expect.any(Object)
      );
    });

    test('should handle non-existent user', async () => {
      mockFetchResponse({ type: 'error', detail: 'User not found' }, 404);

      await expect(teaRoulette.getUser('non-existent-id'))
        .rejects.toThrow('Resource not found');
    });
  });

  describe('Drink Run Management', () => {
    test('should create new drink run with participants', async () => {
      const participants = [
        { userId: 'user-1' },
        { userId: 'user-2' }
      ];
      const mockResponse = {
        id: '123',
        drinkMaker: { id: 'user-1', firstName: 'John', lastName: 'Doe' },
        orders: []
      };
      mockFetchResponse(mockResponse, 201);

      const drinkRun = await teaRoulette.createDrinkRun(participants);
      expect(drinkRun).toEqual(mockResponse);
    });

    test('should require minimum two participants', async () => {
      const participants = [{ userId: 'user-1' }];
      await expect(teaRoulette.createDrinkRun(participants))
        .rejects.toThrow('Minimum two participants required');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('should get drink run by id', async () => {
      const mockDrinkRun = {
        id: '123',
        drinkMaker: { id: 'user-1', firstName: 'John', lastName: 'Doe' },
        orders: []
      };
      mockFetchResponse(mockDrinkRun);

      const drinkRun = await teaRoulette.getDrinkRun('123');
      expect(drinkRun).toEqual(mockDrinkRun);
    });
  });

  describe('Drink Order Management', () => {
    test('should create drink order', async () => {
      const order = {
        userId: 'user-1',
        name: 'Earl Grey',
        type: 'Tea',
        additionalSpecification: {
          milk: 'yes',
          sugar: '1'
        }
      };
      const mockResponse = { ...order, id: '123' };
      mockFetchResponse(mockResponse, 201);

      const response = await teaRoulette.createDrinkOrder(order);
      expect(response).toEqual(mockResponse);
    });

    test('should get drink order by id', async () => {
      const mockOrder = {
        id: 'existing-order-id',
        userId: 'user-1',
        name: 'Earl Grey',
        type: 'Tea',
        additionalSpecification: {
          milk: 'yes',
          sugar: '1'
        }
      };
      mockFetchResponse(mockOrder);

      const order = await teaRoulette.getDrinkOrder('existing-order-id');
      expect(order).toEqual(mockOrder);
    });
  });

  describe('Error Handling', () => {
    test('should handle API connection errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to connect to API'));

      await expect(teaRoulette.getUsers())
        .rejects.toThrow('Failed to connect to API');
    });

    test('should handle invalid input data', async () => {
      const invalidUser = {
        firstName: '',
        lastName: ''
      };
      await expect(teaRoulette.createUser(invalidUser))
        .rejects.toThrow('Invalid user data');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('should handle rate limiting', async () => {
      // Mock rate limit response for all requests
      Array(10).fill(null).forEach(() => {
        mockFetchResponse({ type: 'error', detail: 'Rate limit exceeded' }, 429);
      });

      const promises = Array(10).fill(null).map(() => teaRoulette.getUsers());
      await expect(Promise.all(promises))
        .rejects.toThrow('Rate limit exceeded');
    });
  });
});
