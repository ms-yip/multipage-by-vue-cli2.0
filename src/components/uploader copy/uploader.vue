// 上传按钮，文字列表
<template>
  <!-- with-credentials="true" -->
  <!-- drag="true" -->
  <!-- accept="" -->
  <el-upload ref="uploader"
             :action="prefix + action"
             :headers="headers"
             :multiple="multipleSelect"
             :data="data"
             name="file"
             show-file-list
             :auto-upload="isAuto"
             :on-preview="preview"
             :on-success="successHandler"
             :on-remove="removeHandler"
             :before-upload="beforeUploadHandler"
             :file-list="fileList"
             list-type="card"
             :disabled="!isAllow">
    <slot v-if="!disabled">
      <el-button type="primary"
                 size="small">{{ btnTitle }}</el-button>
      <el-button style="margin-left: 10px;"
                 size="small"
                 type="success"
                 @click="submitUpload">上传到服务器</el-button>
      <!-- （支持格式:PDF、word、Excel、tex、jpg、png、zip ; 大小 &lt;=10M） -->
    </slot>
    <div slot="tip"
         v-if="tip">{{ tip }}</div>
  </el-upload>
</template>
<style scoped></style>
<script type="text/ecmascript-6">
import upload from './upload'
export default {
  mixins: [upload]
}
</script>
