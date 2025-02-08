import { InputValidator } from '../../lib/utils/input-validators';
import { ValidationError } from '../../app/api/api-errors';

describe('InputValidator', () => {
  describe('Name Validation', () => {
    test('should validate correct names', () => {
      expect(InputValidator.validateName('John')).toBe(true);
      expect(InputValidator.validateName('Mary Jane')).toBe(true);
    });

    test('should reject invalid names', () => {
      expect(InputValidator.validateName('')).toBe(false);
      expect(InputValidator.validateName('J0hn')).toBe(false);
      expect(InputValidator.validateName('   ')).toBe(false);
    });
  });

  describe('Participant Validation', () => {
    test('should validate correct participant list', () => {
      const validParticipants = [
        { userId: '1' },
        { userId: '2' }
      ];
      expect(() => InputValidator.validateParticipants(validParticipants)).not.toThrow();
    });

    test('should reject invalid participant list', () => {
      const invalidCases = [
        [],
        [{ userId: '1' }],
        [{ userId: '' }, { userId: '2' }],
        [{ userId: 123 }, { userId: '2' }] as any[]
      ];

      invalidCases.forEach(testCase => {
        expect(() => InputValidator.validateParticipants(testCase))
          .toThrow(ValidationError);
      });
    });
  });

  describe('Drink Order Validation', () => {
    test('should validate correct drink order', () => {
      const validOrder = {
        name: 'Earl Grey',
        type: 'Tea',
        additionalSpecification: { milk: 'yes' }
      };
      expect(() => InputValidator.validateDrinkOrder(validOrder)).not.toThrow();
    });

    test.each([
      [{ type: 'Tea', additionalSpecification: {} }, 'missing name'],
      [{ name: 'Coffee', additionalSpecification: {} }, 'missing type'],
      [{ name: 'Coffee', type: 'Hot' }, 'missing additionalSpecification'],
      [{}, 'empty object'],
      [null, 'null input'],
      [undefined, 'undefined input']
    ])('should reject invalid drink order - %s', (testCase: any, _scenario: string) => {
      expect(() => InputValidator.validateDrinkOrder(testCase)).toThrow(ValidationError);
    });
  });
});
