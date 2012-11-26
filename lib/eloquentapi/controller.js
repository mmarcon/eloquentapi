var Validator = require('./validator');

var Controller = function(name, route, methods, description){
    this.name = name;
    this.route = route;
    this.methods = methods;
    this.description = description;
    //Default handler, just to remind devs that there is no handler.
    this.handlerFn = function(){
        this.res.writeHead(501, { 'Content-Type': 'text/plain' });
        this.res.end(name + ' not implemented');
    };
};

var C = Controller.prototype;

C.expect = function(parameters){
    this.parameters = parameters;
};

C.handler = function(handler){
    this.handlerFn = Validator.validate(this.parameters, handler);
    return this.handlerFn;
};

Controller.makeController = function(object) {
    if (typeof object.methods === 'string') {
        object.methods = [object.methods];
    }
    var controller = new Controller(object.name, object.route, object.methods, object.description);
    if (object.parameters) {
        controller.expect(object.parameters);
    }
    if (typeof object.handler === 'function') {
        controller.handler(object.handler);
    }
    return controller;
};

module.exports = Controller;

