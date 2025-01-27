import { render, screen, fireEvent } from '@testing-library/react';
import { AddUserForm } from '../components/add-user-form';

describe('AddUserForm', () => {
  it('renders the form and allows user addition', () => {
    const onUserAdded = jest.fn();
    render(<AddUserForm onUserAdded={onUserAdded} />);

    fireEvent.change(screen.getByPlaceholderText('Enter user name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.click(screen.getByText('Add participant to the list'));

    expect(onUserAdded).toHaveBeenCalled();
  });
});
