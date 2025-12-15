import { Expense } from '../types';
import { calculateBalances, simplifyDebts, calculateTotalSpending } from '../utils/balanceCalculations';

interface BalanceViewProps {
  people: string[];
  expenses: Expense[];
}

function BalanceView({ people, expenses }: BalanceViewProps) {
  const balances = calculateBalances(expenses, people);
  const totalSpending = calculateTotalSpending(expenses);
  const settlements = simplifyDebts(balances);
  const allSettled = settlements.length === 0;

  const getBalanceStatus = (balance: number): { text: string; color: string } => {
    if (Math.abs(balance) < 0.01) {
      return { text: 'settled up', color: 'text-gray-600' };
    } else if (balance > 0) {
      return { text: 'is owed', color: 'text-green-600' };
    } else {
      return { text: 'owes', color: 'text-red-600' };
    }
  };

  const getBalanceStyle = (balance: number): string => {
    if (Math.abs(balance) < 0.01) {
      return 'bg-gray-100 border border-gray-300';
    } else if (balance > 0) {
      return 'bg-green-50 border border-green-300';
    } else {
      return 'bg-red-50 border border-red-300';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-3 sm:mb-4 text-xl sm:text-2xl border-b-2 border-gray-200 pb-2">
        💰 Balances
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg mb-4 sm:mb-6 gap-2 sm:gap-0">
        <span className="text-sm sm:text-base">Total Group Spending:</span>
        <strong className="text-xl sm:text-2xl">${totalSpending.toFixed(2)}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balances</h3>
        {people.map((person) => {
          const balance = balances[person] || 0;
          const status = getBalanceStatus(balance);
          return (
            <div
              key={person}
              className={`flex justify-between items-center px-3 py-3 mb-2 rounded-md transition-all hover:translate-x-1 ${getBalanceStyle(balance)}`}
            >
              <span className="font-medium text-gray-800">{person}</span>
              <span className="flex items-center gap-2">
                <span className={`${status.color} text-sm`}>{status.text}</span>
                <strong className={`${status.color} text-lg`}>
                  ${Math.abs(balance).toFixed(2)}
                </strong>
              </span>
            </div>
          );
        })}
      </div>

      {allSettled ? (
        <div className="text-center py-8 bg-green-100 rounded-lg text-green-900 font-medium">
          <p>✅ All balances are settled!</p>
        </div>
      ) : (
        <div>
          <h3 className="text-gray-600 my-2 text-lg mb-3">Suggested Settlements</h3>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 mb-2 bg-white rounded border border-blue-100 last:mb-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{settlement.from}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-medium text-gray-800">{settlement.to}</span>
                </div>
                <span className="font-semibold text-blue-600">
                  ${settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} needed to settle all debts
          </p>
        </div>
      )}
    </div>
  );
}

export default BalanceView;
