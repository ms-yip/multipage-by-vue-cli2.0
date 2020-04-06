<template>
  <el-upload ref="uploader" :headers="headers" :action="$urlPrefix+action" :data="data" name="files[]" show-file-list
             :on-success="successHandler" :on-remove="removeHandler" :before-upload="beforeUploadHandler"
             :file-list="fileList" list-type="card" :disabled="!isAllow" :on-preview="preview">
    <slot v-if="!disabled">
      <el-button type="primary">{{btnTitle}}</el-button>
      <!--<span>（支持格式：PDF、word、Excel、tex、jpg、png、zip ; 大小 &lt;=10M）</span>-->
      <slot name="tip"></slot>
    </slot>
  </el-upload>
</template>
<style scoped>

</style>
<script type="text/ecmascript-6">
/*eslint-disable*/
  import upload from './upload';

  export default {
    mixins: [upload],
  };
</script>
