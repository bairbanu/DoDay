import { AsyncStorage } from 'react-native';

export const persistState = state => {
  const stateJSON = JSON.stringify(state);

  AsyncStorage.setItem('@focus_monkey', stateJSON)
    .catch(error => {
      console.log('Async set error:', error);
    })
}
