var director = require('director'),
    Controller = require('./controller');

var EndpointRegistry = {};

var Registry = function(name){
    this.name = name;
    this.routes = {};
    this.ready = false;
    this.router = null;
}, R = Registry.prototype;

R.register = function(route, method, handler, description) {
    if(typeof this.routes[route] === 'object') {
        throw new Error('Route already registered');
    }
    this.routes[route] = {};
    this.routes[route][method] = handler;
    //Description will be shown when the API self-document itself.
    //Store it along with the route. Let's not enforce the presence
    //of description for now. But let's also point that out.
    this.routes[route].description = description || 'This endpoint should really be documented.';
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
        return this.register(controller.route,
                             controller.method,
                             controller.handler,
                             controller.description);
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
    this.router.dispatch(req, res, errHandler);
};

EndpointRegistry.createRegistry = function(name){
    return new Registry(name);
};

module.exports = EndpointRegistry;
