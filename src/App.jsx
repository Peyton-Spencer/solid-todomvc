import { createSignal, createMemo, Show, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

let counter = 0;
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const App = () => {
  const [todos, setTodos] = createStore([]);
  const [showMode, setShowMode] = createSignal('all');
  const remainingCount = createMemo(() => todos.filter(todo => !todo.completed).length);

  function addTodo(event) {
    const title = event.target.value.trim();
    if (event.keyCode == ENTER_KEY && title) {
      setTodos(produce(
        tds => tds.push({ id: counter++, title, completed: false }))
      );
      event.target.value = '';
    }
  };

  function removeTodo(todoId) {
    return () => {
      setTodos(todos.filter(todo => todo.id !== todoId));
    }
  };

  function toggleCompleted(id) {
    return () => {
      setTodos(
        (todo) => todo.id == id,
        "completed",
        (completed) => !completed
      );
    }
  };

  function clearCompleted() {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const toggleAll = (event) => {
    const checked = event.target.checked;
    setTodos(
      () => true,
      "completed",
      () => checked
    )
  };

  const filterTodos = (tds) => {
    if (showMode() === 'active') return tds.filter(todo => !todo.completed);
    if (showMode() === 'completed') return tds.filter(todo => todo.completed);
    return tds;
  }

  function locationHandler() {
    setShowMode(window.location.hash.replace(/#\/?/, '') || 'all');
  }
  window.addEventListener("hashchange", locationHandler)
  onCleanup(() => window.removeEventListener("hashchange", locationHandler))

  return (
    <section class="todoapp">

      <header class="header">
        <h1>Todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={addTodo}
        />
      </header>


      <Show when={todos.length > 0}>
        <section class="main">

          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            checked={!remainingCount()}
            onInput={toggleAll}
          />
          <label for="toggle-all" />

          <ul class="todo-list">
            <For each={filterTodos(todos)}>
              {(todo) => (
                <li class="todo"
                  classList={{
                    completed: todo.completed,
                  }}
                >
                  <div class="view">
                    <input type="checkbox"
                      class="toggle"
                      checked={todo.completed}
                      onInput={toggleCompleted(todo.id)}
                    />
                    <label>{todo.title}</label>
                    <button class="destroy" onClick={removeTodo(todo.id)} />
                  </div>
                </li>
              )}
            </For>
          </ul>
        </section>
        <footer class="footer">
          <span class="todo-count">
            <strong>{remainingCount()}</strong>
            {remainingCount() === 1 ? ' item' : ' items'} left
          </span>
          <ul class="filters">
            <li>
              <a href="#/active"
                classList={{ selected: showMode() === 'active' }}
              >
                Active
              </a>
            </li>
            <li>
              <a href="#/all"
                classList={{ selected: showMode() === 'all' }}
              >
                All
              </a>
            </li>
            <li>
              <a href="#/completed"
                classList={{ selected: showMode() === 'completed' }}
              >
                Completed
              </a>
            </li>
          </ul>
          <Show when={remainingCount() !== todos.length}>
            <button class="clear-completed" onClick={clearCompleted}>
              Clear completed
            </button>
          </Show>
        </footer>
      </Show>


    </section >
  );
};

export default App;
