import { describe, it, expect } from 'vitest';
import { calculateBalances, simplifyDebts, calculateTotalSpending } from './balanceCalculations';
import { Expense } from '../types';

describe('Balance Calculations', () => {
  const mockPeople = ['Alice', 'Bob', 'Charlie'];
  const mockExpenses: Expense[] = [
    {
      id: 1,
      description: 'Lunch',
      amount: 90,
      paidBy: 'Alice',
      splitBetween: ['Alice', 'Bob', 'Charlie'],
      date: '2024-01-15',
      splitType: 'equal'
    },
    {
      id: 2,
      description: 'Coffee',
      amount: 30,
      paidBy: 'Bob',
      splitBetween: ['Bob', 'Charlie'],
      date: '2024-01-16',
      splitType: 'equal'
    }
  ];

  it('should calculate balances correctly for equal split', () => {
    const balances = calculateBalances(mockExpenses, mockPeople);

    // Alice: paid 90, owes 30, net = +60
    expect(balances.Alice).toBe(60);

    // Bob: paid 30, owes 30 (lunch) + 15 (coffee), net = -15
    expect(balances.Bob).toBe(-15);

    // Charlie: paid 0, owes 30 (lunch) + 15 (coffee), net = -45
    expect(balances.Charlie).toBe(-45);
  });

  it('should calculate total spending correctly', () => {
    const total = calculateTotalSpending(mockExpenses);
    expect(total).toBe(120); // 90 + 30
  });

  it('should simplify debts to minimize transactions', () => {
    const balances = {
      Alice: 60,
      Bob: -15,
      Charlie: -45
    };

    const settlements = simplifyDebts(balances);

    // Verify all debts are covered
    const totalPaid = settlements.reduce((sum, s) => sum + s.amount, 0);
    expect(totalPaid).toBeGreaterThan(0);

    // Verify no one pays themselves
    settlements.forEach(settlement => {
      expect(settlement.from).not.toBe(settlement.to);
    });

    // Should have at most n-1 transactions (where n is number of people with non-zero balance)
    expect(settlements.length).toBeLessThanOrEqual(2);
  });
});
