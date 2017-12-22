import React, { Component } from 'react';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  AppState,
  AsyncStorage,
} from 'react-native';

import {
  TaskList,
  AddOrEditTask,
  Header,
  Footer,
} from './views';

import { setHeight } from './model/utils';

export default class ToDoModel extends Component {
  state = {
    tasks: [],
    completedTasks: [],
    taskBeingEdited: null,
    addingOrEditingTask: true,
    editingTask: false,
    viewingCompletedTask: false,
    counterForTaskID: 1,
    refreshDate: null,
  }

  /* ---------- HOOK ---------- */
  componentWillMount() {
    this.handleFirstTimeUser();
    this.shouldListRefresh();
  }

  /* ---------- HOOK ---------- */
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  /* ---------- HOOK ---------- */
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  /* ---------- HANDLER ---------- */
  handleAppStateChange = (nextAppState) => {
    console.log('nextAppState::', nextAppState);
    if (nextAppState === 'active') {
      const refresh = this.shouldListRefresh();
      if (!refresh)
        this.getState();
    }

    else if (nextAppState === 'inactive')
      this.persistState();
  }

  /* ---------- HANDLER ---------- */
  handleFirstTimeUser = () => {
    if (this.state.refreshDate === null)
      this.setState({
        refreshDate: moment().add(1, 'days').format('DD')
      });
  }

  /* ---------- UTIL ---------- */
  shouldListRefresh = () => {
    const refreshTimeThreshold = 5; // in military time, so 5 AM

    const shouldTasksRefresh = this.checkTasksRefresh(refreshTimeThreshold);
    if (shouldTasksRefresh) {
      this.refreshTaskList();
    }
    return shouldTasksRefresh;
  }

  /* ---------- UTIL, needs refreshDate from state ---------- */
  checkTasksRefresh = (timeThreshold) => {
    // currently not consider thresholds to be as granular as minutes
    const currentTime = Number(moment().format('HH'));
    const currentDate = Number(moment().format('DD'));
    const { refreshDate } = this.state;

    // need to handle the monthly edge case. What happens
    // when months change. Then, what happens when year changes.
    if (currentDate < Number(refreshDate))
      return false;
    else if (currentDate >= Number(refreshDate)) {
      if (currentTime < timeThreshold)
        return false;
      else if (currentTime > timeThreshold)
        return true;
    }
  }

  /* ---------- UTIL, needs the state ---------- */
  persistState = () => {
    const stateJSON = JSON.stringify(this.state);

    AsyncStorage.setItem('@focus_monkey', stateJSON)
      .catch(error => {
        console.log('Async set error:', error);
      })
  }

  /* ---------- UTIL, can abstract away AsyncStorage logic ---------- */
  getState = () => {
    AsyncStorage.getItem('@focus_monkey')
      .then(stateJSON => {
        const stateObject = JSON.parse(stateJSON);
        this.setState(stateObject);
      })
      .catch(error => {
        console.log('Async get error:', error);
      })
  }

  /* ---------- TOGGLING ---------- */
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

  /* ---------- MANIPULATING TASKS ---------- */
  addTask = (item) => {
    if (item.text === '') {
      this.setState({
        addingOrEditingTask: false,
        editingTask: false,
      });
      return;
    }

    this.setState(prevState => {
      const newTask = {
        id: prevState.counterForTaskID,
        task: item.text,
        priority: item.priority,
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
        completedTasks: [...prevState.completedTasks, ...finishedTask],
      }
    });
  }

  unCompleteTask = (taskID) => {
    const unFinishedTask = this.state.completedTasks.filter(task => taskID === task.id);
    const newCompletedTasks = this.state.completedTasks.filter(task => taskID !== task.id);

    this.setState(prevState => {
      return {
        tasks: [...prevState.tasks, ...unFinishedTask],
        completedTasks: [...newCompletedTasks],
      }
    })
  }

  deleteTask = (taskID) => {
    const newTasks = this.state.tasks.filter(task => taskID !== task.id);
    this.setState({
      tasks: [...newTasks]
    });
  }

  refreshTaskList = () => {
    this.setState({
      tasks: [],
      refreshDate: moment().add(1, 'days').format('DD')
    });
  }

  /* ---------- RENDER LOGIC ---------- */
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

    let tasksEmpty = false;
    let completedTasksEmpty = false;
    if (tasks.length === 0) tasksEmpty = true;
    if (completedTasks.length === 0) completedTasksEmpty = true;

    if (!addingOrEditingTask && !viewingCompletedTask) {
      return (
        <View>
          <View>
            <Header headerStyle={ styles.header } />
          </View>
          <View style={ styles.taskListContainer }>
            <TaskList
              toggleEditingTask={ this.toggleEditingTask }
              tasks={ tasks }
              tasksEmpty = { tasksEmpty }
              completeTask={ this.completeTask }
              deleteTask={ this.deleteTask }
            />
          </View>
          <View>
            <Footer
              footerStyle={ styles.footer }
              toggleAddingTask={ this.toggleAddingTask }
              toggleCompletedTaskView={ this.toggleCompletedTaskView }
              viewingCompletedTask={ viewingCompletedTask }
            />
          </View>
        </View>
      );
    }
    else if (viewingCompletedTask) {
      return (
        <View>
          <View>
            <Header headerStyle={ styles.header } />
          </View>
          <View style={ styles.taskListContainer }>
            <TaskList
              toggleEditingTask={ this.toggleEditingTask }
              tasks={ completedTasks }
              completedTasksEmpty={ completedTasksEmpty }
              viewingCompletedTask={ viewingCompletedTask }
              unCompleteTask={ this.unCompleteTask }
              deleteTask={ this.deleteTask }
            />
          </View>
          <View>
            <Footer
              footerStyle={ styles.footer }
              toggleAddingTask={ this.toggleAddingTask }
              toggleCompletedTaskView={ this.toggleCompletedTaskView }
              viewingCompletedTask={ viewingCompletedTask }
            />
          </View>
        </View>
      );
    }
    else if (editingTask) {
      return (
        <View>
          <View style={ styles.addOrEditTaskContainer }>
            <AddOrEditTask
              editTask={ this.editTask }
              editing={ editingTask }
              taskBeingEdited={ taskBeingEdited }
            />
          </View>
          <View>
            <Footer
              footerStyle={ styles.footer }
              toggleAddingTask={ this.toggleAddingTask }
              toggleCompletedTaskView={ this.toggleCompletedTaskView }
              viewingCompletedTask={ viewingCompletedTask }
            />
          </View>
        </View>
      );
    }
    else if (!editingTask) {
      return (
        <View>
          <View style={ styles.addOrEditTaskContainer }>
            <AddOrEditTask
              addTask={ this.addTask }
            />
          </View>
          <View>
            <Footer
              footerStyle={ styles.footer }
              toggleAddingTask={ this.toggleAddingTask }
              toggleCompletedTaskView={ this.toggleCompletedTaskView }
              viewingCompletedTask={ viewingCompletedTask }
            />
          </View>
        </View>
      );
    }
  }

  render() {
    const displayComponent = this.pickComponent()

    return (
      <View>
        { displayComponent }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    marginTop: 50,
    height: setHeight(7),
    textAlign: 'center',
  },
  footer: {
    height: setHeight(18),
    bottom: 0,
  },
  taskListContainer: {
    height: setHeight(75),
  },
  addOrEditTaskContainer: {
    height: setHeight(88.80),
  }
});
