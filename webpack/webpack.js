const fs = require('fs')
const path = require('path')
const parserModule = require('@babel/parser')
const traverseModule = require('@babel/traverse').default
const babel = require('@babel/core')
const uglifyJs = require('uglify-js')

/**
 * 单模块分析
 * @param file 文件地址
 */
function analysisSingerModule (file) {
  const fileContent = fs.readFileSync(file, 'utf-8')
  // ast 抽象语法树
  const ast = parserModule.parse(fileContent, {
    sourceType: 'module'
  })

  // 收集项目中 import/export 依赖
  const depAst = {}
  traverseModule(ast, {
    ImportDeclaration ({node}) {
      const realPath = `./${path.join(path.dirname(file), node.source.value)}`
      depAst[node.source.value] = realPath
    }
  })

  // 代码降维处理 ES6+ => ES5
  const {code} = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })

  const module = {
    code,
    depAst,
    file
  }

  return module
}

// 多模块解析
function parseModules (file) {
  const entry = analysisSingerModule(file)
  const collect = [entry]
  const depAstGraph = {}

  // 获取到所有解析好的模块
  getDepsAnalysis(collect, entry)

  // ast 画像
  collect.forEach(info => {
    depAstGraph[info.file] = {
      depAst: info.depAst,
      code: info.code
    }
  })

  return depAstGraph
}

// 递归获取模块 ast
function getDepsAnalysis (collectList, {depAst}) {
  Object.keys(depAst).forEach(key => {
    // 子模块
    const childModule = analysisSingerModule(depAst[key])
    collectList.push(childModule)
    getDepsAnalysis(collectList, childModule)
  })
}

function bundle (file) {
  try {
    const graphs = JSON.stringify(parseModules(file))
    const {code} = uglifyJs.minify(`(function (graph) {
      function require (file) {
        var exports = {}
        function absRequire (path) {
          return require(graph[file].depAst[path])
        }
        (function (require, exports, code) {
          eval(code)
        })(absRequire, exports, graph[file].code)
        return exports
      }
      require('${file}')
    })(${graphs})`)
    return code
  } catch (e) {
    console.error(e)
  }
}

!fs.existsSync('./dist') && fs.mkdirSync('dist')
fs.writeFileSync('./dist/bundle.js', bundle('./src/app.js'))
