const Main = require('./main');
const winston = require('winston');
class Logger extends Main {
	 constructor(amqpoptions,options) {
		super(options);
         options = options || {};
         options.type = options.type || 'none';
         options.level = options.level || Rogger.level;
         options.source = options.source || Rogger.source;
         options.clevel = options.clevel || Rogger.clevel;
         this.configure(options);
         this.setupLogger(amqpoptions);
    }
    setupLogger(amqpoptions) {
        let config = this.getLoggerConfig(amqpoptions);
        this.logger = new winston.Logger(config);
        this.ready = true;
        this.checkPool();
	}
}
module.exports = Logger;

