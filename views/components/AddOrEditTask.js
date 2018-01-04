import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  Picker,
} from 'react-native';

import { setHeight } from '../../model/utils';

export default class AddOrEditTask extends Component {
  state = {
    text: '',
    priority: 'none',
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

  handleChange = text => {
    this.setState({ text });
  }

  handleTaskSubmit = () => {
    const { editing } = this.props;

    if (!editing) {
      this.props.addTask(this.state);
    }
    else if (editing) {
      const { taskBeingEdited } = this.props;

      const editedTask = {
        id: taskBeingEdited.id,
        task: this.state.text,
        priority: this.state.priority
      }

      this.props.editTask(editedTask);
    }
  }

  render = () => {
    return (
      <ScrollView style={ styles.container }>
        <View style={ styles.textInputContainer }>
          <TextInput
            style={ styles.textInput }
            value={ this.state.text }
            onChangeText={ this.handleChange }
            onSubmitEditing={ this.handleTaskSubmit }
          />
        </View>

        <Text style={ styles.priorityText }> Priority </Text>
        <Picker
          selectedValue={ this.state.priority }
          onValueChange={ itemValue => this.setState({ priority: itemValue }) }>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="None" value="none" />
        </Picker>

        <View style={ styles.doneButtonContainer }>
          <TouchableHighlight onPress={ this.handleTaskSubmit }>
            <View style={ [styles.button, styles.doneButton] }>
              <Text style={ styles.buttonText }>+</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 20,
    height: 50,
    width: Dimensions.get('window').width,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d6d7da',
    fontSize: 30,
    textAlign: 'center'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
  },
  textInputContainer: {
    height: setHeight(30),
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 360,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 40,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityButtonText: {
    fontSize: 30,
  },
  doneButtonContainer: {
    marginTop: 30,
    height: 100,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    height: 90,
    width: 90,
  },
  priorityText: {
    fontSize: 15,
    textAlign: 'center',
  }
})
