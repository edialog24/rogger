require('../lib/index')({url:'amqp://localhost'},{level:'debug'})
    .then((amqp) => {
        Rogger.log('info','Global logger');
        let blogger = new Rogger.Logger();
        blogger.log('info','Custom logger');
        // Printing error exception with error stack
        let err = new Error("Error message");
        Rogger.error(err);
        // The explicit alternative (same result) is:
        Rogger.error(err.message, {error: err.stack.toString()});

    })
    .catch((err) => {console.error(err);});
