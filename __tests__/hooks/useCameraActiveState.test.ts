import { renderHook, act } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCameraActiveState } from '@/hooks/useCameraActiveState';

// Mock expo-router
jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
}));

describe('useCameraActiveState', () => {
  let focusCallback: Function;
  let appStateCallback: Function;
  let mockRemove: jest.Mock;
  let originalCurrentState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    originalCurrentState = AppState.currentState;
    Object.defineProperty(AppState, 'currentState', {
      configurable: true,
      get: () => 'active',
    });
    
    // Capture the callback passed to useFocusEffect
    (useFocusEffect as jest.Mock).mockImplementation((callback) => {
      focusCallback = callback;
    });

    mockRemove = jest.fn();
    // Capture the callback passed to AppState.addEventListener
    jest.spyOn(AppState, 'addEventListener').mockImplementation((event, callback) => {
      if (event === 'change') {
        appStateCallback = callback;
      }
      return { remove: mockRemove } as any;
    });
  });

  afterEach(() => {
    Object.defineProperty(AppState, 'currentState', {
      configurable: true,
      value: originalCurrentState,
    });
  });

  it('should return false initially before focus effect runs', async () => {
    const { result } = await renderHook(() => useCameraActiveState());
    expect(result.current).toBe(false);
  });

  it('should return true when focused and app is active', async () => {
    const { result } = await renderHook(() => useCameraActiveState());
    
    await act(async () => {
      focusCallback();
    });

    expect(result.current).toBe(true);
  });

  it('should return false when unfocused', async () => {
    const { result } = await renderHook(() => useCameraActiveState());
    
    let cleanup: Function;
    await act(async () => {
      cleanup = focusCallback();
    });
    
    expect(result.current).toBe(true);
    
    await act(async () => {
      cleanup();
    });
    
    expect(result.current).toBe(false);
  });

  it('should return false when app state changes to background', async () => {
    const { result } = await renderHook(() => useCameraActiveState());
    
    await act(async () => {
      focusCallback();
    });
    
    expect(result.current).toBe(true);
    
    await act(async () => {
      appStateCallback('background');
    });
    
    expect(result.current).toBe(false);
  });
  
  it('should return false when app state changes to inactive', async () => {
    const { result } = await renderHook(() => useCameraActiveState());
    
    await act(async () => {
      focusCallback();
    });
    
    expect(result.current).toBe(true);
    
    await act(async () => {
      appStateCallback('inactive');
    });
    
    expect(result.current).toBe(false);
  });

  it('should cleanup event listener on unmount', async () => {
    const { unmount } = await renderHook(() => useCameraActiveState());
    
    await act(async () => {
      unmount();
    });
    
    expect(mockRemove).toHaveBeenCalled();
  });
});
