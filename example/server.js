var http = require('http'),
eloquent = require('..');

var registry = eloquent.EndpointRegistry.createRegistry('myexampleserver');
eloquent.APIDescriber.describe(registry);

var controller = new eloquent.Controller('mycontroller');
controller.expect({
    message: {
        type: 'string',
        required: true,
        description: 'A message from the client'
    }
});

var handler = controller.handler(function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello world');
});

registry.get('/', handler, 'says hello world');

var server = http.createServer(function (req, res) {
    registry.dispatch(req, res, function (err) {
        if (err) {
            res.writeHead(404);
            res.end();
        }
    });
});

server.listen(8000);