import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import { setHeight } from '../../model/utils';

export default class AddOrEditTask extends Component {
  state = {
    text: '',
    priority: null,
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
    console.log('this is the priority:::', priority);
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <Text style={ styles.headerText }> Enter tasks </Text>
        </View>
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
              <Text style={ styles.buttonText }> 1 </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ this.handlePrioritySubmit.bind(null) }>
            <View style={ [styles.button, styles.priorityButton] }>
              <Text style={ styles.buttonText }> 2 </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ this.handlePrioritySubmit }>
            <View style={ [styles.button, styles.priorityButton] }>
              <Text style={ styles.buttonText }> 3 </Text>
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
      </View>
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
  header: {
    height: setHeight(7),
    marginTop: 50,
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
