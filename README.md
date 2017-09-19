# rogger

Rogger is a library that uses our winston-amqplib for sending messages to rabbit, it's mainly used for logging into the elk stack.

# example
```
//Instantiate rogger
require('rogger')({url:'amqp://localhost' || connection:'rabbitconnection' || channel:'rabbitchannel'},{
level:'debug',
type:'customtype',
clevel:'console level, defaults to level if not specified',
source:'Define a source so you can recognise the logs'
})
.then((amq) => {
        Rogger.log('info','Global info');
        Rogger.debug('Global debug');
        Rogger.info('Global info');
        Rogger.error('Global error');
        //New instance, Rogger.Logger can also specify another object after the first to specify custom rabbit connections
        const rogger = new Rogger.Logger({level: 'debug', type: 'express'});
        rogger.log('info','info message');
        rogger.debug('debug message');
        rogger.info('info','info message');
        rogger.error('error','error message');

    })
    .catch((err) => console.error(err));
```