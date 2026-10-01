import { createSlice } from '@reduxjs/toolkit'

const starterTasks = [
  { id: 'starter-1', title: 'Review project proposal', category: 'Work', priority: 'High', completed: false },
  { id: 'starter-2', title: 'Send notes to the team', category: 'Work', priority: 'Medium', completed: false },
  { id: 'starter-3', title: 'Pick up groceries for dinner', category: 'Personal', priority: 'Low', completed: false },
  { id: 'starter-4', title: 'Read 20 pages', category: 'Personal', priority: 'Low', completed: true },
]

function getInitialTasks() {
  try {
    const savedTasks = localStorage.getItem('daymark-todos')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      if (Array.isArray(parsedTasks)) return parsedTasks
    }
  } catch {
    // Fall back to starter tasks when saved data cannot be read.
  }
  return starterTasks
}

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: getInitialTasks(),
    filter: 'all',
    category: 'All',
    query: '',
  },
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.unshift(action.payload)
      },
      prepare({ title, category, priority }) {
        return {
          payload: {
            id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
            title: title.trim(),
            category,
            priority,
            completed: false,
          },
        }
      },
    },
    toggleTodo(state, action) {
      const todo = state.items.find((item) => item.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
    deleteTodo(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilter(state, action) {
      state.filter = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
    setQuery(state, action) {
      state.query = action.payload
    },
    clearCompleted(state) {
      state.items = state.items.filter((item) => !item.completed)
    },
  },
})

export const { addTodo, toggleTodo, deleteTodo, setFilter, setCategory, setQuery, clearCompleted } = todosSlice.actions
export default todosSlice.reducer