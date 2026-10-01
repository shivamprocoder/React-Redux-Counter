import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../features/todos/todosSlice.js'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})

store.subscribe(() => {
  try {
    localStorage.setItem('daymark-todos', JSON.stringify(store.getState().todos.items))
  } catch {
    // Keep the app usable when browser storage is unavailable.
  }
})