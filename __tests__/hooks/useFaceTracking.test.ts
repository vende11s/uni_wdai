import { renderHook, act } from '@testing-library/react-native';
import { useFaceTracking } from '@/hooks/useFaceTracking';
import { useFaceDetectorOutput } from 'react-native-vision-camera-face-detector';

jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    useSharedValue: jest.fn((init) => ({ value: init })),
    withSpring: jest.fn((toValue) => toValue),
    withTiming: jest.fn((toValue) => toValue),
    useAnimatedStyle: jest.fn((cb) => {
      const style = {};
      const initial = cb();
      for (const key of Object.keys(initial)) {
        Object.defineProperty(style, key, {
          get: () => cb()[key],
          enumerable: true
        });
      }
      return style;
    }),
  };
});

jest.mock('react-native-vision-camera-face-detector', () => ({
  useFaceDetectorOutput: jest.fn(),
}));

describe('useFaceTracking', () => {
  let onFacesDetected: Function;
  let onError: Function;

  beforeEach(() => {
    jest.clearAllMocks();

    (useFaceDetectorOutput as jest.Mock).mockImplementation((options) => {
      onFacesDetected = options.onFacesDetected;
      onError = options.onError;
      return 'mockedFaceDetectorOutput';
    });
  });

  const defaultProps = {
    cameraPosition: 'front' as const,
    viewSize: { width: 400, height: 800 },
    DEBUG_MODE: false,
  };

  it('should initialize with default values', async () => {
    const { result } = await renderHook(() => useFaceTracking(defaultProps));

    expect(useFaceDetectorOutput).toHaveBeenCalledWith(expect.objectContaining({
      cameraFacing: 'front',
      windowWidth: 400,
      windowHeight: 800,
    }));

    expect(result.current.faceDetectorOutput).toBe('mockedFaceDetectorOutput');
    expect(result.current.foreheadStyle.opacity).toBe(0);
    expect(result.current.debugStyle.opacity).toBe(0);
  });

  it('should update shared values when a face is detected', async () => {
    const { result } = await renderHook(() => useFaceTracking(defaultProps));

    const mockFace = {
      bounds: { x: 50, y: 100, width: 200, height: 200 },
      pitchAngle: 10,
      landmarks: {
        LEFT_EYE: { x: 100, y: 150 },
        RIGHT_EYE: { x: 150, y: 150 },
      },
    };

    await act(async () => {
      onFacesDetected([mockFace]);
    });

    expect(result.current.foreheadStyle.opacity).toBe(1);
    expect(result.current.debugStyle.opacity).toBe(0); // DEBUG_MODE is false
  });

  it('should show debug overlay when DEBUG_MODE is true and face is detected', async () => {
    const { result } = await renderHook(() => useFaceTracking({ ...defaultProps, DEBUG_MODE: true }));

    const mockFace = {
      bounds: { x: 50, y: 100, width: 200, height: 200 },
      pitchAngle: 10,
      landmarks: {
        LEFT_EYE: { x: 100, y: 150 },
        RIGHT_EYE: { x: 150, y: 150 },
      },
    };

    await act(async () => {
      onFacesDetected([mockFace]);
    });

    expect(result.current.debugStyle.opacity).toBe(1);
    expect(result.current.debugStyle.left).toBe(50);
    expect(result.current.debugStyle.top).toBe(100);
    expect(result.current.debugStyle.width).toBe(200);
    expect(result.current.debugStyle.height).toBe(200);
  });

  it('should handle face detection gracefully if no face or landmarks are present', async () => {
    const { result } = await renderHook(() => useFaceTracking({ ...defaultProps, DEBUG_MODE: true }));

    // Empty array
    await act(async () => {
      onFacesDetected([]);
    });

    expect(result.current.foreheadStyle.opacity).toBe(0);
    expect(result.current.debugStyle.opacity).toBe(0);

    // Face without landmarks
    const mockFace = {
      bounds: { x: 50, y: 100, width: 200, height: 200 },
      pitchAngle: 10,
    };
    
    await act(async () => {
      onFacesDetected([mockFace]);
    });
    
    expect(result.current.debugStyle.opacity).toBe(1);
  });

  it('should log errors via onError callback', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await renderHook(() => useFaceTracking(defaultProps));
    
    await act(async () => {
      onError(new Error('Detector error'));
    });
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Face detection error:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
