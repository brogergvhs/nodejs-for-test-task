import React from 'react';
import axios from 'axios';
import {
  Button, Card, CardHeader, CardBody, CardFooter, Divider, Progress,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import TodoForm from './TodoForm';
import { Todo } from '../types';

function TodoCard({ todo }: { todo: Todo }): JSX.Element {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const navigate = useNavigate();

  async function handleDelete() {
    if (!process.env.REACT_APP_API_SERVER_URL || !todo) {
      console.error('Cant execute delete');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this todo item?');
    if (!confirmDelete) return;

    try {
      console.log('Delete todo:', todo);
      await axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/todos/${todo._id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  function handleCardClick() {
    console.log('Navigating to singleTodo:', todo);
    navigate('/singleTodo', { state: { todo } });
  }

  if (isEditing && todo) {
    return (
      <TodoForm setCreatingTodo={() => setIsEditing(false)} todo={todo} />
    );
  }

  return (
    <div
      className="h-full"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyPress={handleCardClick}
    >
      <Card className="h-full w-full max-w-[400px] cursor-pointer hover:scale-[101%]">
        <CardHeader className="flex gap-3">
          <div className="font-semibold text-lg">
            {todo.name}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{todo.description}</p>
          <div className="flex flex-row items-center gap-3">
            <span>
              {todo.progress}
              %
            </span>
            <Progress aria-label="Loading..." value={todo.progress} className="max-w-md" />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="gap-3">
          <Button color="primary" onClick={() => setIsEditing(true)}>Edit</Button>
          <Button color="danger" onClick={() => handleDelete()}>Delete</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TodoCard;
