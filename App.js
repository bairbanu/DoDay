import React, { Component } from 'react';
import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  AppState,
  AsyncStorage,
  Dimensions,
} from 'react-native';

import {
  TaskList,
  AddOrEditTask,
  Header,
  Footer,
} from './views';

import { setHeight, prioritizeTasks, checkTasksRefresh } from './model/utils';
import { persistState } from './model/database';

export default class StateStore extends Component {
  state = {
    tasks: [],
    completedTasks: [],
    taskBeingEdited: null,
    addingOrEditingTask: false,
    editingTask: false,
    viewingCompletedTask: false,
    counterForTaskID: 1,
    refreshDate: null,
    justRefreshed: false,
  }

  componentWillMount() {
    this.handleFirstTimeUser();
    this.refreshTasksOrGetState();
  }

  componentDidMount() {
    // console.log('this:::', this);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.refreshTasksOrGetState()
    }

    else if (nextAppState === 'inactive')
    // consider persisting state each time the user adds, edits, completes, or deletes a task
      persistState(this.state);
  }

  handleFirstTimeUser = () => {
    if (this.state.refreshDate === null)
      this.setState({
        refreshDate: moment().add(1, 'days').format('DD'),
        justRefreshed: true,
      });
  }

  refreshTasksOrGetState = () => {
    const shouldRefresh = checkTasksRefresh(5, this.state.refreshDate);
    if (!shouldRefresh)
      this.getState();
    else if (shouldRefresh) {
      this.refreshTaskList();
    }
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
          addingOrEditingTask: !prevState.addingOrEditingTask,
        }
      });
  }

  toggleEditingTask = task => {
    this.setState({
      taskBeingEdited: task,
      addingOrEditingTask: true,
      editingTask: true
    });
  }

  toggleEditingTaskView = () => {
    this.setState( prevState => {
      return {
        taskBeingEdited: null,
        editingTask: !prevState.editingTask,
        addingOrEditingTask: !prevState.addingOrEditingTask,
      }
    });
  }

  toggleCompletedTaskView = () => {
    this.setState(prevState => {
      return {
        viewingCompletedTask: !prevState.viewingCompletedTask
      }
    });
  }

  addTask = item => {
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

      const prioritizedTasks = prioritizeTasks([...prevState.tasks, newTask]);

      return {
        tasks: prioritizedTasks,
        addingOrEditingTask: false,
        editingTask: false,
        counterForTaskID: newCounterID,
        justRefreshed: false,
       }
    })
  }

  editTask = item => {
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

    const prioritizedTasks = prioritizeTasks(newTasks);

    this.setState({
      tasks: prioritizedTasks,
      taskBeingEdited: null,
      addingOrEditingTask: false,
      editingTask: false
    })
  }

  completeTask = taskID => {
    const finishedTask = this.state.tasks.filter(task => taskID === task.id);
    const newTasks = this.state.tasks.filter(task => taskID !== task.id);

    this.setState(prevState => {
      return {
        tasks: [...newTasks],
        completedTasks: [...prevState.completedTasks, ...finishedTask],
      }
    });
  }

  unCompleteTask = taskID => {
    const unFinishedTask = this.state.completedTasks.filter(task => taskID === task.id);
    const newCompletedTasks = this.state.completedTasks.filter(task => taskID !== task.id);

    this.setState(prevState => {
      return {
        tasks: [...prevState.tasks, ...unFinishedTask],
        completedTasks: [...newCompletedTasks],
      }
    })
  }

  deleteTask = taskID => {
    const newTasks = this.state.tasks.filter(task => taskID !== task.id);
    this.setState({
      tasks: [...newTasks]
    });
  }

  refreshTaskList = () => {
    this.setState({
      tasks: [],
      refreshDate: moment().add(1, 'days').format('DD'),
      justRefreshed: true,
    });
  }

  pickComponent = () => {
    const {
      addingOrEditingTask,
      editingTask,
      tasks,
      taskBeingEdited,
      viewingCompletedTask,
      completedTasks,
      justRefreshed,
    } = this.state;

    let tasksEmpty = false;
    let completedTasksEmpty = false;
    if (tasks.length === 0) tasksEmpty = true;
    if (completedTasks.length === 0) completedTasksEmpty = true;

    if (!addingOrEditingTask && !viewingCompletedTask) {
      return (
        <View>
          <View>
            <Header headerStyle={ styles.header } toDisplay={ moment().format('MMMM Do, YYYY') }/>
          </View>
          <View style={ styles.taskListContainer }>
            <TaskList
              toggleEditingTask={ this.toggleEditingTask }
              tasks={ tasks }
              tasksEmpty = { tasksEmpty }
              completeTask={ this.completeTask }
              deleteTask={ this.deleteTask }
              justRefreshed={ justRefreshed }
            />
          </View>
          <View>
            <Footer
              footerStyle={ styles.footer }
              toggleAddingTask={ this.toggleAddingTask }
              toggleCompletedTaskView={ this.toggleCompletedTaskView }
              viewingCompletedTask={ viewingCompletedTask }
              buttonText="∆"
            />
          </View>
        </View>
      );
    }
    else if (viewingCompletedTask) {
      return (
        <View>
          <View>
            <Header headerStyle={ styles.header } toDisplay={ moment().format('MMMM Do, YYYY') } />
          </View>
          <View style={ styles.taskListContainer }>
            <TaskList
              tasks={ completedTasks }
              completedTasksEmpty={ completedTasksEmpty }
              viewingCompletedTask={ viewingCompletedTask }
              unCompleteTask={ this.unCompleteTask }
              justRefreshed={ justRefreshed }
            />
          </View>
          <View>
            <Footer
              footerStyle={ styles.footer }
              toggleAddingTask={ this.toggleAddingTask }
              toggleCompletedTaskView={ this.toggleCompletedTaskView }
              viewingCompletedTask={ viewingCompletedTask }
              buttonText="∆"
            />
          </View>
        </View>
      );
    }
    else if (editingTask) {
      return (
        <View>
          <View>
            <Header headerStyle={ styles.header } toDisplay="Edit Task" />
          </View>
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
              addingOrEditingTask={ addingOrEditingTask }
              editingTask= { editingTask }
              toggleEditingTaskView= { this.toggleEditingTaskView }
              buttonText="X"
            />
          </View>
        </View>
      );
    }
    else if (!editingTask) {
      return (
        <View>
          <View>
            <Header headerStyle={ styles.header } toDisplay="Add Task" />
          </View>
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
              addingOrEditingTask={ addingOrEditingTask }
              buttonText="X"
            />
          </View>
        </View>
      );
    }
  }

  render = () => {
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
    height: setHeight(12),
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskListContainer: {
    height: setHeight(75),
  },
  addOrEditTaskContainer: {
    height: setHeight(75),
  }
});
