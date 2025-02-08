import { ValidationError } from '../errors/api-errors';

export class InputValidator {
  static validateName(name: string): boolean {
    return /^[a-zA-Z\s]{2,50}$/.test(name.trim());
  }

  static validateUser(firstName: string, lastName: string): void {
    if (!this.validateName(firstName) || !this.validateName(lastName)) {
      throw new ValidationError('Invalid user data');
    }
  }

  static validateParticipants(participants: { userId: string }[]): void {
    if (!Array.isArray(participants) || participants.length < 2) {
      throw new ValidationError('Minimum two participants required');
    }
    if (!participants.every(p => typeof p.userId === 'string' && p.userId.length > 0)) {
      throw new ValidationError('Invalid participant data');
    }
  }

  static validateDrinkOrder(order: {
    name: string;
    type: string;
    additionalSpecification: Record<string, string>;
  }): void {
    if (!order?.name || !order?.type) {
      throw new ValidationError('Drink order must include name and type');
    }
    if (!order?.additionalSpecification || typeof order.additionalSpecification !== 'object') {
      throw new ValidationError('Invalid additional specifications');
    }
  }
}
