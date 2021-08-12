"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollView = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _helpers = require("./helpers");

var _hooks = require("./hooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Used as a memo to prevent rerendering too often when the context changes.
 * See: https://github.com/facebook/react/issues/15156#issuecomment-474590693
 */
const ScrollViewMemo = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef((props, passRef) => {
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.ScrollView, _extends({
    // @ts-expect-error reanimated types are broken on ref
    ref: passRef
  }, props));
}));
/**
 * Use like a regular ScrollView.
 */


const ScrollView = /*#__PURE__*/_react.default.forwardRef(({
  contentContainerStyle,
  style,
  onContentSizeChange,
  children,
  refreshControl,
  ...rest
}, passRef) => {
  const name = (0, _hooks.useTabNameContext)();
  const ref = (0, _hooks.useSharedAnimatedRef)(passRef);
  const {
    setRef,
    contentInset,
    scrollYCurrent
  } = (0, _hooks.useTabsContext)();
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    progressViewOffset
  } = (0, _hooks.useCollapsibleStyle)();
  const {
    scrollHandler,
    enable
  } = (0, _hooks.useScrollHandlerY)(name);
  (0, _hooks.useAfterMountEffect)(() => {
    // we enable the scroll event after mounting
    // otherwise we get an `onScroll` call with the initial scroll position which can break things
    enable(true);
  });

  _react.default.useEffect(() => {
    setRef(name, ref);
  }, [name, ref, setRef]);

  const scrollContentSizeChange = (0, _hooks.useUpdateScrollViewContentSize)({
    name
  });
  const scrollContentSizeChangeHandlers = (0, _hooks.useChainCallback)(_react.default.useMemo(() => [scrollContentSizeChange, onContentSizeChange], [onContentSizeChange, scrollContentSizeChange]));

  const memoRefreshControl = _react.default.useMemo(() => refreshControl && /*#__PURE__*/_react.default.cloneElement(refreshControl, {
    progressViewOffset,
    ...refreshControl.props
  }), [progressViewOffset, refreshControl]);

  const memoContentOffset = _react.default.useMemo(() => ({
    y: _helpers.IS_IOS ? -contentInset.value + scrollYCurrent.value : 0,
    x: 0
  }), [contentInset.value, scrollYCurrent.value]);

  const memoContentInset = _react.default.useMemo(() => ({
    top: contentInset.value
  }), [contentInset.value]);

  const memoContentContainerStyle = _react.default.useMemo(() => [_contentContainerStyle, // TODO: investigate types
  contentContainerStyle], [_contentContainerStyle, contentContainerStyle]);

  const memoStyle = _react.default.useMemo(() => [_style, style], [_style, style]);

  return /*#__PURE__*/_react.default.createElement(ScrollViewMemo, _extends({}, rest, {
    ref: ref,
    bouncesZoom: false,
    style: memoStyle,
    contentContainerStyle: memoContentContainerStyle,
    onScroll: scrollHandler,
    onContentSizeChange: scrollContentSizeChangeHandlers,
    scrollEventThrottle: 16,
    contentInset: memoContentInset,
    contentOffset: memoContentOffset,
    automaticallyAdjustContentInsets: false,
    refreshControl: memoRefreshControl
  }), children);
});

exports.ScrollView = ScrollView;
//# sourceMappingURL=ScrollView.js.map