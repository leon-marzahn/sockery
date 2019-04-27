export interface ListenerOptions {
  event: string;
  limit?: boolean;
  encrypted?: boolean;
  tokenProtected?: boolean;
  permissions?: string[];
  middleware: any[]; // Proper typing
}