# Submission Notes

## Implementation Approach

### State Management
- **Choice:** Lifted state to App.tsx with props drilling
- **Rationale:** Simple and straightforward for 4 components; Context API would be overkill
- **Data Flow:** Unidirectional - state flows down via props, callbacks flow up

### Architecture Decisions
- **Component Structure:** 
  - PeopleManager: Handles add/remove person operations
  - ExpenseForm: Manages expense creation with equal/custom split
  - ExpenseList: Displays and manages expense deletion
  - BalanceView: Calculates and displays balances and settlements
- **Utility Functions:** Isolated balance calculations in `balanceCalculations.ts`
- **Algorithm:** Greedy algorithm for debt simplification (match largest creditor with largest debtor)

### Key Implementation Details
- **Floating-Point Precision:** Calculate precise shares without early rounding, round only final balances to 2 decimals
- **Validation:** Return boolean success/failure from add/remove operations for proper error handling
- **Auto-increment IDs:** Generate expense IDs based on max existing ID + 1

## Assumptions Made

1. **Person Removal:** A person cannot be removed if they appear in any expense (either as payer or in split)
2. **Minimum People:** At least 1 person must always exist in the group
3. **Custom Split Validation:** Custom split amounts must equal the total expense amount within $0.01 tolerance
4. **Date Defaults:** New expenses default to today's date
5. **Form Behavior:** Input fields clear automatically on successful submission
6. **User Feedback:** Success messages auto-hide after 3 seconds
7. **Duplicate Names:** Cannot add a person with a name that already exists in the group

## Known Issues / Incomplete Features

None - all required features are fully implemented and functional.

## Testing

- Application runs without errors
- All core features tested manually
- Responsive design verified on mobile and desktop viewports
