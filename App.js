import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import moment from 'moment';
import { TaskList, AddOrEditTask } from './views/components';

export default class App extends Component {
  state = {
    tasks: [
      {
        id: 0,
        task: 'Initial test task',
        priority: undefined,
        completed: false
      },
    ],
    taskBeingEdited: null,
    addingOrEditingTask: false,
    editingTask: false,
    counterForTaskID: 1
  }

  toggleAddingTask = () => {
    this.setState(prevState => ({ addingOrEditingTask: !prevState.addingOrEditingTask }));
  }

  toggleEditingTask = (task) => {
    this.setState({
      taskBeingEdited: task,
      addingOrEditingTask: true,
      editingTask: true
    })
  }

  addTask = (task) => {
    this.setState(prevState => {
      const newTask = {
        id: prevState.counterForTaskID,
        task: task.text,
        priority: task.priority,
        completed: false
      }
      const newCounterID = prevState.counterForTaskID + 1;

      return {
        tasks: [...prevState.tasks, newTask],
        addingOrEditingTask: false,
        editingTask: false,
        counterForTaskID: newCounterID
       }
    })
  }

  editTask = (item) => {
    const newTasks = this.state.tasks.map(task => {
      if (task.id === item.id) {
        return {
          task: item.task,
          id: item.id,
          priority: item.priority,
          completed: false
        }
      }
      return task;
    })
    this.setState({
      tasks: newTasks,
      taskBeingEdited: null,
      addingOrEditingTask: false,
      editingTask: false
    })
  }

  pickComponent = () => {
    const { addingOrEditingTask, editingTask, tasks, taskBeingEdited } = this.state;

    if (!addingOrEditingTask) {
      return (
        <TaskList
          toggleAddingTask={ this.toggleAddingTask }
          toggleEditingTask={ this.toggleEditingTask }
          tasks={ tasks } />
      );
    }
    else if (editingTask) {
      return (
        <AddOrEditTask
          editTask={ this.editTask }
          editing={ editingTask }
          taskBeingEdited={ taskBeingEdited }
        />
      );
    }
    else if (!editingTask) {
      return (
        <AddOrEditTask
          addTask={ this.addTask }
        />
      );
    }
  }

  render() {
    const displayComponent = this.pickComponent()

    return (
      <View>
        {/* Make this a date shower stateless component, and add a thin separator */}
        <Text style={ styles.header }> { moment().format('MMMM Do, YYYY') } </Text>
        <View>
          { displayComponent }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    marginTop: 50,
  },
  task: {
    marginTop: 20,
    marginBottom: 10
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50
  }
});
