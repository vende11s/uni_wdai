# Project Context: Expo v57.0.0 (Strict TypeScript)
Read docs at https://docs.expo.dev/versions/v57.0.0/ if unsure about an API.

## Architecture & Conventions
- **Dumb Components:** Keep UI components stateless. Extract complex logic and state management to custom hooks.
- **Exports:** Use Named Exports exclusively, except for `app/` directory screens which require default exports.
- **Imports:** Use absolute path aliases (e.g., `@/components/`, `@/hooks/`).

## Mobile Specifics & Navigation
- **Routing:** Strictly use `expo-router`. Do not manually configure React Navigation.
- **Safe Areas:** Do NOT blindly wrap screens in `SafeAreaView` if a Stack header is present (to avoid double padding). Prefer using the `useSafeAreaInsets()` hook from `react-native-safe-area-context` for precise layout adjustments.
- **Keyboards:** Ensure keyboards never obscure `TextInput` fields. Use `KeyboardAvoidingView` (with proper platform-specific `behavior`), `ScrollView`, or keyboard hooks appropriately based on the screen's complexity.
- **Primitives:** Never use standard HTML tags (div, span). Use only primitive React Native components (View, Text, Pressable).

## Workflow (TDD-First)
- Write robust tests using `jest` and `@testing-library/react-native` BEFORE implementation.
- Include interaction or snapshot tests for all UI components.
- Co-locate test files (e.g., `Button.test.tsx` next to `Button.tsx`).

## Pull requests

- One feature per branch: `got-them-all/<short-name>` (e.g. `got-them-all/add-new-pokemon-eevee`).
- Keep PRs focused; describe **what** changed, **why**, and how it was verified.
- Match the surrounding code's style and idioms.