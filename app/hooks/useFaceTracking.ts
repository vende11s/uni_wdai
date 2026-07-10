import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useFaceDetectorOutput } from 'react-native-vision-camera-face-detector';
import { useAnimatedStyle } from 'react-native-reanimated';

interface UseFaceTrackingProps {
  cameraPosition: 'front' | 'back';
  viewSize: { width: number; height: number };
  DEBUG_MODE: boolean;
}

export function useFaceTracking({ cameraPosition, viewSize, DEBUG_MODE }: UseFaceTrackingProps) {
  // Keep overlay position in shared values (UI thread) to prevent JS thread blocking
  // React won't re-render when these values change 30-60 times a second
  const foreheadX = useSharedValue(0);
  const foreheadY = useSharedValue(0);
  const foreheadW = useSharedValue(0);
  const foreheadOpacity = useSharedValue(0);

  // Shared values for visual debugging (face bounding box + eyes)
  const debugX = useSharedValue(0);
  const debugY = useSharedValue(0);
  const debugW = useSharedValue(0);
  const debugH = useSharedValue(0);
  const debugLeftEyeX = useSharedValue(0);
  const debugLeftEyeY = useSharedValue(0);
  const debugRightEyeX = useSharedValue(0);
  const debugRightEyeY = useSharedValue(0);
  const debugOpacity = useSharedValue(0);

  // Face detection via integrated camera output
  const faceDetectorOutput = useFaceDetectorOutput({
    performanceMode: 'fast',
    cameraFacing: cameraPosition,
    // autoMode natively scales bounds to screen size and handles rotation/mirroring
    autoMode: true,
    windowWidth: viewSize.width,
    windowHeight: viewSize.height,
    // Enable face landmarks for precise tracking
    runLandmarks: true,
    onFacesDetected: (faces) => {
      const face = faces?.[0];
      if (face) {
        const { bounds } = face;
        const leftEye = face.landmarks?.LEFT_EYE;
        const rightEye = face.landmarks?.RIGHT_EYE;

        let width = 0;
        let targetX = 0;
        let targetY = 0;

        if (leftEye && rightEye) {
          const dx = rightEye.x - leftEye.x;
          const dy = rightEye.y - leftEye.y;
          const eyeDistance = Math.sqrt(dx * dx + dy * dy);

          const midX = (leftEye.x + rightEye.x) / 2;
          const midY = ((leftEye.y + rightEye.y) / 2) * 0.835;

          width = eyeDistance * 1.5;
          targetX = midX - width / 2;

          const pitchFactor = 1.05 + (face.pitchAngle * 0.005);
          targetY = midY - (eyeDistance * pitchFactor);
        }

        foreheadW.value = withSpring(width, { damping: 20, stiffness: 120, mass: 0.5 });
        foreheadX.value = withSpring(targetX, { damping: 20, stiffness: 120, mass: 0.5 });
        foreheadY.value = withSpring(targetY, { damping: 20, stiffness: 120, mass: 0.5 });
        foreheadOpacity.value = withTiming(1, { duration: 150 });

        debugX.value = bounds.x;
        debugY.value = bounds.y;
        debugW.value = bounds.width;
        debugH.value = bounds.height;
        if (leftEye && rightEye) {
          const screenLeft = leftEye.x <= rightEye.x ? leftEye : rightEye;
          const screenRight = leftEye.x <= rightEye.x ? rightEye : leftEye;
          debugLeftEyeX.value = screenLeft.x;
          debugLeftEyeY.value = screenLeft.y;
          debugRightEyeX.value = screenRight.x;
          debugRightEyeY.value = screenRight.y;
        }
        debugOpacity.value = (DEBUG_MODE ? 1 : 0);
      } else {
        foreheadOpacity.value = withTiming(0, { duration: 150 });
        debugOpacity.value = 0;
      }
    },
    onError: (err) => {
      console.error('Face detection error:', err);
    },
  });

  const foreheadStyle = useAnimatedStyle(() => ({
    opacity: foreheadOpacity.value,
    left: foreheadX.value,
    top: foreheadY.value,
    width: foreheadW.value,
    height: foreheadW.value,
  }));

  const debugStyle = useAnimatedStyle(() => ({
    opacity: debugOpacity.value,
    left: debugX.value,
    top: debugY.value,
    width: debugW.value,
    height: debugH.value,
  }));

  const leftEyeStyle = useAnimatedStyle(() => ({
    opacity: debugOpacity.value,
    left: debugLeftEyeX.value,
    top: debugLeftEyeY.value,
  }));

  const rightEyeStyle = useAnimatedStyle(() => ({
    opacity: debugOpacity.value,
    left: debugRightEyeX.value,
    top: debugRightEyeY.value,
  }));

  return {
    faceDetectorOutput,
    foreheadStyle,
    debugStyle,
    leftEyeStyle,
    rightEyeStyle,
  };
}
