import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Button, Text } from 'react-native';

export default class TaskList extends Component {
  renderTask({ item }) {
    return <Text style={ styles.task } onPress={ this.test }> { item.task } </Text>
  }

  render() {
    const { handlePress, tasks } = this.props;

    return (
      <ScrollView>
        <View>
          <FlatList
            style={ styles.flatList }
            data={ tasks }
            renderItem={ this.renderTask }
            // add keys here
          />
        </View>
        <Button style={ styles.button } title="Add Task" onPress={ handlePress } />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    marginTop: 50,
  },
  task: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center'
  },
  button: {
    fontSize: 30
  }
});
