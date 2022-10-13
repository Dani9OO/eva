export class UnexpectedError extends Error {
  constructor(action: string) {
    super(`Unexpected error ocurred while ${action}`)
  }
}
