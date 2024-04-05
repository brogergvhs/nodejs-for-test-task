import "../../aliases";

import { createServer, Server } from "http";

import cors from "cors";
import express, { Request, Response } from "express";
import { Socket, Server as SocketIOServer } from "socket.io";

import { coreConfig } from "@shared/configs";
import { PATH } from "@shared/constants";

import { swaggerDocs } from "./swagger/index.swagger";

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

export enum SOCKET_EVENTS {
  UPDATE_TODO_PROGRESS = "update-todo-progress",
}

interface ISocketTodoProgressData {
  _id: string;
  progress: number;
}

class Main {
  private todos: ITodo[] = [];

  private io: SocketIOServer|null = null;

  public initialize = async () => {
    try {
      const app = express();

      app.use(cors({ origin: "*" }));
      app.use(express.json());
      swaggerDocs(app);

      app.get(`/${PATH.API}/${PATH.TODOS}`, this.handleGetRequest);

      app.post(`/${PATH.API}/${PATH.TODOS}`, this.handlePostRequest);

      app.put(`/${PATH.API}/${PATH.TODOS}`, this.handlePutRequest);

      app.delete(`/${PATH.API}/${PATH.TODOS}/:_id`, this.handleDeleteRequest);

      const httpServer = createServer(app);
      this.initSocket(httpServer);

      httpServer.listen(coreConfig.port, () => {
        console.log(`Express is running on ${coreConfig.port} port`);
      });
    } catch (error) {
      console.error("[initialize] Critical error occurred. Existing", error);
      process.exit(1);
    }
  };

  private initSocket(server: Server) {
    this.io = new SocketIOServer(server, { cors: { origin: "*" } });

    this.triggerSocketTodoUpdate();

    this.io.on("connection", async (socket: Socket) => this.onClientConnection(socket));
  }

  private triggerSocketTodoUpdate = async () => {
    await this.sleep(10000);

    if (this.todos.length) {
      const randomIndex: number = Math.floor(Math.random() * this.todos.length);
      this.todos[randomIndex].progress += 1;
      console.log("[triggerSocketTodoUpdate] Incremented progress for todo: ", this.todos[randomIndex]);
      this.emitSocketTodoUpdate(this.todos[randomIndex]._id, this.todos[randomIndex].progress);
    } else {
      console.log("[triggerSocketTodoUpdate] No todos");
    }

    this.triggerSocketTodoUpdate();
  };

  private emitSocketTodoUpdate = (_id: string, progress: number) => {
    if (this.io) {
      const data: ISocketTodoProgressData = { _id, progress };
      this.io.emit(SOCKET_EVENTS.UPDATE_TODO_PROGRESS, data);
      console.log("[emitSocketTodoUpdate] Sent todo progress data to all clients", data);
    }
  };

  private onClientConnection = (socket: Socket) => {
    console.log(`[onClientConnection] Socket connected ${socket.id}`);

    socket.on("disconnect", () => console.log(`[onClientConnection] [disconnect] Socket disconnected ${socket.id}`));
  };

  private handleGetRequest = (_: Request, res: Response) => {
    this.processRequest(_, res, () => {
      console.log("[GET] Current todos: ", this.todos);

      res.status(200).send(this.todos);
    });
  };

  private handlePostRequest = (req: Request, res: Response) => {
    this.processRequest(req, res, () => {
      const { _id, description, name, progress } = req.body as ITodo;

      if (!_id) return this.sendBadRequestResponse("_id", res);

      if (!description) return this.sendBadRequestResponse("description", res);

      if (!name) return this.sendBadRequestResponse("name", res);

      if (progress === undefined) return this.sendBadRequestResponse("progress", res);

      const exists = this.todos.find((t) => t._id === _id);
      if (exists) return this.sendConflictResponse("todo", "_id", res);

      const todo: ITodo = { _id, description, name, progress };
      this.todos.push(todo);

      console.log("[POST] Added: ", todo);
      console.log("[POST] Current todos: ", this.todos);

      if (this.io) this.io.emit('todos-updated');

      return res.status(200).send(todo);
    });
  };

  private handlePutRequest = (req: Request, res: Response) => {
    this.processRequest(req, res, () => {
      const { _id, name, description, progress } = req.body as ITodo;
      if (!_id) return this.sendBadRequestResponse("_id", res);

      const targetTodo = this.todos.find((t) => t._id === _id);
      if (!targetTodo) return this.sendNotFoundResponse("todo", res);

      console.log(`[PUT] Updating ${_id} with ${description}|${name}|${progress}`);
      targetTodo.description = description || targetTodo.description;
      targetTodo.name = name || targetTodo.name;
      targetTodo.progress = progress ?? targetTodo.progress;

      console.log(`[PUT] Updated ${_id} with ${description}|${name}|${progress}`);
      console.log("[PUT] Current todos: ", this.todos);

      if (this.io) this.io.emit('todos-updated');

      res.status(200).send(this.todos);
    });
  };

  private handleDeleteRequest = (req: Request, res: Response) => {
    this.processRequest(req, res, () => {
      const { _id } = req.params;
      if (!_id) return this.sendBadRequestResponse("_id", res);

      const targetTodoIndex = this.todos.findIndex((t) => String(t._id) === String(_id));
      if (targetTodoIndex === -1) return this.sendNotFoundResponse("todo", res);

      this.todos.splice(targetTodoIndex, 1);

      console.log(`[DELETE] Removed ${_id} todo`);
      console.log("[DELETE] Todos: ", this.todos);

      if (this.io) this.io.emit('todos-updated');
      const response: IDefaultResponse = { success: true };

      return res.status(200).send(response);
    });
  };

  private sendBadRequestResponse(label: string, res: Response) {
    const data: IErrorResponse = { error: `No "${label}" field provided`, success: false };
    res.status(400).send(data);
  }

  private sendNotFoundResponse(label: string, res: Response) {
    const data: IErrorResponse = { error: `${label} not found`, success: false };
    res.status(404).send(data);
  }

  private sendConflictResponse(label: string, value: string, res: Response) {
    const data: IErrorResponse = { error: `${label} with "${value}" value already exists`, success: false };
    res.status(409).send(data);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => { setTimeout(resolve, ms); });
  }

  private async processRequest(req: Request<any, any, any, any>, res: Response, f: () => any) {
    try {
      await f();
    } catch (err) {
      console.error(`[processRequest] ${req.url} Error: `, err);
      res.status(500).send({
        success: false,
        error: (err as any).message || "Unknown Error",
      });
    }
  }
}

new Main().initialize();
