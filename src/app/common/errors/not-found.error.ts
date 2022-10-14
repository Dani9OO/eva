export class NotFoundError extends Error {
  constructor(
    public entity: string,
    public identifier?: string,
    public value?: string
  ) {
    super(
      `Couldn't find ${entity} ${identifier ? `identified by ${identifier} "${value}"` : ''}.`
    )
  }
}
