var epregistry = require('../lib/eloquentapi/endpointregistry'),
    director = require('director');
describe('Endpoint registry', function(){
    it('Creates a registry', function(){
        var registry = epregistry.createRegistry('foo');
        expect(registry.ready).toBe(false);
        expect(registry.router).toBe(null);
        expect(registry.routes).toEqual({});
    });
    it('Register a GET route with the registry', function(){
        var registry = epregistry.createRegistry('foo-get'),
            handler = function(){},
            routes = registry.get('/fooget', handler, 'My Foo Endpoint');
        expect(routes).toEqual({'/fooget': {get: handler, description: 'My Foo Endpoint'}});
    });
    it('Register a POST route with the registry', function(){
        var registry = epregistry.createRegistry('foo-post'),
            handler = function(){},
            routes = registry.post('/foopost', handler, 'My Foo Endpoint');
        expect(routes).toEqual({'/foopost': {post: handler, description: 'My Foo Endpoint'}});
    });
    it('Initializes the router object', function(){
        var registry = epregistry.createRegistry('foo'),
            handler = function(){};
            registry.post('/foopost', handler, 'My Foo Endpoint');
            registry.get('/get', handler, 'My Foo Endpoint');
            registry.init();

            expect(registry.router).not.toBe(undefined);
            expect(registry.router instanceof director.http.Router).toBe(true);
    });
});