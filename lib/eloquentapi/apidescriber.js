var url = require('url'),
    https = require('https');
//This module does exactly what the name says it does.
//Given an API prepared to be eloquent, it generates the corresponding
//JSON-Schema-Like documentation;
var APIDescriber = {};

function getBasePath(req) {
    return url.format({
        // QUESTION [telendt]: is there a better way of checking request protocol?
        protocol: req.headers["x-forwarded-proto"] ||
            (req.connection.server instanceof https.Server ? "https" : "http"),
        host: req.headers.host
    });
}

APIDescriber.use = function(describer) {
    this.describer = describer;
};

APIDescriber.makeEndpointIndex = function(registry, basePath){
    return this.describer.describeAPI(registry, basePath);
};

APIDescriber.makeEndpoint = function(controller, basePath){
    return this.describer.describeResource(controller, basePath);
};

APIDescriber.describe = function(registry){
    var endpointIndexSnapshot =
    //Support both /doc/ and /doc
    registry.get('/doc/?', function(){
        this.res.writeHead(200, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(APIDescriber.makeEndpointIndex(registry, getBasePath(this.req))));
    });
    registry.controllers.forEach(function(controller){
        registry.get('/doc' + controller.route, function(){
            this.res.writeHead(200, { 'Content-Type': 'application/json' });
            this.res.end(JSON.stringify(APIDescriber.makeEndpoint(controller, getBasePath(this.req))));
        });
    });
};

module.exports = APIDescriber;