import React, { useState, useEffect } from 'react';
import { StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import useLayout from '../hooks/useLayout';
import type { BarcodeMaskProps } from '../types';

const BarcodeMask = (props: BarcodeMaskProps) => {
  const {
    animatedLineColor,
    outerMaskOpacity,
    lineAnimationDuration,
    animatedLineOrientation,
    animatedLineThickness,
    edgeColor,
    width: defaultWidth,
    height: defaultHeight,
    showAnimatedLine,
    backgroundColor,
    edgeWidth,
    edgeHeight,
    edgeBorderWidth,
    edgeRadius,
    isActive,
    onPress,
  } = props;
  const translationY = useSharedValue(0);
  const translationX = useSharedValue(0);
  const lineWidth = useSharedValue<any>(0);
  const lineHeight = useSharedValue<any>(0);
  const { width, height, portrait } = useLayout();
  const [maskHight, setMaskHeight] = useState(230);
  const [maskWidth, setMaskWidth] = useState(280);
  const opacity = outerMaskOpacity || 1;
  const EDGE_WIDTH = typeof edgeWidth === 'number' ? edgeWidth : 25;
  const EDGE_HEIGHT = typeof edgeHeight === 'number' ? edgeHeight : 25;
  const EDGE_BORDER_WIDTH =
    typeof edgeBorderWidth === 'number' ? edgeBorderWidth : 4;
  const EDGE_RADIUS = typeof edgeRadius === 'number' ? edgeRadius : 0;

  const TouchableOpacityAnimated =
    Reanimated.createAnimatedComponent(TouchableOpacity);

  const styleLine = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translationY.value,
        },
        {
          translateX: translationX.value,
        },
      ],
      width: lineWidth.value,
      height: lineHeight.value,
    } as ViewStyle;
  });

  const setAnimation = (value = 0) => {
    return withRepeat(
      withTiming(value, {
        duration:
          typeof lineAnimationDuration === 'number'
            ? lineAnimationDuration
            : 2000,
      }),
      -1,
      true
    );
  };

  useEffect(() => {
    setMaskHeight(typeof defaultHeight === 'number' ? defaultHeight : 300);
    setMaskWidth(typeof defaultWidth === 'number' ? defaultWidth : 300);
  }, [defaultHeight, defaultWidth]);

  useEffect((): ReturnType<any> => {
    if (isActive) {
      if (animatedLineOrientation && animatedLineOrientation === 'vertical') {
        translationX.value = -(maskWidth / 2) + EDGE_BORDER_WIDTH;
        translationY.value = 0;
        lineHeight.value = maskHight - 10;
        lineWidth.value = animatedLineThickness;
        translationX.value = setAnimation(maskWidth / 2 - EDGE_BORDER_WIDTH);
      } else {
        translationX.value = 0;
        translationY.value = EDGE_BORDER_WIDTH;
        lineHeight.value = animatedLineThickness;
        lineWidth.value = maskWidth - 10;
        translationY.value = setAnimation(maskHight - EDGE_BORDER_WIDTH);
      }
    }
  }, [
    lineAnimationDuration,
    maskHight,
    maskWidth,
    animatedLineOrientation,
    animatedLineThickness,
    isActive,
  ]);

  useEffect(() => {
    if (isActive === false) {
      cancelAnimation(translationY);
    }
  }, [isActive]);

  return (
    <Reanimated.View style={[styles.container]}>
      {Array.from({ length: 2 }).map((_, index) => {
        return (
          <Reanimated.View
            key={index.toString()}
            style={[
              styles.back,
              { backgroundColor: backgroundColor },
              index % 2 === 0 ? { top: 0 } : { bottom: 0 },
              {
                left: 0,
                right: 0,
                height: (height - (!portrait ? maskHight + 35 : maskHight)) / 2,
                opacity: opacity,
              },
            ]}
          />
        );
      })}
      {Array.from({ length: 2 }).map((_, index) => {
        return (
          <Reanimated.View
            key={index.toString()}
            style={[
              styles.back,
              { backgroundColor: backgroundColor },
              index % 2 === 0 ? { left: 0 } : { right: 0 },
              {
                height: maskHight,
                width: (width - maskWidth) / 2,
                opacity: opacity,
              },
            ]}
          />
        );
      })}
      <TouchableOpacityAnimated
        onPress={onPress}
        activeOpacity={1}
        style={[styles.mask, { width: maskWidth, height: maskHight }]}
      >
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <Reanimated.View
              key={index.toString()}
              style={[
                styles.borders,
                {
                  width: EDGE_WIDTH,
                  height: EDGE_HEIGHT,
                  borderColor: edgeColor,
                  top: -EDGE_BORDER_WIDTH,
                  right:
                    index % 2 === 0
                      ? -EDGE_BORDER_WIDTH
                      : maskWidth - EDGE_WIDTH + EDGE_BORDER_WIDTH,
                  borderWidth: EDGE_BORDER_WIDTH,
                  borderBottomWidth: 0,
                  borderLeftWidth: index % 2 === 0 ? 0 : EDGE_BORDER_WIDTH,
                  borderRightWidth: index % 2 === 0 ? EDGE_BORDER_WIDTH : 0,
                  borderTopRightRadius: index % 2 === 0 ? EDGE_RADIUS : 0,
                  borderTopLeftRadius: index % 2 === 0 ? 0 : EDGE_RADIUS,
                },
              ]}
            />
          );
        })}
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <Reanimated.View
              key={index.toString()}
              style={[
                styles.borders,
                {
                  width: EDGE_WIDTH,
                  height: EDGE_HEIGHT,
                  borderColor: edgeColor,
                  bottom: -EDGE_BORDER_WIDTH,
                  right:
                    index % 2 === 0
                      ? -EDGE_BORDER_WIDTH
                      : maskWidth - EDGE_WIDTH + EDGE_BORDER_WIDTH,
                  borderWidth: EDGE_BORDER_WIDTH,
                  borderTopWidth: 0,
                  borderLeftWidth: index % 2 === 0 ? 0 : EDGE_BORDER_WIDTH,
                  borderRightWidth: index % 2 === 0 ? EDGE_BORDER_WIDTH : 0,
                  borderBottomRightRadius: index % 2 === 0 ? EDGE_RADIUS : 0,
                  borderBottomLeftRadius: index % 2 === 0 ? 0 : EDGE_RADIUS,
                },
              ]}
            />
          );
        })}
        {showAnimatedLine ? (
          <Reanimated.View
            style={[
              styles.line,
              {
                backgroundColor: animatedLineColor,
                top:
                  animatedLineOrientation === 'vertical'
                    ? EDGE_BORDER_WIDTH
                    : 0,
              },
              styleLine,
            ]}
          />
        ) : null}
      </TouchableOpacityAnimated>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  back: {
    position: 'absolute',
  },
  mask: {
    position: 'relative',
  },
  line: {
    position: 'absolute',
    alignSelf: 'center',
  },
  borders: {
    position: 'absolute',
  },
});

BarcodeMask.defaultProps = {
  width: 280,
  height: 230,
  edgeWidth: 25,
  edgeHeight: 25,
  edgeColor: '#fff',
  edgeBorderWidth: 4,
  edgeRadius: 0,
  backgroundColor: '#000',
  outerMaskOpacity: 1,
  animatedLineColor: '#fff',
  animatedLineOrientation: 'horizontal',
  lineAnimationDuration: 2000,
  animatedLineThickness: 3,
  showAnimatedLine: true,
  isActive: true,
  onPress: undefined,
};

export default BarcodeMask;
