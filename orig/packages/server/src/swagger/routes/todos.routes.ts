export const todosRoutes = {
  "/todos": {
    get: {
      summary: "Get all todos",
      tags: [
        "todos",
      ],
      responses: {
        200: {
          description: "Todo List",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/TodoItem",
                },
              },
            },
          },
        },
        500: {
          description: "Unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Create TODO",
      tags: [
        "todos",
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/TodoItem",
            },
            examples: {
              Demo: { $ref: "#/components/examples/todosExample" },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TodoItem",
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
        407: {
          description: "Already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Update TODO",
      tags: [
        "todos",
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/TodoItem",
            },
            examples: {
              Demo: { $ref: "#/components/examples/todosExample" },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successfully updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TodoItem",
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "TODO not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  "/todos/{_id}": {
    delete: {
      summary: "Deletes a TODO",
      tags: [
        "todos",
      ],
      parameters: [
        {
          $ref: "#/components/parameters/_idParam",
        },
      ],
      responses: {
        200: {
          description: "Successfully deleted",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/SuccessResponse",
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "TODO not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Unexpected error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/responses/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
