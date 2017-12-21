import React, { Component } from 'react';
import { Text } from 'react-native';

import moment from 'moment';

const Header = ({ headerStyle }) => {
  return (
    <Text style={ headerStyle }> { moment().format('MMMM Do, YYYY') } </Text>
  );
}

export default Header;
