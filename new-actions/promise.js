function pm () {
  return class Promise1 {
    constructor (fn) {
      // super()
      this.status = 'PENDING'
      this.resolveArgs = ''
      this.rejectArgs = ''
      this.init.call(this, fn)
      this.resolve.bind(this)
      this.reject.bind(this)
      this.then.bind(this)
    }
  
    init (_fn) {
      try {
        if (Object.prototype.toString.call(_fn) === '[object Function]') {
          _fn.call(this, this.resolve.bind(this), this.reject.bind(this))
        } else {
          throw new Error('argument is not a function')
        }
        return this
      } catch (e) {
        this.reject(e)
        return this
      }
      
    }
  
    resolve (args) {
      this.status = "RESOLVED"
      this.resolveArgs = args
      return this
    }
  
    reject (args) {
      this.status = "REJECTED"
      this.rejectArgs = args
      return this
    }
  
    then (resolveFun) {
      if (Object.prototype.toString.call(resolveFun) !== '[object Function]') {
        throw new Error('resolve: argment is not a function')
      }
      this.status === 'RESOLVED' && resolveFun.call(this, this.resolveArgs)
      return this
    }
  
    catch (rejectFun) {
      if (Object.prototype.toString.call(rejectFun) !== '[object Function]') {
        throw new Error('reject: argment is not a function')
      }
      this.status === 'REJECTED' && rejectFun(this.rejectArgs)
    }
  }  
}

module.exports = pm()
