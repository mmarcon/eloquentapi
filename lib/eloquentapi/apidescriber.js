//This module does exactly what the name says it does.
//Given an API prepared to be eloquent, it generates the corresponding
//JSON-Schema-Like documentation;
var APIDescriber = {};

APIDescriber.use = function(describer) {
    this.describer = describer;
};

APIDescriber.makeEndpointIndex = function(registry){
    return this.describer.describeAPI(registry);
};

APIDescriber.makeEndpoint = function(controller){
    return this.describer.describeResource(controller);
};

APIDescriber.describe = function(registry){
    var endpointIndexSnapshot = JSON.stringify(APIDescriber.makeEndpointIndex(registry));
    //Support both /doc/ and /doc
    registry.get('/doc/?', function(){
        this.res.writeHead(200, { 'Content-Type': 'application/json' });
        this.res.end(endpointIndexSnapshot);
    });
    registry.controllers.forEach(function(controller){
        registry.get('/doc' + controller.route, function(){
            this.res.writeHead(200, { 'Content-Type': 'application/json' });
            this.res.end(JSON.stringify(APIDescriber.makeEndpoint(controller)));
        });
    });
};

module.exports = APIDescriber;