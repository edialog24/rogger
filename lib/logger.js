const Main = require('./main');
const winston = require('winston');
class Logger extends Main {
	 constructor(amqpoptions,options) {
		super(options);
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

