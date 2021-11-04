const koa = require('koa')
const fs = require('fs')
const _path = require('path')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

function resolve () {
  return _path.resolve(__dirname, ...arguments)
}

const app = new koa()

app.use(async ctx => {
  const { url, query } = ctx

  // 访问根目录
  if (url === '/') {
    ctx.type = 'text/html'
    let content = fs.readFileSync(resolve('./index.html'), 'utf-8')

    content = content.replace('<script', 
    `
      <script>
        window.process = {
          env: {
            NODE_ENV: 'dev'
          }
        }
      </script>
      <script 
    `
    )

    ctx.body = content
  } else if (url.endsWith('.js')) {
    ctx.type = 'application/javascript'
    ctx.body = parseImportAddrs(fs.readFileSync(resolve(url.slice(1)), 'utf-8'))
  } else if (url.startsWith('/@modules/')) {
    const pix = resolve('node_modules', url.replace(/\/@modules\//, ''))
    const module = require(`${pix}/package.json`).module
    ctx.type = 'application/javascript'
    ctx.body = parseImportAddrs(fs.readFileSync(resolve(pix, module), 'utf-8'))
  } else if (url.indexOf('.vue') > -1) {
    const path = resolve(url.split('?')[0].slice(1))
    const { descriptor } = compilerSfc.parse(fs.readFileSync(path, 'utf-8'))

    let styles = ''

    // 判断 vue 文件中是否有样式 style
    if (descriptor.styles.length > 0) {
      descriptor.styles.forEach(item => {
        if (item.type === 'style') {
          styles += `${item.content}`
        }
      })
    }

    console.log(styles, 333)

    if (!query.type) {
      ctx.type = 'application/javascript'
      ctx.body = `
        ${parseImportAddrs(descriptor.script.content.replace('export default ', 'const __script = '))}
        import { render as __render } from '${url}?type=template'
        __script.render = __render

        ${styles
          ? `const style = document.createElement('style')
             style.type = 'text/css'
             style.innerText = '${styles.replace(/\n/g, '')}'
             document.head.appendChild(style)
            `
          : null}

        export default __script
      `
    } else if (query.type === 'template') {
      const template = descriptor.template
      const render = compilerDom.compile(template.content, {mode: 'module'}).code
      ctx.type = 'application/javascript'
      ctx.body = parseImportAddrs(render)
    }
  }
})

app.listen(3000, () => {
  console.log('listening start....')
})

function parseImportAddrs (content) {
  return content.replace(/ from ['|"]([^'"]+)['|"]/g, function ($0, $1) {
    if ($1[0] !== '.' && $1[1] !== '/') {
      return `from '/@modules/${$1}'`
    } else {
      return $0
    }
  })
}
