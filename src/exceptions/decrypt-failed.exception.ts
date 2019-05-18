export class DecryptFailedException extends Error {
  constructor() {
    super('Could not decrypt message');
  }
}