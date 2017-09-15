# rogger

Rogger is a library that uses our winston-amqplib for sending messages to rabbit, it's mainly used for logging into the elk stack.

# examples
```
require('../lib/index');
//one of the following to connect
Rogger.configure({level:'error'},{url:'amqp://localhost'});
Rogger.configure({level:'error'},{connection:connectionObj});
Rogger.configure({level:'error'},{channel:channelObj});


//Global logger
Rogger.log('info','Global');
Rogger.debug('Global Debug log');
Rogger.info('Global Info log');

//New instance
var blogger = new Rogger.Logger({},{url:'amqp://localhost'});
blogger.log('info','log');
blogger.debug('Debug log');
blogger.info('Info log');
```