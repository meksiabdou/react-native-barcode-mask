/* eslint-disable react-native/no-inline-styles */
import { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  type ViewStyle,
  type ViewProps,
  I18nManager,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  withSpring,
  type WithSpringConfig,
} from 'react-native-reanimated';
import useLayout from '../hooks/useLayout';
import type { BarcodeMaskProps } from '../types';

const MASK_PADDING = 8;
const DEFAULT_WIDTH = 280;
const DEFAULT_HEIGHT = 300;

const checkNumber = (value: any, defaultValue = 0) => {
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

const TouchableOpacityAnimated =
  Reanimated.createAnimatedComponent(TouchableOpacity);

const statusBarHeight = checkNumber(StatusBar.currentHeight, 30);

const BarcodeMask = (props: BarcodeMaskProps) => {
  const {
    animatedLineColor = '#fff',
    outerMaskOpacity = 1,
    lineAnimationDuration = 2000,
    animatedLineOrientation = 'horizontal',
    animatedLineThickness = 3,
    edgeColor = '#fff',
    width: defaultWidth = DEFAULT_WIDTH,
    height: defaultHeight = DEFAULT_HEIGHT,
    showAnimatedLine = true,
    backgroundColor = '#000',
    edgeWidth = 25,
    edgeHeight = 25,
    edgeBorderWidth = 4,
    edgeRadius = 0,
    isActive = true,
    onPress = undefined,
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
  const EDGE_WIDTH = checkNumber(edgeWidth, 25);
  const EDGE_HEIGHT = checkNumber(edgeHeight, 25);
  const EDGE_BORDER_WIDTH = checkNumber(edgeBorderWidth, 4);
  const EDGE_RADIUS = checkNumber(edgeRadius, 0);
  const IS_RTL = I18nManager.isRTL ? -1 : 1;

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
      height: outMaskWidthHight.value,
      width: outMaskWidthWidth.value,
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
    return withSpring(value, config);
  };

  const setAnimationTranslation = (value = 0) => {
    return withRepeat(
      withTiming(value, {
        duration: checkNumber(lineAnimationDuration, 2000),
      }),
      -1,
      true
    );
  };

  useEffect(() => {
    maskHight.value = checkNumber(defaultHeight, DEFAULT_HEIGHT);
    maskWidth.value = checkNumber(defaultWidth, DEFAULT_WIDTH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultHeight, defaultWidth]);

  useEffect(() => {
    outMaskWidthWidth.value = (width - maskWidth.value) / 2;
    outMaskWidthHight.value = maskHight.value;
    outMaskHightHight.value =
      (height -
        (!portrait
          ? maskHight.value + (statusBarHeight - MASK_PADDING)
          : maskHight.value)) /
      2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, maskHight.value, maskWidth.value, portrait]);

  useEffect((): ReturnType<any> => {
    if (isActive) {
      const lineThickness = checkNumber(animatedLineThickness, 2);
      if (animatedLineOrientation && animatedLineOrientation === 'vertical') {
        translationX.value = 0;
        translationY.value = 0;
        lineHeight.value = maskHight.value;
        lineWidth.value = setAnimation(lineThickness);
        translationX.value = setAnimationTranslation(
          maskWidth.value - MASK_PADDING * 2
        );
      } else {
        translationX.value = 0;
        translationY.value = 0;
        lineHeight.value = setAnimation(lineThickness);
        lineWidth.value = maskWidth.value;
        translationY.value = setAnimationTranslation(
          maskHight.value - MASK_PADDING * 2
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lineAnimationDuration,
    maskHight.value,
    maskWidth.value,
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
            index % 2 === 0
              ? { right: -(EDGE_BORDER_WIDTH - 1) }
              : { left: -(EDGE_BORDER_WIDTH - 1) },
            style,
            //edgeAnimationStyle,
          ]}
          {...rest}
        />
      );
    },
    [EDGE_WIDTH, EDGE_HEIGHT, edgeColor, EDGE_BORDER_WIDTH, EDGE_RADIUS]
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
                transform: [
                  {
                    rotate:
                      index % 2 === 0
                        ? `${IS_RTL * 270}deg`
                        : `${IS_RTL * 90}deg`,
                  },
                ],
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
    overflow: 'hidden',
  },
  mask: {
    position: 'relative',
    maxHeight: '100%',
    maxWidth: '100%',
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

export default BarcodeMask;
