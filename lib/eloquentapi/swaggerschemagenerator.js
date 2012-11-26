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
    return Object.create(Object.getPrototypeOf(template), Object.getOwnPropertyNames(template).reduce(function(memo, name) {
        return (memo[name] = Object.getOwnPropertyDescriptor(template, name)) && memo;
    }, {}));
}

function describeResource(controller) {

}

function describeAPI(registry) {

}

SwaggerSchemaGenerator.describeAPI = describeAPI;

module.exports = SwaggerSchemaGenerator;