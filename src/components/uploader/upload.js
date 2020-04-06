// import userInfo from '@/utils/user';
/*eslint-disable*/
import CanvasCompress from 'canvas-compress'
export default {
  data() {
    return {
      // action: '/admin/File/upload',
      prefix: this.$urlPrefix,
      headers: {},
      fileList: [],
      currentFile: null,
    };
  },
  props: {
    value: [String, Number],
    imgurl: [String],
    params: Object,
    limit: {
      type: Number,
      default: 1,
    },
    // type: 1图片  2文件 3定制
    type: {
      type: Number,
      default: 1,
    },
    btnTitle: {
      type: String,
      default: '添加附件',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    imgLimit: {
      type: String,
      default: '10'
    },
    action: {
      type: String,
      default: '/admin/File/upload',
    },
  },
  created() {
    if (this.value) this.refreshFileList();
  },
  watch: {
    value(val) {
      if (this.fileListIds !== val) this.refreshFileList();
    },
  },
  computed: {
    data() {
      return { ...this.params, admin_id: '1' };
    },
    multiple() {
      return this.limit !== 1;
    },
    isAllow() {
      return (this.limit <= 1) || (this.limit > 1 && this.fileList.length < this.limit);
    },
    fileListIds() {
      return this.fileList.map(f => f.id).join(',');
    },
    needRefreshFileList() {
      return this.fileListIds !== this.value;
    },
  },
  methods: {
    preview(data) {
      if (!data.url) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: '链接错误！',
        });
      } else {
        window.open(data.url);
      }
    },
    refreshFileList() {
      if (this.needRefreshFileList && this.value) {
        // /admin/File/get
        this.$http.get('/admin/File/getUrlById', {
          params: { id: this.value },
          loading: true
        }).then((res) => {
          const success = res.code === '0001';
          if (success) {
            this.fileList = res.data;
          } else {
            this.$notify({
              message: res.msg,
              type: 'error',
            });
          }
        });
      }
    },
    setUploadOptions() {
      const token = sessionStorage.getItem('_t');
      this.prefix = this.$urlPrefix;
      this.headers.Authorization = `Bearer ${token}`;
    },
    beforeUploadHandler(file) {
      this.setUploadOptions();

      if (!this.isAllow) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `最多只允许上传 ${this.limit} 个文件`,
        });
        return false;
      }

      const fileName = file.name.toLocaleLowerCase();
      const typeImage = /[^"]*(\.jpg|\.png|\.bmp|\.jpeg|\.pdf)/;
      const typeReg = /[^"]*(\.doc|\.docx|\.xls|\.xlsx|\.csv|\.txt|\.jpg|\.png|\.bmp|\.jpeg|\.zip|\.rar|\.pdf)/;
      // 定制的检验类型 此处为excel文件检验
      const xlsReg = /\.xl(s[xmb]|t[xm]|am)$/;
      let isLtType = false;
      if (this.type === 3) {
        isLtType = xlsReg.test(fileName);
      } else {
        isLtType = this.type === 1 ? typeImage.test(fileName) : typeReg.test(fileName);
      }
      // const isLt10M = file.size / 1024 / 1024 < 10;
      const isLtLimit = file.size / 1024 / 1024 < parseInt(this.imgLimit)
      if (!isLtType) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `不支持上传 ${file.name} 的文件格式`,
        });
        return false
      }
      if (!isLtLimit) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `文件大小超过 ${this.imgLimit} M`,
        });
        return false
      }
      // return isLtType && isLt10M;
      if (this.type === 1) {
        // const maxSize = 0.5 * 1024 * 1024
        // const radio = maxSize / file.size
        // const compressor = new CanvasCompress({
        //   type: CanvasCompress.MIME.JPEG,
        //   quality: this.imgLimit ? radio : 0.4
        // })
        // let newFile = compressor.process(file)
        // return Promise.resolve(newFile.result.blob)
        return Promise.resolve(this.compressHandler(file))
      }
    },
    successHandler(response, rfile, fileList) {
      const file = rfile;
      const success = response.code === '0001';
      this.status = success ? 1 : 2;

      if (success) {
        const fileId = response.data[0].id;
        file.id = fileId;
        const isExisted = fileList.filter(f => `${f.id}` === `${fileId}`).length > 1;
        if (isExisted) {
          const index = fileList.indexOf(file);
          fileList.splice(index, 1);
        }
      } else {
        const index = fileList.indexOf(file);
        fileList.splice(index, 1);
      }

      if (success && this.multiple) {
        this.$nextTick(() => {
          this.$emit('input', fileList.filter(f => f.id).map(f => f.id).join(','));
        });
      } else if (success && !this.multiple) {
        const uploader = this.$refs.uploader;
        this.currentFile = file;

        uploader.fileList.splice(0, fileList.length, file);

        this.$nextTick(() => {
          this.$emit('input', `${file.id}`);
        });
      } else {
        this.$nextTick(() => {
          this.$emit('input', fileList.filter(f => f.id).map(f => f.id).join(','));
        });
      }

      this.fileList = fileList;
    },
    removeHandler(file, fileList) {
      if (!file) {
        return;
      }

      if (this.multiple) {
        this.$emit('input', fileList.filter(f => f.id).map(f => f.id).join(','));
      } else {
        this.$emit('input', '');
      }
    },
    async compressHandler (file) {
      const maxSize = 0.5 * 1024 * 1024
      const radio = maxSize / file.size
      const compressor = new CanvasCompress({
        type: CanvasCompress.MIME.JPEG,
        quality: this.imgLimit ? radio : 0.4
      })
      let newFile = await compressor.process(file)
      return newFile.result.blob
    }
  },
};
