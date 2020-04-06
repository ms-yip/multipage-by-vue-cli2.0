import {
  getPrefix
} from '@/api/aixos.js'
import {
  Message
} from 'element-ui'
import {
  getImg
} from '@/api/index.js'

export default {
  data () {
    return {
      prefix: getPrefix(),
      headers: {},
      fileList: [],
      currentFile: null
    }
  },
  props: {
    action: {
      type: String,
      default: '/satisfaction/templeteUpload'
    },
    value: [String, Number], // 单个数字，多个字符
    // imgUrl: [Object],
    params: Object,
    limit: {
      type: Number,
      default: 1
    },
    // type: 1图片  2文件
    type: {
      type: Number,
      default: 1
    },
    btnTitle: {
      type: String,
      default: '添加附件'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multipleSelect: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String
    },
    hasAfterMess: {
      type: Boolean,
      default: false
    },
    isAuto: {
      type: Boolean,
      default: true
    }
  },
  created () {
    if (this.value && this.type === 1) this.refreshFileList()
  },
  watch: {
    value (val) {
      if (this.type === 1) this.refreshFileList()
    }
  },
  computed: {
    data () {
      // 参数列表
      return {
        ...this.params
        // admin_id: '1'
      }
    },
    multiple () {
      // >1 显示列表
      return this.limit > 1
    },
    isAllow () {
      //  限制一个可替换，少于限制数可加
      return (
        this.limit <= 1 || (this.limit > 1 && this.fileList.length < this.limit)
      )
    },
    fileListIds () {
      let temp = ''
      if (this.multipleSelect) {
        setTimeout(() => {
          temp = this.fileList.map(f => f.id)
        })
      } else {
        temp = this.fileList.map(f => f.id)
      }
      return temp && temp.length ? temp.join(',') : ''
    },
    needRefreshFileList () {
      // console.log("111", this.fileListIds);
      // console.log(this.value);
      // console.log(this.fileListIds !== this.value);
      return this.fileListIds !== this.value
    }
  },
  methods: {
    preview (data) {
      console.log(data.response.data.url)
      // if (!data.response.data.url) { // 上传后
      if (!data.url) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: '链接错误！'
        })
      } else {
        window.open(data.url)
        // window.open(data.response.data.url);
      }
    },
    refreshFileList () {
      // console.log(6666666);
      const host = (location.host === '10.1.39.170:8080' || location.host === 'localhost:8080') ? 'domainname' : location.host
      if (this.needRefreshFileList && this.value) {
        this.fileList = [{
          name: '',
          id: this.value,
          url: `${location.protocol}//${host}/times-bhk/img/${this.value}`
        }],
        this.currentFile = [{
          name: '',
          id: this.value,
          url: `${location.protocol}//${host}/times-bhk/img/${this.value}`
        }]
        // console.log(`${location.protocol}//${host}/times-bhk/img/${this.value}`)
        // console.log(88888888);
        // const res = await getImg(this.value)
        // console.log(res)
        // this.$http
        //   .get(`/img/${this.value}`).then(res => {
        //     const success = res.code === '0001'
        //     if (success) {
        //       //  res.data.id = this.value;
        //       //  res.data.name = '';
        //       //  this.fileList = [res.data];
        //       this.fileList = res.data
        //       this.currentFile = res.data // @todo 未知错误
        //     } else {
        //       this.$notify({
        //         message: res.msg,
        //         type: 'error'
        //       })
        //     }
        //   })
      }
    },
    setUploadOptions () {
      // console.log(localStorage.getItem('_token'));
      // console.log(localStorage.getItem('_t'));
      // console.log(localStorage.getItem('_u'));
      const token = sessionStorage.getItem('_t') || localStorage.getItem('_t')
      this.prefix = getPrefix()
      this.headers.Authorization = `Bearer ${token}`
      this.headers.token = `${localStorage.getItem('_token')}`
    },
    beforeUploadHandler (file) {
      this.setUploadOptions()
      if (!this.isAllow) {
        // 数量限制
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `最多只允许上传 ${this.limit} 个文件`
        })
        return false
      }
      // 限制文件类型
      const fileName = file.name.toLocaleLowerCase()
      const typeImage = /[^"]*(\.jpg|\.png|\.bmp|\.jpeg|\.pdf)/
      const typeReg = /[^"]*(\.doc|\.docx|\.xls|\.xlsx|\.csv|\.txt|\.jpg|\.png|\.bmp|\.jpeg|\.zip|\.rar|\.pdf)/
      const isLtType =
        this.type === 1 ? typeImage.test(fileName) : typeReg.test(fileName)

      // 限制文件大小
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLtType) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `不支持上传 ${file.name} 的文件格式`
        })
      }

      if (!isLt1M) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `${file.name}文件大小超过1M`
        })
      }
      return isLtType && isLt1M
    },
    successHandler (response, rfile, fileList) {
      console.log(response)
      console.log(rfile)
      console.log(fileList)
      const file = rfile
      const success = response.code === '0000'
      this.status = success ? 1 : 2
      // console.log(fileList);
      // 修改接口返回的fileList
      if (success) {
        if (this.isAuto) {
          const fileId = response.data.id
          file.id = fileId
          const isExisted =
            fileList.filter(f => `${f.id}` === `${fileId}`).length > 1
          if (isExisted) { // 超出
            const index = fileList.indexOf(file)
            fileList.splice(index, 1)
            const newLocal = Message({
              message: `${response.msg}，${response.data}`,
              type: 'warning'
            })
          }
        } else {
          const index = fileList.indexOf(file)
          fileList.splice(index, 1)
          Message({
            message: response.msg,
            type: 'warning'
          })
        }
        // 修改组件的value值
        if (success && this.multiple) {
          console.log(1)
          // console.log(fileList);
          console.log(
            fileList
              .filter(f => f.id)
              .map(f => f.id)
              .join(',')
          )
          this.$nextTick(() => {
            this.$emit(
              'input',
              fileList
                .filter(f => f.id)
                .map(f => f.id)
                .join(',')
            )
          })
        } else if (success && !this.multiple) {
          console.log(2)
          const uploader = this.$refs.uploader
          this.currentFile = [file]

          uploader.fileList.splice(0, fileList.length, file)

          this.$nextTick(() => {
            this.$emit('input', `${file.id}`)
          })
        } else {
          this.$nextTick(() => {
            this.$emit(
              'input',
              fileList
                .filter(f => f.id)
                .map(f => f.id)
                .join(',')
            )
          })
        }
        // 修改组件的fileList
        this.fileList = fileList
        console.log('**', this.fileList)
      }
    },
    removeHandler (file, fileList) {
      if (!file) {
        return
      }

      if (this.multiple) {
        this.$emit(
          'input',
          fileList
            .filter(f => f.id)
            .map(f => f.id)
            .join(',')
        )
      } else {
        this.$emit('input', '')
      }
    },
    submitUpload () {
      console.log(this.$refs.uploader.submit)
      this.$refs.uploader.submit()
    }
  }
}
