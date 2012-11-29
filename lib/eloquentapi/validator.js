var url = require('url');

var Validator = {};

function validateParameters(params, qs, inURL){
    var p, pName, inputParameter;
    for(pName in params) {
        if(params.hasOwnProperty(pName)) {
            p = params[pName];
            //Get the passed parameter either
            //from URL or from query string
            if(p.ptype === 'path') {
                inputParameter = inURL[p.position];
            } else {
                inputParameter = qs[pName];
            }

            //If it is required but not there, then it is not valid
            if(p.required && !inputParameter) {
                return false;
            }
            //If it is not required and not there, then it is valid
            if(!p.required && !inputParameter) {
                return true;
            }
            //If it is required or not require and is there, the type has to be valid
            if(!validateType(p.type, pName, inputParameter, qs)) {
                return false;
            }
        }
    }
    return true;
}

function validateType(type, name, value, qs){
    switch (type) {
        case 'string':
            qs[name] = value;
            return value.length > 0;
        case 'number':
        case 'integer':
        case 'float':
        case 'timestamp':
            if(!isNaN(value) && value !== '') {
                qs[name] = +value;
                return true;
            }
            return false;
        case 'date':
            var d = new Date(value);
            if(!isNaN(d.getTime())) {
                qs[name] = d;
                return true;
            } else {
                return false;
            }
    }
}

Validator.validate = function(params, handler){
    return function(){
        //Check params
        var parsedUrl = url.parse(this.req.url, true),
            urlParams = Array.prototype.slice.call(arguments); //Arguments in URL are positional, not named
        if(validateParameters(params, parsedUrl.query, urlParams)){
            this.req.parameters = parsedUrl.query;
            handler(this.req, this.res);
        } else {
            this.res.writeHead(400, { 'Content-Type': 'text/plain' });
            this.res.end('Arguments are wrong!');
        }
    };
};

module.exports = Validator;