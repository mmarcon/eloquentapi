var http = require('http'),
eloquent = require('..');

var registry = eloquent.EndpointRegistry.createRegistry('myexampleserver');

var controller = new eloquent.Controller('mycontroller', '/', 'get', 'says hello world');

controller.expect({
    message: {
        type: 'string',
        required: true,
        description: 'A message from the client'
    }
});

controller.handler(function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello world');
});

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