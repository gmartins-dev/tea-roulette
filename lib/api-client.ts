import {
  User,
  DrinkOrder,
  DrinkRun,
  ApiErrorResponse,
  ApiSuccessResponse
} from '@/types/api';

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
      throw new Error(errorResponse.detail || 'API request failed');
    }

    return (data as ApiSuccessResponse<T>).data;
  }

  /**
   * Gets all users from the system
   */
  async getUsers(): Promise<User[]> {
    return this.fetchApi<User[]>(`${this.baseUrl}/v1/Users`);
  }

  /**
   * Creates a new user
   * @param firstName - User's first name
   * @param lastName - User's last name
   */
  async createUser(firstName: string, lastName: string): Promise<User> {
    return this.fetchApi<User>(`${this.baseUrl}/v1/Users`, {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName }),
    });
  }

  /**
   * Creates a new drink run with the given participants
   * @param participants - Array of user IDs participating in the run
   */
  async createDrinkRun(participants: { userId: string }[]): Promise<DrinkRun> {
    return this.fetchApi<DrinkRun>(`${this.baseUrl}/v1/DrinkRun`, {
      method: 'POST',
      body: JSON.stringify({ participants }),
    });
  }
}

export const apiClient = new ApiClient();
