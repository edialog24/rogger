const winston = require('winston');
const uuidV4 = require('uuid/v4');
const os = require('os');
class Main {
    constructor(options) {
    }
    configure(options,amqpoptions) {
        options = options || {};
        this.level = options.level || 'info';
        this.correlationId = options.correlationId || (new Date().getTime()) + '_' + uuidV4();
        this.source = options.source;
        this.hostname = os.hostname();
        this.type = options.type;
        this.logger.configure({
            transports: [
                new winston.transports.Console(
                    {
                        level: 'info',
                        colorize: true,
                        timestamp: true,
                        handleExceptions: true,
                        humanReadableUnhandledException: true
                    }),
                new winston.transports.WinstonAmqplib({
                    level: this.level,
                    colorize: false,
                    timestamp: true,
                    type:options.type,
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                    formatter:(output) => {
                        return JSON.stringify({
                            level: output.level,
                            timestamp: new Date().toISOString(),
                            meta: output.meta,
                            correlationId: this.correlationId,
                            source: this.source,
                            hostname: this.hostname,
                            message: output.message,
                            type: this.type
                        });
                    }
                },amqpoptions)
            ]
        });
    }
    log(level,msg,meta,cb) {
        if(!meta)
            this.logger.log(level,msg);
        else if(!cb)
            this.logger.log(level,msg,meta);
        else
            this.logger.log(level,msg,meta,cb);
    }
	debug(msg) {
        this.logger.log('debug',msg);
    }
    error(a,b,c,d){
        this.logger.error(a,b,c,d);
    }
}
module.exports = Main;