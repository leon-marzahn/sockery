import { Middleware } from './middleware';

export interface ListenerOptions {
  event: string;
  limit?: boolean;
  encrypted?: boolean;
  tokenProtected?: boolean;
  middleware?: Middleware[];
}