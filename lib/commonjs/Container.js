"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));

var _Context = require("./Context");

var _Lazy = require("./Lazy");

var _MaterialTabBar = require("./MaterialTabBar");

var _Tab = require("./Tab");

var _helpers = require("./helpers");

var _hooks = require("./hooks");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Basic usage looks like this:
 *
 * ```tsx
 * import { Tabs } from 'react-native-collapsible-tab-view'
 *
 * const Example = () => {
 *   return (
 *     <Tabs.Container renderHeader={MyHeader}>
 *       <Tabs.Tab name="A">
 *         <ScreenA />
 *       </Tabs.Tab>
 *       <Tabs.Tab name="B">
 *         <ScreenB />
 *       </Tabs.Tab>
 *     </Tabs.Container>
 *   )
 * }
 * ```
 */
const Container = /*#__PURE__*/_react.default.memo( /*#__PURE__*/_react.default.forwardRef(({
  initialTabName,
  headerHeight: initialHeaderHeight,
  minHeaderHeight = 0,
  tabBarHeight: initialTabBarHeight = _MaterialTabBar.TABBAR_HEIGHT,
  revealHeaderOnScroll = false,
  snapThreshold,
  children,
  // TODO: these two are obsolete, remove them in v5.0
  HeaderComponent,
  TabBarComponent = _MaterialTabBar.MaterialTabBar,
  renderHeader = (0, _helpers.makeRenderFunction)(HeaderComponent),
  renderTabBar = (0, _helpers.makeRenderFunction)(TabBarComponent),
  headerContainerStyle,
  cancelTranslation,
  containerStyle,
  lazy,
  cancelLazyFadeIn,
  pagerProps,
  onIndexChange,
  onTabChange
}, ref) => {
  const containerRef = (0, _hooks.useContainerRef)();
  const [tabProps, tabNamesArray] = (0, _hooks.useTabProps)(children, _Tab.Tab);
  const [refMap, setRef] = (0, _hooks.useAnimatedDynamicRefs)();
  const windowWidth = (0, _reactNative.useWindowDimensions)().width;

  const firstRender = _react.default.useRef(true);

  const containerHeight = (0, _reactNativeReanimated.useSharedValue)(undefined);
  const tabBarHeight = (0, _reactNativeReanimated.useSharedValue)(initialTabBarHeight);
  const headerHeight = (0, _reactNativeReanimated.useSharedValue)(!renderHeader ? 0 : initialHeaderHeight);
  const contentInset = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return _helpers.IS_IOS ? (headerHeight.value || 0) + (tabBarHeight.value || 0) : 0;
  });
  const isSwiping = (0, _reactNativeReanimated.useSharedValue)(false);
  const isSnapping = (0, _reactNativeReanimated.useSharedValue)(false);
  const snappingTo = (0, _reactNativeReanimated.useSharedValue)(0);
  const isGliding = (0, _reactNativeReanimated.useSharedValue)(false);
  const offset = (0, _reactNativeReanimated.useSharedValue)(0);
  const accScrollY = (0, _reactNativeReanimated.useSharedValue)(0);
  const oldAccScrollY = (0, _reactNativeReanimated.useSharedValue)(0);
  const accDiffClamp = (0, _reactNativeReanimated.useSharedValue)(0);
  const isScrolling = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollYCurrent = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollY = (0, _reactNativeReanimated.useSharedValue)(tabNamesArray.map(() => 0), false);
  const contentHeights = (0, _reactNativeReanimated.useSharedValue)(tabNamesArray.map(() => 0), false);
  const tabNames = (0, _reactNativeReanimated.useDerivedValue)(() => tabNamesArray, [tabNamesArray]);
  const index = (0, _reactNativeReanimated.useSharedValue)(initialTabName ? tabNames.value.findIndex(n => n === initialTabName) : 0);
  const scrollX = (0, _reactNativeReanimated.useSharedValue)(index.value * windowWidth, false);
  const pagerOpacity = (0, _reactNativeReanimated.useSharedValue)(initialHeaderHeight === undefined || index.value !== 0 ? 0 : 1, false);

  const [data, setData] = _react.default.useState(tabNamesArray);

  _react.default.useEffect(() => {
    setData(tabNamesArray);
  }, [tabNamesArray]);

  const focusedTab = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return tabNames.value[index.value];
  }, [tabNames]);
  const calculateNextOffset = (0, _reactNativeReanimated.useSharedValue)(index.value);
  const headerScrollDistance = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return headerHeight.value !== undefined ? headerHeight.value - minHeaderHeight : 0;
  }, [headerHeight, minHeaderHeight]);

  const getItemLayout = _react.default.useCallback((_, index) => ({
    length: windowWidth,
    offset: windowWidth * index,
    index
  }), [windowWidth]);

  const indexDecimal = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return scrollX.value / windowWidth;
  }, [windowWidth]); // handle window resize

  _react.default.useEffect(() => {
    if (!firstRender.current) {
      var _containerRef$current;

      (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.scrollToIndex({
        index: index.value,
        animated: false
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [windowWidth]);

  const afterRender = (0, _reactNativeReanimated.useSharedValue)(0);

  _react.default.useEffect(() => {
    if (!firstRender.current) pagerOpacity.value = 0;
    afterRender.value = (0, _reactNativeReanimated.withDelay)(_helpers.ONE_FRAME_MS * 5, (0, _reactNativeReanimated.withTiming)(1, {
      duration: 0
    }));
  }, [afterRender, pagerOpacity, tabNamesArray]);

  _react.default.useEffect(() => {
    if (firstRender.current) {
      if (initialTabName !== undefined && index.value !== 0) {
        var _containerRef$current2;

        (_containerRef$current2 = containerRef.current) === null || _containerRef$current2 === void 0 ? void 0 : _containerRef$current2.scrollToIndex({
          index: index.value,
          animated: false
        });
      }

      firstRender.current = false;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [containerRef, initialTabName, windowWidth]); // the purpose of this is to scroll to the proper position if dynamic tabs are changing


  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    return afterRender.value === 1;
  }, trigger => {
    if (trigger) {
      afterRender.value = 0;
      tabNamesArray.forEach(name => {
        'worklet';

        (0, _helpers.scrollToImpl)(refMap[name], 0, scrollY.value[index.value] - contentInset.value, false);
      });
      pagerOpacity.value = (0, _reactNativeReanimated.withTiming)(1);
    }
  }, [tabNamesArray, refMap, afterRender, contentInset]); // derived from scrollX
  // calculate the next offset and index if swiping
  // if scrollX changes from tab press,
  // the same logic must be done, but knowing
  // the next index in advance

  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    const nextIndex = isSwiping.value ? Math.round(indexDecimal.value) : null;
    return nextIndex;
  }, nextIndex => {
    if (nextIndex !== null && nextIndex !== index.value) {
      calculateNextOffset.value = nextIndex;
    }
  }, []);

  const propagateTabChange = _react.default.useCallback(change => {
    onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange(change);
    onIndexChange === null || onIndexChange === void 0 ? void 0 : onIndexChange(change.index);
  }, [onIndexChange, onTabChange]);

  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    return calculateNextOffset.value;
  }, i => {
    if (i !== index.value) {
      offset.value = scrollY.value[index.value] - scrollY.value[i] + offset.value;
      (0, _reactNativeReanimated.runOnJS)(propagateTabChange)({
        prevIndex: index.value,
        index: i,
        prevTabName: tabNames.value[index.value],
        tabName: tabNames.value[i]
      });
      index.value = i;
    }
  }, []);
  const scrollHandlerX = (0, _reactNativeReanimated.useAnimatedScrollHandler)({
    onScroll: event => {
      const {
        x
      } = event.contentOffset;
      scrollX.value = x;
    },
    onBeginDrag: () => {
      isSwiping.value = true;
    },
    onMomentumEnd: () => {
      isSwiping.value = false;
    }
  }, []);

  const renderItem = _react.default.useCallback(({
    index: i
  }) => {
    if (!tabNames.value[i]) return null;
    return /*#__PURE__*/_react.default.createElement(_Context.TabNameContext.Provider, {
      value: tabNames.value[i]
    }, lazy ? /*#__PURE__*/_react.default.createElement(_Lazy.Lazy, {
      startMounted: i === index.value,
      cancelLazyFadeIn: cancelLazyFadeIn
    }, _react.default.Children.toArray(children)[i]) : _react.default.Children.toArray(children)[i]);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [children, lazy, tabNames.value, cancelLazyFadeIn]);

  const headerTranslateY = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return revealHeaderOnScroll ? -accDiffClamp.value : -Math.min(scrollYCurrent.value, headerScrollDistance.value);
  }, [revealHeaderOnScroll]);
  const stylez = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [{
        translateY: headerTranslateY.value
      }]
    };
  }, [revealHeaderOnScroll]);

  const getHeaderHeight = _react.default.useCallback(event => {
    const height = event.nativeEvent.layout.height;

    if (headerHeight.value !== height) {
      headerHeight.value = height;
    }
  }, [headerHeight]);

  const getTabBarHeight = _react.default.useCallback(event => {
    const height = event.nativeEvent.layout.height;
    if (tabBarHeight.value !== height) tabBarHeight.value = height;
  }, [tabBarHeight]);

  const onLayout = _react.default.useCallback(event => {
    const height = event.nativeEvent.layout.height;
    if (containerHeight.value !== height) containerHeight.value = height;
  }, [containerHeight]); // fade in the pager if the headerHeight is not defined


  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    return (initialHeaderHeight === undefined || initialTabName !== undefined) && headerHeight !== undefined && pagerOpacity.value === 0;
  }, update => {
    if (update) {
      pagerOpacity.value = (0, _reactNativeReanimated.withTiming)(1);
    }
  }, [headerHeight]);
  const pagerStylez = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      opacity: pagerOpacity.value
    };
  }, []);

  const onTabPress = _react.default.useCallback(name => {
    // simplify logic by preventing index change
    // when is scrolling or gliding.
    if (!isScrolling.value && !isGliding.value) {
      const i = tabNames.value.findIndex(n => n === name);
      calculateNextOffset.value = i;

      if (name === focusedTab.value) {
        const ref = refMap[name];
        (0, _reactNativeReanimated.runOnUI)(_helpers.scrollToImpl)(ref, 0, headerScrollDistance.value - contentInset.value, true);
      } else {
        var _containerRef$current3;

        (_containerRef$current3 = containerRef.current) === null || _containerRef$current3 === void 0 ? void 0 : _containerRef$current3.scrollToIndex({
          animated: true,
          index: i
        });
      }
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [containerRef, refMap, contentInset]);

  _react.default.useEffect(() => {
    if (index.value >= tabNamesArray.length) {
      onTabPress(tabNamesArray[tabNamesArray.length - 1]);
    }
  }, [index.value, onTabPress, tabNamesArray]);

  const keyExtractor = _react.default.useCallback(name => name, []);

  _react.default.useImperativeHandle(ref, () => ({
    setIndex: index => {
      if (isScrolling.value || isGliding.value) return false;
      const name = tabNames.value[index];
      onTabPress(name);
      return true;
    },
    jumpToTab: name => {
      if (isScrolling.value || isGliding.value) return false;
      onTabPress(name);
      return true;
    },
    getFocusedTab: () => {
      return tabNames.value[index.value];
    },
    getCurrentIndex: () => {
      return index.value;
    }
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [onTabPress]);

  return /*#__PURE__*/_react.default.createElement(_Context.Context.Provider, {
    value: {
      contentInset,
      tabBarHeight,
      headerHeight,
      refMap,
      tabNames,
      index,
      snapThreshold,
      revealHeaderOnScroll,
      focusedTab,
      accDiffClamp,
      indexDecimal,
      containerHeight,
      scrollYCurrent,
      scrollY,
      setRef,
      headerScrollDistance,
      accScrollY,
      oldAccScrollY,
      offset,
      isScrolling,
      scrollX,
      isGliding,
      isSnapping,
      snappingTo,
      contentHeights,
      headerTranslateY
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, containerStyle],
    onLayout: onLayout,
    pointerEvents: "box-none"
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.topContainer, headerContainerStyle, !cancelTranslation && stylez]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, styles.headerContainer],
    onLayout: getHeaderHeight,
    pointerEvents: "box-none"
  }, renderHeader && renderHeader({
    containerRef,
    index,
    tabNames: tabNamesArray,
    focusedTab,
    indexDecimal,
    onTabPress,
    tabProps
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, styles.tabBarContainer],
    onLayout: getTabBarHeight,
    pointerEvents: "box-none"
  }, renderTabBar && renderTabBar({
    containerRef,
    index,
    tabNames: tabNamesArray,
    focusedTab,
    indexDecimal,
    onTabPress,
    tabProps
  }))), headerHeight !== undefined && /*#__PURE__*/_react.default.createElement(_helpers.AnimatedFlatList // @ts-expect-error problem with reanimated types, they're missing `ref`
  , _extends({
    ref: containerRef,
    initialScrollIndex: index.value,
    data: data,
    keyExtractor: keyExtractor,
    renderItem: renderItem,
    horizontal: true,
    pagingEnabled: true,
    onScroll: scrollHandlerX,
    showsHorizontalScrollIndicator: false,
    getItemLayout: getItemLayout,
    scrollEventThrottle: 16,
    bounces: false
  }, pagerProps, {
    style: [pagerStylez, pagerProps === null || pagerProps === void 0 ? void 0 : pagerProps.style]
  }))));
}));

exports.Container = Container;

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  topContainer: {
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  tabBarContainer: {
    zIndex: 1
  },
  headerContainer: {
    zIndex: 2
  }
});
//# sourceMappingURL=Container.js.map