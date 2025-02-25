"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Indicator = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Indicator = ({
  indexDecimal,
  itemsLayout,
  style,
  fadeIn = false
}) => {
  const opacity = (0, _reactNativeReanimated.useSharedValue)(fadeIn ? 0 : 1);
  const stylez = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    var _itemsLayout$;

    const transform = itemsLayout.length > 1 ? [{
      translateX: (0, _reactNativeReanimated.interpolate)(indexDecimal.value, itemsLayout.map((_, i) => i), itemsLayout.map(v => v.x))
    }] : undefined;
    const width = itemsLayout.length > 1 ? (0, _reactNativeReanimated.interpolate)(indexDecimal.value, itemsLayout.map((_, i) => i), itemsLayout.map(v => v.width)) : (_itemsLayout$ = itemsLayout[0]) === null || _itemsLayout$ === void 0 ? void 0 : _itemsLayout$.width;
    return {
      transform,
      width,
      opacity: (0, _reactNativeReanimated.withTiming)(opacity.value)
    };
  }, [indexDecimal, itemsLayout]);

  _react.default.useEffect(() => {
    if (fadeIn) {
      opacity.value = 1;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [fadeIn]);

  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [stylez, styles.indicator, style]
  });
};

exports.Indicator = Indicator;

const styles = _reactNative.StyleSheet.create({
  indicator: {
    height: 2,
    backgroundColor: '#2196f3',
    position: 'absolute',
    bottom: 0
  }
});
//# sourceMappingURL=Indicator.js.map