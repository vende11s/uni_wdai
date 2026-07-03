import { renderHook } from '@testing-library/react-native';
import { useBottomSheetAnimation } from '@/hooks/useBottomSheetAnimation';
import { Animated } from 'react-native';

describe('useBottomSheetAnimation', () => {
  it('initializes animated values correctly', async () => {
    const onClose = jest.fn();
    const { result } = await renderHook(() => useBottomSheetAnimation(false, onClose));

    // Verify it returns Animated.Value instances
    expect(result.current.translateY).toBeInstanceOf(Animated.Value);
    expect(result.current.backdropOpacity).toBeInstanceOf(Animated.Value);
    
    // Verify it returns the pan gesture handlers
    expect(result.current.panHandlers).toBeDefined();
    expect(typeof result.current.closeSheet).toBe('function');
  });
});
