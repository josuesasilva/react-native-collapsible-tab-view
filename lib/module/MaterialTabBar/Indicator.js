import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolate } from 'react-native-reanimated';

const Indicator = ({
  indexDecimal,
  itemsLayout,
  style,
  fadeIn = false
}) => {
  const opacity = useSharedValue(fadeIn ? 0 : 1);
  const stylez = useAnimatedStyle(() => {
    var _itemsLayout$;

    const transform = itemsLayout.length > 1 ? [{
      translateX: interpolate(indexDecimal.value, itemsLayout.map((_, i) => i), itemsLayout.map(v => v.x))
    }] : undefined;
    const width = itemsLayout.length > 1 ? interpolate(indexDecimal.value, itemsLayout.map((_, i) => i), itemsLayout.map(v => v.width)) : (_itemsLayout$ = itemsLayout[0]) === null || _itemsLayout$ === void 0 ? void 0 : _itemsLayout$.width;
    return {
      transform,
      width,
      opacity: withTiming(opacity.value)
    };
  }, [indexDecimal, itemsLayout]);
  React.useEffect(() => {
    if (fadeIn) {
      opacity.value = 1;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [fadeIn]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [stylez, styles.indicator, style]
  });
};

const styles = StyleSheet.create({
  indicator: {
    height: 2,
    backgroundColor: '#2196f3',
    position: 'absolute',
    bottom: 0
  }
});
export { Indicator };
//# sourceMappingURL=Indicator.js.map