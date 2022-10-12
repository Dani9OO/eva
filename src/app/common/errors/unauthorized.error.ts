export class UnauthorizedError extends Error {
  constructor(email: string) {
    super(`Domain ${email.split('@')[1]} is not authorized to use this application`)
  }
}
