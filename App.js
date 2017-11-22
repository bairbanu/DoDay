import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, FlatList } from 'react-native';

import { TaskList, TaskDetail } from './views/components';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [
        {
          id: 0,
          task: 'Initial task.',
          priority: undefined,
          completed: false
        }
      ],
      addingTask: false,
      counterForID: 1
    }

    this.toggleAddingTask = this.toggleAddingTask.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  toggleAddingTask() {
    this.setState(prevState => ({ addingTask: !prevState.addingTask }));
  }

  addTask(item) {
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
    setInterval(() => {
      this.setState({
        tasks: [
          {
            id: 0,
            task: 'Initial task.',
            priority: undefined,
            completed: false
          }
        ],
        addingTask: false,
        counterForID: 1
      })
    }, 30000)

    const displayComponent = !this.state.addingTask
    ? <TaskList
        handlePress={ this.toggleAddingTask }
        tasks={ this.state.tasks } />
    : <TaskDetail
        addTask={ this.addTask } />;

    return (
      <View>
        { displayComponent }
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
  }
});
