import { useRef, useEffect } from 'react';
import { Dimensions, PanResponder } from 'react-native';
import {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function useBottomSheetAnimation(visible: boolean, onClose?: () => void) {
    // Start with the sheet pushed down by screen height (hidden)
    const translateY = useSharedValue(SCREEN_HEIGHT);

    // Backdrop starts fully transparent (0)
    const backdropOpacity = useSharedValue(0);

    const openSheet = () => {
        translateY.value = withTiming(0, { duration: 300 });
        backdropOpacity.value = withTiming(0.5, { duration: 350 });
    };

    const closeSheet = () => {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, (finished) => {
            if (finished && onClose) {
                runOnJS(onClose)();
            }
        });
        backdropOpacity.value = withTiming(0, { duration: 250 });
    };

    useEffect(() => {
        if (visible) {
            openSheet();
        } else {
            // Ensure the sheet is hidden
            translateY.value = SCREEN_HEIGHT;
            backdropOpacity.value = 0;
        }
    }, [visible]);

    // Drag gesture handling
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            // Take control only when swiping down
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 5;
            },

            onPanResponderMove: (_, gestureState) => {
                // Move the sheet only downwards (dy > 0)
                if (gestureState.dy > 0) {
                    translateY.value = gestureState.dy;
                }
            },

            onPanResponderRelease: (_, gestureState) => {
                // Close if dragged more than 120px or swiped down fast (vy > 0.5)
                if (gestureState.dy > 120 || gestureState.vy > 0.5) {
                    closeSheet();
                } else {
                    // Otherwise, spring back to the original position
                    translateY.value = withSpring(0);
                }
            },
        })
    ).current;

    const animatedBackdropStyle = useAnimatedStyle(() => {
        return {
            opacity: backdropOpacity.value,
        };
    });

    const animatedSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return {
        animatedBackdropStyle,
        animatedSheetStyle,
        panHandlers: panResponder.panHandlers,
        closeSheet,
    };
}
