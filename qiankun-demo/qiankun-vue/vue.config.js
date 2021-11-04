const {name} = require('./package.json')
const port = 3030

module.exports = {
  devServer: {
    port,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    publicPath: process.env.NODE_ENV === 'development' ? '/' : '/vue-app/'
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
}