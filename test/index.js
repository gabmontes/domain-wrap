const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const protect = require('../lib')
const protectAsync = require('../lib').async

const { expect } = chai
chai.use(chaiAsPromised)

function testFn(value, shouldError, shouldThrow, callback) {
  setTimeout(function () {
    if (shouldThrow) {
      throw new Error(value)
    }
    if (shouldError) {
      callback(new Error(value))
      return
    }
    callback(null, value)
  }, 0)
}

function testAsyncFn(value, shouldReject, shouldThrow) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldThrow) {
        throw new Error(value)
      }
      if (shouldReject) {
        reject(new Error(value))
        return
      }
      resolve(value)
    }, 0)
  })
}

const protectedFn = protect(testFn)
const protectedAsyncFn = protectAsync(testAsyncFn)

describe('Domain wrapped functions', function () {
  it('should call the callback if all is ok', function (done) {
    const testValue = 'test'
    protectedFn(testValue, false, false, function (err, value) {
      expect(value).to.equals(testValue)
      done()
    })
  })

  it('should call the callback if there is an error', function (done) {
    const testError = 'some error'
    protectedFn(testError, true, false, function (err) {
      expect(err).to.be.an('error')
      expect(err).to.have.property('message').to.equals(testError)
      done()
    })
  })

  it('should call the callback if the fn throws within the domain', function (done) {
    const testError = 'thrown error'
    protectedFn(testError, false, true, function (err) {
      expect(err).to.be.an('error')
      expect(err).to.have.property('message').to.equals(testError)
      done()
    })
  })

  it('should apply function context using bind()', function (done) {
    const testObject = {
      value: 'some text',
      getValue: function (callback) {
        setTimeout(() => callback(null, this.value), 0)
      }
    }
    const safeGetValue = protect(testObject.getValue.bind(testObject))
    safeGetValue(function (err, value) {
      expect(err).to.not.exist
      expect(value).to.equals(testObject.value)
      done()
    })
  })

  it('should resolve if all is ok', function () {
    const testValue = 'test'
    return protectedAsyncFn(testValue, false, false).then(function (value) {
      expect(value).to.equals(testValue)
    })
  })

  it('should reject if there is an error', function () {
    const testError = 'some error'
    return expect(protectedAsyncFn(testError, true, false)).to.be.rejectedWith(testError)
  })

  it('should reject if the fn throws within the domain', function () {
    const testError = 'thrown error'
    return expect(protectedAsyncFn(testError, false, true)).to.be.rejectedWith(testError)
  })
})
