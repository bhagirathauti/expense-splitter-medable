import { useState } from 'react';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';
import { initialPeople, initialExpenses } from './initialData';
import { Expense } from './types';

function App() {
  const [people, setPeople] = useState<string[]>(initialPeople);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addPerson = (name: string) => {
    if (!name.trim()) return false;
    if (people.includes(name.trim())) return false;
    setPeople([...people, name.trim()]);
    return true;
  };

  const removePerson = (name: string) => {
    // Check if person is in any existing expenses
    const personInExpenses = expenses.some(
      expense => expense.paidBy === name || expense.splitBetween.includes(name)
    );
    
    if (personInExpenses) {
      return false; // Indicate removal failed
    }
    
    setPeople(people.filter(p => p !== name));
    return true; // Indicate removal succeeded
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1
    };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-4 sm:p-6 text-center border-b border-white/20">
        <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>

      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2">
            <PeopleManager 
              people={people}
              onAddPerson={addPerson}
              onRemovePerson={removePerson}
            />
            <ExpenseForm people={people} onAddExpense={addExpense} />
          </div>

          <div className="w-full lg:w-1/2">
            <BalanceView people={people} expenses={expenses} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
