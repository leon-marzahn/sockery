export class EventExistsException extends Error {
  constructor() {
    super('This event already exists');
  }
}