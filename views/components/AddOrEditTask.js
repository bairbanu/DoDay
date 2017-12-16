import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  View
} from 'react-native';

export default class TaskDetail extends Component {
  state = {
    text: '',
    priority: undefined,
  }

  componentWillMount = () => {
    const { editing } = this.props;

    if (editing) {
      const { taskBeingEdited } = this.props;

      this.setState({
        text: taskBeingEdited.task,
        priority: taskBeingEdited.priority
      });
    }
  }

  handleChange = (text) => {
    this.setState({ text });
  }

  handleSubmit = () => {
    const { editing } = this.props;

    if (!editing) {
      this.props.addTask(this.state);
    }
    else if (editing) {
      // create the edited task and pass it to editTask
      const { taskBeingEdited } = this.props;

      const editedTask = {
        id: taskBeingEdited.id,
        task: this.state.text,
        priority: this.state.priority
      }

      this.props.editTask(editedTask);
    }
  }

  render() {
    // console.log('task being edited:::', this.props.taskBeingEdited);

    return (
      <View>
        <Text style={ styles.header }> Enter tasks </Text>
        <View>
          <TextInput
            value={ this.state.text }
            onChangeText={ this.handleChange }
            onSubmitEditing={ this.handleSubmit }
            style={ styles.textInput } />
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
