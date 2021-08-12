function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { AnimatedFlatList, IS_IOS } from './helpers';
import { useAfterMountEffect, useChainCallback, useCollapsibleStyle, useScrollHandlerY, useSharedAnimatedRef, useTabNameContext, useTabsContext, useUpdateScrollViewContentSize } from './hooks';
/**
 * Used as a memo to prevent rerendering too often when the context changes.
 * See: https://github.com/facebook/react/issues/15156#issuecomment-474590693
 */

const FlatListMemo = /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef((props, passRef) => {
  return /*#__PURE__*/React.createElement(AnimatedFlatList // @ts-expect-error reanimated types are broken on ref
  , _extends({
    ref: passRef
  }, props));
}));

function FlatListImpl({
  contentContainerStyle,
  style,
  onContentSizeChange,
  refreshControl,
  ...rest
}, passRef) {
  const name = useTabNameContext();
  const {
    setRef,
    contentInset,
    scrollYCurrent
  } = useTabsContext();
  const ref = useSharedAnimatedRef(passRef);
  const {
    scrollHandler,
    enable
  } = useScrollHandlerY(name);
  useAfterMountEffect(() => {
    // we enable the scroll event after mounting
    // otherwise we get an `onScroll` call with the initial scroll position which can break things
    enable(true);
  });
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    progressViewOffset
  } = useCollapsibleStyle();
  React.useEffect(() => {
    setRef(name, ref);
  }, [name, ref, setRef]);
  const scrollContentSizeChange = useUpdateScrollViewContentSize({
    name
  });
  const scrollContentSizeChangeHandlers = useChainCallback(React.useMemo(() => [scrollContentSizeChange, onContentSizeChange], [onContentSizeChange, scrollContentSizeChange]));
  const memoRefreshControl = React.useMemo(() => refreshControl && /*#__PURE__*/React.cloneElement(refreshControl, {
    progressViewOffset,
    ...refreshControl.props
  }), [progressViewOffset, refreshControl]);
  const memoContentOffset = React.useMemo(() => ({
    y: IS_IOS ? -contentInset.value + scrollYCurrent.value : 0,
    x: 0
  }), [contentInset.value, scrollYCurrent.value]);
  const memoContentInset = React.useMemo(() => ({
    top: contentInset.value
  }), [contentInset.value]);
  const memoContentContainerStyle = React.useMemo(() => [_contentContainerStyle, // TODO: investigate types
  contentContainerStyle], [_contentContainerStyle, contentContainerStyle]);
  const memoStyle = React.useMemo(() => [_style, style], [_style, style]);

  const onScroll = event => {
    rest.onScroll && rest.onScroll(event);
    scrollHandler(event);
  };

  return (
    /*#__PURE__*/
    // @ts-expect-error typescript complains about `unknown` in the memo, it should be T
    React.createElement(FlatListMemo, _extends({}, rest, {
      ref: ref,
      bouncesZoom: false,
      style: memoStyle,
      contentContainerStyle: memoContentContainerStyle,
      progressViewOffset: progressViewOffset,
      onScroll: onScroll,
      onContentSizeChange: scrollContentSizeChangeHandlers,
      scrollEventThrottle: 16,
      contentInset: memoContentInset,
      contentOffset: memoContentOffset,
      automaticallyAdjustContentInsets: false,
      refreshControl: memoRefreshControl
    }))
  );
}
/**
 * Use like a regular FlatList.
 */


export const FlatList = /*#__PURE__*/React.forwardRef(FlatListImpl);
//# sourceMappingURL=FlatList.js.map