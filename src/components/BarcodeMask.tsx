/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StatusBar,
  ViewProps,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import useLayout from '../hooks/useLayout';
import type { BarcodeMaskProps } from '../types';

const MASK_PADDING = 8;
const DEFAULT_WIDTH = 280;
const DEFAULT_HEIGHT = 300;

const checkNumbre = (value: any, defaultValue = 0) => {
  value = Number(value);
  if (typeof value === 'number' && !isNaN(value) && value !== null) {
    return value;
  }
  return defaultValue;
};

const springConfig: WithSpringConfig = {
  damping: 15,
  stiffness: 100,
  mass: 0.5,
};

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
  const maskHight = useSharedValue<any>(defaultHeight);
  const maskWidth = useSharedValue<any>(defaultWidth);
  const outMaskWidthHight = useSharedValue<any>(0);
  const outMaskWidthWidth = useSharedValue<any>(0);
  const outMaskHightHight = useSharedValue<any>(0);
  const { width, height, portrait } = useLayout();
  const opacity = outerMaskOpacity || 1;
  const EDGE_WIDTH = checkNumbre(edgeWidth, 25);
  const EDGE_HEIGHT = checkNumbre(edgeHeight, 25);
  const EDGE_BORDER_WIDTH = checkNumbre(edgeBorderWidth, 4);
  const EDGE_RADIUS = checkNumbre(edgeRadius, 0);

  const TouchableOpacityAnimated =
    Reanimated.createAnimatedComponent(TouchableOpacity);

  const statusBarHeight = checkNumbre(StatusBar.currentHeight, 35);

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

  const maskStyle = useAnimatedStyle(() => {
    return {
      width: maskWidth.value,
      height: maskHight.value,
    };
  });

  const outMaskStyleWidth = useAnimatedStyle(() => {
    return {
      height: outMaskWidthWidth.value,
      width: outMaskWidthHight.value,
    };
  });

  const outMaskStyleHight = useAnimatedStyle(() => {
    return {
      height: outMaskHightHight.value,
    };
  });

  const setAnimation = (
    value: any,
    config: WithSpringConfig = springConfig
  ) => {
    'worklet';
    return withSpring(value, config);
  };

  const setAnimationTranslation = (value = 0) => {
    return withRepeat(
      withTiming(value, {
        duration: checkNumbre(lineAnimationDuration, 2000),
      }),
      -1,
      true
    );
  };

  useEffect(() => {
    maskHight.value = setAnimation(checkNumbre(defaultHeight, DEFAULT_HEIGHT));
    maskWidth.value = setAnimation(checkNumbre(defaultWidth, DEFAULT_WIDTH));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultHeight, defaultWidth]);

  useEffect(() => {
    const _maskHight = checkNumbre(defaultHeight, DEFAULT_HEIGHT);
    const _maskWidth = checkNumbre(defaultWidth, DEFAULT_WIDTH);
    outMaskHightHight.value =
      (height - (!portrait ? _maskHight + statusBarHeight : _maskHight)) / 2;
    outMaskWidthWidth.value = _maskHight;
    outMaskWidthHight.value = (width - _maskWidth) / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, defaultHeight, defaultWidth, portrait]);

  useEffect((): ReturnType<any> => {
    if (isActive) {
      const lineThickness = checkNumbre(animatedLineThickness, 2);
      const _maskHight = checkNumbre(defaultHeight, DEFAULT_HEIGHT);
      const _maskWidth = checkNumbre(defaultWidth, DEFAULT_WIDTH);
      if (animatedLineOrientation && animatedLineOrientation === 'vertical') {
        translationX.value = 0;
        translationY.value = 0;
        lineHeight.value = setAnimation(_maskHight);
        lineWidth.value = setAnimation(lineThickness);
        translationX.value = setAnimationTranslation(
          _maskWidth - MASK_PADDING * 2
        );
      } else {
        translationX.value = 0;
        translationY.value = 0;
        lineHeight.value = setAnimation(lineThickness);
        lineWidth.value = setAnimation(_maskWidth);
        translationY.value = setAnimationTranslation(
          _maskHight - MASK_PADDING * 2
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lineAnimationDuration,
    defaultHeight,
    defaultWidth,
    animatedLineOrientation,
    animatedLineThickness,
    isActive,
  ]);

  useEffect(() => {
    if (isActive === false) {
      cancelAnimation(translationY);
      cancelAnimation(translationX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const Edge = useCallback(
    ({ index, style, ...rest }: ViewProps & { index: number }) => {
      const edgeAnimationStyle = useAnimatedStyle(() => {
        'worklet';
        return {
          right: setAnimation(
            index % 2 === 0
              ? -(EDGE_BORDER_WIDTH - 1)
              : maskWidth.value - EDGE_WIDTH + EDGE_BORDER_WIDTH,
            springConfig
          ),
        };
      });
      return (
        <Reanimated.View
          style={[
            styles.borders,
            {
              width: EDGE_WIDTH,
              height: EDGE_HEIGHT,
              borderColor: edgeColor,
              borderWidth: EDGE_BORDER_WIDTH,
              borderLeftWidth: index % 2 === 0 ? 0 : EDGE_BORDER_WIDTH,
              borderRightWidth: index % 2 === 0 ? EDGE_BORDER_WIDTH : 0,
              borderTopWidth: 0,
              borderBottomRightRadius: index % 2 === 0 ? EDGE_RADIUS : 0,
              borderBottomLeftRadius: index % 2 === 0 ? 0 : EDGE_RADIUS,
            },
            style,
            edgeAnimationStyle,
          ]}
          {...rest}
        />
      );
    },
    [edgeWidth, edgeHeight, edgeBorderWidth, edgeRadius, edgeColor, edgeBorderWidth]
  );

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
                opacity: opacity,
              },
              outMaskStyleHight,
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
                opacity: opacity,
              },
              outMaskStyleWidth,
            ]}
          />
        );
      })}
      <TouchableOpacityAnimated
        onPress={onPress}
        activeOpacity={1}
        style={[styles.mask, maskStyle]}
      >
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <Edge
              key={index.toString()}
              index={index}
              style={{
                top: -(EDGE_BORDER_WIDTH - 1),
                transform: [{rotate: index % 2 === 0 ? "270deg" : '90deg'}]
              }}
            />
          );
        })}
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <Edge
              key={index.toString()}
              index={index}
              style={{
                bottom: -(EDGE_BORDER_WIDTH - 1),
              }}
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
    maxHeight: '100%',
    paddingHorizontal: MASK_PADDING,
    paddingVertical: MASK_PADDING,
  },
  line: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  borders: {
    position: 'absolute',
  },
});

BarcodeMask.defaultProps = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
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
