import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@nextui-org/react';
import { useSocket } from '../hooks/SocketContext';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import { Todo } from '../types';

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
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <span className="text-2xl font-sebold">{todos.length > 0 ? 'All Todos' : 'No todos found'}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatingTodo ? (
          <TodoForm setCreatingTodo={() => setCreatingTodo(false)} />
        ) : (
          <Button className="w-24 h-24 m-auto" onClick={() => setCreatingTodo(true)}>Create Todo</Button>
        )}
        {todos && todos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

export default AllTodos;
