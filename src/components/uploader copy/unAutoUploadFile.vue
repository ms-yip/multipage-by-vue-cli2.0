<!-- 手动上传文件 -->
<template>
  <div class="unAutoUpload">
    <el-upload class="upload-demo"
               ref="upload"
               multiple
               :action="action"
               :on-success="handleAvatarSuccess"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :file-list="fileList"
               :auto-upload="false">
      <!-- :on-progress="uploadProcess" -->
      <el-button slot="trigger"
                 size="small"
                 type="primary">选取文件</el-button>
      <div slot="tip"
           class="el-upload__tip">请选择正确的文件</div>
    </el-upload>
    <div class="toolbar">
      <el-button style="margin-left: 10px;"
                 size="small"
                 type="success"
                 v-if="showUpload"
                 @click="submitUpload">导入数据</el-button>
    </div>
    <el-dialog title="上传结果提示"
               append-to-body
               :visible.sync="dialogVisible"
               :before-close="closeDlg"
               width="50%">
      <p v-html="msg"></p>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeDlg"
                   size="small"
                   type="primary">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'unAutoUpload',
  components: {},

  mixins: [],

  props: {
    url: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      fileList: [],
      dialogVisible: false,
      msg: '',
      uploadComplete: true,
      // fullscreenLoading: false,
      loading: ''
    }
  },

  computed: {
    action () {
      return `/times-bhk${this.url}`
    },
    showUpload () {
      return true
    }
  },

  watch: {},

  created () { },

  mounted () { },

  methods: {
    // uploadProcess(event, file, fileList) {
    //   let percent=(event.loaded / event.total * 100) | 0
    //   //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
    //   // this.$refs.upload.onProgress({percent:percent})
    //   console.log(event, file, fileList)
    //   this.uploadComplete = false
    // },
    submitUpload () {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(256, 256, 256, 0.1)'
      })
      // this.fullscreenLoading = true
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleAvatarSuccess (response, rfile, fileList) {
      // this.fullscreenLoading = false
      this.loading.close()
      const file = rfile
      const success = response.code === '0000'
      this.status = success ? 1 : 2
      // console.log(fileList);
      // 修改接口返回的fileList
      const msg = response.msg.replace(/<br\/>/g, '<br/><br/>')

      if (success) {
        this.uploadComplete = true // 上传成功
        this.dialogVisible = true
        this.msg = this.msg.length ? this.msg + '<br/><br/>' + msg : msg
      } else {
        this.$message(response.msg)
        const index = fileList.indexOf(file)
        fileList.splice(index, 1)
      }
    },
    closeDlg () {
      this.dialogVisible = false
      this.msg = ''
      setTimeout(() => {
        this.$emit('closeUpload', false)
      }, 0)
    }

  }
}

</script>
<style lang='less' scoped>
// @import '';
.unAutoUpload {
  .toolbar {
    display: flex;
    justify-content: flex-end;
  }
  .el-upload__tip {
    color: red;
  }
}
</style>
