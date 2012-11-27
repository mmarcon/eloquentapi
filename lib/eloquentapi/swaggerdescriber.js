var SwaggerSchemaGenerator = {};

var baseObject = {
    apiVersion: "0.1.0",
    swaggerVersion: "1.1",
    basePath: null,
    resourcePath: null,
    apis: [],
    models: {}
},
apiBaseObject = {
    path: null,
    description: null,
    operations: []
},
operationBaseObject = {
    httpMethod: null,
    summary: null,
    notes: null,
    responseClass: null,
    nickname: null,
    parameters: []
},
resourcesBaseObject = {
    apiVersion: "0.1.0",
    swaggerVersion: "1.1",
    basePath: null,
    apis: []
};

function clone(template) {
    return JSON.parse(JSON.stringify(template));
}

function mapParameter(paramName, param) {
    return {
        name: paramName,
        description: param.description,
        paramType: "query",
        dataType: param.type,
        required: param.required,
        allowMultiple: false
    };
}

function describeResource(controller, basePath) {
    var methods = controller.methods,
        schema = clone(baseObject),
        api = clone(apiBaseObject);

    schema.basePath = basePath;
    schema.resourcePath = controller.route;

    api.path = controller.route;
    api.description = controller.description;

    methods.forEach(function (m) {
        var operation = clone(operationBaseObject), p;
        operation.httpMethod = m;
        operation.summary = controller.description;
        operation.notes = controller.notes;
        operation.responseClass = null;
        operation.nickname = controller.route.nickname || controller.route.replace(/\//g, "");
        for (p in controller.parameters) {
            if (controller.parameters.hasOwnProperty(p)) {
                operation.parameters.push(mapParameter(p, controller.parameters[p]));
            }
        }
        api.operations.push(operation);
    });

    schema.apis.push(api);

    return schema;
}

function describeAPI(registry, basePath) {
    var resources = clone(resourcesBaseObject), r;
    resources.basePath = basePath;

    for (r in registry.routes) {
        if (registry.routes.hasOwnProperty(r)) {
            //hack :(
            if(r.match(/\/doc/)) {
                continue;
            }
            resources.apis.push({
                path: '/doc' + r,
                description: registry.routes[r].description
            });
        }
    }

    return resources;
}

SwaggerSchemaGenerator.describeResource = describeResource;
SwaggerSchemaGenerator.describeAPI = describeAPI;

module.exports = SwaggerSchemaGenerator;