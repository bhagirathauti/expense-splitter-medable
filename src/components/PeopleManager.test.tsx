import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleManager from './PeopleManager';

describe('PeopleManager', () => {
  it('should successfully add a new person', () => {
    const mockAddPerson = vi.fn().mockReturnValue(true);
    const mockRemovePerson = vi.fn();
    const people = ['Alice', 'Bob'];

    render(
      <PeopleManager
        people={people}
        onAddPerson={mockAddPerson}
        onRemovePerson={mockRemovePerson}
      />
    );

    const input = screen.getByPlaceholderText(/enter person's name/i);
    const addButton = screen.getByRole('button', { name: /add person/i });

    fireEvent.change(input, { target: { value: 'Charlie' } });
    fireEvent.click(addButton);

    expect(mockAddPerson).toHaveBeenCalledWith('Charlie');
  });

  it('should successfully remove a person', () => {
    const mockAddPerson = vi.fn();
    const mockRemovePerson = vi.fn().mockReturnValue(true);
    const people = ['Alice', 'Bob', 'Charlie'];

    render(
      <PeopleManager
        people={people}
        onAddPerson={mockAddPerson}
        onRemovePerson={mockRemovePerson}
      />
    );

    const removeButtons = screen.getAllByRole('button').filter(btn => btn.textContent === '❌');
    fireEvent.click(removeButtons[0]);

    expect(mockRemovePerson).toHaveBeenCalledWith('Alice');
  });

  it('should display all current members with count', () => {
    const mockAddPerson = vi.fn();
    const mockRemovePerson = vi.fn();
    const people = ['Alice', 'Bob', 'Charlie', 'Diana'];

    render(
      <PeopleManager
        people={people}
        onAddPerson={mockAddPerson}
        onRemovePerson={mockRemovePerson}
      />
    );

    expect(screen.getByText(/current members \(4\)/i)).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
  });
});
