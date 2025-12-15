import { useState } from 'react';

interface PeopleManagerProps {
  people: string[];
  onAddPerson: (name: string) => boolean;
  onRemovePerson: (name: string) => boolean;
}

function PeopleManager({ people, onAddPerson, onRemovePerson }: PeopleManagerProps) {
  const [newPersonName, setNewPersonName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPersonName.trim()) {
      setErrorMessage('Please enter a name');
      return;
    }

    if (people.includes(newPersonName.trim())) {
      setErrorMessage('This person is already in the group');
      return;
    }

    const success = onAddPerson(newPersonName);
    if (success) {
      setSuccessMessage(`${newPersonName} added successfully!`);
      setNewPersonName('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleRemove = (name: string) => {
    if (people.length <= 1) {
      setErrorMessage('Cannot remove the last person');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    const success = onRemovePerson(name);
    if (!success) {
      setErrorMessage(`Cannot remove ${name} - they have existing expenses. Delete their expenses first.`);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    setSuccessMessage(`${name} removed`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-3 sm:mb-4 text-xl sm:text-2xl border-b-2 border-gray-200 pb-2">
        👥 Manage People
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

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}          placeholder="Enter person's name"
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px"
        >
          Add Person
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-gray-600 my-2 text-lg">
          Current Members ({people.length})
        </h3>
        {people.length === 0 ? (
          <p className="text-center text-gray-400 py-8 italic">
            No people added yet
          </p>
        ) : (
          <ul className="list-none mt-2">
            {people.map((person, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 mb-1 bg-gray-50 rounded transition-colors hover:bg-gray-100"
              >
                <span className="font-medium text-gray-800">{person}</span>
                <button 
                  onClick={() => handleRemove(person)}
                  className="bg-transparent text-red-500 px-1 py-1 text-sm border border-transparent transition-colors hover:bg-red-100 hover:border-red-300 rounded"
                  type="button"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {people.length < 2 && (
        <p className="bg-red-100 text-red-900 px-3 py-3 rounded-md mt-4 flex items-center gap-2">
          ⚠️ Add at least 2 people to start tracking expenses
        </p>
      )}
    </div>
  );
}

export default PeopleManager;
