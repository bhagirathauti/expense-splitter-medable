import { useState } from 'react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const calculateShare = (expense: Expense, person: string): number => {
    if (expense.splitType === 'custom' && expense.customAmounts) {
      return expense.customAmounts[person] || 0;
    }
    return expense.amount / expense.splitBetween.length;
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-3 sm:mb-4 text-xl sm:text-2xl border-b-2 border-gray-200 pb-2">
        📝 Expense History
      </h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">
          No expenses added yet. Add your first expense to get started!
        </p>
      ) : (
        <div>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-gray-50 rounded-lg mb-4 border border-gray-200 overflow-hidden"
            >
              <div 
                className="p-3 sm:p-4 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-100"
                onClick={() => toggleExpand(expense.id)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-gray-800 mb-1 text-base sm:text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {expense.description}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:gap-4 text-gray-600 text-xs sm:text-sm">
                    <span>{formatDate(expense.date)}</span>
                    <span className="truncate">Paid by {expense.paidBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-base sm:text-xl font-semibold text-gray-700 whitespace-nowrap">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    className={`bg-transparent text-gray-600 px-2 py-1 transition-all hover:bg-gray-200 rounded ${expandedId === expense.id ? 'rotate-90' : ''}`}
                    aria-label="Expand"
                  >
                    ▶
                  </button>
                </div>
              </div>
              
              {expandedId === expense.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
                  <div className="mb-3">
                    <h5 className="text-gray-700 font-medium mb-2">Split Details:</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Split Type: <span className="font-medium">{expense.splitType === 'equal' ? 'Equal Split' : 'Custom Amounts'}</span>
                    </p>
                    <div className="space-y-1">
                      {expense.splitBetween.map((person) => (
                        <div key={person} className="flex justify-between text-sm">
                          <span className="text-gray-700">{person}</span>
                          <span className="font-medium text-gray-800">
                            ${calculateShare(expense, person).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${expense.description}"?`)) {
                        onDeleteExpense(expense.id);
                      }
                    }}
                    className="w-full px-3 py-2 bg-red-500 text-white rounded-md text-sm font-medium transition-all hover:bg-red-600 hover:-translate-y-px"
                  >
                    🗑️ Delete Expense
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-700">
        <p>
          Total Expenses: <strong>{expenses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ExpenseList;
