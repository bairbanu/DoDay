import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, Button, FlatList } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [
        {
          id: 0,
          task: 'why not',
          priority: undefined,
          completed: false
        }
      ],
      addingTask: false
    }

    this.handleAddTaskPress = this.handleAddTaskPress.bind(this);
  }

  renderTask({ item }) {
    return <Text style={ styles.task } onPress={ this.test }> { item.task } </Text>
  }

  handleAddTaskPress() {
    this.setState( prevState => ({ tasks: [...prevState.tasks, {task: 'cool'}] }) );
  }

  render() {
    const taskList =
    <ScrollView>
      <View>
        <FlatList
          style={ styles.flatList }
          data={ this.state.tasks }
          renderItem={ this.renderTask }
        />
      </View>
      <Button title="Add Task" onPress={ this.handleAddTaskPress } />
    </ScrollView>;

    const taskDetail = <Text style={ styles.task }> Cool sauce </Text>;

    const displayComponent = !this.state.addingTask ? taskList : taskDetail;

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
