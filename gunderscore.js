/* 
 * gunderscore
 * 2013-10-15
 * --------------------------------------------------------------- */


(function() {


	// The `gunderscore` object
	this.g_ = g_ = {};


/* Collection functions
 *
 * @Fogus: 'Functional programming is extremely useful for tasks
 * requiring that some operation happen on many items in a
 * collection... The point of a collection-centric view... is to have 
 * a consistent processing idiom so that we can reuse a comprehensive
 * set of functions.'
 * --------------------------------------------------------------- */


	// `each` is an immutable iterator. It is the quintessential
	// example of a functional style. Note that it uses a `for` loop.
	// Functional programming does not eliminate imperative concepts;
	// rather, it abstracts them away with functions. And any loss in
	// performance can be mitigated or regained by a compressor.
	var each = g_.each = function(coll, func) {
		if ( !exists(coll) ) return;

		var i = 0,
			keys,
			len;

		if ( isIndexed(coll) ) {
			len = coll.length;
			for ( ; i < len; i++) {
				// Use call to allow for function context
				// configuration.
				func(coll[i], i);
			}
		} else {
			ks = keys(coll);
			len  = ks.length;
			for ( ; i < len; i++) {
				func(coll[ks[i]], i);
			}
		}

		return;
	};


	// `map` calls a function on every value in a collection,
	// returning an array of results. Notice how it uses `each`.
	// Functional programming builds bigger abstractions from
	// smaller abstractions.
	var map = g_.map = function(coll, func) {
		var result = [];

		// Note that the anonymous function passed to `each` adheres
		// to `each`'s contract, namely it takes a parameter `item`
		// which is just `coll[i]` for the appropriate iteration.
		//
		// Also note that `map` mutates a variable, `result`. In this
		// way, `gunderscore` (and `underscore`) fails the definition
		// of a purely functional library. Rather, it abstracts away
		// mutation. As @Fogus says: 'As long as no one knows you've
		// mutated a variable then does it matter? I'd say no.'
		each(coll, function(item) {
			result.push( func(item) );
		});
		
		return result;
	};


	// `reduce` returns a single result from a list of values. Note
	// that `reduce` is recursive. It calls `func` for each item in
	// `coll` and assigns that as the new value of `seed`. If `func`
	// does not reassign seed--try passing in `identity`--then
	// `reduce` simply returns `seed`. See `legacyReduce`.
	var reduce = g_.reduce = function(coll, func, seed) {
		var noSeed = arguments.length < 3;

		each(coll, function(item, i) {
			if (noSeed) {
				// This condition passes at most once. If it passes,
				// `seed`--the first iteration on the collection--is
				// assigned the value of the first item in the
				// collection.
				noSeed = false;
				seed = item;
			} else {
				// Every iteration of `each` reassigns `seed` with
				// the value of `func`, called with `seed` and
				// `item`. In other words, `func` gets called with
				// the running, accumulated value and current item
				// in `coll`.
				seed = func(seed, item, i);
			}
		});

		return seed;
	};


	// `legacyReduce` was my first attempt at `reduce`. The key flaw
	// in the implementation was that I created a mutable, 'global'
	// variable, `result` and mutated it upon every iteration of
	// `each`. The new `reduce` is recursive.
	var legacyReduce = function(coll, func) {
		var result = 0;

		each(coll, function(item) {
			result += func(item);
		});

		return result;
	};


	// `filter` calls a predicate function on each item in a
	// collection, returning a collection of predicates.
	var filter = g_.filter = function(coll, pred) {
		var result = [];

		each(coll, function(item) {
			if ( pred(item) ) {
				result.push(item);
			}
		});

		return result;
	};


	// `find` takes a collection and a predicate and returns the
	// first element for which the predicate returns true. While this
	// implementation is inefficient, it is clear that we are
	// building an abstraction upon an abstraction.
	var find = g_.find = function(coll, pred) {
		return filter(coll, pred)[0];
	};


	// `where` takes an array of objects and returns all of the
	// objects that match the criteria.
	var where = g_.where = function(coll, crit) {
		return filter(coll, function(item) {
			for (key in crit) {
				if (crit[key] !== item[key]) {
					return false;
				}
			}
			return true;
		});
	};


	// `select` takes an array of objects and returns the values of
	// each object's `key` key.
	var select = g_.select = function(coll, key) {
		return map(coll, function(item) {
			return item[key];
		});
	};


	// `invert` takes an associative array and switches the keys and
	// the values.
	var invert = g_.invert = function(coll) {

		if ( isArray(coll) ) return;

		var result = {},
			ks     = keys(coll),
			vs     = vals(coll);

		each(keys, function(i) {
			result[vs[i]] = ks[i];
		});

		return result;
	};


	// `not` is the opposite of filter. This is a nice example of
	// functional programming. `not` relies on `filter` which relies
	// on `each`. Abstraction upon abstraction. The code is dense,
	// but elegant.
	var not = g_.not = function(coll, pred) {
		return filter(coll, function(i) {
			return !pred(i);
		});
	};


	// `all` takes a collection and a predicate and returns true if
	// all of the elements return true on the predicate.
	var all = g_.all = function(coll, pred) {
		return coll.length === filter(coll, pred).length;
	};


	// `any` takes a collection and a predicate and returns true if 
	// any of the elements return true on the predicate.
	var any = g_.any = function(coll, pred) {
		return filter(coll, pred).length > 0;
	};


	var properSubset = g_.properSubset = function(coll, pred) {
		return any(coll) && !all(coll);
	}


	// `tail` returns a new array with the first element from the
	// input array removed.
	var tail = g_.tail = function(coll) {
		// Why not `return coll.slice(1)`? See:
		// fhttp://stackoverflow.com/questions/7056925/
		return Array.prototype.slice.call(coll, 1);
	};


	// `first` selects the first item in a collection.
	var first = g_.first = function(coll) {
		if ( isIndexed(coll) ) {
			return coll[0];
		} else {
			return coll[ keys(coll)[0] ];
		}
	};


	// `max` returns the largest number in an array.
	var max = g_.max = function(coll, pred) {
		var result = -Infinity; // This acounts for negative numbers.

		if (!g_.exists(coll) || !g_.isArray(coll)) return;

		each(coll, function(i) {
			if ( g_.isGreaterThan(coll[i], result) ) {
				result = coll[i];
			}
		});

		return result;
	};


	// `min` returns the smallest number in an array.
	var min = g_.min = function(coll, pred) {
		var result = Infinity; // This acounts for positive numbers.

		if (!g_.exists(coll) || !g_.isArray(coll)) return;

		each(coll, function(i) {
			if ( !g_.isGreaterThan(coll[i], result) ) {
				result = coll[i];
			}
		});

		return result;
	};


	// `pipeline`
	var pipeline = g_.pipeline = function(seed /*, args */) {
		return reduce(tail(arguments),
					  function(last, curr) {
					  	  return curr(last);
					  },
					  seed);
	};


	// `zip` combines multiple lists into arrays with a shared index.
	// `zip` uses a for-loop rather than `each` because there is no
	// good way to iterate over each list in `args` and then each
	// item in each array in `args` with the correct index (try it).
	//
	// This is a good example of a function that, while not
	// technically pure, conceptually is. Functions are the unit of
	// abstraction. So long as mutations do not 'leak out', it does
	// not matter.
	//
	// @Fogus: 'As long as no one knows you've mutated a variable
	// then does it matter? I'd say no.'
	var zip = g_.zip = function(/* args */) {
		var args = toArray(arguments),
			i = 0,
			len = args[0].length,
			result = [];

		for ( ; i < len; i++) {
			result.push(
				map(args, function(arr) {
					return arr[i];
				})
			);
		}
		
		return result;
	};


/* Currying and partial application
 *
 * @Fogus: 'A curried function is one that returns a new function for
 * every logical argument that it takes.''
 * --------------------------------------------------------------- */


	// `curry` takes a function `func` and allows for partial or
	// full application of its arguments. If `curry` is provided with
	// all the arguments that `func` expects, it calls `func` with
	// those arguments. If it does not, it concatenates curried
	// function's applied arguments with `func`'s arguments and then
	// calls `func`. See `legacyCurry`.
	var curry = g_.curry = function(func) {
		return function(/* args */) {
			var args = toArray(arguments);
			if (func.length === args.length) {
				return func.apply(null, args);
			}
			else {
				return function(/* args */) {
					// I do not like this. I am not calling the
					// curried function. I am just using it as a way
					// to grab its arguments and apply it to the
					// original function.
					var args2 = args.concat( toArray(arguments) );
					return func.apply(null, args2);
				};
			}
		};
	};


	// `legacyCurry` takes a function and returns a function
	// expecting one parameter. It enforces currying, essentially.
	// See `curry` for a more robust implementation.
	var legacyCurry = function(func) {
		return function(arg) {
			return func(arg);
		};
	};


/* Utility functions
 * --------------------------------------------------------------- */


	// `identity` returns the value it is passed. This abstraction is
	// surprisingly important because, since functional programming
	// focuses on functions rather than values (for configuration),
	// we often need to pass in `identity`.
	var identity = g_.identity = function(val) {
		return val;
	};


	// `times` executes `func` `n` times.
	var times = g_.times = function(n, func) {
		each( g_.range(n), func );
		return;
	};

	// `constant` is configurable, higher-order that returns a function
	// that always returns the input.
	var constant = g_.constant = function(constant) {
		return function() { return constant; };
	};


	// `range` returns an array of size `stop`, with optional
	// `start` and `step` parameters.
	var range = g_.range = function(start, stop, step) {
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


	// `clone` creates a clone of an array or associative array
	// without mutating the input.
	var clone = g_.clone = function(coll) {
		// TODO: Add `deep copy` functionality.
		if ( isArray(coll) )  return coll.slice(0);
		if ( isObject(coll) ) return mixin({}, coll);
	};


	// `memoize` builds a cache of function calls and return values,
	// and only executes `func` if it has not done so previously.
	var memoize = g_.memoize = function(func) {
		var cache = {};

		return function(/* args */) {
			// This converts `arguments` to a stringified array.
			var args = toArray(arguments).toString();

			if ( !cache[args] ) {
				cache[args] = func.apply(func, arguments);
			}

			return cache[args];
		};
	};


	// `nth` returns the element located within a collection at the
	// index provided. @Fogus says, 'While array indexing is a core
	// behavior in JavaScript, there is no way to grab hold of the
	// behavior and use it as needed without placing it into a
	// function.' But now that it is a function, we can do this:
	//
	// function second(coll) { return nth(arr, 1); };
	//
	// This is powerful because, as @Fogus says, `second` allows us
	// to 'appropriate the correct behavior of `nth` for a different
	// but related use case.'
	var nth = g_.nth = function(coll, index) {
		if ( !isIndexed(coll) ) return;
		return coll[index];
	};


	/* Conversion functions
 	 * -------------------- */

	// `toArray` turns array-like objects (`arguments`, strings)
	// into arrays
	var toArray = g_.toArray = function(args) {
		return Array.prototype.slice.call(args, 0);
	};


	// `toHexidecimal` returns a hexidecimal number, based on the
	// number `n` applied.
	var toHexidecimal = g_.toHexidecimal = function(n) {
		return n.toString(16);
	};


	// `comparator` maps a predicate function to comparator values,
	// -1, 0, and 1. As a use case, we can now write the following,
	// since `sort` take an optional comparator argument:
	//
	// [2, 3, -1, -6, 0, -108, 42].sort(comparator(!isGreaterThan));
	// => [-108, -6, -1, 0, 2, 3, 42]
	var comparator = g_.comparator = function(pred) {
		return function(x, y) {
			if ( isFalsy(pred(x, y)) ) {
				return -1;
			} else if ( isTruthy(pred(x, y)) ) {
				return 1;
			} else {
				return 0;
			}
		}
	};

	/* Object functions
 	 * ---------------- */

	// `keys` takes an associative array and returns array of keys.
	var keys = g_.keys = function(coll) {
		var result = [];

		for (key in coll) {
			result.push(key);
		}

		return result;
	};


	// `values` takes an associative array and returns array of 
	// values.
	var vals = g_.vals = function(coll) {
		var result = [];

		for (key in coll) {
			result.push( coll[key] );
		}

		return result;
	};


	// `mixin` combines the properties of the objects applied without
	// mutating them. It returns a new object.
	var mixin = g_.mixin = function(/* args */) {
		var result = {},
			prop,
			args = toArray(arguments);

		each(args, function(obj) {
			for (prop in obj) {
				result[prop] = obj[prop];
			}
		});

		return result;
	};


	// `legacyExtend`--now `mixin`--extends the `result` object with
	// the properties with the object(s) applied. @Fogus, 'The
	// problem of course is that _.extend mutates the first object
	// in its argument list.' See `mixin` for a purely functional
	// implementation.
	var legacyExtend = function(result /*, args */) {
		var prop,
			args = g_.tail(arguments);

		each(args, function(obj) {
			for (prop in obj) {
				result[prop] = obj[prop];
			}
		});

		return result;
	};


	// `has` is a convenience wrapper for `hasOwnProperty`. It
	// highlights how functional programming create fluent interfaces
	// and now the built-in behavior of `has` can be passed around as
	// a first-class function.
	var has = g_.has = function(obj, key) {
		return obj.hasOwnProperty(key);
	};


/* Predicates
 *
 * @Fogus: 'Functions that always return a Boolean value are called
 * "predicates."'
 * --------------------------------------------------------------- */


	// `exists` is a boolean function that returns whether an
	// element exists (is neither `undefined` nor `null`). Loose
	// equality makes this a one-liner.
	var exists = g_.exists = function(val) {
		return val != null;
	};


	// `isTruthy` returns true if the value exists and is not false.
	// Note that it does not return truthy in the JavaScript sense of
	// of the word (e.g. 0 will return true).
	var isTruthy =  g_.isTruthy = function(val) {
		return val !== false && g_.exists(val);
	};


	var isFalsy = g_.isFalsy = function(val) {
		return !g_.isTruthy(val);
	};


	var isFunction = g_.isFunction = function(val) {
		return typeof val === 'function';
	};


	var isNumber = g_.isNumber = function(val) {
		return !isNaN(val);
	};


	var isString = g_.isString = function(obj) {
		return obj instanceof String;
	};


	var isArray = g_.isArray = function(obj) {
		return obj instanceof Array;
	};


	var isIndexed = g_.isIndexed = function(obj) {
		return isArray(obj) || isString(obj);
	};


	var isObject = g_.isObject = function(obj) {
		return obj instanceof Object;
	};


	var isEqual = g_.isEqual = function(x, y) {
		return x === y;
	};


	var isGreaterThan = g_.isGreaterThan = function(x, y) {
		return x > y;
	};


})();