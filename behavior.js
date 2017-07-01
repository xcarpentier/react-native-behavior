import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity
} from 'react-native';

export default class extends Component {
  nativeValue = new Animated.Value(0);
  value = new Animated.Value(0);

  animateTo = (toValue, configs = {}) => {
    const { mode, callback, ...options } = {
      ...this.props.configs,
      ...configs
    };

    const animate = mode === 'timing' ? Animated.timing : Animated.spring;

    Animated.parallel([
      animate(this.nativeValue, {
        ...options,
        toValue,
        useNativeDriver: true
      }),
      animate(this.value, { ...options, toValue })
    ]).start(animation => {
      if (animation.finished && callback) callback();
    });
  };

  render() {
    const { nativeValue, value } = this;
    const {
      initialState,
      states,
      style,
      enableGestures,
      onGesture
    } = this.props;

    const inputRange = [...Array(states.length).keys()];

    const defaultState = {
      backgroundColor: 'transparent',
      height: 0,
      opacity: 1,
      rotate: '0deg',
      scale: 1,
      translateX: 0,
      translateY: 0,
      width: 0
    };

    const getRange = prop => {
      const range = [];

      for (let i = 0; i < states.length; i += 1) {
        let prevState;

        for (let j = i - 1; j >= 0; j -= 1) {
          prevState = states[j] && states[j][prop];
          if (prevState) break;
        }

        range[i] =
          states[i][prop] ||
          (prevState || ((style && style[prop]) || defaultState[prop]));
      }

      return range;
    };

    const backgroundColor = value.interpolate({
      inputRange,
      outputRange: getRange('backgroundColor')
    });

    const height = value.interpolate({
      inputRange,
      outputRange: getRange('height')
    });

    const opacity = nativeValue.interpolate({
      inputRange,
      outputRange: getRange('opacity')
    });

    const rotate = nativeValue.interpolate({
      inputRange,
      outputRange: getRange('rotate')
    });

    const scale = nativeValue.interpolate({
      inputRange,
      outputRange: getRange('scale')
    });

    const translateX = nativeValue.interpolate({
      inputRange,
      outputRange: getRange('translateX')
    });

    const translateY = nativeValue.interpolate({
      inputRange,
      outputRange: getRange('translateY')
    });

    const width = value.interpolate({
      inputRange,
      outputRange: getRange('width')
    });

    const nativeStyles = {
      opacity,
      overflow: 'hidden',
      transform: [{ rotate }, { scale }, { translateX }, { translateY }]
    };

    const styles = { backgroundColor, height, width };

    if (initialState) {
      nativeValue.setValue(initialState);
      value.setValue(initialState);
    }

    if (enableGestures) {
      this.pan = PanResponder.create({
        onMoveShouldSetPanResponder: (event, gesture) => {
          const dx = gesture.dx / Dimensions.get('window').width;
          const dy = gesture.dy / Dimensions.get('window').height;
          const isVertical = () => Math.abs(dy) > Math.abs(dx);
          const isHorizontal = () => !isVertical();
          onGesture({
            swipedLeft: isHorizontal() && dx < 0,
            swipedRight: isHorizontal() && dx > 0,
            swipedUp: isVertical() && dy < 0,
            swipedDown: isVertical() && dy > 0
          });
          return true;
        }
      });
    }

    const NativeBehavior = props =>
      <Animated.View style={[style, nativeStyles]} {...props} />;

    const Behavior = props => <Animated.View style={styles} {...props} />;

    const Touchable = props =>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={() => onGesture({ longPressed: true })}
        onPress={() => onGesture({ pressed: true })}
        {...props}
      />;

    if (enableGestures)
      return (
        <NativeBehavior {...this.pan.panHandlers}>
          <Touchable>
            <Behavior />
          </Touchable>
        </NativeBehavior>
      );

    return (
      <NativeBehavior>
        <Behavior />
      </NativeBehavior>
    );
  }
}
