/**
 *  tests.js
 *
 *  Created on: November 9, 2013
 *      Author: Valeri Karpov
 *
 *  Unit tests. Run using nodeunit (npm install nodeunit -g).
 *
 */

var DependencyInjector = require('./dependency_injector.js').DependencyInjector;

exports.test = {
  setUp : function(callback) {
    this.di = DependencyInjector();
    callback();
  },
  testRegister : function(test) {
    this.di.register("a", 1);
    test.equals(1, this.di.get("a"));
    test.done();
  },
  testInject : function(test) {
    this.di.register("a", 2);

    var result = 0;
    this.di.inject(function(a) {
      result = a;
    });

    test.equals(2, result);
    test.done();
  },
  testInjectAndRegister : function(test) {
    this.di.register("a", 3);

    this.di.injectAndRegister("b", function(a) {
      return a + 1;
    });

    test.equals(3, this.di.get("a"));
    test.equals(4, this.di.get("b"));

    this.di.inject(function(a, b) {
      test.equals(3, a);
      test.equals(4, b);
      test.done();
    });
  },
  testAssemble : function(test) {
    var levels = [
      [
        { name : 'a', obj : 1 },
        { name : 'b', factory : function() { return 2; } }
      ],
      [
        { name : 'c', factory : function(a, b) { return a + b; } }
      ]
    ];

    this.di.assemble(levels);
    this.di.inject(function(a, b, c) {
      test.equals(1, a);
      test.equals(2, b);
      test.equals(3, c);
      test.done();
    });
  },
  testUnregisteredParam : function(test) {
    try {
      this.di.inject(function(a) {
        return 1;
      });
      test.ok(false);
    } catch(e) {
      test.ok(true);
    }

    test.done();
  },
  testRegisterAll : function(test) {
    this.di.registerAll({ a : 1, b : 2 });
    this.di.inject(function(a, b) {
      test.equals(a, 1);
      test.equals(b, 2);
      test.done();
    });
  }
};