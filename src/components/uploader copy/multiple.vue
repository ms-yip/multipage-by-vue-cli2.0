<template>
  <el-upload class="upload-demo"
             :headers="headers"
             :action="prefix + action"
             :data="data"
             name="file"
             :on-preview="handlePreview"
             :on-remove="handleRemove"
             :before-upload="beforeUploadHandler"
             :on-success="successHandler"
             :file-list="fileList"
             multiple>
    <el-button size="small"
               type="primary">点击上传</el-button>
    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div> -->
  </el-upload>
</template>
<script>

export default {
  data () {
    return {
      action: '/api/file/upload',
      prefix: getPrefix(),
      headers: {},
      fileList: []
    }
  },
  props: {
    value: [String, Number]
  },
  computed: {
    data () {
      return { admin_id: this.$root.user.id, unvalidate: 1 }
    }
  },
  methods: {
    setUploadOptions () {
      const token = sessionStorage.getItem('_t')
      // this.prefix = this.$urlPrefix;
      this.headers.Authorization = `Bearer ${token}`
    },
    beforeUploadHandler () {
      this.setUploadOptions()
    },
    successHandler (response, rfile, fileList) {
      const success = response.code === '0001'

      if (success) {
        // const fileId = response.data[0].file_id;
        this.$emit('input', fileList.map(f => f.id).join(','))
        this.fileList = fileList
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>
<style scoped></style>
