import { User, DrinkOrder, DrinkRun, Participant } from '../../types';
import { APIError, NetworkError, ValidationError } from '../../app/api/api-errors';
import { InputValidator } from './input-validators';

export class ApiHandler {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8794') {
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/v1${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new APIError('Resource not found', 404);
        }
        if (response.status === 429) {
          throw new APIError('Rate limit exceeded', 429);
        }
        if (response.status === 409) {
          throw new APIError('User already exists', 409);
        }
        throw new APIError(data.detail || 'API request failed', response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new NetworkError('Failed to connect to API');
    }
  }

  async createUser(user: {firstName: string, lastName: string}) {
    // Early validation before any API call
    if (!user || typeof user !== 'object') {
      throw new ValidationError('Invalid user data');
    }

    if (!InputValidator.isValidUser(user)) {
      throw new ValidationError('Invalid user data');
    }

    try {
      return this.fetchApi<User>('/Users', {
        method: 'POST',
        body: JSON.stringify(user)
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw error;
    }
  }

  async getUser(id: string) {
    return this.fetchApi<User>(`/Users/${id}`, {
      method: 'GET'
    });
  }

  async getUsers() {
    return this.fetchApi<User[]>('/Users', {
      method: 'GET'
    });
  }

  async updateUser(id: string, updates: Partial<User>) {
    if (!id || !updates) {
      throw new ValidationError('Invalid update data');
    }

    return this.fetchApi<User>(`/Users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async createDrinkRun(participants: Array<{userId: string}>) {
    if (participants.length < 2) {
      throw new Error('Minimum two participants required');
    }

    return this.fetchApi<DrinkRun>('/DrinkRuns', {
      method: 'POST',
      body: JSON.stringify({ participants })
    });
  }

  async getDrinkRun(id: string) {
    return this.fetchApi<DrinkRun>(`/DrinkRuns/${id}`, {
      method: 'GET'
    });
  }

  async createDrinkOrder(order: any) {
    return this.fetchApi<DrinkOrder>('/DrinkOrders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  }

  async getDrinkOrder(id: string) {
    return this.fetchApi<DrinkOrder>(`/DrinkOrders/${id}`, {
      method: 'GET'
    });
  }
}
