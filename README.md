# @meksiabdou/react-native-barcode-mask

BarcodeMask Component for React-Native Camera

![bundlephobia](https://badgen.net/bundlephobia/minzip/@meksiabdou/react-native-barcode-mask)
![downloads](https://badgen.net/npm/dt/@meksiabdou/react-native-barcode-mask)
![npm](https://badgen.net/npm/v/@meksiabdou/react-native-barcode-mask)
![license](https://badgen.net/github/license/meksiabdou/react-native-barcode-mask)
[![Known Vulnerabilities](https://snyk.io/test/github/meksiabdou/react-native-barcode-mask/badge.svg?targetFile=package.json)](https://snyk.io/test/github/meksiabdou/react-native-barcode-mask?targetFile=package.json)

![](https://i.imgur.com/mwkbsE7.gif)


## Requirements

- [react-native-reanimated v2.2.0 or higher](https://github.com/software-mansion/react-native-reanimated)

## Installation

```sh
npm install @meksiabdou/react-native-barcode-mask
```

```sh
yarn add @meksiabdou/react-native-barcode-mask
```

## Usage

```tsx
import React, from 'react';
import {View, TouchableOpacity, StyleSheet, Linking, Text} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import BarcodeMask from 'react-native-barcode-mask';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const requestCameraPermission = async () => {
    return await Camera.requestCameraPermission();
  };

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
      <Camera
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={true}
        torch={'off'}
      />
      <BarcodeMask
        lineAnimationDuration={2000}
        showAnimatedLine={true}
        width={width}
        height={height}
        outerMaskOpacity={0.4}
        backgroundColor="#eee"
        edgeColor={'#fff'}
        edgeBorderWidth={4}
        edgeHeight={25}
        edgeWidth={25}
        edgeRadius={5}
        animatedLineColor={'#0097AB'}
        animatedLineThickness={3}
        animatedLineOrientation="horizontal"
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
    //paddingVertical: 50,
  },
});

export default App;

```

### BarcodeMaskProps

| name             | type          | description                           | default |
| ---------------- | ------------- | ------------------------------------- | ------- |
| width            | number | Width of the Barcode Finder Area      | 280     |
| height           | number | Height of the Barcode Finder Area     | 230     |
| edgeWidth        | number | Width of corner edges                 | 20      |
| edgeHeight       | number | Height of corner edges                | 20      |
| edgeColor        | string        | Color of corner edges                 | #fff    |
| edgeRadius       | number        | Border Radius of corner edges         | 0       |
| edgeBorderWidth  | number | Thickness of corner edges             | 4       |
| backgroundColor  | string        | Background color of Outer Finder Area | #eee    |
| maskOpacity      | number        | Opacity of Outer Finder Area          | 1       |
| showAnimatedLine | boolean       | Whether to show Animated Line         | true    |
| animatedLineThickness | number | Thickness of Animated Line | 2 |
| animatedLineOrientation | 'vertical' or 'horizontal' | Orientation that the Animated Line will be drawn | 'horizontal' |
| animatedLineColor | string | Color of Animated Line | #fff |
| animationDuration | number | Duration of Animated Line animation (in ms) | 20000 |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
