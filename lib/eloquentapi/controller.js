var Validator = require('./validator');

var Controller = function(name){
    this.name = name;
};

var C = Controller.prototype;

C.expect = function(parameters){
    this.parameters = parameters;
};

C.handler = function(handler){
    return Validator.validate(this.parameters, handler);
};

module.exports = Controller;

