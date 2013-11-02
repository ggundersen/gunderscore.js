// Expose onto window
var result = undefined;
var arr = [1, 2, 3];
var obj = {
	'foo': 'bar',
	'qux': 'baz'
};
var obj2 = {
	'foo': '1',
	'jor': '2'
};

var stooges = [{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}, {test: 'test'}];

var str = 'this is a string';

describe('The `gunderscore` module', function() {
	var arr, obj, result, str;

	beforeEach(function() {
		arr = [1, 2, 3];	
		obj = {
			'foo': 'bar',
			'qux': 'baz'
		};
		str = 'this is a string';
	});

	it('is an object', function() {
		expect(typeof g_).toBe('object');
	});


/* `each`
 * ----------------------------------------------------------------*/
	describe('has an `each` method that', function() {
		var eachSpy;

		beforeEach(function() {
			eachSpy = jasmine.createSpy('eachSpy');
		});

		it('is a function', function() {
			expect(typeof g_.each).toBe('function');
		});
		it('returns `undefined` (is executed for its side effects)', function() {
			var result = g_.each([1,2,3], g_.identity);
			expect(typeof result).toBe('undefined');
		});
		it('calls the applied function on every item in an applied array', function() {
			var arr = _.range(Math.random() * 100);
			g_.each(arr, eachSpy);
			expect(eachSpy.calls.length).toEqual(arr.length);
		});
		it('calls the applied function on every item in an applied object', function() {
			var obj = { 'key': Math.random(), 'val': Math.random() };
			g_.each(obj, eachSpy);
			expect(eachSpy.calls.length).toEqual(g_.keys(obj).length);	
		});
		it('calls the applied function on every item in an applied string', function() {
			var str = g_.toHexidecimal( Math.random() );
			g_.each(str, eachSpy);
			expect(eachSpy.calls.length).toEqual(str.length);	
		});
	});


/* `map`
 * ----------------------------------------------------------------*/
	describe('has an `map` method that', function() {
		var mapSpy;

		beforeEach(function() {
			mapSpy = jasmine.createSpy('mapSpy');
		});

		it('is a function', function() {
			expect(typeof g_.map).toBe('function');
		});
		it('returns an array', function() {
			var result = g_.map();
			expect(result instanceof Array).toBeTruthy();
		});
		it('returns an empty array if passed no arguments', function() {
			var result = g_.map();
			expect(result.length).toBe(0);
		});
		it('returns an array of the same length as the number of items in the collection passed in', function() {
			var result = g_.map(arr, g_.identity);
			expect(result.length).toBe(arr.length);
		});
		it('calls the passed in function on every item in the collection', function() {
			g_.map(arr, mapSpy);
			expect(mapSpy.calls.length).toBe(arr.length);
		});
		it('calls the passed in function on every item in the collection', function() {
			g_.map(obj, mapSpy);
			expect(mapSpy.calls.length).toBe(g_.keys(obj).length);
		});
	});


/* `reduce`
 * ----------------------------------------------------------------*/
	describe('has an `reduce` method that', function() {
		it('is a function', function() {
			expect(typeof g_.reduce).toBe('function');
		});
	});

});