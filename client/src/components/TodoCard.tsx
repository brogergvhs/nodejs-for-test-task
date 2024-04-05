import React from 'react';
import axios from 'axios';
import {
  Button, Card, CardHeader, CardBody, CardFooter, Divider, Progress,
} from '@nextui-org/react';
import TodoForm from './TodoForm';
import { Todo } from '../types';

function TodoCard({ todo }: { todo: Todo }): JSX.Element {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  async function handleDelete() {
    if (!process.env.REACT_APP_API_SERVER_URL || !todo) {
      console.error('Cant execute delete');
      return;
    }

    try {
      console.log('Delete todo:', todo);
      await axios.delete(`${process.env.REACT_APP_API_SERVER_URL}/todos/${todo._id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  function goToSingleTodo(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.preventDefault();
  }

  if (isEditing && todo) {
    return (
      <TodoForm setCreatingTodo={() => setIsEditing(false)} todo={todo} />
    );
  }

  return (
    <Card className="w-full max-w-[400px] cursor-pointer hover:scale-[101%]" onClick={(e) => goToSingleTodo(e)}>
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
  );
}

export default TodoCard;
