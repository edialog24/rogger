const Main = require('./main');
const winston = require('winston');
class Logger extends Main {
	 constructor(opts) {	
		super(opts);
		this.logger = new winston.Logger(opts);   		
    }	
}
module.exports = Logger;

