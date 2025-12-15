import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
  it('should update ExpenseForm dropdowns when person is added', async () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText(/enter person's name/i);
    const addButton = screen.getByRole('button', { name: /add person/i });

    fireEvent.change(nameInput, { target: { value: 'Eve' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/current members \(5\)/i)).toBeInTheDocument();
    });

    const paidBySelect = screen.getByLabelText(/paid by/i) as HTMLSelectElement;
    const options = Array.from(paidBySelect.options).map(opt => opt.value);
    expect(options).toContain('Eve');
  });

  it('should update BalanceView when expense is added', async () => {
    render(<App />);

    const initialSpending = screen.getByText(/total group spending/i);
    expect(initialSpending.parentElement).toHaveTextContent('$365.00');

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Snacks' }
    });
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/paid by/i), {
      target: { value: 'Alice' }
    });

    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes[0]) fireEvent.click(checkboxes[0]);

    const addExpenseButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addExpenseButton);

    await waitFor(() => {
      expect(screen.getByText('$385.00')).toBeInTheDocument();
    });
  });

  it('should prevent person removal if they have expenses', async () => {
    render(<App />);

    const removeButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent === '❌'
    );

    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
    }

    await waitFor(() => {
      expect(screen.getByText(/cannot remove.*existing expenses/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/current members \(4\)/i)).toBeInTheDocument();
  });
});
