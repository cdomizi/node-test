class CustomError extends Error {
  stack: string | undefined;
  statusCode: number;

  constructor(message?: string, statusCode = 500) {
    super(message);

    Object.setPrototypeOf(this, Error.prototype);
    this.statusCode = statusCode;
  }

  getErrorMessage() {
    return "Unexpected Error: " + this.message;
  }
}

export default CustomError;
