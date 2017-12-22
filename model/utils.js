import { Dimensions } from 'react-native';

export const setHeight = (percentage) => {
  return Dimensions.get('window').height * (percentage / 100);
}
