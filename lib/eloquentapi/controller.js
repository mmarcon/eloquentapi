var Validator = require('./validator');

var Controller = function(name, route, method, description){
    this.name = name;
    this.route = route;
    this.method = method;
    this.description = description;
};

var C = Controller.prototype;

C.expect = function(parameters){
    this.parameters = parameters;
};

C.handler = function(handler){
    this.handler = Validator.validate(this.parameters, handler);
    return this.handler;
};

module.exports = Controller;

