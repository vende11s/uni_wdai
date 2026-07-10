import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';

export function useCameraActiveState() {
  const [isFocused, setIsFocused] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return isFocused && appState === 'active';
}
