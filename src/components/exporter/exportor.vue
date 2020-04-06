<template>
  <el-button
    :type="type"
    :size="size"
    class="btn-submit"
    @click="exportHandler"
    :disabled="disabled"
  >
    <slot><i :class="buttonIcon"></i> {{ buttonName }}</slot>
  </el-button>
</template>
<style scoped></style>
<script type="text/ecmascript-6">
import qs from 'qs'
export default {
  props: {
    type: { type: String, default: 'success' },
    size: { type: String, default: 'large' },
    params: Object,
    api: { type: String, required: true },
    buttonName: { type: String, default: '导出数据' },
    buttonIcon: { type: String, default: 'el-icon-download' },
    disabled: Boolean,
    fileName: {type: String, default: '导出数据.xls'}
  },
  methods: {
    exportHandler () {
      if (!this.api) {
        this.$Notice.warning('请配置正确的下载接口')
        return
      }
      const api = `${this.api}`
      const prefix = this.$urlPrefix
      // const prefix = this.$urlPrefix || '/index.php' // $urlPrefix 失效
      if (this.params) {
        // const token = `Bearer ${sessionStorage.getItem('token')}` // token作为参数
        const prefix = this.$urlPrefix || ''
        const params = {
          // Authorization: token,
          // admin_id: this.$user.id,
          ...this.params
        }
        console.log(params)
        const query = qs.stringify(params)
        const api = `${this.api}?`
        const exportUrl = location.origin + prefix + api + query
        console.log('导出url', exportUrl)
        window.open(exportUrl)
      } else {
        const exportUrl = location.origin + prefix + api
        console.log('导出url', exportUrl)
        window.open(exportUrl)
      }
    },
    exportXhrHandler (id) {
      // 没必浪费资源请求一次,但是如果有header的验证，可以使用
      this.$http({
        method: 'post',
        url: '/api/goods/post/qrcodeDown',
        // responseType: 'application/octet-stream',
        responseType: 'blob',
        data: {
          id: id
        }
      }).then((response) => {
        let blob = new Blob([response])
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `${this.fileName}`
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>
