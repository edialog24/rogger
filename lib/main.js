const winston = require('winston');
const uuidV4 = require('uuid/v4');
const os = require('os');
class Main {
    constructor(options) {
        this.ready = false;
        this.pooled = [];
    }
    configure(options,amqpoptions) {
            options = options || {};
            this.level = options.level || 'info';
            this.clevel = options.clevel || this.level;
            this.correlationId = options.correlationId || (new Date().getTime()) + '_' + uuidV4();
            this.source = options.source;
            this.hostname = os.hostname();
            this.type = options.type;
    }
    getLoggerConfig(amqpoptions){
        return {
            transports: [
                new winston.transports.Console(
                    {
                        level: this.clevel,
                        timestamp: true,
                        handleExceptions: true,
                        humanReadableUnhandledException: true,
                        formatter:(output) => {
                            const meta = Object.keys(output.meta).map((key) => `  ${key}: ${output.meta[key]}\n`);

                            return `${new Date().toISOString()} - [${output.level.toUpperCase()}] ${output.message}\n{hostname:${this.hostname}, source:${this.source}, type:${this.type}, correlationId:${this.correlationId}}\n ${meta}`;
                        }
                    }),
                new winston.transports.WinstonAmqplib({
                    level: this.level,
                    colorize: false,
                    timestamp: true,
                    type:this.type,
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
        };

    }
    checkPool() {
        //Need to pool since we don't know if we have created the connection yet
        if(this.ready === true) {
            for (let i = 0; i < this.pooled.length; i++) {
                this.send(this.pooled[i]);
                this.pooled.splice(i--, 1);
            }
        }
    }
    send(sendObj) {
        if(!sendObj.meta) {
            this.logger.log(sendObj.level,sendObj.msg);
        } else if(!sendObj.cb) {
            this.logger.log(sendObj.level, sendObj.msg,sendObj.meta);
        } else {
            this.logger.log(sendObj.level, sendObj.msg,sendObj.meta,sendObj.cb);
        }
    }
    log(level,msg,meta,cb) {
        this.pooled.push({level,msg,meta,cb});
        this.checkPool();
    }
	info(msg,meta,cb) {
        this.pooled.push({level:'info',msg,meta,cb});
        this.checkPool();
    }
	debug(msg,meta,cb) {
        this.pooled.push({level:'debug',msg,meta,cb});
        this.checkPool();
    }
    error(msg,meta,cb)
    {
        if (msg instanceof Error)
        {
            let err = msg;
            msg = msg.toString();
            meta = { stack: err.stack.toString() };
        }
        this.pooled.push({level:'error',msg,meta,cb});
        this.checkPool();
    }

}
module.exports = Main;