/* 
 * gunderscore.js
 * 2013-10-15
 * ----------------------------------------------------------------*/


(function() {

/* `g_` is a function, available for chaining, and exposed on the 
 * global object.
 * ----------------------------------------------------------------*/
	

	// TODO: Make `g_` chainable.
	var g_ = function() { };

	// Expose on the global object.
	this.g_ = g_;


/* Collection functions
 *
 * @Fogus: 'Functional programming is extremely useful for tasks
 * requiring that some operation happen on many items in a
 * collection... The point of a collection-centric view... is to have 
 * a consistent processing idiom so that we can reuse a comprehensive
 * set of functions.'
 * ----------------------------------------------------------------*/


	/* `each` is an immutable iterator. It is the quintessential
	 * example of a functional style. Note that its implementation
	 * uses a `for` loop. Functional programming does not eliminate
	 * imperative concepts; rather, it abstracts them away with a
	 * function. Any loss in performance can be mitigated or
	 * regained by a compressor.
	 */
	g_.each = function(coll, func, that) {
		if ( !g_.exists(coll) ) return;

		var i = 0,
			keys,
			len;

		// Arrays and strings
		if ( g_.isArray(coll) || g_.isString(coll) ) {
			len = coll.length;
			for ( ; i < len; i++) {
				func.call(that, i);
			}
		// Associative arrays
		} else {
			keys = g_.keys(coll);
			len  = keys.length;
			for ( ; i < len; i++) {
				func.call(that, keys[i]);
			}
		}

		return;
	};


	/* `map` calls a function on every value in a collection,
	 * returning an array of results. Notice how it uses `each`; we
	 * are building upon small abstractions.
	 */
	g_.map = function(coll, func, that) {
		var result = [];

		g_.each(coll, function(i) {
			result.push( func.call(that, coll[i]));
		});
		
		return result;
	};


	/* `reduce` calls a function on every value in a collection,
	 * accumulates the result, and returns it.
	 */
	g_.reduce = function(coll, func, that) {
		var result = 0;

		g_.each(coll, function(i) {
			result += func.call(that, coll[i]);
		});

		return result;
	};


	/* `filter` calls a predicate function on each item in a
	 * collection, returning a collection of predicates.
	 */
	g_.filter = function(coll, pred, that) {
		var result = [];

		g_.each(coll, function(i) {
			if ( pred.call(that, coll[i]) ) {
				result.push( coll[i] );
			}
		});

		return result;
	};


	/* `find` takes a collection and a predicate and returns the
	 * first element for which the predicate returns true.
	 */
	g_.find = function(coll, pred, that) {
		return g_.filter(coll, pred, that)[0];
	};


	/* `where` takes an array of objects and returns all of the
	 * objects that match the criteria.
	 */
	g_.where = function(coll, crit) {
		return g_.filter(coll, function(item) {
			for (key in crit) {
				if (crit[key] !== item[key]) {
					return false;
				}
			}
			return true;
		});
	};


	/* `select` takes an array of objects and returns the values of
	 * each object's `key` key.
	 */
	g_.select = function(coll, key) {
		return g_.map(coll, function(item) {
			return item[key];
		});
	};


	/* `invert` takes an associative array and switches the keys and
	 * the values.
	 */
	g_.invert = function(coll) {

		if ( g_.isArray(coll) ) return;

		var result = {},
			keys   = g_.keys(coll),
			vals   = g_.vals(coll);

		g_.each(keys, function(i) {
			result[vals[i]] = keys[i];
		});

		return result;
	};


	/* `not` is the opposite of filter. This is a nice example of
	 * functional programming. `not` relies on `filter` which relies
	 * on `each`. Abstraction upon abstraction. The code is dense,
	 * but elegant.
	 */
	g_.not = function(coll, pred) {
		return g_.filter(coll, function(i) {
			return !pred(i);
		});
	};


	/* `all` takes a collection and a predicate and returns true if
	 * all of the elements return true on the predicate.
	 */
	g_.all = function(coll, pred) {
		return coll.length === filter(coll, pred).length;
	};


	/* `any` takes a collection and a predicate and returns true if 
	 * any of the elements return true on the predicate.
	 */
	g_.any = function(coll, pred) {
		return g_.filter(coll, pred).length > 0;
	};


	/* `tail` creates a new array with the first element from the
	 * input array removed.
	 */
	g_.tail = function(coll) {
		if ( !g_.isArray(coll) ) return;

		return g_.clone(coll).splice(1, coll.length);
	};


	/* `first` selects the first item in a collection.
	 */
	g_.first = function(coll) {
		if ( g_.isArray(coll) || g_.isString(coll) ) return coll[0];
		else return coll[ g_.keys(coll)[0] ];
	};


	/* `max` returns the largest number in an array.
	 */
	g_.max = function(coll, pred) {
		var result = -Infinity; // This acounts for negative numbers.

		if (!g_.exists(coll) || !g_.isArray(coll)) return;

		g_.each(coll, function(i) {
			if ( g_.isGreaterThan(coll[i], result) ) {
				result = coll[i];
			}
		});

		return result;
	};


	/* `min` returns the smallest number in an array.
	 */
	g_.min = function(coll, pred) {
		var result = Infinity; // This acounts for positive numbers.

		if (!g_.exists(coll) || !g_.isArray(coll)) return;

		g_.each(coll, function(i) {
			if ( !g_.isGreaterThan(coll[i], result) ) {
				result = coll[i];
			}
		});

		return result;
	};


/* Utility functions
 * ----------------------------------------------------------------*/


	/* `identity` returns the value it is passed. This abstraction is
	 * surprisingly important because, since functional programming
	 * focuses on functions rather than values (for configuration),
	 * we often need to pass in `identity`.
	 */
	g_.identity = function(val) {
		return val;
	};


	/* `times` executes `func` `n` times.
	 */
	g_.times = function(n, func) {
		g_.each( g_.range(n), func );
		
		return;
	};

	/* `constant` is configurable, higher-order that returns a function
	 * that always returns the input.
	 */
	g_.constant = function(constant) {
		return function() { return constant; };
	};


	/* `range` returns an array of size `stop`, with optional
	 * `start` and `step` parameters.
	 */
	g_.range = function(start, stop, step) {
		var i,
			result = [],
			stop   = arguments[1] || arguments[0],
			start  = (arguments.length >= 2) ? arguments[0] : 0,
			step   = arguments[2] || 1;

		for (i = start; i < stop; i = i+step) {
			result.push(i);
		}

		return result;
	};


	/* `clone` creates a clone of an array or associative array
	 * without mutating the input.
	 */
	g_.clone = function(coll) {
		// TODO: Add `deep copy` functionality.
		if ( g_.isArray(coll) )  return coll.slice(0);
		if ( g_.isObject(coll) ) return g_.extend({}, coll);
	};


	/* `memoize` builds a cache of function calls and return values,
	 * and only executes `func` if it has not done so previously.
	 */
	g_.memoize = function(func) {
		var cache = {};

		return function(/* args */) {
			// This converts `arguments` to a stringified array.
			var args = g_.toArray(arguments).toString();

			if ( !cache[args] ) {
				cache[args] = func.apply(func, arguments);
			}

			return cache[args];
		};
	};


	/* Conversion functions
 	 * ------------------------------------------------------------*/

	/* `toArray` turns array-like objects (`arguments`, strings)
	 * into arrays
	 */
	g_.toArray = function(args) {
		return Array.prototype.slice.call(args, 0);
	};


	/* `toHexidecimal` returns a hexidecimal number, based on the
	 * number `n` applied.
	 */
	g_.toHexidecimal = function(n) {
		return n.toString(16);
	};


	/* Object functions
 	 * ------------------------------------------------------------*/

	/* `keys` takes an associative array and returns array of keys.
	 */
	g_.keys = function(coll) {
		var result = [];

		for (key in coll) {
			result.push(key);
		}

		return result;
	};


	/* `values` takes an associative array and returns array of 
	 * values.
	 */
	g_.vals = function(coll) {
		var result = [];

		for (key in coll) {
			result.push( coll[key] );
		}

		return result;
	};


	/* `extend` merges two or more associative arrays into a target.
	 */
	g_.extend = function(source /*, args */) {
		var prop,
			result = source, // Do not mutate applied object.
			objs = _.tail(arguments);

		g_.each(objs, function(i) {
			for (prop in objs[i]) {
				result[prop] = objs[i][prop];
			}
		});

		return result;
	};


	/* `has` is a convenience wrapper for `hasOwnProperty`.
	 */
	g_.has = function(obj, key) {
		return obj.hasOwnProperty(key);
	};


/* Predicates
 *
 * @Fogus: 'Functions that always return a Boolean value are called
 * "predicates."'
 * ----------------------------------------------------------------*/


	/* `exists` is a boolean function that returns whether an
	 * element exists (is neither `undefined` nor `null`). Loose
	 * equality makes this a one-liner.
	 */
	g_.exists = function(val) {
		return val != null;
	};


	g_.isTruthy = function(val) {
		return val !== false && g_.exists(val);
	};


	g_.isFalsy = function(val) {
		return !g_.isTruthy(val);
	};


	g_.isFunction = function(val) {
		return typeof val === 'function';
	};


	g_.isNumber = function(val) {
		return !isNaN(val);
	};


	g_.isString = function(val) {
		return typeof val === 'string';
	};


	g_.isArray = function(obj) {
		return obj instanceof Array;
	};


	g_.isObject = function(obj) {
		return obj instanceof Object;
	};


	g_.isEqual = function(x, y) {
		return x === y;
	};


	g_.isGreaterThan = function(x, y) {
		return x > y;
	};

})();