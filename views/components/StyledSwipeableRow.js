import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class StyledSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={ styles.leftAction } >
        <AnimatedIcon
          name="archive"
          size={ 30 }
          color="#fff"
          style={[styles.actionIcon, { transform: [{ scale }] }]}
        />
      </RectButton>
    );
  };

  renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={ styles.rightAction } >
        <AnimatedIcon
          name="delete-forever"
          size={ 30 }
          color="#fff"
          style={[styles.actionIcon, { transform: [{ scale }] }]}
        />
      </RectButton>
    );
  };

  updateRef = ref => {
    this._swipeableRow = ref;
  };

  complete = () => {
    this._swipeableRow.close();

    const { id } = this._swipeableRow.props.children.props.item;
    this.props.completeTask(id);
  };

  remove = () => {
    this._swipeableRow.close();

    const { id } = this._swipeableRow.props.children.props.item;
    this.props.deleteTask(id);
  }

  render() {
    const { children } = this.props;
    return (
      <Swipeable
          ref={ this.updateRef }
          friction={ 2 }
          leftThreshold={ 80 }
          rightThreshold={ 80 }
          renderLeftActions={ this.renderLeftActions }
          renderRightActions={ this.renderRightActions }
          onSwipeableLeftOpen= { this.complete }
          onSwipeableRightOpen= { this.remove } >
        { children }
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    width: 30,
    backgroundColor: '#388e3c',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
  rightAction: {
    alignItems: 'flex-end',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'center',
  },
});
