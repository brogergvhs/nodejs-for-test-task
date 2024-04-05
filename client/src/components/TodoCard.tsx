import React from 'react';
import axios from 'axios';
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

  if (isEditing && todo) {
    return (
      <TodoForm todo={todo} />
    );
  }

  return (
    <div style={{
      border: '1px solid #ddd', borderRadius: '4px', padding: '10px', marginBottom: '10px',
    }}
    >
      <h2 style={{ margin: '0 0 10px 0' }}>{todo.name}</h2>
      <p style={{ margin: '0 0 10px 0' }}>{todo.description}</p>
      <p style={{ margin: '0 0 10px 0' }}>
        {todo.progress}
        %
      </p>
      <div style={{ height: '20px', backgroundColor: '#f3f3f3' }}>
        <div style={{ height: '100%', width: `${todo.progress}%`, backgroundColor: '#4caf50' }} />
      </div>
      <div>
        <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default TodoCard;
