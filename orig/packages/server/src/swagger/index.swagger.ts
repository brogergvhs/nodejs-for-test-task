import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import { PATH } from "@shared/constants";

import { responses, parameters } from "./components";
import { examples } from "./examples";
import { paths } from "./routes";
import { schemas } from "./schemas";

export const swagger = {
  openapi: "3.0.3",
  info: {
    title: "REST API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/api",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "todos",
      description: "TODO API",
    },
  ],
  paths,
  components: {
    schemas,
    responses,
    examples,
    parameters,
  },
};

export const swaggerDocs = (app: Express) => {
  // Swagger page
  app.use(`/${PATH.API_DOCS}`, swaggerUi.serve, swaggerUi.setup(swagger));

  // Docs in JSON format
  app.get(`/${PATH.DOCS_JSON}`, (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger);
  });
};
