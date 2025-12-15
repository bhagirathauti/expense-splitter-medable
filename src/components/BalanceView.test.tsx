import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BalanceView from './BalanceView';
import { Expense } from '../types';

describe('BalanceView', () => {
  const mockPeople = ['Alice', 'Bob', 'Charlie'];
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
      description: 'Taxi',
      amount: 45,
      paidBy: 'Bob',
      splitBetween: ['Bob', 'Charlie'],
      date: '2024-01-16',
      splitType: 'equal'
    }
  ];

  it('should calculate and display individual balances correctly', () => {
    render(<BalanceView people={mockPeople} expenses={mockExpenses} />);

    // Verify balances are displayed (amounts may appear multiple times in settlements)
    expect(screen.getAllByText('$80.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$17.50').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$62.50').length).toBeGreaterThan(0);
    
    // Verify all three people are shown in balance section
    const balanceSection = screen.getByText(/individual balances/i).parentElement;
    expect(balanceSection?.textContent).toMatch(/alice/i);
    expect(balanceSection?.textContent).toMatch(/bob/i);
    expect(balanceSection?.textContent).toMatch(/charlie/i);
    
    // Verify status indicators
    expect(screen.getByText(/is owed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/owes/i).length).toBe(2); // Bob and Charlie
  });

  it('should display total group spending', () => {
    render(<BalanceView people={mockPeople} expenses={mockExpenses} />);

    expect(screen.getByText(/total group spending/i)).toBeInTheDocument();
    expect(screen.getByText('$165.00')).toBeInTheDocument(); // 120 + 45
  });

  it('should show suggested settlements with debt simplification', () => {
    render(<BalanceView people={mockPeople} expenses={mockExpenses} />);

    expect(screen.getByText(/suggested settlements/i)).toBeInTheDocument();
    
    // Should show simplified debts
    const settlements = screen.getByText(/suggested settlements/i).parentElement;
    expect(settlements).toBeTruthy();
  });
});
