/**
 *  index.js
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

module.exports = require('./dependency_injector.js').DependencyInjector;
