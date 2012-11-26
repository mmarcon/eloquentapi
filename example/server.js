var http = require('http'),
eloquent = require('..');

var registry = eloquent.EndpointRegistry.createRegistry('myexampleserver');

var controllerObject = {};
controllerObject.name = 'mycontroller';
controllerObject.route = '/';
controllerObject.method = 'get';
controllerObject.description = 'says hello world';
controllerObject.parameters = {
    message: {
        type: 'string',
        required: true,
        description: 'A message from the client'
    }
};
controllerObject.handler = function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello world');
};

var controller = eloquent.Controller.makeController(controllerObject);

registry.registerController(controller);

eloquent.APIDescriber.describe(registry);

var server = http.createServer(function (req, res) {
    registry.dispatch(req, res, function (err) {
        if (err) {
            res.writeHead(404);
            res.end();
        }
    });
});

server.listen(8000);