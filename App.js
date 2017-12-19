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
    counterForTaskID: 1,
    refreshDate: null,
  }

  // do the to do list disappearing stuff in this hook
  componentWillMount() {
    this.handleFirstTimeUser();
    this.shouldListRefresh();
  }

  componentDidMount() {
    console.log(this.state);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    // console.log('nextAppState:::', nextAppState);
    // when app is going to the background:
    // write to persistent data
    // when app is coming to foreground:
    // read from persistent data and update state
  }

  handleFirstTimeUser = () => {
    const { refreshDate } = this.state;

    if (refreshDate === null)
      this.setState({
        refreshDate: moment().add(1, 'days').format('DD')
      });
  }

  shouldListRefresh = () => {
    const refreshTimeThreshold = 5; // in military time, so 5 AM

    const shouldTasksRefresh = this.checkTasksRefresh(refreshTimeThreshold);
    if (shouldTasksRefresh) {
      this.refreshList();
    }
  }

  checkTasksRefresh = (timeThreshold) => {
    // currently not consider thresholds to be as granular as minutes
    const currentTime = Number(moment().format('HH'));
    const currentDate = Number(moment().format('DD'));
    const { refreshDate } = this.state;

    if (currentDate < Number(refreshDate))
      return false;
    else if (currentDate === Number(refreshDate)) {
      if (currentTime < timeThreshold)
        return false;
      else if (currentTime > timeThreshold)
        return true;
    }
  }


  refreshList = () => {
    this.setState({
      tasks: [],
      refreshDate: moment().add(1, 'days').format('DD')
    });
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
