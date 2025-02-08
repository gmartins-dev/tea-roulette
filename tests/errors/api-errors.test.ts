import { APIError, ValidationError, NetworkError } from '../../app/api/api-errors';

describe('API Errors', () => {
  test('APIError should set correct properties', () => {
    const error = new APIError('Test error', 400, 'TEST_ERROR');
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(400);
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('APIError');
  });

  test('ValidationError should set correct properties', () => {
    const error = new ValidationError('Invalid data');
    expect(error.message).toBe('Invalid data');
    expect(error.name).toBe('ValidationError');
  });

  test('NetworkError should set correct properties', () => {
    const error = new NetworkError();
    expect(error.message).toBe('Failed to connect to API');
    expect(error.name).toBe('NetworkError');

    const customError = new NetworkError('Custom message');
    expect(customError.message).toBe('Custom message');
  });
});
