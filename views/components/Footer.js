import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const Footer = ({
  footerStyle,
  toggleAddingTask,
  toggleCompletedTaskView,
  viewingCompletedTask,
  addingOrEditingTask,
  toggleEditingTaskView,
  editingTask,
  buttonText,
}) => {
  return (
    <View style={ footerStyle }>
      <Button
        large
        title={ buttonText }
        buttonStyle={ styles.button }
        onPress={
          viewingCompletedTask
          ? toggleCompletedTaskView
          : (editingTask
            ? toggleEditingTaskView
            : toggleAddingTask)
        }
        onLongPress= {
          addingOrEditingTask
          ? (editingTask
            ? toggleEditingTaskView
            : toggleAddingTask)
          : toggleCompletedTaskView
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width,
  }
})

export default Footer;
