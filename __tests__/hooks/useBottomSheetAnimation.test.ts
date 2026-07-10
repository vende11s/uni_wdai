import { renderHook } from '@testing-library/react-native';
import { useBottomSheetAnimation } from '@/hooks/useBottomSheetAnimation';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      View: React.forwardRef((props: any, ref: any) => React.createElement(View, { ref, ...props })),
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: (fn: any) => fn(),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
    runOnJS: (fn: any) => fn,
  };
});

describe('useBottomSheetAnimation', () => {
  it('initializes animated values correctly', async () => {
    const onClose = jest.fn();
    const { result } = await renderHook(() => useBottomSheetAnimation(false, onClose));

    // Verify it returns the animated style objects
    expect(result.current.animatedBackdropStyle).toBeDefined();
    expect(typeof result.current.animatedBackdropStyle).toBe('object');
    expect(result.current.animatedSheetStyle).toBeDefined();
    expect(typeof result.current.animatedSheetStyle).toBe('object');
    
    // Verify it returns the pan gesture handlers
    expect(result.current.panHandlers).toBeDefined();
    expect(typeof result.current.closeSheet).toBe('function');
  });
});
