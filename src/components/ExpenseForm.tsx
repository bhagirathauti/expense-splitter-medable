import { useState } from 'react';
import { Expense } from '../types';

interface ExpenseFormProps {
  people: string[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

function ExpenseForm({ people, onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{ [person: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!description.trim()) {
      setErrorMessage('Please enter a description');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0');
      return;
    }

    if (!paidBy) {
      setErrorMessage('Please select who paid');
      return;
    }

    if (splitBetween.length === 0) {
      setErrorMessage('Please select at least one person to split between');
      return;
    }

    // Validate custom amounts
    if (splitType === 'custom') {
      const customAmountsObj: { [person: string]: number } = {};
      let total = 0;

      for (const person of splitBetween) {
        const customAmount = parseFloat(customAmounts[person] || '0');
        if (isNaN(customAmount) || customAmount <= 0) {
          setErrorMessage(`Please enter a valid amount for ${person}`);
          return;
        }
        customAmountsObj[person] = customAmount;
        total += customAmount;
      }

      if (Math.abs(total - amountNum) > 0.01) {
        setErrorMessage(`Custom amounts must total $${amountNum.toFixed(2)} (currently $${total.toFixed(2)})`);
        return;
      }

      onAddExpense({
        description: description.trim(),
        amount: amountNum,
        paidBy,
        splitBetween,
        date,
        splitType: 'custom',
        customAmounts: customAmountsObj
      });
    } else {
      onAddExpense({
        description: description.trim(),
        amount: amountNum,
        paidBy,
        splitBetween,
        date,
        splitType: 'equal'
      });
    }

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaidBy('');
    setSplitBetween([]);
    setCustomAmounts({});
    setSuccessMessage('Expense added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleSplitPerson = (person: string) => {
    if (splitBetween.includes(person)) {
      setSplitBetween(splitBetween.filter(p => p !== person));
      const newCustomAmounts = { ...customAmounts };
      delete newCustomAmounts[person];
      setCustomAmounts(newCustomAmounts);
    } else {
      setSplitBetween([...splitBetween, person]);
    }
  };

  const handleCustomAmountChange = (person: string, value: string) => {
    setCustomAmounts({
      ...customAmounts,
      [person]: value
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-3 sm:mb-4 text-xl sm:text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-900 px-3 py-2 rounded-md mb-4 flex items-center gap-2">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-900 px-3 py-2 rounded-md mb-4 flex items-center gap-2">
          ✅ {successMessage}
        </div>
      )}

      {people.length < 2 && (
        <div className="bg-yellow-100 text-yellow-900 px-3 py-2 rounded-md mb-4 flex items-center gap-2">
          ⚠️ Add at least 2 people before creating expenses
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Description
          </label>
          <input
            id="description"
            type="text"            value={description}
            onChange={(e) => setDescription(e.target.value)}            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 mb-4">
            <label
              htmlFor="amount"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-sm sm:text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label
              htmlFor="date"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-sm sm:text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="paidBy"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-sm sm:text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Type
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                name="splitType"
                checked={splitType === 'equal'}
                onChange={(e) => setSplitType(e.target.value as 'equal' | 'custom')}
                className="cursor-pointer"
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="custom"
                name="splitType"
                checked={splitType === 'custom'}
                onChange={(e) => setSplitType(e.target.value as 'equal' | 'custom')}
                className="cursor-pointer"
              />
              <span>Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Between
          </label>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <div
                key={person}
                className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1"
              >
                <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    checked={splitBetween.includes(person)}
                    onChange={() => toggleSplitPerson(person)}
                    className="cursor-pointer" 
                  />
                  <span>{person}</span>
                </label>
                {splitType === 'custom' && splitBetween.includes(person) && (
                  <input
                    type="number"
                    step="0.01"
                    value={customAmounts[person] || ''}
                    onChange={(e) => handleCustomAmountChange(person, e.target.value)}
                    placeholder="Amount"
                    className="w-24 px-2 py-1 border-2 border-gray-200 rounded text-sm transition-colors focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={people.length < 2}
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px flex items-center justify-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
