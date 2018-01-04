import React, { Component } from 'react';
import { Text } from 'react-native';

import moment from 'moment';

const Header = ({ headerStyle, toDisplay }) => {
  return (
    <Text style={ headerStyle }> { toDisplay } </Text>
  );
}

export default Header;
