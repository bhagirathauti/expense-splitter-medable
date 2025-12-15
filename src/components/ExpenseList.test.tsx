import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseList from './ExpenseList';
import { Expense } from '../types';

describe('ExpenseList', () => {
  const mockExpenses: Expense[] = [
    {
      id: 1,
      description: 'Lunch',
      amount: 120,
      paidBy: 'Alice',
      splitBetween: ['Alice', 'Bob', 'Charlie'],
      date: '2024-01-15',
      splitType: 'equal'
    },
    {
      id: 2,
      description: 'Coffee',
      amount: 15,
      paidBy: 'Bob',
      splitBetween: ['Bob', 'Charlie'],
      date: '2024-01-16',
      splitType: 'equal'
    }
  ];

  it('should display all expenses', () => {
    const mockDeleteExpense = vi.fn();

    render(<ExpenseList expenses={mockExpenses} onDeleteExpense={mockDeleteExpense} />);

    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
  });

  it('should delete expense when delete button is clicked', () => {
    const mockDeleteExpense = vi.fn();
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ExpenseList expenses={mockExpenses} onDeleteExpense={mockDeleteExpense} />);

    // Click to expand the first expense
    const expenseRow = screen.getByText('Lunch');
    fireEvent.click(expenseRow);

    // Now find and click the delete button
    const deleteButton = screen.getByText(/delete expense/i);
    fireEvent.click(deleteButton);

    expect(mockDeleteExpense).toHaveBeenCalledWith(1);
  });

  it('should show expense details when expanded', () => {
    const mockDeleteExpense = vi.fn();

    render(<ExpenseList expenses={mockExpenses} onDeleteExpense={mockDeleteExpense} />);

    const expenseRow = screen.getByText('Lunch').closest('div');
    if (expenseRow) {
      fireEvent.click(expenseRow);
    }

    expect(screen.getByText(/split type/i)).toBeInTheDocument();
    expect(screen.getByText(/equal split/i)).toBeInTheDocument();
  });
});
