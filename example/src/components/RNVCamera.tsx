/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Text,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  type CodeScanner,
} from 'react-native-vision-camera';

export interface CameraProps {
  camera?: any;
}

interface IProps extends CameraProps {
  children: any;
}

const RNVCamera: React.FC<IProps> = (props: IProps) => {
  const { children } = props;
  const [hasPermission, setHasPermission] = useState(false);
  const [flash, setFlash] = useState<boolean>(false);
  const cameraDevice = useCameraDevice('back', {
    physicalDevices: ['wide-angle-camera'],
  });
  const isActive = true;

  // console.log(device);
  const requestCameraPermission = async () => {
    return await Camera.requestCameraPermission();
  };

  useEffect((): ReturnType<any> => {
    let isMounted = true;
    requestCameraPermission().then((permission) => {
      if (isMounted) {
        if (permission === 'denied') {
          Linking.openSettings();
        }
        setHasPermission(permission === 'granted');
      }
    });
    return () => (isMounted = false);
  }, []);

  const barCodeScanner: CodeScanner = {
    codeTypes: ['ean-13', 'ean-8', 'code-128', 'code-39', 'code-93'],
    onCodeScanned: (barcodes) => {
      console.log({
        type: barcodes?.[0]?.type,
        data: barcodes?.[0]?.value,
      });
    },
  };

  if (cameraDevice == null || !hasPermission) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Camera
        device={cameraDevice}
        style={StyleSheet.absoluteFill}
        isActive={isActive}
        torch={flash ? 'on' : 'off'}
        enableZoomGesture
        codeScanner={barCodeScanner}
      />
      {children || children}
      <View style={styles.flash}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.flashBtn}
          onPress={() => setFlash(!flash)}
        >
          <Text style={{ color: '#333' }}>
            {!flash ? 'flash on' : 'flash off'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
    //paddingVertical: 50,
  },
  flash: {
    position: 'absolute',
    top: 25,
    right: 0,
    flex: 0,
    zIndex: 2,
    flexDirection: 'row',
  },
  flashBtn: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 8,
    alignSelf: 'center',
    margin: 20,
  },
});

export default RNVCamera;
