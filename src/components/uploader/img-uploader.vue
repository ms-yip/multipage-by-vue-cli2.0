<template>
  <el-upload class="img-uploader crm-img-loader" ref="uploader" :headers="headers" :action="$urlPrefix+action" :data="data"
             name="file" :show-file-list="multiple" :on-success="successHandler" :on-remove="removeHandler"
             :before-upload="beforeUploadHandler" list-type="picture-card" :file-list="fileList"
             :disabled="!isAllow">
    <i v-if="!imageUrl" :class="isAllow?'el-icon-plus':'el-icon-close'"></i>
    <img v-if="imageUrl && !multiple" :src="imageUrl" class="avatar">
    <!--<div class="tips" slot="tip">（建议上传大小50-100K的图片）</div>-->
  </el-upload>
</template>
<style lang="less">
  .img-uploader {
    position: relative;
  }
  .crm-img-loader {
    .el-upload--picture-card {
      position: relative;
    }
  }
  .avatar {
    position: absolute;
    top: 50%;
    /*left: 50%;*/
    max-width: 100%;
    max-height: 100%;
    transform: translate(-50%, -50%);
  }
  .tips{
    margin-top: 10px;
    width:220px;
    color: #8393a5;
    font-size: 13px;
  }
</style>
<script type="text/ecmascript-6">
/*eslint-disable*/
  import upload from './upload';

  export default {
    mixins: [upload],
    computed: {
      imageUrl() {
        const url = this.fileList[0] ? this.fileList[0].url : '';
        this.currentFile ? this.$emit('getImgUrl', this.currentFile.url) : this.$emit('getImgUrl', url)
        return this.currentFile ? this.currentFile.url : url;
      },
    },
  };
</script>
