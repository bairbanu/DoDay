import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';

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
      ]
    }

    this.handlePress = this.handlePress.bind(this);
  }

  renderTask({ item }) {
    return <Text style={ styles.task } onPress={ this.test }> { item.task } </Text>
  }

  handlePress() {
    this.setState( prevState => ({ tasks: [...prevState.tasks, {task: 'cool'}] }) );
  }

  render() {
    return (
      <View>
        <View>
          <FlatList
            style={ styles.flatList }
            data={ this.state.tasks }
            renderItem={ this.renderTask }
          />
        </View>
        <Button title="Add Task" onPress={ this.handlePress } />
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
