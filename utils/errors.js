export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export function throwError(error) {
  const messages = error.details.map(detail => detail.message)
  throw new BadRequestError(messages.join('\n'))
}
