import Vue from 'vue'
import '../../plugins/element' // 引入element-ui
import '../../styles/global.less'

import http from '../../api/aixos'
import App from './houses.vue'
Vue.use(http)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
