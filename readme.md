Minimalist to-do application that takes out the past and the future and helps users focus on today.

#### Tech Stack:
- React Native using the Expo XDE.

## Application Features:

- No accounts necessary so users can be productive right away.
- Users can add task by pressing ∆ button and filling out details.
- Users can view completed tasks by long pressing ∆ button.
- Users can complete task by swiping right.
- Users can delete task by swiping left.
- Users can edit task by pressing on the task to be edited.
- On the completed tasks view, users can undo completion by swiping right.
- When task list is empty, appropriate messages are shown, such as "No more tasks for today! Yet." or "New day, new beginning!"

## Application Internals:
- Task list refreshes at 5am everyday.
- Tasks are persisted on users' phones by using React Native's AsyncStorage module.


## Future Features:
- Add a habit builder.

### Cons:
- Since I was building this application just for fun, I wrote ambigious commit messages and didn't follow proper git workflow. Noted and will ensure to avoid in any future applications.
