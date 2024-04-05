export const todoSchema = {
  TodoItem: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        example: "123",
      },
      name: {
        type: "string",
        example: "The name of todo item",
      },
      description: {
        type: "string",
        example: "The description of the todo item",
      },
      progress: {
        type: "number",
        example: 50,
      },
    },
  },
};
