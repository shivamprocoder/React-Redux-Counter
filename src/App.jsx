import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  setCategory,
  setFilter,
  setQuery,
  toggleTodo,
} from './features/todos/todosSlice.js'
import './App.css'

const filters = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
]
const categories = ['All', 'Work', 'Personal']

function App() {
  const dispatch = useDispatch()
  const { items, filter, category, query } = useSelector((state) => state.todos)
  const [title, setTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Work')
  const [priority, setPriority] = useState('Medium')

  const visibleTodos = useMemo(() => items.filter((todo) => {
    const matchesFilter = filter === 'all'
      || (filter === 'active' && !todo.completed)
      || (filter === 'completed' && todo.completed)
    const matchesCategory = category === 'All' || todo.category === category
    const matchesQuery = todo.title.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesCategory && matchesQuery
  }), [items, filter, category, query])

  const completedCount = items.filter((todo) => todo.completed).length
  const activeCount = items.length - completedCount
  const progress = items.length ? Math.round((completedCount / items.length) * 100) : 0
  const today = new Date()
  const formattedDate = new Intl.DateTimeFormat('en', {
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(today)

  function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return
    dispatch(addTodo({ title, category: newCategory, priority }))
    setTitle('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#today" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true">d</span>
          <span>daymark<span className="brand-period">.</span></span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Task views">
          {filters.map((item) => (
            <button className={`nav-item ${filter === item.id ? 'is-selected' : ''}`} key={item.id}
              onClick={() => dispatch(setFilter(item.id))} type="button">
              <span className={`nav-symbol nav-symbol-${item.id}`} aria-hidden="true">
                {item.id === 'all' ? '◷' : item.id === 'active' ? '↗' : '✓'}
              </span>
              <span>{item.label}</span>
              <span className="nav-count">
                {item.id === 'all' ? items.length : item.id === 'active' ? activeCount : completedCount}
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-label category-label">LABELS</div>
        <nav className="category-nav" aria-label="Task categories">
          {categories.map((item) => {
            const count = item === 'All' ? items.length : items.filter((todo) => todo.category === item).length
            return (
              <button className={`category-item ${category === item ? 'is-selected' : ''}`} key={item}
                onClick={() => dispatch(setCategory(item))} type="button">
                <span className={`category-dot dot-${item.toLowerCase()}`} />
                <span>{item === 'All' ? 'Everything' : item}</span>
                <span className="nav-count">{count}</span>
              </button>
            )
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note-mark" aria-hidden="true">✳</div>
          <p>A little progress<br />goes a long way.</p>
          <span>MAKE TODAY COUNT</span>
        </div>
      </aside>

      <main className="main-area" id="today">
        <header className="topbar">
          <div className="breadcrumb"><span>MY SPACE</span><span className="breadcrumb-slash">/</span><strong>Tasks</strong></div>
          <div className="profile"><span className="profile-name">Alex Morgan</span><span className="avatar" aria-label="Alex Morgan">AM</span></div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">{formattedDate}</p>
              <h1>Make room for <em>what matters.</em></h1>
              <p className="welcome-subtitle">One thing at a time. You’ve got this.</p>
            </div>
            <div className="date-stamp" aria-hidden="true">
              <span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(today).toUpperCase()}</span>
              <strong>{today.getDate()}</strong>
            </div>
          </section>

          <section className="stat-row" aria-label="Task summary">
            <div className="stat-block"><span className="stat-icon stat-icon-total" aria-hidden="true">▤</span>
              <div><span className="stat-value">{items.length}</span><span className="stat-label">Total tasks</span></div>
            </div>
            <div className="stat-block"><span className="stat-icon stat-icon-active" aria-hidden="true">◌</span>
              <div><span className="stat-value">{activeCount}</span><span className="stat-label">Still to do</span></div>
            </div>
            <div className="stat-block"><span className="stat-icon stat-icon-done" aria-hidden="true">✓</span>
              <div><span className="stat-value">{completedCount}</span><span className="stat-label">Already done</span></div>
            </div>
            <div className="stat-decoration" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          </section>

          <div className="content-grid">
            <section className="task-section" aria-labelledby="tasks-heading">
              <div className="section-heading">
                <div>
                  <h2 id="tasks-heading">Your tasks <span>{category === 'All' ? 'today' : `· ${category.toLowerCase()}`}</span></h2>
                  <p>A clear list makes a clear mind.</p>
                </div>
                <label className="search-box"><span aria-hidden="true">⌕</span>
                  <input aria-label="Search tasks" onChange={(event) => dispatch(setQuery(event.target.value))}
                    placeholder="Find a task" type="search" value={query} />
                </label>
              </div>
              <form className="add-form" onSubmit={handleSubmit}>
                <span className="add-plus" aria-hidden="true">+</span>
                <input aria-label="New task title" onChange={(event) => setTitle(event.target.value)}
                  placeholder="Add something to your day..." value={title} />
                <select aria-label="Task category" onChange={(event) => setNewCategory(event.target.value)} value={newCategory}>
                  <option>Work</option><option>Personal</option>
                </select>
                <select aria-label="Task priority" onChange={(event) => setPriority(event.target.value)} value={priority}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
                <button className="add-button" type="submit">Add task <span aria-hidden="true">↗</span></button>
              </form>
              <div className="list-toolbar">
                <div className="filter-tabs" aria-label="Filter tasks">
                  {filters.map((item) => (
                    <button aria-pressed={filter === item.id} className={filter === item.id ? 'tab-active' : ''}
                      key={item.id} onClick={() => dispatch(setFilter(item.id))} type="button">{item.label}</button>
                  ))}
                </div>
                {completedCount > 0 && <button className="clear-button" onClick={() => dispatch(clearCompleted())} type="button">Clear completed</button>}
              </div>
              <div className="task-list">
                {visibleTodos.length > 0 ? visibleTodos.map((todo) => (
                  <article className={`task-row ${todo.completed ? 'task-complete' : ''}`} key={todo.id}>
                    <button aria-label={todo.completed ? `Mark ${todo.title} incomplete` : `Complete ${todo.title}`}
                      aria-pressed={todo.completed} className="task-check" onClick={() => dispatch(toggleTodo(todo.id))} type="button">
                      {todo.completed && <span aria-hidden="true">✓</span>}
                    </button>
                    <div className="task-copy"><span className="task-title">{todo.title}</span>
                      <span className="task-meta"><span className={`category-dot dot-${todo.category.toLowerCase()}`} />{todo.category}</span>
                    </div>
                    <span className={`priority priority-${todo.priority.toLowerCase()}`}><span />{todo.priority}</span>
                    <button aria-label={`Delete ${todo.title}`} className="delete-button" onClick={() => dispatch(deleteTodo(todo.id))}
                      title="Delete task" type="button">×</button>
                  </article>
                )) : (
                  <div className="empty-state"><span className="empty-mark" aria-hidden="true">✳</span>
                    <strong>{query ? 'No tasks match your search' : 'Nothing on this list yet'}</strong>
                    <span>{query ? 'Try another search term.' : 'Add a task above and start your day.'}</span>
                  </div>
                )}
              </div>
              <p className="list-footer">Showing {visibleTodos.length} of {items.length} {items.length === 1 ? 'task' : 'tasks'}</p>
            </section>

            <aside className="insights-column" aria-label="Progress">
              <section className="progress-panel">
                <div className="panel-kicker"><span className="live-dot" /> DAILY CHECK-IN</div>
                <h2>You’re finding<br />your <em>rhythm.</em></h2>
                <p>Every completed task is a promise kept to yourself.</p>
                <div className="progress-ring" style={{ '--progress': `${progress}%` }}>
                  <div><strong>{progress}<small>%</small></strong><span>COMPLETE</span></div>
                </div>
                <div className="progress-caption"><span>Today’s progress</span><strong>{completedCount} / {items.length}</strong></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              </section>
              <section className="focus-panel">
                <span className="focus-icon" aria-hidden="true">✳</span>
                <div className="panel-kicker">A SMALL REMINDER</div>
                <p>“You don’t have to see the whole staircase, just take the first step.”</p>
                <span className="focus-author">MARTIN LUTHER KING JR.</span>
              </section>
            </aside>
          </div>
        </div>
        <footer className="page-footer"><span>DAYMARK</span><span>Small steps, every day.</span><span>EST. FOR TODAY</span></footer>
      </main>
    </div>
  )
}

export default App