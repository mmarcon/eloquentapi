var url = require('url');

var Validator = {};

function validateQueryString(params, qs){
    var p, pName;
    for(pName in params) {
        if(params.hasOwnProperty(pName)) {
            p = params[pName];
            if(p.required && !qs[pName]) {
                return false;
            }
            if(!validateType(p.type, pName, qs)) {
                return false;
            }
        }
    }
    return true;
}

function validateType(type, name, qs){
    var value = qs[name];
    switch (type) {
        case 'string':
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
        var parsedUrl = url.parse(this.req.url, true);
        if(validateQueryString(params, parsedUrl.query)){
            this.req.query = parsedUrl.query;
            handler(this.req, this.res, arguments);
        } else {
            this.res.writeHead(400, { 'Content-Type': 'text/plain' });
            this.res.end('Arguments are wrong!');
        }
    };
};

module.exports = Validator;