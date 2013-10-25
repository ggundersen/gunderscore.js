/* 
 * gunderscore.js
 * 2013-10-15
 * ----------------------------------------------------------------*/


var myArray = [1, 2, 3];
var myObject = { name: 'Bob', profession: 'chef', gender: 'male' };
var myObject2 = { name: 'Samantha', profession: 'engineer', gender: 'female' };
var myObject3 = { color: 'blue', shade: 'dark' };
var doubleX = function(x) { return x * x; };


var g_ = (function(g_) {


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
	g_.each = function(coll, func) {
		// Iterate over keys, not the collection itself
		// This handles both arrays and associative arrays
		var i = 0,
			keys = g_.keys(coll),
			len = keys.length;

		for (; i < len; i++) {
			func(i);
		}
	};


	/* `map` calls a function on every value in a collection,
	 * returning a collection of results. Notice how it uses `each`;
	 * we are building upon small abstractions.
	 */
	g_.map = function(coll, func) {
		var result = [];

		g_.each(coll, function(i) {
			result.push( func(coll[i]) );
		});
		
		return result;
	};


	/* `reduce` (or `fold`) calls a function on every value in a
	 * collection, accumulates the result, and returns it.
	 */
	g_.reduce = function(coll, func) {
		var result = 0;

		g_.each(coll, function(i) {
			result += func(coll[i]);
		});

		return result;
	};


	/* `invert` takes an associative array and switches the keys and
	 * the values.
	 */
	g_.invert = function(coll) {
		var result = {},
			keys = g_.keys(coll),
			values = g_.values(coll);

		g_.each(keys, function(i) {
			result[values[i]] = keys[i];
		});

		return result;
	};


	/* `filter` calls a predicate function on each item in a
	 * collection, returning a collection of predicates
	 */
	g_.filter = function(coll, pred) {
		var result = [];

		g_.each(coll, function(i) {
			if ( pred(coll[i]) ) {
				result.push( coll[i] );
			}
		});

		return result;
	};


	/* `find` takes a collection and a predicate and returns the
	 * first element for which the predicate returns true
	 */
	g_.find = function(coll, pred) {
		return g_.filter(coll, pred)[0];
	};


	/* `where` takes an array of objects and returns all of the
	 * objects that match the criteria.
	 */
	g_.where = function() { };


	/* `not` is the opposite of filter; this feels like it could be
	 * greatly optimized.
	 */
	g_.not = function(coll, pred) {
		var result = [];

		g_.each(coll, function(i) {
			if ( !pred(coll[i]) ) {
				result.push( coll[i] );
			}
		});

		return result;
	};


	/* `tail` creates a new array with the first element from the
	 * input array removed.
	 */
	g_.tail = function(coll) {
		return g_.clone(coll).splice(1, coll.length);
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


	/* `max` returns the largest number in an array.
	 */
	g_.max = function(coll) {
	 	var result = 0;

		g_.each(coll, function(i) {
			if ( g_.isGreaterThan(coll[i], result) ) {
				result = coll[i];
			}
		});

		return result;
	};


	/* `max` returns the largest number in an array.
	 */
	g_.max = function(coll, func) {
	 	var result = 0;

		g_.each(coll, function(i) {
			if ( func(coll[i]) ) {
				result = coll[i];
			}
		});

		return result;
	};


/* Utility
 * ----------------------------------------------------------------*/


	/* `identity` returns the value it is passed. This abstraction is
	 * surprisingly important because, since functional programming
	 * focuses on functions rather than values (for configuration),
	 * we often need to pass in `identity`.
	 */
	g_.identity = function(val) {
		return val;
	};


	/* `constant` is configurable higher-order that returns a function
	 * that always returns the input.
	 */
	g_.constant = function(constant) {
		return function() {
			return constant;
		};
	};


	/* `range` returns an array of N size, with a configurable start,
	 * and stop
	 */
	g_.range = function(N /*, start, step */) {
		var result = [],
			start = (arguments[1]) ? arguments[1] : 0,
			step = (arguments[2]) ? arguments[2] : 1;

		for (var i = start; i < N; i = i+step) {
			result.push(i);
		}

		return result;
	};


	/* `clone` creates a clone of an array without mutating it.
	 */
	g_.clone = function(coll) {
		return coll.slice(0);
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
	g_.values = function(coll) {
		var result = [];

		for (key in coll) {
			result.push( coll[key] );
		}

		return result;
	};


	/* `extend` merges two or more associative arrays into a target.
	 */
	g_.extend = function(result /*, args */) {
		var prop,
			objs = _.tail(arguments);

		g_.each(objs, function(i) {
			for (prop in objs[i]) {
				result[prop] = objs[i][prop];
			}
		});

		return result;
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
		return (val !== false) && g_.exists(val);
	};


	g_.isFunction = function(val) {
		return (typeof val === 'function');
	};


	g_.isNumber = function(val) {
		return !isNaN(val);
	};


	g_.isString = function(val) {
		return (typeof val === 'string');
	};


	g_.isEqual = function(x, y) {
		return x === y;
	};


	g_.isGreaterThan = function(x, y) {
		return x > y;
	};



	return g_;

})({});