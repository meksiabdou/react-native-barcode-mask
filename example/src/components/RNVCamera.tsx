import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Linking, Text} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
// import stylesCamera from '../styles/camera.style';
//import {dimensions} from '../constants/Layout';
import Reanimated from 'react-native-reanimated';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

// const styles = stylesCamera;

// const DESIRED_RATIO = '4:3';
// const aspectRatio = 4 / 3;

export interface CameraProps {
  // localization: any;
  camera?: any;
}

interface IProps extends CameraProps {
  children: any;
}

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const RNVCamera: React.FC<IProps> = (props: IProps): JSX.Element => {
  const {children} = props;
  const [hasPermission, setHasPermission] = useState(false);
  const [flash, setFlash] = useState<boolean>(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const isActive = true;

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ]);

  // console.log(device);
  const requestCameraPermission = async () => {
    return await Camera.requestCameraPermission();
  };

  useEffect(() => {
    if (barcodes.length) {
      const [data] = barcodes;
      console.log(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodes]);

  useEffect((): ReturnType<any> => {
    let isMounted = true;
    requestCameraPermission().then(permission => {
      if (isMounted) {
        if (permission === 'denied') {
          Linking.openSettings();
        }
        setHasPermission(permission === 'authorized');
      }
    });
    return () => (isMounted = false);
  }, []);

  if (device == null || !hasPermission) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <ReanimatedCamera
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={isActive}
        frameProcessor={frameProcessor}
        torch={flash ? 'on' : 'off'}
        enableZoomGesture
      />
      {children || children}
      <View style={styles.flash}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.flashBtn}
          onPress={() => setFlash(!flash)}>
          <Text>{!flash ? 'flash on' : 'flash off'}</Text>
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  captureView: {
    position: 'absolute',
    bottom: -70,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    flex: 0,
    //backgroundColor: '#fff',
    borderRadius: 5,
    //padding: 25,
    //paddingHorizontal: 20,
    alignSelf: 'center',
    //margin: 20,
  },
});

export default RNVCamera;
