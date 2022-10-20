export class UnexpectedError extends Error {
  public constructor(action: string) {
    super(`Unexpected error ocurred while ${action}`)
  }
}
