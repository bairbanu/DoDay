import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppState,
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
      },
    ],
    completedTasks: [],
    taskBeingEdited: null,
    addingOrEditingTask: false,
    editingTask: false,
    viewingCompletedTask: false,
    counterForTaskID: 1
  }

  // do the to do list disappearing stuff in this hook
  componentWillMount() {
    const timeGreaterThanThreshold = isTimeGreaterThan('4 PM');
    // will get back a true or false
    // if true, empty out tasks
    // if false, do nothing
    this.setState({
      tasks: [],
    })
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    console.log('nextAppState:::', nextAppState);
    // when app is going to the background:
    // write to persistent data
    // when app is coming to foreground:
    // read from persistent data and update state
  }

  toggleAddingTask = () => {
    this.setState(prevState => {
        return {
          addingOrEditingTask: !prevState.addingOrEditingTask
        }
      });
  }

  toggleEditingTask = (task) => {
    this.setState({
      taskBeingEdited: task,
      addingOrEditingTask: true,
      editingTask: true
    })
  }

  toggleCompletedTaskView = () => {
    this.setState(prevState => {
      return {
        viewingCompletedTask: !prevState.viewingCompletedTask
      }
    });
  }

  addTask = (task) => {
    this.setState(prevState => {
      const newTask = {
        id: prevState.counterForTaskID,
        task: task.text,
        priority: task.priority,
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

  completeTask = (taskID) => {
    const finishedTask = this.state.tasks.filter(task => taskID === task.id);
    const newTasks = this.state.tasks.filter(task => taskID !== task.id);

    this.setState(prevState => {
      return {
        tasks: [...newTasks],
        completedTasks: [...prevState.completedTasks, ...finishedTask]
      }
    });
    console.log('state:::', this.state);
  }

  deleteTask = (taskID) => {
    const newTasks = this.state.tasks.filter(task => taskID !== task.id);
    this.setState({
      tasks: [...newTasks]
    });
  }

  pickComponent = () => {
    const {
      addingOrEditingTask,
      editingTask,
      tasks,
      taskBeingEdited,
      viewingCompletedTask,
      toggleCompletedTaskView,
      completedTasks,
    } = this.state;

    if (!addingOrEditingTask && !viewingCompletedTask) {
      return (
        <TaskList
          toggleAddingTask={ this.toggleAddingTask }
          toggleEditingTask={ this.toggleEditingTask }
          toggleCompletedTaskView={ this.toggleCompletedTaskView }
          tasks={ tasks }
          completeTask={ this.completeTask }
          deleteTask={ this.deleteTask }
        />
      );
    }
    else if (viewingCompletedTask) {
      return (
        <TaskList
          toggleAddingTask={ this.toggleAddingTask }
          toggleEditingTask={ this.toggleEditingTask }
          toggleCompletedTaskView={ this.toggleCompletedTaskView }
          tasks={ completedTasks }
          completeTask={ this.completeTask }
          deleteTask={ this.deleteTask }
        />
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

// make a utility function in another file
const isTimeGreaterThan = (threshold) => {
  const currentTime = moment().format('LT');
  // will need to check both time and date
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
