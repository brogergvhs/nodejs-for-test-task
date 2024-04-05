export const responses = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      error: {
        type: "string",
        example: "Error text",
      },
    },
    required: [
      "success", "error",
    ],
  },
  SuccessResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
    },
    required: [
      "success",
    ],
  },
};
