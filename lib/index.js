const winston = require('winston');
require('winston-amqplib');
const Main = require('./main');
const Logger = require('./logger');
class MainLogger extends Main {
    constructor(opts) {
        super(opts);
        this.logger = winston;
    }
}
const Rogger = global.Rogger = new MainLogger();

Rogger.Logger = function(opts, amqpoptions){
    opts = opts || {};
    opts.type = opts.type || 'none';
    opts.level = opts.level || 'info';
    let t = new Logger();
    t.configure(opts,amqpoptions);
    return t;
};

module.exports = Rogger;