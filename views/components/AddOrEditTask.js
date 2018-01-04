import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import { setHeight } from '../../model/utils';

export default class AddOrEditTask extends Component {
  state = {
    text: '',
    priority: null,
  }

  // if editing a task, this will populate that task for user.
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

  handlePrioritySubmit = (priority) => {
    this.setState({ priority });
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

        <View style={ styles.priorityButtonsContainer }>
          <TouchableHighlight onPress={ this.handlePrioritySubmit.bind(null, 1) }>
            <View style={ [styles.button, styles.priorityButton] }>
              <Text style={ styles.buttonText, styles.priorityButtonText }> 1 </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ this.handlePrioritySubmit.bind(null, 2) }>
            <View style={ [styles.button, styles.priorityButton] }>
              <Text style={ styles.buttonText, styles.priorityButtonText }> 2 </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ this.handlePrioritySubmit.bind(null, 3) }>
            <View style={ [styles.button, styles.priorityButton] }>
              <Text style={ styles.buttonText, styles.priorityButtonText }> 3 </Text>
            </View>
          </TouchableHighlight>
        </View>

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
  priorityButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityButton: {
    margin: 20,
  },
  doneButton: {
    height: 90,
    width: 90,
  }
})
