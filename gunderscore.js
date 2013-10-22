/* 
 * gunderscore.js
 * 2013-10-15
 * ----------------------------------------------------------------*/

var g_ = (function() {

	/* `gunderscore` object
 	 */
	var g_ = {};

/* Collection functions
 *
 * @Fogus: 'Functional programming is extremely useful for tasks
 * requiring that some operation happen on many items in a
 * collection... The point of a collection-centric view... is to a
 * consistent processing idiom so that we can reuse a comprehensive
 * set of functions.'
 * ----------------------------------------------------------------*/

	/* `each` is an immutable iterator. It is the quintessential
	 * example of a functional style. Note that its implementation
	 * uses a `for` loop. Functional programming does not eliminate
	 * imperative concepts; rather, it abstracts them away with a
	 * function. Any loss in performance can be mitigated or
	 * regained by a compressor.
	 */
	var each = g_.each = function(collection, func) {
		var i, len;

		for (i = 0, len = collection.length; i < len; i++) {
			func(i);
		}
	};

	/* `map` calls a function on every value in a collection,
	 * returning a collection of results. Notice how it can use
	 * `each`; we are quickly building upon small abstractions.
	 */
	var map = g_.map = function(collection, func) {
		var result = [];

		each(collection, function(i) {
			result.push( func(collection[i]) );
		});
		
		return result;
	};

	/* `reduce` (or `fold`) calls a function on every value in a
	 * collection, accumulates the result, and returns it.
	 */
	var reduce = g_.reduce = function(collection, func) {
		var result = 0;

		each(collection, function(i) {
			result += func(collection[i]);
		});

		return result;
	};

	/* `filter` calls a predicate function on each item in a
	 * collection, returning a collection of predicates
	 */
	var filter = g_.filter = function(collection, predicate) {
		var result = [];

		each(collection, function(i) {
			if ( predicate(collection[i]) ) {
				result.push( collection[i] );
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
	g_.identity = function(value) {
		return value;
	}

/* Predicates
 *
 * @Fogus: 'Functions that always return a Boolean value are called
 * "predicates."'
 * ----------------------------------------------------------------*/

	/* `isExistential` is a boolean function that returns whether an
	 * element exists (is neither `undefined` nor `null`). Loose
	 * equality makes this a one-liner.
	 */
	g_.isExistential = function(value) {
		return value != null;
	};

	g_.isTruthy = function(value) {
		return (value !== false) && g_.isExistential(value);
	};

	return g_;

})();

var items = [1, 2, 3];
var double = function(x) { return x*x; };