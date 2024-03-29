var director = require('director'),
    Controller = require('./controller');

var EndpointRegistry = {};

var Registry = function(name){
    this.name = name;
    this.routes = {};
    this.ready = false;
    this.router = null;
    this.controllers = [];
}, R = Registry.prototype;

R.register = function(route, method, handler, description) {
    if(typeof this.routes[route] === 'object' && typeof this.routes[route].method === 'method') {
        throw new Error('Route already registered');
    }
    this.routes[route] = this.routes[route] || {};
    this.routes[route][method] = handler;
    //Description will be shown when the API self-document itself.
    //Store it along with the route. Let's not enforce the presence
    //of description for now. But let's also point that out.
    this.routes[route].description = this.routes[route].description || description || 'This endpoint should really be documented.';
    //Might be helpful
    return this.routes;
};

R.get = function(route, handler, description) {
    return this.register(route, 'get', handler, description);
};

R.post = function(route, handler, description) {
    return this.register(route, 'post', handler, description);
};

R.registerController = function(controller) {
    if (controller instanceof Controller) {
        controller.methods.forEach((function(method){
            this.register(controller.route,
                         method,
                         controller.handlerFn,
                         controller.description);
            //Save a reference to the controller
            this.controllers.push(controller);
        }).bind(this));
        return this.routes;
    }
    else {
        throw new Error('Controller expected');
    }
};

R.init = function(){
    if(this.ready) {
        //Routing things have already been setup.
        //Nothing to do with this instance then.
        return;
    }
    this.router = new director.http.Router(this.routes);
    this.ready = true;
};

R.dispatch = function(req, res, errHandler){
    if(!this.ready) {
        this.init();
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    this.router.dispatch(req, res, errHandler);
};

EndpointRegistry.createRegistry = function(name){
    return new Registry(name);
};

module.exports = EndpointRegistry;
