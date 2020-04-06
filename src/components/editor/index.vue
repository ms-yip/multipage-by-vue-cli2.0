<!-- 编辑器 -->

<template>
  <quill-editor
    class="editor"
    :value="content"
    ref="myQuillEditor"
    @change="changValue"
    :options="editorOption"
  >
  </quill-editor>
</template>

<script>
// import Quill from 'quill';
import { Quill } from 'vue-quill-editor'
// import VueQuillEditor, { Quill } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
// import ImageResize from 'quill-image-resize-module'
// import VideoResize from 'quill-video-resize-module'

import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'

// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
let fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong',
  'Arial',
  'Times-New-Roman',
  'sans-serif'
]
let Font = Quill.import('formats/font')
Font.whitelist = fonts // 将字体加入到白名单
Quill.register(Font, true)

Quill.register('modules/ImageExtend', ImageExtend)
// Quill.register('modules/imageResize', ImageResize)
// Quill.register('modules/VideoResize', VideoResize)
// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//   // ['blockquote', 'code-block'],

//   [{ header: 1 }, { header: 2 }], // custom button values
//   [{ list: 'ordered' }, { list: 'bullet' }],
//   // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
//   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
//   [{ direction: 'rtl' }], // text direction

//   [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],

//   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//   [{ font: [] }],
//   [{ align: [] }],
//   ['clean'], // remove formatting button
//   ['link', 'image']
// ]
export default {
  name: 'editor',
  // components: { VueQuillEditor },

  mixins: [],

  props: {
    content: {
      type: String
    }
  },

  data () {
    return {
      editorOption: {
        modules: {
          // imageResize: {
          //   handleStyles: {
          //     backgroundColor: 'red',
          //     border: 'none',
          //     color: 'green'
          //     // other camelCase styles for size display
          //   },
          //   displayStyles: {
          //     backgroundColor: 'red',
          //     border: 'none',
          //     color: 'green'
          //     // other camelCase styles for size display
          //   }
          // },
          // videoResize: {
          //   handleStyles: {
          //     backgroundColor: 'blue',
          //     border: 'blue',
          //     color: 'red'
          //     // other camelCase styles for size display
          //   },
          //   displayStyles: {
          //     backgroundColor: 'red',
          //     border: 'red',
          //     color: 'green'
          //     // other camelCase styles for size display
          //   }
          // },
          ImageExtend: {
            // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
            name: 'img', // 图片参数名
            size: 20, // 可选参数 图片大小，单位为M，1M = 1024kb
            action: '/qwerty.php/LinliAPPHomePage/BannerManage/uploadImage', // 服务器地址, 如果action为空，则采用base64插入图片
            // response 为一个函数用来获取服务器返回的具体图片地址
            // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
            // 则 return res.data.url
            response: res => {
              if (res.code === '0001') {
                if (res.data.id) {
                  // console.log(`${location.protocol}//${location.host}/times-bhk/img/${res.data.id}`)
                  // return `${location.protocol}//${location.host}/times-bhk/img/${res.data.id}`
                  console.log(res.data.url)
                  return res.data.url
                } else {
                  this.$message.error('获取图片失败')
                  return ''
                }
              } else {
                this.$message.error(res.msg)
                return ''
              }
            },
            //   headers: xhr => {
            //     xhr.setRequestHeader(
            //       'token',
            //       `${localStorage.getItem('_token')}`
            //     )
            //   }, // 可选参数 设置请求头部
            //   sizeError: () => {
            //     // @TODO 添加
            //     this.$message.error(
            //       '提示信息: 上传图片超过' +
            //         this.editorOption.modules.ImageExtend.size +
            //         'M'
            //     )
            //   }, // 图片超过大小的回调
            //   start: () => {}, // 可选参数 自定义开始上传触发事件
            //   end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            //   error: () => {
            //     this.$message.error('提示信息: 上传图片失败')
            //   }, // 可选参数 上传失败触发的事件
            //   success: () => {}, // 可选参数  上传成功触发的事件
            change: (xhr, formData) => {
              // xhr.setRequestHeader('myHeader','myValue')
              // formData.append('token', 'myToken')
              console.log(xhr)
              formData.append('returnJson', '1')
              formData.append('id', 'WU_FILE_0')
              formData.append('type', '')
              formData.append('lastModifiedDate', '')
              formData.append('size', '')
              formData.append('name', '')
            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          toolbar: {
            // 如果不上传图片到服务器，此处不必配置
            container: container, // container为工具栏，此次引入了全部工具栏，也可自行配置
            // container: toolbarOptions, // container为工具栏，此次引入了全部工具栏，也可自行配置
            handlers: {
              image: function () {
                // 劫持原来的图片点击按钮事件
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      }
    }
  },

  computed: {},

  watch: {},

  created () {},

  mounted () {},

  methods: {
    changValue (editor) {
      this.$emit('update:content', editor.html.replace('[upload error]', ''))
      this.$emit('validata', true)
    },
    // 方法弃用,升级成quill-image-extend-module
    quillRedefineSetting () {
      this.editorOption = quillRedefine({
        // 图片上传的设置
        uploadConfig: {
          action: '/index.php/api/file/upload', // 必填参数 图片上传地址
          // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
          // 你必须把返回的数据中所包含的图片地址 return 回去
          res: response => {
            return response.data.url
          },
          // 设置
          header: (xhr, formData) => {
            xhr.setRequestHeader('token', `${localStorage.getItem('_token')}`)
            // formData.append('token', `${localStorage.getItem('_token')}`)
          },
          methods: 'POST', // 可选参数 图片上传方式  默认为post
          // token: `${localStorage.getItem('_token')}`, // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
          name: 'file', // 可选参数 文件的参数名 默认为img
          size: 500, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
          accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon', // 可选参数 可上传的图片格式
          // input点击事件  formData是提交的表单实体
          change: formData => {},
          // start: function (){}
          start: () => {}, // 可选参数 接收一个函数 开始上传数据时会触发
          end: () => {}, // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
          success: () => {}, // 可选参数 接收一个函数 上传数据成功时会触发
          error: response => {
            this.$notify.error({
              title: '提示',
              message: '图片上传:' + response.msg
            })
          } // 可选参数 接收一个函数 上传数据中断时会触发
        },
        // 以下所有设置都和vue-quill-editor本身所对应
        placeholder: '请填写内容', // 可选参数 富文本框内的提示语
        theme: 'snow', // 可选参数 富文本编辑器的风格
        toolOptions: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          // ['blockquote', 'code-block'],

          // [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'],
          // ['link', 'image', 'video']
          ['link', 'image']
        ], // 可选参数  选择工具栏的需要哪些功能  默认是全部
        handlers: {} // 可选参数 重定义的事件，比如link等事件
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "./font.css";
.editor {
  .quill-editor iframe {
    pointer-events: none;
  }
}
</style>
