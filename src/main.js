import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import echarts from 'echarts'
import '@/styles/index.scss' // global css
import VCharts from 'v-charts'
import App from './App'
import router from './router'
import store from './store'
import mock from './mock/mock.js'
import '@/icons' // icon
import region from './assets/area-data/region'
// import '@/permission' // permission control
import global from './global'
import axios from 'axios'


Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.use(mock)
Vue.use(echarts)

Vue.prototype.$region = region
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.global = global

Vue.prototype.HOST = '/api'

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
