import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpenseForm from './ExpenseForm';

describe('ExpenseForm', () => {
  it('should add expense with equal split successfully', async () => {
    const mockAddExpense = vi.fn();
    const people = ['Alice', 'Bob', 'Charlie'];

    render(<ExpenseForm people={people} onAddExpense={mockAddExpense} />);

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Dinner' }
    });
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '90' }
    });
    fireEvent.change(screen.getByLabelText(/paid by/i), {
      target: { value: 'Alice' }
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Alice
    fireEvent.click(checkboxes[1]); // Bob
    fireEvent.click(checkboxes[2]); // Charlie

    const addButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Dinner',
          amount: 90,
          paidBy: 'Alice',
          splitBetween: ['Alice', 'Bob', 'Charlie'],
          splitType: 'equal'
        })
      );
    });
  });

  it('should add expense with custom split successfully', async () => {
    const mockAddExpense = vi.fn();
    const people = ['Alice', 'Bob'];

    render(<ExpenseForm people={people} onAddExpense={mockAddExpense} />);

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Taxi' }
    });
    fireEvent.change(screen.getByLabelText('Amount ($)'), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/paid by/i), {
      target: { value: 'Bob' }
    });

    // Switch to custom split
    const customRadio = screen.getByLabelText(/custom amounts/i);
    fireEvent.click(customRadio);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Alice
    fireEvent.click(checkboxes[1]); // Bob

    // Set custom amounts
    const customInputs = screen.getAllByPlaceholderText('Amount');
    fireEvent.change(customInputs[0], { target: { value: '20' } });
    fireEvent.change(customInputs[1], { target: { value: '30' } });

    const addButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Taxi',
          amount: 50,
          paidBy: 'Bob',
          splitBetween: ['Alice', 'Bob'],
          splitType: 'custom',
          customAmounts: { Alice: 20, Bob: 30 }
        })
      );
    });
  });

  it('should show validation error for invalid input', async () => {
    const mockAddExpense = vi.fn();
    const people = ['Alice', 'Bob'];

    render(<ExpenseForm people={people} onAddExpense={mockAddExpense} />);

    const addButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a description/i)).toBeInTheDocument();
    });

    expect(mockAddExpense).not.toHaveBeenCalled();
  });
});
