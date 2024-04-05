import React, { useState } from 'react';
import axios from 'axios';
import {
  Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Textarea,
} from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../types';

const mockTodo: Todo = {
  _id: '',
  name: '',
  description: '',
  progress: 0,
};

function TodoForm({
  todo = mockTodo,
  setCreatingTodo,
}: {
  todo?: Todo;
  setCreatingTodo: () => void;
}): JSX.Element {
  const id = todo?._id;
  const [name, setName] = useState<string>(todo.name);
  const [description, setDescription] = useState<string>(todo.description);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!process.env.REACT_APP_API_SERVER_URL) {
      console.error('REACT_APP_API_SERVER_URL is undefined');
      return;
    }

    const todoData = {
      _id: id, name, description, progress: todo.progress,
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
      <Card className="flex-1 w-full max-w-[400px]">
        <CardHeader className="flex gap-3">
          <Input size="sm" type="text" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </CardHeader>
        <Divider />
        <CardBody>
          <Textarea label="Description" placeholder="Write a nice To Do description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </CardBody>
        <Divider />
        <CardFooter className="gap-3">
          <Button isDisabled={!name || !description} type="submit" color="primary">
            {id ? 'Update' : 'Create'}
          </Button>
          <Button onClick={setCreatingTodo}>Cancel</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default TodoForm;
