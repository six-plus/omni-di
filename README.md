omni-di
==

Omni stands for "One More NodeJS dependency Injector"


## Install

    npm install omni-di

## Travis

    https://travis-ci.org/bookalokal/omni-di

## Usage

    var di = require('omni.di')();

    // Can register and inject dependencies
    di.register("a", 1)

    var fn = di.inject(function (a) {
      return function() {
        return ++a;
      }
    })

    fn() // 2
    fn() // 3
    
    // Can register and inject with one function call
    di.injectAndRegister('b', function(a) {
      return a + 1;
    });
    
    di.inject(function(b) {
      console.log(b); // 2 
    });
    
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
