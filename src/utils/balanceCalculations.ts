import { Expense, Balance, SimplifiedDebt } from '../types';

/**
 * Calculate net balance for each person
 * Balance = Total Paid - Total Owed
 * Positive balance means they are owed money
 * Negative balance means they owe money
 */
export function calculateBalances(expenses: Expense[], people: string[]): Balance {
  const balances: Balance = {};
  
  // Initialize all people with 0 balance
  people.forEach(person => {
    balances[person] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    // Add the amount paid to the payer's balance (round to 2 decimal places)
    if (balances[expense.paidBy] !== undefined) {
      balances[expense.paidBy] = Math.round((balances[expense.paidBy] + expense.amount) * 100) / 100;
    }

    // Subtract each person's share from their balance
    expense.splitBetween.forEach(person => {
      if (balances[person] !== undefined) {
        let share = 0;
        if (expense.splitType === 'custom' && expense.customAmounts) {
          share = expense.customAmounts[person] || 0;
        } else {
          // Don't round individual shares - let them accumulate precisely
          share = expense.amount / expense.splitBetween.length;
        }
        balances[person] = Math.round((balances[person] - share) * 100) / 100;
      }
    });
  });

  return balances;
}

/**
 * Simplify debts to minimize number of transactions
 * Uses greedy algorithm: match largest creditor with largest debtor repeatedly
 */
export function simplifyDebts(balances: Balance): SimplifiedDebt[] {
  const debts: SimplifiedDebt[] = [];
  
  // Create arrays of creditors (owed money) and debtors (owe money)
  const creditors: { person: string; amount: number }[] = [];
  const debtors: { person: string; amount: number }[] = [];

  Object.entries(balances).forEach(([person, balance]) => {
    if (balance > 0.01) {
      creditors.push({ person, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ person, amount: -balance });
    }
  });

  // Sort by amount (descending)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.amount, debtor.amount);

    debts.push({
      from: debtor.person,
      to: creditor.person,
      amount: amount
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return debts;
}

/**
 * Calculate total group spending (sum of all expenses)
 */
export function calculateTotalSpending(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
