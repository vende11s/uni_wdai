import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, TouchableOpacity, Alert, Linking, Platform, PermissionsAndroid, useWindowDimensions, LayoutChangeEvent } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Animated from 'react-native-reanimated';
import { useFavPokemon } from '@/hooks/useFavPokemon';
import { useFaceTracking } from '@/hooks/useFaceTracking';
import { useCameraActiveState } from '@/hooks/useCameraActiveState';

const DEBUG_MODE = false;
const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png'

export default function ARCameraScreen() {
  const { favPokemon } = useFavPokemon();
  const { hasPermission, requestPermission } = useCameraPermission();
  const isActive = useCameraActiveState();

  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const device = useCameraDevice(cameraPosition);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [viewSize, setViewSize] = useState({ width: windowWidth, height: windowHeight });

  const foreheadImage = (favPokemon ? favPokemon.image : DEFAULT_IMAGE);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setViewSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  };

  const [lastTap, setLastTap] = useState(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // time in milliseconds
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      toggleCamera();
    } else {
      setLastTap(now);
    }
  };

  const {
    faceDetectorOutput,
    foreheadStyle,
    debugStyle,
    leftEyeStyle,
    rightEyeStyle,
  } = useFaceTracking({ cameraPosition, viewSize, DEBUG_MODE });

  // Permission button handler
  const handleRequestPermission = async () => {
    let granted = false;

    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        granted = result === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permissions request error (PermissionsAndroid):', err);
      }
    } else {
      granted = await requestPermission();
    }

    if (!granted) {
      Alert.alert(
        'Camera access denied',
        'Could not access the camera. If you do not see a permission prompt, please enable it manually in app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const toggleCamera = () => {
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
  }

  // Handle missing permissions
  if (!hasPermission) {
    console.log('arcam: user aint got no permission');
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          The app needs camera access to work properly.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handleRequestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Handle missing physical camera (e.g., on older simulators)
  if (device == null) {
    console.log('arcam: device not found');
    return (
      <View style={styles.center}>
        <Text>No camera found on this device.</Text>
      </View>
    );
  }

  // Main view with live preview
  return (
    <Pressable style={styles.container} onLayout={handleLayout} onPress={handleDoubleTap}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        outputs={[faceDetectorOutput]}
        resizeMode="cover"
      />
      <Animated.Image
        source={{ uri: foreheadImage }}
        style={[styles.foreheadImage, foreheadStyle]}
        resizeMode="contain"
      />

      {/* Live debugging views */}
      {/* 1. Red face bounding box */}
      <Animated.View style={[
        { position: 'absolute', borderWidth: 2, borderColor: 'red', zIndex: 90, elevation: 90 },
        debugStyle
      ]} />

      {/* 2. Blue eye dot on the LEFT side of the screen */}
      <Animated.View style={[
        { position: 'absolute', width: 12, height: 12, borderRadius: 6, marginLeft: -6, marginTop: -6, backgroundColor: 'blue', zIndex: 91, elevation: 91 },
        leftEyeStyle
      ]} />

      {/* 3. Green eye dot on the RIGHT side of the screen */}
      <Animated.View style={[
        { position: 'absolute', width: 12, height: 12, borderRadius: 6, marginLeft: -6, marginTop: -6, backgroundColor: 'green', zIndex: 91, elevation: 91 },
        rightEyeStyle
      ]} />

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Black background behind the camera looks better
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#007AFF', // Blue (iOS style)
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flipButton: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(235, 235, 235, 1)',
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 99,
    elevation: 99,
    borderRadius: 60,
  },
  foreheadImage: {
    position: 'absolute',
    zIndex: 10,
    elevation: 10,
  },
});