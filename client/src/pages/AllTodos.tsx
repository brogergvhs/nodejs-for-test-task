import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Todo } from '../types';
import { useSocket } from '../hooks/SocketContext';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';

function AllTodos(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [creatingTodo, setCreatingTodo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (!process.env.REACT_APP_API_SERVER_URL) {
      console.error('API_SERVER_URL is not defined');
      return;
    }
    setIsLoading(true);

    axios.get<Todo[]>(`${process.env.REACT_APP_API_SERVER_URL}/todos`)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!socket) return () => {};

    const handleTodoUpdate = (data: { _id: string; progress: number }) => {
      setTodos((prevTodos) => prevTodos.map((todo) => (
        todo._id === data._id
          ? { ...todo, progress: data.progress }
          : todo
      )));
    };

    const handleTodosRefresh = async () => {
      console.log('Refetching todos');
      setIsLoading(true);
      try {
        const response = await axios.get<Todo[]>(`${process.env.REACT_APP_API_SERVER_URL}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
      setCreatingTodo(false);
      setIsLoading(false);
    };

    socket.on('update-todo-progress', handleTodoUpdate);
    socket.on('todos-updated', handleTodosRefresh);

    return () => {
      socket.off('update-todo-progress', handleTodoUpdate);
      socket.off('todos-updated', handleTodosRefresh);
    };
  }, [socket]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {creatingTodo ? (
        <TodoForm />
      ) : (
        <button type="button" onClick={() => setCreatingTodo(true)}>
          Add a To Do
        </button>
      )}
      {todos.length === 0 && <div>No todos found</div>}
      {todos && todos.map((todo) => (
        <TodoCard key={todo._id} todo={todo} />
      ))}
    </div>
  );
}

export default AllTodos;
