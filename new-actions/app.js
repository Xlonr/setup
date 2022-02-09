const Promise1 = require('./promise')

new Promise1((resolve, reject) => {
  reject(8)
}).then(data => {
  console.log(data, 222)
}).catch(e => {
  console.log(e, '========')
})
