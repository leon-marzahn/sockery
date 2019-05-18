# Sockery [![npm version](https://badge.fury.io/js/sockery.svg)](https://badge.fury.io/js/sockery) [![Build Status](https://travis-ci.org/PsychoPflanze/sockery.svg?branch=master)](https://travis-ci.org/PsychoPflanze/sockery) [![codecov](https://codecov.io/gh/PsychoPflanze/sockery/branch/master/graph/badge.svg)](https://codecov.io/gh/PsychoPflanze/sockery)

### Usage:
```
import { Server } from 'sockery';

const server = new Server();
server.addListeners(ADD_YOUR_LISTENERS_HERE);
server.listen(8082);
```

##### How to add listeners:

```
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
server.addListeners([new TestListener]);
server.listen(8082);
```