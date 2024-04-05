export enum ENVIRONMENT {
  LOCAL="local",
  DEV="dev",
  PROD="prod"
}

export enum APP_NAME {
  SERVER="server"
}

export enum ESSENTIAL_SERVICE_NAME {
  MONGODB="MongoDBService",
  RABBITMQ="RabbitMqService"
}

export interface ICoreConfig {
  port: number;
  env: ENVIRONMENT;
  appName: string;
  allowedNodeIp: string;
}
