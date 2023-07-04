import { HttpStatus } from "@nestjs/common";

export function SuccessResponse(
  data: any,
  message: string,
  statusCode: HttpStatus,
) {
  return {
    data,
    message,
    statusCode,
    description: "Request completed Successfully without any errors!",
  };
}

export function ErrorResponse(
  error: any,
  message: string,
  statusCode: HttpStatus,
) {
  return {
    error,
    message,
    statusCode,
    description: `Request failed with error code ${statusCode}!`,
  };
}
