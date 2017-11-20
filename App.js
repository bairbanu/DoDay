import React from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [{task: 'why not'}]
    }

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    this.setState((prevState) => {
      return {tasks: [...prevState.tasks, {task: 'cool'}]}
    })
  }

  render() {
    return (
      <View>
        <View>
          <FlatList
            style={ styles.flatlist }
            data={ this.state.tasks }
            renderItem={({ item }) => <Text> { item.task } </Text>}
          />
        </View>
        <Button title="Add Task" onPress={ this.handlePress } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatlist: {
    marginTop: 50,
  }
});
