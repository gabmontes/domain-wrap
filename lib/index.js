const domain = require('domain')

function protect(fn) {
  return function (...args) {
    const d = domain.create()
    d.on('error', function (err) {
      d.on('error', function () {})
      const callback = args.pop()
      callback(err)
    })
    d.run(fn, ...args)
  }
}

function protectAsync(fn) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      const d = domain.create()
      d.on('error', reject)
      d.run(function () {
        fn(...args).then(resolve).catch(reject)
      })
    })
  }
}

protect.async = protectAsync

module.exports = protect
