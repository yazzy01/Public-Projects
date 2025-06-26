import React,{useState} from 'react';
import './todo.css';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [newtodo, setNewtodo] = useState('');

    const handleAddTodo = (e) => {
        e.preventDefault();
        setTodos([...todos, newtodo]);
        setNewtodo('');
    };

    const handleDeleteTodo = (index) => {
        const newTodos = [...todos];
        newTodos.splice(index,1);
        setTodos(newTodos);
    }
    return (
    <>  
    <h1>Todo List</h1>
    <input type="text" id="todo" value={newtodo} onChange={(e) => setNewtodo(e.target.value)}/>
    <button onClick={handleAddTodo}>Add Todo</button>  
    <button onClick={handleDeleteTodo}>Delete Todo</button>
    <ul>
        {
        todos.map((Todos,index)=>           
        <li key={index}>{Todos}</li>
        )
        }
    </ul>

    </>
    );
}   

export default Todos;

