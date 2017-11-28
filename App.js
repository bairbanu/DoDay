import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  FlatList } from 'react-native';

import moment from 'moment';
import { TaskList, TaskDetail } from './views/components';

export default class App extends Component {
  state = {
    tasks: [{
      id: 0,
      task: 'Initial test task',
      priority: undefined,
      completed: false
    }],
    completedTasks: [],
    addingTask: false,
    counterForID: 1
  }

  toggleAddingTask = () => {
    this.setState(prevState => ({ addingTask: !prevState.addingTask }));
  }

  addTask = (item) => {
    this.setState(prevState => {
      const task = {
        id: prevState.counterForID,
        task: item.text,
        priority: item.priority,
        completed: false
      };

      const newCounterID = prevState.counterForID + 1;

      return {
        tasks: [...prevState.tasks, task],
        addingTask: false,
        counterForID: newCounterID
       }
    })
  }

  render() {
    const displayComponent = !this.state.addingTask
    ? <TaskList
        handlePress={ this.toggleAddingTask }
        tasks={ this.state.tasks } />
    : <TaskDetail
        addTask={ this.addTask } />;

    return (
      <View>
        <Text style={ styles.header }> { moment().format('MMMM Do, YYYY')}</Text>
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
