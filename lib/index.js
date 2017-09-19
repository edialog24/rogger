const winston = require('winston');
require('winston-amqplib');
const Main = require('./main');
const Logger = require('./logger');
class MainLogger extends Main {
    constructor(amqpoptions, options,cb) {
        super(options);
        this.configure(options);
        this.logger = winston;
        this.amqpoptions = amqpoptions || {};
        if (!this.amqpoptions.connection && !this.amqpoptions.channel) {
            winston.transports.WinstonAmqplib.createConnection(this.amqpoptions)
                .then((connection) => {
                    this.amqpoptions.connection = connection;
                    return winston.transports.WinstonAmqplib.setupChannel(this.amqpoptions);
                })
                .then((channel) => {
                    this.amqpoptions.channel = channel;
                    this.setupLogger(amqpoptions);
                    cb(amqpoptions);
                })
                .catch((err) => console.error(err));
        } else {
           this.setupLogger(amqpoptions);
        }
    }
    setupLogger(amqpoptions) {
        this.logger.configure(this.getLoggerConfig(amqpoptions));
        this.ready = true;
        this.checkPool();
    }
}
module.exports = (amqpOpts, opts) => {
    return new Promise((res,rej) => {
        let Rogger = new MainLogger(amqpOpts || {}, opts || {},(amqpoptions) => {
           res(amqpoptions);
        });
        Rogger.Logger = function(options, amqpoptions) {
            //In case you want to override the global amqpoptions
            let amqpOpts = amqpoptions || Rogger.amqpoptions;
            let t = new Logger(amqpOpts,options);
            return t;
        };
        global.Rogger = Rogger;
    });
};




