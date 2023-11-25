import { createSignal, createMemo, Show, onCleanup } from 'solid-js';

let counter = 0;
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const App = () => {
  const [todos, setTodos] = createSignal([]);
  const [showMode, setShowMode] = createSignal('all');
  const remainingCount = createMemo(() => todos().filter(todo => !todo.completed).length);

  function addTodo(event) {
    const title = event.target.value.trim();
    if (event.keyCode == ENTER_KEY && title) {
      setTodos((todos) => [
        ...todos,
        { id: counter++, title, completed: false },
      ]);
      event.target.value = '';
    }
  };

  function removeTodo(todoId) {
    return () => {
      setTodos(todos => todos.filter(todo => todo.id !== todoId));
    }
  };

  function toggleCompleted(todoId) {
    return () => {
      setTodos(todos =>
        todos.map(todo => {
          if (todo.id !== todoId) return todo;
          return { ...todo, completed: !todo.completed };
        }
        )
      );
    }
  };

  function clearCompleted() {
    setTodos(todos => todos.filter(todo => !todo.completed))
  };

  const toggleAll = (event) => {
    const checked = event.target.checked;
    setTodos(todos => todos.map(todo => ({ ...todo, completed: checked })));
  };

  const filterTodos = (todos) => {
    if (showMode() === 'active') return todos.filter(todo => !todo.completed);
    if (showMode() === 'completed') return todos.filter(todo => todo.completed);
    return todos;
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


      <Show when={todos().length > 0}>
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
            <For each={filterTodos(todos())}>
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
          <Show when={remainingCount() !== todos().length}>
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
