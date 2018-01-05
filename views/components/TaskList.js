import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import { FlatList, RectButton } from 'react-native-gesture-handler';

import StyledSwipeableRow from './StyledSwipeableRow';

const Row = ({ item, toggleEditingTask, viewingCompletedTask }) => {
  return (
    <RectButton
      style={ styles.rectButton }
      onPress={ !viewingCompletedTask ? toggleEditingTask.bind(this, item) : null} >
        <Text
          numberOfLines={ 2 }
          style={ viewingCompletedTask ? styles.messageTextComplete : styles.messageText }
        >
          { item.task }
        </Text>
    </RectButton>
  );
};

const SwipeableRow = ({
  item,
  index,
  toggleEditingTask,
  completeTask,
  viewingCompletedTask,
  unCompleteTask,
  deleteTask
}) => (
    <StyledSwipeableRow
      completeTask={ completeTask }
      deleteTask={ deleteTask }
      viewingCompletedTask={ viewingCompletedTask }
      unCompleteTask={ unCompleteTask }
    >
      <Row
        item={ item }
        toggleEditingTask={ toggleEditingTask }
        viewingCompletedTask= { viewingCompletedTask }
      />
    </StyledSwipeableRow>
  );

export default class TaskList extends Component {
  render() {
    const {
      tasks,
      tasksEmpty,
      completedTasksEmpty,
      toggleAddingTask,
      toggleEditingTask,
      toggleCompletedTaskView,
      viewingCompletedTask,
      completeTask,
      unCompleteTask,
      deleteTask,
    } = this.props;

    // console.log('empty prop::', tasksEmpty, completedTasksEmpty);
    // would need a way to add text for new day tasks
    // as well as when tasks for a given day are done
    if (tasksEmpty)
      return (
        <View style={ styles.emptyContainer }>
          <Text style={ styles.emptyText }> No current tasks. </Text>
        </View>
      );
    if (completedTasksEmpty)
      return (
        <View style={ styles.emptyContainer }>
          <Text style={ styles.emptyText }> No completed tasks. </Text>
        </View>
      );

    return (
        <ScrollView>
          <FlatList
            data={ tasks }
            ItemSeparatorComponent={() => <View style={ styles.separator } />}
            renderItem={({ item, index }) => (
              <SwipeableRow
                item={ item }
                index={ index }
                toggleEditingTask={ toggleEditingTask }
                viewingCompletedTask={ viewingCompletedTask }
                completeTask={ completeTask }
                unCompleteTask={ unCompleteTask }
                deleteTask={ deleteTask }
              />
            )}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>
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
  messageTextComplete: {
    fontSize: 20,
    backgroundColor: 'transparent',
    textDecorationLine: 'line-through',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 20,
  }
});
