export const parameters = {
  _idParam: {
    in: "path",
    name: "_id",
    description: "_id of the TODO item",
    required: true,
    schema: {
      type: "string",
    },
    example: "123",
  },
};
