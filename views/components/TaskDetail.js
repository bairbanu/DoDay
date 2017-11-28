import React, { Component } from 'react';
import { Text, StyleSheet, TextInput, Button, View } from 'react-native';

export default class TaskDetail extends Component {
  state = {
    text: '',
    priority: undefined
  }

  handleChange = (text) => {
    this.setState({ text });
  }

  handleSubmit = () => {
    this.props.addTask(this.state);
  }

  render() {
    return (
      <View>
        <Text style={ styles.header }> Enter tasks </Text>
        <View>
          <TextInput
            value={ this.state.value }
            onChangeText={ this.handleChange }
            onSubmitEditing={ this.handleSubmit }
            style={ styles.textInput } />
        </View>
        <View>
          <View>
            <Button title="1" onPress={ () => this.setState({ priority: 1 }) } />
          </View>
          <View>
            <Button title="2" onPress={ () => this.setState({ priority: 2 }) } />
          </View>
          <View>
            <Button title="3" onPress={ () => this.setState({ priority: 3 }) } />
          </View>
        </View>
        <View>
          <Button title="Done" onPress={ this.handleSubmit } />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 50,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d6d7da',
    fontSize: 30,
    textAlign: 'center'
  },
  header: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 40
  }
})
