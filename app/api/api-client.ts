import {
  User,
  DrinkOrder,
  DrinkRun,
  ApiErrorResponse,
  ApiSuccessResponse
} from '@/app/api/api-client.types';

interface CreateDrinkOrderRequest {
  userId: string;
  name: string;
  type: string;
  additionalSpecification?: Record<string, string>;
}

/**
 * Client for interacting with the Tea Round Picker API
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/proxy';
  }

  /**
   * Makes a type-safe request to the API through the proxy
   * @param url - The endpoint URL
   * @param options - Fetch options
   * @returns Promise with the typed response data
   */
  private async fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResponse = data as ApiErrorResponse;
        throw new Error(errorResponse.detail || `API request failed: ${response.status}`);
      }

      return (data as ApiSuccessResponse<T>).data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Gets all users from the system
   */
  async getUsers(): Promise<User[]> {
    const response = await this.fetchApi<User[]>(`${this.baseUrl}/v1/Users`);
    return response;
  }

  /**
   * Creates a new user
   * @param firstName - User's first name
   * @param lastName - User's last name
   */
  async createUser(firstName: string, lastName: string): Promise<User> {
    return this.fetchApi<User>(`${this.baseUrl}/v1/Users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName }),
    });
  }

  /**
   * Creates a new drink run with the given participants
   * @param userIds - Array of user IDs participating in the run
   */
  async createDrinkRun(userIds: string[]): Promise<DrinkRun> {
    if (!userIds.length || userIds.length < 2) {
      throw new Error('At least two participants are required');
    }

    const participants = userIds.map(userId => ({ userId }));

    return this.fetchApi<DrinkRun>(`${this.baseUrl}/v1/DrinkRun`, {
      method: 'POST',
      body: JSON.stringify({ participants }),
    });
  }

  /**
   * Creates a new drink order for a user
   * @param order - The drink order details
   */
  async createDrinkOrder(order: CreateDrinkOrderRequest): Promise<DrinkOrder> {
    if (!order.userId || !order.type || !order.name) {
      throw new Error('Missing required fields for drink order');
    }

    return this.fetchApi<DrinkOrder>(`${this.baseUrl}/v1/DrinkOrder`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }
}

export const apiClient = new ApiClient();
