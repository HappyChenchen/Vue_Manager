import AreaCascader from './index.vue'

import Bus from '../area-utils/bus.js'

AreaCascader.install = function (Vue) {
  Bus.saveVueRef(Vue)
  Vue.component(AreaCascader.name, AreaCascader)
}

export default AreaCascader
