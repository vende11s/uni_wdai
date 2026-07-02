# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Test-driven development

This project is **TDD-first**. Write a failing test, then the implementation.
- Use `jest` and `@testing-library/react-native` for all tests.
- Place test files next to the implementation files with a `.test.tsx` or `.test.ts` extension (e.g. `App.test.tsx` next to `App.tsx`).
- Ensure all business logic and UI components have tests written BEFORE the actual implementation is developed.

## UI verification

For any UI components, ensure that you write robust snapshot or interaction tests using `@testing-library/react-native` to verify the rendered component tree instead of relying on manual testing.

## Pull requests

- One feature per branch: `got-them-all/<short-name>` (e.g. `got-them-all/add-new-pokemon-eevee`).
- Keep PRs focused; describe **what** changed, **why**, and how it was verified.
- Match the surrounding code's style and idioms.