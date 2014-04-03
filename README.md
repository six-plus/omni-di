omni-di
==

Omni stands for "One More NodeJS dependency Injector". Clean, powerful, and expressive name-based DI for NodeJS


## Install

    npm install omni-di

## Build Status

[![Build Status](https://travis-ci.org/bookalokal/omni-di.png?branch=master)](https://travis-ci.org/bookalokal/omni-di)

## Usage

Fundamentally, omni takes a function, inspects the function's parameter names, and executes the function with the parameters as identified by their names. A common use case is building up routes for use in ExpressJS without having to do explicit `require` calls in every route file:

    // app.js
    var request = require('request');
    var google = require('./routes/google.js');
    di.register('request', request);

    app.get('/google', google.get.inject(di));

    // routes/google.js
    exports.get = function(request) {
      return function(req, res) {
        // Use request module...
      }
    };

## API

### instance.register(name, object)
### instance.inject(function)
    var di = require('omni-di')();

    // Can register and inject dependencies
    di.register("a", 1)

    var fn = di.inject(function (a) {
      return function() {
        return ++a;
      }
    })

    fn() // 2
    fn() // 3
    
### instance.injectAndRegister(name, function)
    // Can register and inject with one function call
    di.injectAndRegister('b', function(a) {
      return a + 1;
    });
 
    di.inject(function(b) {
      console.log(b); // 2 
    });

### instance.get(name)
    // Can register and inject dependencies
    di.register("a", 1);

    di.get('a') // 1

### instance.assemble(array)
    
    // Can assemble your dependency graph
    di.assemble([
      [
        { name : 'fs', obj : require('fs') },
        { name : 'config', obj : { file : 'test.txt' } }
      ],
      [
        {
          name : 'configFile',
          factory : function(fs, config) {
            return JSON.parse(fs.readFileSync(config.file));
          }
      ],
      [
        {
          name : 'doStuffWithConfig',
          factory : function(configFile) {
            // Do things with JSON config
          }
      ]
    ]);

    di.inject(function(fs, configFile) {
      // Do things with fs and configFile
    });

### omni.addInjectToFunctionPrototype
    var omni = require('omni-di');
    // Attaches a convenience helper .inject(di) to Function.prototype
    omni.addInjectToFunctionPrototype();
    var di = omni();

    di.register("a", 1);

    // Use attached .inject() for syntactic sugar
    function(a) {
      console.log("a"); // 1
    }.inject(di);
