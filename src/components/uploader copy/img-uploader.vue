// 备注 name 字段为传参时 键名
<template>
  <el-upload class="img-uploader"
             ref="uploader"
             :headers="headers"
             :action="prefix + action"
             :data="data"
             name="file"
             :show-file-list="multiple"
             :on-success="successHandler"
             :on-remove="removeHandler"
             :before-upload="beforeUploadHandler"
             :on-preview="handlePictureCardPreview"
             list-type="picture-card"
             :file-list="fileList"
             :disabled="!isAllow">
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
           :src="dialogImageUrl"
           alt="" />
    </el-dialog>
    <!-- + X 图标-->
    <i v-if="!imageUrl"
       :class="isAllow ? 'el-icon-plus' : 'el-icon-close'"></i>
    <!-- 单个图片 -->
    <div>
      <img v-if="imageUrl && !multiple"
           :src="imageUrl"
           class="avatar" />
    </div>
    <!-- 单个图片 -->
    <!-- <img v-if="!multiple" :src="showSingle" alt="" class="avatar" /> -->
  </el-upload>
</template>
<style scoped>
.img-uploader {
  position: relative;
}

.avatar {
  width: 148px;
  height: 148px;
  position: absolute;
  top: 50%;
  /* left: 0; */
  max-width: 100%;
  max-height: 100%;
  transform: translate(-50%, -50%);
}
</style>
<script type="text/ecmascript-6">
import upload from './upload'
export default {
  mixins: [upload],
  computed: {
    imageUrl () {
      return this.currentFile ? this.currentFile[0].url : ''
    },
    showSingle () {
      if (this.currentFile && this.currentFile.length && this.currentFile.length === 1) {
        return this.currentFile[0].url
      }
      return ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handlePictureCardPreview (file) {
      if (!this.multiple) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      } else {

      }
    }
  }
}
</script>
