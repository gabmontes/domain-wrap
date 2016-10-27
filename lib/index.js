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

module.exports = protect
