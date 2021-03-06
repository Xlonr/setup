import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { startQiankun } from './qiankun-config'

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

app.$nextTick(() => {
  startQiankun()
})
