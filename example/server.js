var http = require('http'),
eloquent = require('..');

var registry = eloquent.EndpointRegistry.createRegistry('myexampleserver');

var controllerObject = {};
controllerObject.name = 'mycontroller';
controllerObject.route = '/mycontroller';
controllerObject.methods = ['get'];
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

var myOtherControllerObject = {};
myOtherControllerObject.name = 'myothercontroller';
myOtherControllerObject.route = '/myothercontroller';
myOtherControllerObject.methods = ['get', 'post'];
myOtherControllerObject.description = 'says you are awesome several times';
myOtherControllerObject.parameters = {
    repetitions: {
        type: 'integer',
        required: true,
        description: 'Number of repetitions'
    }
};
myOtherControllerObject.handler = function(req, res){
    var repetitions = req.query.repetitions;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(Array(repetitions + 1).join(' you are awesome '));
};

var myOtherController = eloquent.Controller.makeController(myOtherControllerObject);

registry.registerController(controller);
registry.registerController(myOtherController);

eloquent.APIDescriber.use(eloquent.SwaggerDescriber);
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