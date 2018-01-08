import { Dimensions } from 'react-native';
import moment from 'moment';

export const setHeight = percentage => {
  return Dimensions.get('window').height * (percentage / 100);
}

export const prioritizeTasks = tasks => {
  const highPriority = tasks.filter(task => task.priority === 'high');
  const mediumPriority = tasks.filter(task => task.priority === 'medium');
  const lowPriority = tasks.filter(task => task.priority === 'low');
  const nullPriority = tasks.filter(task => task.priority === 'none');

  return [...highPriority, ...mediumPriority, ...lowPriority, ...nullPriority];
}

 // timeThreshold in military time
export const checkTasksRefresh = (timeThreshold, refreshDate) => {
  // currently not consider thresholds to be as granular as minutes
  const currentTime = Number(moment().format('HH'));
  const currentDate = Number(moment().format('DD'));

  // need to handle the monthly edge case. What happens
  // when months change. Then, what happens when year changes.
  if (currentDate < Number(refreshDate))
    return false;
  else if (currentDate >= Number(refreshDate)) {
    if (currentTime < timeThreshold)
      return false;
    else if (currentTime > timeThreshold)
      return true;
  }
}
