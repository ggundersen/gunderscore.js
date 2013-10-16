/* 
 * gunderscore.js
 * ----------------------------------------------------------------*/

 (function() {

 	/* Test data. No function should ever mutate this variable.
 	 */
 	var items = [1, 2, 3];

	/* `each` is an immutable iterator. It is the quintessential
	 * example of a functional style. Note that its implementation uses a
	 * loop. Functional programming does not eliminate imperative
	 * concepts; rather, it abstracts them away with a function. Any
	 * loss in performance can be mitigated or regained by an
	 * optimizer.
	 */
	var each = function(iter, fn) {
		// what is the difference between `each` and `map`?
	};

	/* `map` applies a supplied function to every element of an array
	 * and returns a new array
	 */
	var map = function(iter, fn) {
		var i,
			result = [];

		for (i = 0; i < iter.length; i++) {
			result.push( fn(iter[i]) );
		}

		return result;
	}

 })();