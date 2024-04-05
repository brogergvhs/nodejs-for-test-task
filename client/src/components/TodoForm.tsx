import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../types';

const mockTodo: Todo = {
  _id: '',
  name: '',
  description: '',
  progress: 0,
};

function TodoForm({ todo = mockTodo }: {todo?: Todo}): JSX.Element {
  const id = todo?._id;
  const [name, setName] = useState<string>(todo.name);
  const [description, setDescription] = useState<string>(todo.description);
  const [progress, setProgress] = useState<number>(todo.progress);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!process.env.REACT_APP_API_SERVER_URL) {
      console.error('REACT_APP_API_SERVER_URL is undefined');
      return;
    }

    const todoData = {
      _id: id, name, description, progress,
    };

    if (!id) {
      const newId = uuidv4();
      todoData._id = newId;
      try {
        await axios.post<Todo>(`${process.env.REACT_APP_API_SERVER_URL}/todos`, todoData);
      } catch (error) {
        console.error('Error creating todo:', error);
      }
      return;
    }

    try {
      await axios.put<Todo>(`${process.env.REACT_APP_API_SERVER_URL}/todos`, todoData);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Name:
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label htmlFor="description">
        Description:
        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label htmlFor="progress">
        Progress:
        <input id="progress" max="100" type="number" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
      </label>
      <button disabled={!name || !description} type="submit">
        {id ? 'Update' : 'Create'}
        To Do
      </button>
    </form>
  );
}

export default TodoForm;
