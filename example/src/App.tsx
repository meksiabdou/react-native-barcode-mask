import * as React from 'react';
import RNVCamera from './components/RNVCamera';
import BarcodeMask from '@meksiabdou/react-native-barcode-mask';
import { Slider } from '@miblanchard/react-native-slider';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [size, setSize] = React.useState<{ width: number; height: number }>({
    height: 280,
    width: 300,
  });
  const [isActive, setIsActive] = React.useState<boolean>(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <RNVCamera>
        <BarcodeMask
          lineAnimationDuration={2000}
          showAnimatedLine={true}
          width={size.width}
          height={size.height}
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
          value={size.height}
          onValueChange={(value) => {
            if (value[0]) {
              setSize({ width: value[0], height: value[0] });
            }
          }}
          maximumValue={360}
          minimumValue={100}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slider: {
    position: 'absolute',
    paddingHorizontal: 5,
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 99,
  },
});
