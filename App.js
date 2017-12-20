import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppState,
  AsyncStorage,
  Dimensions,
} from 'react-native';

import moment from 'moment';
import { Button } from 'react-native-elements';
import { TaskList, AddOrEditTask } from './views/components';

export default class ToDoModel extends Component {
  state = {
    tasks: [],
    completedTasks: [],
    taskBeingEdited: null,
    addingOrEditingTask: false,
    editingTask: false,
    viewingCompletedTask: false,
    counterForTaskID: 1,
    // make below into a function::
    refreshDate: moment().add(1, 'days').format('DD'),
  }

  componentWillMount() {
    this.shouldListRefresh();
  }

  componentDidMount() {
    // console.log(this.state);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

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

  shouldListRefresh = () => {
    const refreshTimeThreshold = 5; // in military time, so 5 AM

    const shouldTasksRefresh = this.checkTasksRefresh(refreshTimeThreshold);
    if (shouldTasksRefresh) {
      this.refreshList();
    }
    return shouldTasksRefresh;
  }

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

  refreshList = () => {
    this.setState({
      tasks: [],
      refreshDate: moment().add(1, 'days').format('DD')
    });
  }

  persistState = () => {
    const stateJSON = JSON.stringify(this.state);

    AsyncStorage.setItem('@focus_monkey', stateJSON)
      .catch(error => {
        console.log('Async set error:', error);
      })
  }

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
          toggleEditingTask={ this.toggleEditingTask }
          tasks={ tasks }
          completeTask={ this.completeTask }
          deleteTask={ this.deleteTask }
        />
      );
    }
    else if (viewingCompletedTask) {
      return (
        <TaskList
          toggleEditingTask={ this.toggleEditingTask }
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
        <View style={ styles.content }>
          { displayComponent }
        </View>
        <View style={ styles.footer }>
          <Button
            large
            title="Add"
            onPress={ this.toggleAddingTask }
            onLongPress= { this.toggleCompletedTaskView }
          />
        </View>
      </View>
    );
  }
}

const setHeaderHeight = () => {
  return Dimensions.get('window').height * .07;
}

const setFooterHeight = () => {
  return Dimensions.get('window').height * .1;
}

const setContentHeight = () => {
  return Dimensions.get('window').height * .75;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    marginTop: 50,
    height: setHeaderHeight(),
    textAlign: 'center',
  },
  footer: {
    height: setFooterHeight(),
    bottom: 0
  },
  content: {
    height: setContentHeight()
  }
});
