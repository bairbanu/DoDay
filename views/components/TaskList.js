import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Button,
  Text,
  PanResponder } from 'react-native';

/*
  first touch evt::: Array [
    "dispatchConfig",
    "_targetInst",
    "isDefaultPrevented",
    "isPropagationStopped",
    "_dispatchListeners",
    "_dispatchInstances",
    "nativeEvent",
    "type",
    "target",
    "currentTarget",
    "eventPhase",
    "bubbles",
    "cancelable",
    "timeStamp",
    "defaultPrevented",
    "isTrusted",
    "touchHistory",
  ]
*/

export default class TaskList extends Component {
  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        // console.log('evt.dispatchConfig::::', evt.dispatchConfig);
        // console.log('evt.targetInst::::', evt._targetInst);
        // console.log('evt.nativeEvent::::', evt.nativeEvent);
        // console.log('evt.type::::', evt.type);
        // console.log('evt.target::::', evt.target);
        // console.log('evt.currentTarget::::', evt.currentTarget);
        // console.log('evt.eventPhase::::', evt.eventPhase);
        // console.log('evt.dispatchInstances::::', evt._dispatchInstances);
      },

      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        // console.log('evt:::', evt);
        // console.log('on move:::', gestureState);
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // console.log('release touch:::', gestureState);
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  editTask = (task) => {
    const { toggleEditingTask } = this.props;

    toggleEditingTask(task);
  }

  renderTask = ({ item }) => {
    return (
      <View { ...this._panResponder.panHandlers } >
          <Text
            style={ styles.task }
            onPress={ this.editTask.bind(this, item) }
            id={ item.id } >
            { item.task }
          </Text>
      </View>
    );
  }

  _keyExtractor = ({ id }) => id;

  render = () => {
    const { toggleAddingTask, tasks } = this.props;

    return (
      <ScrollView>
        <View>
          <FlatList
            style={ styles.flatList }
            data={ tasks }
            renderItem={ this.renderTask }
            keyExtractor= { this._keyExtractor }/>
        </View>
        <Button style={ styles.button } title="Add Task" onPress={ toggleAddingTask } />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    marginTop: 50,
  },
  task: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center'
  },
  button: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 30
  }
});
