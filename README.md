# Sockery

### Usage:
```typescript
import { Server } from 'sockery';

const server = new Server();
server.addListeners(ADD_YOUR_LISTENERS_HERE);
server.listen(8082);
```

##### How to add listeners:

```typescript
import { Listener, ListenerOptions } from 'sockery';

export class TestListener extends Listener {
  protected getOptions = (): ListenerOptions => {
    event: 'test'
  };
  
  public execute(payload: any, ack: Function): void {
    ack({
      test: payload.test
    });
  }
}

const server = new Server();
server.addListeners([TestListener]); // <-- ToDo: This is not done yet
server.listen(8082);
```