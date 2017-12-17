import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { FlatList, RectButton } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';

import StyledSwipeableRow from './StyledSwipeableRow';

const Row = ({ item, toggleEditingTask }) => {
  return (
    <RectButton
      style={ styles.rectButton }
      onPress={ toggleEditingTask.bind(this, item) } >
        <Text numberOfLines={2} style={styles.messageText}>
          {item.task}
        </Text>
    </RectButton>
  );
};

const SwipeableRow = ({ item, index, toggleEditingTask, completeTask, deleteTask }) => (
    <StyledSwipeableRow completeTask={ completeTask } deleteTask={ deleteTask } >
      <Row item={item} toggleEditingTask={ toggleEditingTask } />
    </StyledSwipeableRow>
  );

export default class TaskList extends Component {
  render() {
    const {
      tasks,
      toggleAddingTask,
      toggleEditingTask,
      completeTask,
      deleteTask,
    } = this.props;

    return (
      <View>
        <FlatList
          data={ tasks }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item, index }) => (
            <SwipeableRow
              item={ item }
              index={ index }
              toggleEditingTask={ toggleEditingTask }
              completeTask={ completeTask }
              deleteTask={ deleteTask }
            />
          )}
          keyExtractor={(item, index) => index}
        />
        <Button
          large
          title="Add"
          onPress={ toggleAddingTask }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rectButton: {
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  messageText: {
    fontSize: 20,
    backgroundColor: 'transparent',
  },
});
