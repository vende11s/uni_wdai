import { useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';

// Pobieramy wysokość ekranu użytkownika
const SCREEN_HEIGHT = Dimensions.get('window').height;

export function useBottomSheetAnimation(visible: boolean, onClose: () => void) {
    // 1. Zaczynamy z kartą przesuniętą w dół o wysokość ekranu (schowaną)
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    // 2. Tło (backdrop) zaczyna jako całkowicie przezroczyste (0)
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    // Resztę kodu dopiszemy tutaj...
    // Funkcja wysuwająca kartę w górę
    const openSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,              // Przesunięcie do góry do pozycji 0
                duration: 300,           // Czas animacji w milisekundach
                useNativeDriver: true,   // Optymalizacja wydajności
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0.5,            // Przyciemnienie tła do 50%
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    // Funkcja chowająca kartę w dół
    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,  // Zsuwamy z powrotem pod ekran
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,              // Rozjaśniamy tło do 0
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Dopiero po zakończeniu animacji odpalamy callback zamykający
            onClose();
        });
    };

    // Nasłuchujemy zmiany właściwości `visible` przekazanej z ekranu głównego
    useEffect(() => {
        if (visible) {
            openSheet();
        } else {
            // Upewniamy się, że karta jest schowana
            translateY.setValue(SCREEN_HEIGHT);
            backdropOpacity.setValue(0);
        }
    }, [visible]);
    // 3. PanResponder - obsługa gestów przeciągania
    const panResponder = useRef(
        PanResponder.create({
            // Decyduje, czy chcemy reagować na dotknięcie elementu (zawsze tak)
            onStartShouldSetPanResponder: () => true,

            // Decyduje, czy chcemy przejąć kontrolę nad ruchem (tylko, gdy przesuwamy w dół)
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 5;
            },

            // Wywoływane na bieżąco podczas przeciągania palca
            onPanResponderMove: (_, gestureState) => {
                // dy to odległość od miejsca startu. Ruszamy kartę tylko w dół (dy > 0)
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },

            // Wywoływane, gdy użytkownik puści palec z ekranu
            onPanResponderRelease: (_, gestureState) => {
                // dy > 120 (przeciągnięte o 120px) lub vy > 0.5 (szybki flick w dół) -> zamykamy
                if (gestureState.dy > 120 || gestureState.vy > 0.5) {
                    closeSheet();
                } else {
                    // Jeśli przeciągnięto za mało, karta sprężyście wraca na pozycję 0
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // 4. Zwracamy wartości potrzebne do ostylowania i obsłużenia komponentu
    return {
        translateY,
        backdropOpacity,
        panHandlers: panResponder.panHandlers,
        closeSheet,
    };
}

