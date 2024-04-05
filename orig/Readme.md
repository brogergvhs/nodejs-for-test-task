# Server set up
## Prerequisites
- To run the server you need to have Docker installed and running on your machine
## Steps
- run `npm run up` to run the server
- (Optional) run `logs:server` if you want to see server logs
- open `http://localhost:8000/api-docs` to see the Swagger
- use `http://localhost:8000/api` for all requests
## Notes
- the todo list is stored in-memory, if you restart the server, it will be reset to empty array
- you have 4 endpoits, basically CRUD for todo that you should use in your app
- you should connect to the socket.io (same port as express server). 
- each 10 seconds the server updates one of the todo items and sends it to all socket clients
## Interfaces
- Swagger UI has all schemas that you may need to use endpoints
- For socket there's separate enum with events and data interface:
```
export enum SOCKET_EVENTS {
  UPDATE_TODO_PROGRESS = "update-todo-progress",
}

interface ISocketTodoProgressData {
  _id: string;
  progress: number;
}
```
- You can see all interfaces and codebase in `packages/server/src/main.ts`, but here's the main ones you'll need:
```
interface ITodo {
  _id: string;
  name: string;
  description: string;
  progress: number;
}

interface IDefaultResponse {
  success: boolean;
}

interface IErrorResponse extends IDefaultResponse {
  error: string,
}
```

