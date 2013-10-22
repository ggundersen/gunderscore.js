/* 
 * gunderscore.js
 * ----------------------------------------------------------------*/

 var g_ = (function() {

 	/* `gunderscore` object
 	 */
	var g_ = {};

	/* Iterators
	 *-------------------------------------------------------------*/

	/* `each` is an immutable iterator. It is the quintessential
	 * example of a functional style. Note that its implementation uses a
	 * loop. Functional programming does not eliminate imperative
	 * concepts; rather, it abstracts them away with a function. Any
	 * loss in performance can be mitigated or regained by a
	 * compressor.
	 */
	var each = g_.each = function(iterable, fn) {
		var i, len;

		for (i = 0, len = iterable.length; i < len; i++) {
			fn(i);
		}
	};

	/* `map` applies a supplied function to every element of an array
	 * and returns a new array. Notice how it can use `each`; we are
	 * quickly building upon small abstractions.
	 */
	var map = g_.map = function(iterable, fn) {
		var result = [];

		each(iterable, function(i) {
			result.push( fn(iterable[i]) );
		});
		
		return result;
	};

	/*
	 */
	var reduce = g_.reduce = function(iterable) {
		each(iterable, function)
	}

	/* Utility
	 *-------------------------------------------------------------*/

	/* `identity` returns the value it is passed. This abstraction is
	 * surprisingly important because, since functional programming
	 * focuses on functions rather than values (for configuration),
	 * we often need to pass in `identity`.
	 */
	g_.identity = function(value) {
		return value;
	}

	/* Predicates
	 *-------------------------------------------------------------*/

	/* `isExistential` is a boolean function that returns whether an
	 * element exists (is neither `undefined` nor `null`). Loose
	 * equality makes this a one-liner.
	 */
	g_.isExistential = function(el) {
		return el != null;
	};

	/* `isTruthy` defines
	 */
	g_.isTruthy = function(el) {
		return (el !== false) && g_.isExistential(el);
	};

	g_.isLessOrEqual = function(x, y) {
		return x <= x;
	};

	return g_;

 })();