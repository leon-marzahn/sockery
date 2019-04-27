import * as naclutil from 'tweetnacl-util';

export abstract class Key {
  protected readonly value: string;

  public constructor(key: string) {
    this.value = key;
  }

  public toString(): string {
    return this.value;
  }

  public toBuffer(): Uint8Array {
    return naclutil.decodeBase64(this.value);
  }
}