import React, { useEffect, useReducer, useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';

const initialState = {
    loading: true,
    error: '',
    todos: [],
    newTodo: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                todos: action.payload,
                error: '',
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: 'Failed to fetch todos.',
            };
        case 'INPUT_CHANGE':
            return {
                ...state,
                newTodo: action.payload,
            };
        case 'ADD_TODO':
            return {
                ...state,
                todos: [
                    { id: state.todos.length + 1, title: state.newTodo, completed: false },
                    ...state.todos,
                ],
                newTodo: '',
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                ),
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload),
            };
        default:
            return state;
    }
};

const Todo = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const todos = await response.json();
            dispatch({ type: 'FETCH_SUCCESS', payload: todos });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR' });
        }
    };

    const handleInputChange = (e) => {
        dispatch({ type: 'INPUT_CHANGE', payload: e.target.value });
    };

    const addTodo = (e) => {
        e.preventDefault();
        dispatch({ type: 'ADD_TODO', payload: state.newTodo });
    };

    const toggleTodo = (id) => {
        dispatch({ type: 'TOGGLE_TODO', payload: id });
    };

    const deleteTodo = (id) => {
        dispatch({ type: 'DELETE_TODO', payload: id });
    };

    return (
        <Container>
            <h2 style={{ textAlign: 'center', marginBottom:"40px", marginTop:"40px" }}>Jadwal Kegiatan Harian</h2>
            <div style={{ display: 'flex', marginBottom:"20px", justifyContent:"center" }}>
                <Form onSubmit={addTodo} style={{ marginRight: '10px', width:"1200px" }}>
                    <Form.Control
                        type="text"
                        value={state.newTodo}
                        onChange={handleInputChange}
                        placeholder="Tambahkan Kegiatan"
                    />
                </Form>
                <Button variant="primary" onClick={addTodo}>
                    Add
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>Check</th>
                        <th style={{ textAlign: 'center' }}>Kegiatan</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {state.todos.map((todo) => (
                        <tr key={todo.id}>
                            <td style={{ textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                />
                            </td>
                            <td>{todo.id === editText ? (
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                            ) : (
                                todo.title
                            )}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button
                                    variant="info"
                                    onClick={() => setEditText(todo.id)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => deleteTodo(todo.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Todo;
