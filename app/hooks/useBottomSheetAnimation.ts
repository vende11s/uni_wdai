import { useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

// Read the user's screen height
const SCREEN_HEIGHT = Dimensions.get('window').height;

export function useBottomSheetAnimation(visible: boolean, onClose: () => void) {
    // 1. Start with the card shifted down by the screen height (hidden)
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    // 2. Backdrop starts fully transparent (0)
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    // The rest of the code goes here...
    // Slides the card up
    const openSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,              // Shift up to position 0
                duration: 300,           // Animation duration in milliseconds
                useNativeDriver: true,   // Performance optimization
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0.5,            // Dim the backdrop to 50%
                duration: 350,
                useNativeDriver: true,
            })
        ]).start();
    };

    // Slides the card down
    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,  // Slide back below the screen
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,              // Fade the backdrop back to 0
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Fire the close callback only after the animation finishes
            onClose();
        });
    };

    // React to changes of the `visible` prop passed from the parent screen
    useEffect(() => {
        if (visible) {
            openSheet();
        } else {
            // Make sure the card stays hidden
            translateY.setValue(SCREEN_HEIGHT);
            backdropOpacity.setValue(0);
        }
    }, [visible]);
    // 3. PanResponder — drag gesture handling
    const panResponder = useRef(
        PanResponder.create({
            // Claim the touch (always)
            onStartShouldSetPanResponder: () => true,

            // Take over the gesture only when dragging downward
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 5;
            },

            // Called continuously while the finger is dragging
            onPanResponderMove: (_, gestureState) => {
                // dy is the distance from the start. Move the card only downward (dy > 0)
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },

            // Called when the user lifts their finger
            onPanResponderRelease: (_, gestureState) => {
                // dy > 120 (dragged 120px) or vy > 0.5 (fast downward flick) -> close
                if (gestureState.dy > 120 || gestureState.vy > 0.5) {
                    closeSheet();
                } else {
                    // If the drag is too short, spring the card back to position 0
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // 4. Return the values needed to style and control the component
    return {
        translateY,
        backdropOpacity,
        panHandlers: panResponder.panHandlers,
        closeSheet,
    };
}
