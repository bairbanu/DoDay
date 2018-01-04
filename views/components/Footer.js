import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

const Footer = ({
  footerStyle,
  toggleAddingTask,
  toggleCompletedTaskView,
  viewingCompletedTask,
  addingOrEditingTask,
  buttonText,
}) => {
  return (
    <View style={ footerStyle }>
      <Button
        large
        title={ buttonText }
        onPress={
          viewingCompletedTask
          ? toggleCompletedTaskView
          : toggleAddingTask
        }
        onLongPress= {
          addingOrEditingTask
          ? toggleAddingTask
          : toggleCompletedTaskView
        }
      />
    </View>
  );
}

export default Footer;
