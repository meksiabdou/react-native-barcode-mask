import type { GestureResponderEvent } from "react-native";

export interface BarcodeMaskProps {
  lineAnimationDuration?: number;
  showAnimatedLine?: boolean;
  animatedLineOrientation?: 'vertical' | 'horizontal';
  animatedLineThickness?: number;
  width?: number;
  height?: number;
  outerMaskOpacity?: number;
  backgroundColor?: string;
  edgeColor?: string;
  edgeWidth?: number;
  edgeHeight?: number;
  edgeBorderWidth?: number;
  edgeRadius?: number;
  animatedLineColor?: string;
  isActive?: boolean;
  onPress?: (event?: GestureResponderEvent) => void;
}
