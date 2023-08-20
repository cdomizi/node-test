class CustomError extends Error {
  error: string | undefined;
  stack: string | undefined;
  statusCode: number;

  constructor(message?: string, statusCode = 500) {
    super(message);

    Object.setPrototypeOf(this, Error.prototype);
    this.statusCode = statusCode;
  }
}

export default CustomError;
