import React, { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import UserManager from './components/UserManager';
import ProductList from './components/ProductList';

function App() {
  const [activeComponent, setActiveComponent] = useState('todo');

  return (
    <div className="App">
      <header className="App-header">
        <h1>React useState Examples</h1>
        <p>Practical examples of useState with data objects</p>
      </header>

      <div className="component-selector">
        <button 
          className={activeComponent === 'todo' ? 'active' : ''} 
          onClick={() => setActiveComponent('todo')}
        >
          Todo List
        </button>
        <button 
          className={activeComponent === 'user' ? 'active' : ''} 
          onClick={() => setActiveComponent('user')}
        >
          User Manager
        </button>
        <button 
          className={activeComponent === 'product' ? 'active' : ''} 
          onClick={() => setActiveComponent('product')}
        >
          Product List
        </button>
      </div>

      <main>
        {activeComponent === 'todo' && <TodoList />}
        {activeComponent === 'user' && <UserManager />}
        {activeComponent === 'product' && <ProductList />}
      </main>
    </div>
  );
}

export default App; 