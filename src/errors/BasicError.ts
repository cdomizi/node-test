class BasicError extends Error {
  stack: string | undefined;
  statusCode: number | undefined;

  constructor(message?: string, statusCode?: number) {
    super(message);

    Object.setPrototypeOf(this, Error.prototype);
    this.statusCode = statusCode;
  }

  getErrorMessage() {
    return "Unexpected Error: " + this.message;
  }
}

export default BasicError;
