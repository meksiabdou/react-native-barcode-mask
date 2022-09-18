import * as React from 'react';
import RNVCamera from './components/RNVCamera';
import BarcodeMask from '@meksiabdou/react-native-barcode-mask';
import { Slider } from '@miblanchard/react-native-slider';
import { Dimensions, StyleSheet, View } from 'react-native';

export default function App() {
  const [width, setWidth] = React.useState<any>(350);
  const [height, setHeight] = React.useState<any>(280);
  const init = Dimensions.get('window');
  const [isActive, setIsActive] = React.useState<boolean>(true);

  return (
    <View style={styles.container}>
      <RNVCamera>
        <BarcodeMask
          lineAnimationDuration={2000}
          showAnimatedLine={true}
          width={width}
          height={height}
          outerMaskOpacity={0.6}
          backgroundColor="#000"
          edgeColor={'#fff'}
          edgeBorderWidth={3}
          edgeHeight={20}
          edgeWidth={20}
          edgeRadius={0}
          animatedLineColor={'#fff'}
          animatedLineThickness={3}
          animatedLineOrientation="horizontal"
          isActive={isActive}
          onPress={(e) => {
            console.log(e?.nativeEvent);
            setIsActive(!isActive);
          }}
        />
      </RNVCamera>
      <View style={styles.slider}>
        <Slider
          value={width}
          onValueChange={(value: any) => setWidth(value[0])}
          maximumValue={init.width - 50}
          minimumValue={100}
        />
        <Slider
          value={height}
          onValueChange={(value: any) => setHeight(value[0])}
          maximumValue={init.height - 50}
          minimumValue={100}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slider: {
    position: 'absolute',
    paddingHorizontal: 5,
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
