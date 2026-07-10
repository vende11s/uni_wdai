import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ARCameraScreen from '@/(tabs)/ar-camera';
import { Linking, Alert, Platform, PermissionsAndroid } from 'react-native';

const mockRequestPermission = jest.fn();
let mockHasPermission = false;
let mockDevice: any = { id: 'back' };

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Camera: React.forwardRef((props: any, ref: any) => (
      <View testID="camera-preview" {...props} />
    )),
    useCameraDevice: () => mockDevice,
    useCameraPermission: () => ({
      hasPermission: mockHasPermission,
      requestPermission: mockRequestPermission,
    }),
    useFrameOutput: (config: any) => config,
  };
});

jest.mock('react-native-vision-camera-face-detector', () => ({
  useFaceDetectorOutput: (config: any) => config,
}));

jest.mock('@/hooks/useFavPokemon', () => ({
  useFavPokemon: () => ({
    favPokemon: null,
    reload: jest.fn(),
    setFavPokemon: jest.fn(),
  }),
}));

jest.mock('expo-router', () => ({
  useFocusEffect: (cb: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require('react').useEffect(() => cb(), [cb]);
  }
}));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { Image, View } = require('react-native');
  return {
    __esModule: true,
    default: {
      Image: React.forwardRef((props: any, ref: any) => <Image ref={ref} {...props} />),
      View: React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />),
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: (fn: any) => fn(),
    withSpring: (val: any) => val,
    withTiming: (val: any) => val,
  };
});

jest.spyOn(Linking, 'openSettings').mockImplementation(async () => true);
const alertSpy = jest.spyOn(Alert, 'alert');
const permissionsAndroidSpy = jest.spyOn(PermissionsAndroid, 'request');

describe('ARCameraScreen', () => {
  const originalOS = Platform.OS;

  const mockPlatformOS = (os: 'android' | 'ios') => {
    Object.defineProperty(Platform, 'OS', {
      value: os,
      configurable: true,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHasPermission = false;
    mockDevice = { id: 'back' };
    mockPlatformOS('ios'); // default to iOS
  });

  afterEach(() => {
    mockPlatformOS(originalOS);
  });

  it('renders request permission view when permission is not granted', async () => {
    mockHasPermission = false;

    await render(<ARCameraScreen />);

    expect(screen.getByText(/The app needs camera access to work properly/)).toBeOnTheScreen();
    expect(screen.getByText('Grant permission')).toBeOnTheScreen();
  });

  it('calls requestPermission when clicking button on iOS', async () => {
    mockPlatformOS('ios');
    mockHasPermission = false;
    mockRequestPermission.mockResolvedValue(true);

    await render(<ARCameraScreen />);

    const button = screen.getByText('Grant permission');
    fireEvent.press(button);

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('calls PermissionsAndroid.request when clicking button on Android', async () => {
    mockPlatformOS('android');
    mockHasPermission = false;
    permissionsAndroidSpy.mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    await render(<ARCameraScreen />);

    const button = screen.getByText('Grant permission');
    fireEvent.press(button);

    expect(permissionsAndroidSpy).toHaveBeenCalledWith(PermissionsAndroid.PERMISSIONS.CAMERA);
  });

  it('shows Alert dialog with option to open system settings if requestPermission returns false on iOS', async () => {
    mockPlatformOS('ios');
    mockHasPermission = false;
    mockRequestPermission.mockResolvedValue(false);

    await render(<ARCameraScreen />);

    const button = screen.getByText('Grant permission');
    fireEvent.press(button);

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

    // Verify Alert parameters
    expect(alertSpy.mock.calls[0][0]).toBe('Camera access denied');
    expect(alertSpy.mock.calls[0][1]).toContain('Could not access the camera');

    // Simulate clicking "Ustawienia" button in Alert
    const buttons = alertSpy.mock.calls[0][2];
    const settingsButton = buttons?.find((b: any) => b.text === 'Settings');
    expect(settingsButton).toBeDefined();

    if (settingsButton && settingsButton.onPress) {
      settingsButton.onPress();
    }
    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
  });

  it('shows Alert dialog with option to open system settings if PermissionsAndroid returns denied on Android', async () => {
    mockPlatformOS('android');
    mockHasPermission = false;
    permissionsAndroidSpy.mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    await render(<ARCameraScreen />);

    const button = screen.getByText('Grant permission');
    fireEvent.press(button);

    expect(permissionsAndroidSpy).toHaveBeenCalledWith(PermissionsAndroid.PERMISSIONS.CAMERA);
    await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));

    // Verify Alert parameters
    expect(alertSpy.mock.calls[0][0]).toBe('Camera access denied');
    expect(alertSpy.mock.calls[0][1]).toContain('Could not access the camera');

    // Simulate clicking "Ustawienia" button in Alert
    const buttons = alertSpy.mock.calls[0][2];
    const settingsButton = buttons?.find((b: any) => b.text === 'Settings');
    expect(settingsButton).toBeDefined();

    if (settingsButton && settingsButton.onPress) {
      settingsButton.onPress();
    }
    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
  });

  it('renders camera preview when permission is granted and device is available', async () => {
    mockHasPermission = true;

    await render(<ARCameraScreen />);

    expect(screen.getByTestId('camera-preview')).toBeOnTheScreen();
  });

  it('renders no camera device message when device is null', async () => {
    mockHasPermission = true;
    mockDevice = null;

    await render(<ARCameraScreen />);

    expect(screen.getByText('No camera found on this device.')).toBeOnTheScreen();
  });
});
