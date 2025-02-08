import { User, DrinkOrder, DrinkRun, Participant } from './types';
import { APIError, NetworkError, ValidationError } from './errors/api-errors';
import { InputValidator } from './validators/input-validators';

export class TeaRoulette {
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
        throw new APIError('API request failed', response.status);
      }

      return response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new NetworkError();
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    InputValidator.validateUser(user.firstName, user.lastName);
    return this.fetchApi<User>('/Users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, update: Partial<Omit<User, 'id'>>): Promise<User> {
    if (update.firstName) InputValidator.validateName(update.firstName);
    if (update.lastName) InputValidator.validateName(update.lastName);
    return this.fetchApi<User>(`/Users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
  }

  async getUser(id: string): Promise<User> {
    return this.fetchApi<User>(`/Users/${id}`);
  }

  async getUsers(): Promise<User[]> {
    return this.fetchApi<User[]>('/Users');
  }

  async createDrinkRun(participants: Participant[]): Promise<DrinkRun> {
    InputValidator.validateParticipants(participants);
    return this.fetchApi<DrinkRun>('/DrinkRun', {
      method: 'POST',
      body: JSON.stringify({ participants }),
    });
  }

  async getDrinkRun(id: string): Promise<DrinkRun> {
    return this.fetchApi<DrinkRun>(`/DrinkRun/${id}`);
  }

  async createDrinkOrder(order: Omit<DrinkOrder, 'id'>): Promise<DrinkOrder> {
    InputValidator.validateDrinkOrder(order);
    return this.fetchApi<DrinkOrder>('/DrinkOrder', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async getDrinkOrder(id: string): Promise<DrinkOrder> {
    return this.fetchApi<DrinkOrder>(`/DrinkOrder/${id}`);
  }
}
