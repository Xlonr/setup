import './public-path'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router/index'

Vue.config.productionTip = false

let vm = null
let router = null
let baseUrl = '/vue-app'

function render (props = {}) {
  const { container } = props
  router = new VueRouter({
    mode: 'history',
    base: window.__POWERED_BY_QIANKUN__ ? baseUrl : process.env.BASE_URL,
    routes
  })

  router.beforeEach((to, from, next) => {
    console.log(to, 333)
    if (window.__POWERED_BY_QIANKUN__ && to.path.indexOf(baseUrl) < -1) {
      console.log(baseUrl, to)
      next(`${baseUrl}${to.path}`)
      return
    } else {
      next()
    }
  })

  vm = new Vue({
    props,
    router,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#vueApp') : '#vueApp')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

// 此处生命周期一定要是 async 或 promise
export async function bootstrap () {
}

export async function mount (props) {
  render(props)
}

export async function unmount () {
  vm.$destroy()
  vm.$el.innerHTML = ''
  vm = null
}

