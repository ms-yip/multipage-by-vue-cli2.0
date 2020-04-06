import Vue from 'vue'
import '../../plugins/element' // 引入element-ui
import '../../styles/global.less'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import http from '../../api/aixos'
import App from './starStaff.vue'
Vue.use(VueQuillEditor)
Vue.use(http)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
