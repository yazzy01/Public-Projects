import React, { useState } from 'react';

function TodoList() {
  // Initial state with array of todo objects
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React Basics', completed: true },
    { id: 2, text: 'Practice useState Hook', completed: false },
    { id: 3, text: 'Build Todo App', completed: false }
  ]);
  
  // State for new todo input
  const [newTodo, setNewTodo] = useState('');
  
  // Add new todo
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    // Create new todo object
    const newTodoItem = {
      id: Date.now(), // using timestamp as unique ID
      text: newTodo,
      completed: false
    };
    
    // Add to todos array (using functional update)
    setTodos(prevTodos => [...prevTodos, newTodoItem]);
    
    // Clear input
    setNewTodo('');
  };
  
  // Toggle todo completion
  const toggleComplete = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Delete todo
  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };
  
  return (
    <div className="todo-container">
      <h2>Todo List Example (useState with Objects)</h2>
      
      {/* Input for new todo */}
      <div className="todo-form">
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new task"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      
      {/* List of todos */}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span 
              onClick={() => toggleComplete(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {/* Summary */}
      <div className="todo-summary">
        <p>Total todos: {todos.length}</p>
        <p>Completed: {todos.filter(todo => todo.completed).length}</p>
        <p>Pending: {todos.filter(todo => !todo.completed).length}</p>
      </div>
    </div>
  );
}

export default TodoList; 