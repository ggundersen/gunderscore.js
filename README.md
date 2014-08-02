Gunderscore.js
==============

Gunderscore.js is a JavaScript utility library for functional programming. I wrote this library while reading Michael Fogus's "Functional JavaScript."

The library is (obviously) inspired by Underscore.js and many functions were optimized after reading Ashkenas's source code. Other functions were inspired by Fogus. And I preferred Brian McKenna's version of `curry`, from bilby.js

That said, I wrote the first draft of each function myself and intentionally kept the library simple for educational purposes. Underscore.js does a lot of interesting tricks for performance and usability (early returning, error handling, chaining, delegatingto native methods, &c.). In these situations, I have erred on the side of simplicity, if only for myself.

You can play around with Gunderscore.js on my [http://gregorygundersen.com/gunderscorejs/](website).
