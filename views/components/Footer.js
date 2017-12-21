import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

const Footer = ({
  footerStyle,toggleAddingTask,
  toggleCompletedTaskView,
  viewingCompletedTask,
}) => {
  return (
    <View style={ footerStyle }>
      <Button
        large
        title="∆"
        onPress={
          viewingCompletedTask
          ? toggleCompletedTaskView
          : toggleAddingTask
        }
        onLongPress= { toggleCompletedTaskView }
      />
    </View>
  );
}

export default Footer;
