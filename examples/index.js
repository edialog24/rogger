require('../lib/index')({url:'amqp://localhost'},{level:'debug'})
    .then((amqp) => {
        Rogger.log('info','Global logger');
        let blogger = new Rogger.Logger();
        blogger.log('info','Custom logger');
    })
    .catch((err) => {console.error(err);});
