import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'
import {
  filterParams
} from '@/utils/utils'
import Qs from 'qs'
axios.defaults.headers.common['X-Reqeusted-With'] = 'XMLHttpRequest'
// axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'

const prefix = '/qwerty.php' // 统一前缀

// loading 加载
const lodingOptions = {
  lock: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.6)'
}
let loding = {}
let requestNum = 0
// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // console.log("request" + JSON.stringify(config));
    // Do something before request is sent
    config.url = prefix + config.url // 添加前缀
    requestNum += 1
    return config
  },
  error => Promise.reject(error)
)
// Add a response interceptor
axios.interceptors.response.use(
  response => {
    // Do something with response data
    const {
      config
    } = response
    // console.log(config)

    if (loding.close) {
      requestNum -= 1
      setTimeout(() => {
        if (!requestNum) loding.close()
      }, 0)
    }
    const {
      code,
      msg,
      data
    } = response.data
    if (config.all) {
      // 需要整个返回的时候
      if (code === '0001') {
        if (config.hideMsg !== true) {
          Message({
            message: msg,
            type: 'success'
          })
        }
        return response.data
      } else if (code === '0002') {
        return []
      } else {
        Message({
          message: msg,
          type: 'warning'
        })
        throw new Error(code)
      }
    } else {
      if (!(code === '0001' || code === '0002')) {
        Message({
          message: msg,
          type: 'warning'
        })
        throw new Error(code)
        // return Promise.reject(code)
      }
      return data || []
    }
  },
  error => {
    try {
      requestNum -= 1
      setTimeout(() => {
        if (!requestNum) loding.close()
      }, 0)
    } catch (e) {
      // console.log(e);
    }
    // Do something with response error
    Message({
      message: '网络错误',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

/**
 * @method 获取url前缀
 */

export function getPrefix () {
  return prefix
}

/**
 * @method api调用
 * @param {string} type 请求类型
 * @param {string} url api地址
 * @param {object} params 参数
 * @param {object} config 配置信息 all 返回全部信息，不做处理
 * @returns {object}
 */

export async function getApi (type, url, params, config) {
  if (!url) {
    return {}
  }
  const needFilter = config && config.needNull ? !config.needNull : true
  if (needFilter) {
    // 过滤对象中值为空的项
    params = filterParams(params)
  }
  // 本地调试数据模拟
  // if (process.env.NODE_ENV !== 'production') {
  // }
  let res = ''
  // console.log(config && config.loading === undefined)
  // if (config && config.loading === undefined) {
  const hideLoading = !!(config && config.hideLoading)
  if (!hideLoading) {
    loding = Loading.service(lodingOptions) // 调用loading
  }
  // }
  if (
    type === 'get' ||
    type === 'delete' ||
    type === 'head' ||
    type === 'options'
  ) {
    const _config = {
      ...config,
      params
    }
    res = await axios[type](url, _config)
  } else if (type === 'post') {
    if (config.isFormData) {
      res = await axios[type](url, Qs.stringify(params), config)
    } else {
      res = await axios[type](url, params, config)
    }
  } else {
    res = await axios[type](url, params, config)
  } // 还有一种axios#request(config) 用不到
  return res
}

function install (vue) {
  if (install.installed) return
  const Vue = vue
  Vue.prototype.$http = axios
  Vue.prototype.$request = getApi
}
export default {
  install,
  getPrefix,
  getApi
}
