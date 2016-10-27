# Safe function callbacks

Wraps a function in a domain to capture async errors.

Although domains are a deprecated API in node, it is sometimes the best option to solve specific problems trying to catch asynchronous errors. For those specific cases, this module comes to the rescue by easily wrapping a function call in a domain and forcing the callback to be called with the error instead of the uncaught error bubbling up and killing the whole process!

More information on deprecation status:
- https://nodejs.org/api/domain.html
- https://github.com/nodejs/node/issues/66

## Install

```
npm install domain-wrap
```

## Usage

Given a `fn` that uses the node-style callbacks, expecting a callback as the last parameter and this callback expecting an `err` as the first parameter, you can obtain a new function that will always call the callback and never throw an error:

```js
var protect = require('domain-wrap')

function fn(argument, callback) {
  // would throw but in other tick related to this function as a consequence of
  // an async call, setTimeout, or similar
}

var protectedFn = protect(fn)
protectedFn(args, function (err, result) {
  // if `fn` throws, `err` will contain the thrown error
})
```

## API

### protect(fn)

#### Parameters

* `fn` is a function that receives a callback as the last. argument. The callback will receive an `err` object as the first argument.

#### Returns value

A new function that wraps `fn` and makes it safe to call.

## License

WTFPL
