/// <reference types="react" />
import { LayoutChangeEvent, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { TabBarProps, TabName } from '../types';
declare type AnimatedStyle = StyleProp<Animated.AnimateStyle<ViewStyle>>;
declare type AnimatedTextStyle = StyleProp<Animated.AnimateStyle<TextStyle>>;
export declare type MaterialTabItemProps<T extends TabName> = {
    name: T;
    index: number;
    indexDecimal: Animated.SharedValue<number>;
    onPress: (name: T) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
    scrollEnabled?: boolean;
    label: string;
    style?: StyleProp<ViewStyle>;
    /**
     * Style to apply to the tab item label
     */
    labelStyle?: AnimatedTextStyle;
    inactiveOpacity?: number;
    pressColor?: string;
    pressOpacity?: number;
    /**
     * Color applied to the label when active
     */
    activeColor?: string;
    /**
     * Color applied to the label when inactive
     */
    inactiveColor?: string;
} & Omit<PressableProps, 'onPress' | 'children'>;
export declare type MaterialTabBarProps<N extends TabName> = TabBarProps<N> & {
    /**
     * Indicates whether the tab bar should contain horizontal scroll, when enabled the tab width is dynamic
     */
    scrollEnabled?: boolean;
    /**
     * Style to apply to the active indicator.
     */
    indicatorStyle?: AnimatedStyle;
    /**
     * React component to render as tab bar item
     */
    TabItemComponent?: (props: MaterialTabItemProps<N>) => React.ReactElement;
    /**
     * Function to compute the tab item label text
     */
    getLabelText?: (name: N) => string;
    /**
     * Style to apply to the tab bar container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Style to apply to the inner container for tabs
     */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Style to apply to the individual tab items in the tab bar.
     */
    tabStyle?: StyleProp<ViewStyle>;
    /**
     * Style to apply to the tab item label
     */
    labelStyle?: AnimatedTextStyle;
    /**
     * Color applied to the label when active
     */
    activeColor?: string;
    /**
     * Color applied to the label when inactive
     */
    inactiveColor?: string;
};
export declare type ItemLayout = {
    width: number;
    x: number;
};
export declare type IndicatorProps = {
    indexDecimal: Animated.SharedValue<number>;
    itemsLayout: ItemLayout[];
    style?: AnimatedStyle;
    fadeIn?: boolean;
};
export {};
