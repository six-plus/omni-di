omni-di
==

Omni stands for "One More NodeJS dependency Injector"


## Install

    npm install omni-di


## Usage

    var di = require('omni.di')();

    di.register("a", 1)

    var fn = di.inject(function (a) {
      return function() {
        return ++a;
      }
    })

    fn() // 2
    fn() // 3
