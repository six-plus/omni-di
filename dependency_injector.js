/**
 *  dependency_injector.js
 *
 *  Created on: November 9, 2013
 *      Author: Valeri Karpov
 *
 *  Exposes a simple yet flexible API for constructing dependencies in NodeJS:
 *
 *  1) register: Takes a name and object. The inject() function will then pass
 *               that object as a parameter to functions which take `name` as
 *               a parameter.
 *  2) inject: Given a factory function, assembles the parameters necessary for
 *             that function, calls it, and returns the result. If the
 *             parameter name hasn't been registered, throw an exception.
 *  3) injectAndRegister: Given a name and a factory function, register the
 *                        result of calling inject on the factory to `name`.
 *  4) get: Return the object registered to the given name.
 *  5) assemble: Given a list of lists, run injectAndRegister on each element
 *               in order. Can think of this function as building up a
 *               dependency graph with each list representing levels of a
 *               topologically sorted DAG.
 *
 */

var getParameterNames = require('get-parameter-names');

exports.DependencyInjector = function() {
  var dependencies = {};

  var _this = {
    register : function(name, obj) {
      dependencies[name] = obj;
      return _this;
    },
    registerAll : function(obj) {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          dependencies[key] = obj[key];
        }
      }
    },
    inject : function(factory) {
      var params = getParameterNames(factory);

      var factoryDependencies = [];
      for (var i = 0; i < params.length; ++i) {
        if (!dependencies.hasOwnProperty(params[i])) {
          throw new ReferenceError('`' + params[i] + '` has not been registered' +
            ' as a dependency');
        }

        factoryDependencies.push(dependencies[params[i]]);
      }

      return factory.apply(factory, factoryDependencies);
    },
    injectAndRegister : function(name, factory) {
      _this.register(name, _this.inject(factory));
    },
    get : function(name) {
      return dependencies[name];
    },
    // Given a dependency graph in topological order, assemble it.
    assemble : function(levels) {
      for (var i = 0; i < levels.length; ++i) {
        var level = levels[i];
        for (var j = 0; j < level.length; ++j) {
          if (level[j].factory) {
            _this.injectAndRegister(level[j].name, level[j].factory);
          } else if (level[j].obj) {
            _this.register(level[j].name, level[j].obj);
          }
        }
      }
    }
  }

  return _this;
};

/* Optional syntactic sugar, because fn.inject(di) is easier to read than
 * di.inject(fn) if you have a lot of functions and one depedency injector
 */
exports.DependencyInjector.addInjectToFunctionPrototype = function() {
  Function.prototype.inject = function(injector) {
    return injector.inject(this);
  };
};
