import { render, screen, fireEvent } from '@testing-library/react';
import { DrinkOrderForm } from '../components/drink-order-form';
import { User } from '@/app/api/api-client.types';

describe('DrinkOrderForm', () => {
  it('renders the form and submits an order', async () => {
    const mockUser: User = { id: '1', firstName: 'John', lastName: 'Doe', drinkOrders: [] };
    const onOrderCreated = jest.fn();
    render(<DrinkOrderForm user={mockUser} onOrderCreated={onOrderCreated} />);

    fireEvent.change(screen.getByPlaceholderText('e.g., 2 sugars, milk'), {
      target: { value: 'No sugar' },
    });
    fireEvent.click(screen.getByText('Save Preferences'));

    expect(onOrderCreated).toHaveBeenCalled();
  });
});
