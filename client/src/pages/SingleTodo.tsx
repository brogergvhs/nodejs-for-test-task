import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Progress } from '@nextui-org/react';
import { useSocket } from '../hooks/SocketContext';
import BackButton from '../components/BackButton';

function SingleTodoPage(): JSX.Element {
  const { state } = useLocation();
  const { todo } = state;
  const [progress, setProgress] = React.useState<number>(todo.progress);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return () => {};

    const handleTodoUpdate = (data: { _id: string; progress: number }) => {
      if (data._id !== todo._id) return;
      setProgress(data.progress);
    };

    socket.on('update-todo-progress', handleTodoUpdate);

    return () => {
      socket.off('update-todo-progress', handleTodoUpdate);
    };
  }, [socket]);

  return (
    <div className="p-6">
      <BackButton />
      <div className="flex flex-col gap-4 mt-4">
        <div className="text-2xl font-semibold">{todo.name}</div>
        <div className="flex flex-col">
          <span>Description:</span>
          <span className="font-semibold">{todo.description}</span>
        </div>
        <div className="flex flex-col">
          <span>Progress:</span>
          <div className="flex gap-4 items-center">
            <span>
              {progress}
              %
            </span>
            <Progress value={progress} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleTodoPage;
