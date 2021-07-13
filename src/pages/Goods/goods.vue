<template>
  <div class="goods">
    <grid
      ref="grid"
      :formData="searchForm"
      :tableList="columns"
      :layout="layout"
      :api="getApi"
    >
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        slot="form"
      >
        <el-form-item label="商品名称:">
          <el-input
            v-model="searchForm.content"
            placeholder="商品名称"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker
            type="datetime"
            v-model="searchForm.startTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间开始时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="至">
          <el-date-picker
            type="datetime"
            v-model="searchForm.endTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间结束时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="所属模块:">
          <el-select
            v-model="searchForm.type"
            clearable
            filterable
            size="small"
            placeholder="请选择模块"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可见小区:">
          <el-input
            v-model="searchForm.estate_name"
            placeholder="可见小区"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="toolbar">
        <!-- <el-button type="primary">导出</el-button> -->
        <el-button type="primary" @click="openDlg">新增商品</el-button>

        <el-dialog
          :title="type === 1 ? '新增商品' : '编辑商品'"
          :visible.sync="visibled"
          @close="closeDlg"
          width="700px"
        >
          <el-form
            label-width="150px"
            ref="edtForm"
            :model="edtForm"
            :rules="rules"
            v-if="visibled"
          >
            <el-form-item label="所属模块:" prop="type">
              <el-radio-group v-model="edtForm.type" @change="resetPosition">
                <el-radio
                  :label="i.value"
                  v-for="(i, index) in statusList"
                  :key="index"
                  >{{ i.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="显示位置:" prop="position">
              <!-- {{edtForm.position}} -->
              <el-radio-group v-model="edtForm.position">
                <el-radio
                  :label="i.value"
                  v-for="(i, index) in showPositionList"
                  :key="index"
                  >{{ i.name }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品名称:" prop="content">
              <el-input
                v-model="edtForm.content"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="副标题:"
              prop="remark"
              v-if="Number(edtForm.type) === 10"
            >
              <el-input v-model="edtForm.remark" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="副标题:" v-else>
              <el-input
                v-model="edtForm.remark"
                style="width:200px"
                disabled=""
              ></el-input>
            </el-form-item>
            <el-form-item label="价格:" prop="price">
              ￥<el-input
                v-model="edtForm.price"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="weight">
              <el-input
                v-model.number="edtForm.weight"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品封面:" prop="img">
              {{ tips }}
              <el-upload
                class="avatar-uploader"
                name="img"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeUpload"
                :data="oMyForm"
              >
                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="line-height:178px;"
                ></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="跳转URl类型:" prop="jump_type">
              <el-radio-group v-model="edtForm.jump_type">
                <el-radio
                  :label="i.value"
                  v-for="(i, index) in jumpType"
                  :key="index"
                  >{{ i.name }}</el-radio
                >
              </el-radio-group>

              <p v-if="edtForm.jump_type == '1' && visibled">
                <jump-info
                  :disabled="!prizeOption.app_is_jump"
                  v-model="prizeOption.APP"
                  :key-array="['jump_id', 'params']"
                ></jump-info>
              </p>
            </el-form-item>
            <!-- <el-form-item label="跳转URl:" prop="param">
              <el-input v-model="edtForm.param" style="width:400px"></el-input>
            </el-form-item> -->
            <el-form-item label="可见楼盘" prop="estate_id_list">
              <!-- {{edtForm.estate_id_list}} -->
              <estates
                v-model="edtForm.estate_id_list"
                v-if="visibled"
              ></estates>
            </el-form-item>
            <el-form-item>
              <el-button @click="closeDlg">取消</el-button>
              <el-button type="primary" @click="submitForm(edtForm)"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </grid>
  </div>
</template>

<script type="text/jsx">
import grid from '@/components/grid'
import { addGood, edtGood, getGoodDetail, changeGoodStatus, dltGood } from '@/api/index.js'
import ImgUploader from '@/components/uploader/img-uploader'
import estates from '../../components/estates.vue'
import jumpInfo from '../../components/jumpInfo.vue'

export default {
  name: 'goods',
  components: { grid, ImgUploader, estates, jumpInfo },
  mixins: [],
  props: {},
  data () {
    const self = this
    const checkPrice = function (rule, value, callback) {
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        const reg = /^(\d+|\d+\.\d{1,2})$/
        const isOk = reg.test(value)
        if (isOk) {
          callback()
        } else {
          callback(new Error('请输入正确的价格,可保留两位小数'))
        }
      }
    }
    return {
      self,
      response: '',
      searchForm: {
        content: '', // 商品名称
        starttime: '', // 时间
        endtime: '', // 时间
        type: '', // 模块
        estate_name: '' // 可见小区
      },
      type: 1, // dialog type [ 1 add ,2 edit]
      edtForm: {
        type: '', // 类型   8：福利 :9：单品 :10： 抢购
        content: '', // 名称
        position: '', // 位置  1大图  2中图  3小图 9标题
        img: '', // 图片ID
        jump_type: '',
        jump_id: '', // 跳转ID
        param: '', //  参照目前banner 的跳转
        weight: '', // 排序
        price: '', // 价格
        remark: '', // 副标题
        starttime: '', // 开始时间
        endtime: '', // 结束时间
        status: '0', // 1状态
        estate_id_list: [], // 小区
        start_version: '', // 开始版本号
        end_version: '' // 结束版本号
      },
      columns: [
        {
          type: 'default',
          label: '商品名称',
          prop: 'content'
        },
        {
          type: 'default',
          label: '商品图片',
          prop: 'img',
          render (h, {row}) {
            return (<img src={ row.img } style="width:40px;height:40px;"/>)
          }
        },
        {
          type: 'default',
          label: '所属模块',
          prop: 'type_name'
        },
        {
          type: 'default',
          label: '排序',
          prop: 'weight'
        },
        {
          type: 'default',
          label: '可见小区',
          prop: 'estate_name',
          render (h, { row }) {
            let txt = row.estate_name
            if (txt.length > 50) {
              txt = txt.slice(0, 49).concat('...')
            }
            return txt
          }
        },
        {
          type: 'default',
          label: '创建时间',
          prop: 'add_time'
        },
        {
          type: 'default',
          label: '操作',
          render (h, { row }) {
            const edit = <el-button type="text" size="mini" onClick={() => { this.goEdt(row) }}>编辑</el-button>
            const del = <el-button type="text" size="mini" onClick={() => { this.dltGood(row) }}>删除</el-button>
            const changStatus = <el-button type="text" size="mini" onClick={() => { this.changeStatus(row) }}>{
              Number(row.status) === 1 ? '上架' : '下架'
            }</el-button>
            return [edit, del, changStatus]
          }
        }
      ],
      rules: {
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        content: [{ required: true, message: '不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'blur' }],
        position: [{ required: true, message: '不能为空', trigger: 'change' }],
        starttime: [{ required: true, message: '不能为空', trigger: 'change' }],
        endtime: [{ required: true, message: '不能为空', trigger: 'change' }],
        img: [{ required: true, message: '不能为空', trigger: 'change' }],
        estate_id_list: [{ required: true, message: '不能为空', trigger: 'blur' }],
        start_version: [{ required: true, message: '不能为空', trigger: 'blur' }],
        end_version: [{ required: true, message: '不能为空', trigger: 'blur' }],
        jump_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        jump_id: [{ required: true, message: '不能为空', trigger: 'change' }],
        param: [{ required: true, message: '不能为空', trigger: 'blur' }],
        weight: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值', trigger: 'blur' }],
        // price: [{ required: true, message: '不能为空', trigger: 'blur' }],
        price: [{ validator: checkPrice, trigger: 'blur' }, { required: true, message: '不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      layout: ['form', 'toolbar', 'table', 'pagination'], // 有form 必须要有插槽内容
      getApi: '/LinliAPPHomePage/GoodManage/getData',
      statusList: [
        // {
        //   name: '全部',
        //   value: 0
        // },
        {
          name: '福利专区',
          value: 8
        },
        {
          name: '精选单品',
          value: 9
        },
        {
          name: '抢购',
          value: 10
        }
      ],
      positionList: [
        {
          name: '大封面区',
          value: 1
        },
        {
          name: '中封面区',
          value: 2
        },
        {
          name: '小封面区',
          value: 3
        },
        {
          name: '标题',
          value: 9
        },
        {
          name: '常规',
          value: 0
        },
        {
          name: '更多',
          value: 8
        }
      ],
      jumpType: [
        {
          name: '外部链接',
          value: '1'
        }
        // {
        //   name: 'app内置页面',
        //   value: 2
        // }
      ],
      action: '/qwerty.php/LinliAPPHomePage/BannerManage/uploadImage',
      visibled: false, // 对话框
      // 图片相关
      oMyForm: {}, // 图片上传数据源
      prizeOption: {
        APP: '',
        app_is_jump: '0'
      },
      imgUrl: '' // 上传的图片url

    }
  },
  computed: {
    showPositionList () {
      if (Number(this.edtForm.type) === 8) {
        return this.positionList.slice(0, 4)
      } else if (Number(this.edtForm.type) === 9) {
        return this.positionList.slice(3, 6)
      } else {
        return this.positionList.slice(3, 5)
      }
    },
    edtFormType () {
      return this.edtForm.type
    },
    tips () {
      // 模块01标题——690*100px
      // 模块01大封面——337*330px
      // 模块01中封面——358*188px
      // 模块01小封面——330*108px
      // 模块02标题——690*170px
      // 模块02常规——208*194px
      // 模块03常规——284*284px
      if (Number(this.edtForm.type) === 8) {
        if (Number(this.edtForm.position) === 1) {
          return ' (建议尺寸337*330px）'
        } else if (Number(this.edtForm.position) === 2) {
          return ' (建议尺寸358*188px）'
        } else if (Number(this.edtForm.position) === 3) {
          return ' (建议尺寸330*108px）'
        } else if (Number(this.edtForm.position) === 9) {
          return ' (建议尺寸690*100px）'
        }
      } else if (Number(this.edtForm.type) === 9) {
        if (Number(this.edtForm.position) === 0) {
          return ' (建议尺寸208*194px）'
        } else if (Number(this.edtForm.position) === 9) {
          return ' (建议尺寸690*170px）'
        }
      } else if (Number(this.edtForm.type) === 10) {
        if (Number(this.edtForm.position) === 0) {
          return ' (建议尺寸284*284px）'
        }
      }
    }
  },
  created () { },
  mounted () { },
  methods: {
    /**
     * @description: 更改状态
     */
    async changeStatus (row, type) {
      let params = ''
      params = {
        status: Number(row.status) === 1 ? 0 : 1, // 1:上架 0 ：下架
        id: row.id
      }
      const res = await changeGoodStatus(params)
      if (res.code === '0001') {
        // console.log(this.$refs.grid.query)
        this.$refs.grid.query()
      }
    },
    async dltGood (row) {
      const res = await dltGood(
        {
          id: row.id
        }
      )
      if (res.code === '0001') {
        // console.log(this.$refs.grid.query)
        this.$refs.grid.query()
      }
    },
    //  获取详情
    async getGoodDetail (id) {
      const res = await getGoodDetail({
        id: id // 主键ID
      })
      if (res.code === '0001') {
        // console.log(res)
        // const { type, content, status, position, starttime, endtime, img, estate_id_list, start_version, end_version, jump_id, param, weight, price, remark, id } = res.data
        // this.edtForm = { type, content, status, position, starttime, endtime, img, estate_id_list, start_version, end_version, jump_id, param, weight, price, remark, id }
        this.edtForm.type = Number(res.data.type)// 类型   8：福利 :9：单品 :10： 抢购
        this.edtForm.content = res.data.content // 名称
        this.edtForm.position = Number(res.data.position) // 位置  1大图  2中图  3小图 9标题
        this.edtForm.img = res.data.img// 图片ID
        this.edtForm.jump_type = res.data.jump_type // 跳转ID
        this.edtForm.jump_id = res.data.jump_id // 跳转ID
        // console.log(this.edtForm.jump_id)
        this.$set(this.prizeOption, 'APP', {
          jump_id: res.data.jump_id,
          params: JSON.parse(res.data.params)
        })
        // console.log(this.prizeOption)
        this.edtForm.weight = Number(res.data.weight) // 排序
        this.edtForm.price = res.data.price // 价格
        this.edtForm.remark = res.data.remark // 副标题
        this.edtForm.starttime = res.data.starttime // 开始时间
        this.edtForm.endtime = res.data.endtime // 结束时间
        this.edtForm.status = res.data.status // -1状态
        this.edtForm.estate_id_list = res.data.estate_id_list.split(',') // 小区
        console.log(this.edtForm.estate_id_list)
        this.edtForm.start_version = res.data.start_version // 开始版本号
        this.edtForm.end_version = res.data.end_version // 结束版本号
        this.imgUrl = res.data.imgUrl // 结束版本号
        this.$set(this.edtForm, 'id', res.data.id)
        this.type = 2
        this.openDlg()
      }
    },
    async addGood (params) {
      params.jump_id = this.prizeOption.APP.jump_id
      params.param = this.prizeOption.APP.params
      params.estate_id_list = params.estate_id_list.join(',')
      const res = await addGood(params)
      if (res.code === '0001') {
        this.closeDlg()
        console.log(this.$refs.grid.query)
        this.$refs.grid.query()
      }
    },
    async edtGood (params) {
      params.jump_id = this.prizeOption.APP.jump_id
      params.param = this.prizeOption.APP.params
      params.estate_id_list = params.estate_id_list.join(',')

      const res = await edtGood(params)
      if (res.code === '0001') {
        console.log(this.$refs.grid.query)
        this.closeDlg()
        this.$refs.grid.query()
      }
    },
    goEdt (row) {
      this.getGoodDetail(row.id)
    },
    closeDlg () {
      this.type = 1 // 复原
      this.resetForm('edtForm')
    },
    resetForm (formName) {
      this.$refs.edtForm.resetFields()
      this.imgUrl = ''
      this.edtForm.content = ''
      this.edtForm.type = ''
      this.edtForm.position = ''
      this.edtForm.img = ''
      this.edtForm.jump_type = ''
      this.edtForm.jump_id = ''
      this.edtForm.param = ''
      this.edtForm.weight = ''
      this.edtForm.price = ''
      this.edtForm.remark = ''
      this.edtForm.starttime = ''
      this.edtForm.endtime = ''
      this.edtForm.status = '0'
      this.edtForm.estate_id_list = []
      this.edtForm.start_version = ''
      this.edtForm.end_version = ''
      this.edtForm.id = ''
      this.prizeOption = {
        APP: '',
        app_is_jump: '0'
      }
      // this.edtForm = {
      //   type: '', // 类型   8：福利 :9：单品 :10： 抢购
      //   content: '', // 名称
      //   position: '', // 位置  1大图  2中图  3小图 9标题
      //   img: '', // 图片ID
      //   jump_type: '',
      //   jump_id: '', // 跳转ID
      //   param: '', //  参照目前banner 的跳转
      //   weight: '', // 排序
      //   price: '', // 价格
      //   remark: '', // 副标题
      //   starttime: '', // 开始时间
      //   endtime: '', // 结束时间
      //   status: '0', // 1状态
      //   estate_id_list: [], // 小区
      //   start_version: '', // 开始版本号
      //   end_version: '' // 结束版本号
      // }
      console.log(this.edtForm)
      console.log(this.type)
      this.visibled = false
    },
    openDlg () {
      this.visibled = true
    },
    submitForm (form) {
      this.$refs.edtForm.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            this.addGood(Object.assign({}, this.edtForm))
          } else if (this.type === 2) {
            this.edtGood(Object.assign({}, this.edtForm))
          }
        } else {
          return false
        }
      })
    },
    // 图片相关
    handleAvatarSuccess (res, file) {
      if (res.code === '0001') {
        this.edtForm.img = res.data.id
        this.imgUrl = res.data.url
      } else {
        // this.Ids.push('101');//非法请求就写默认
        this.$message(res.msg)
      }
    },
    beforeUpload (file) {
      this.oMyForm.returnJson = '1'
      this.oMyForm.id = 'WU_FILE_0'
      this.oMyForm.type = file.type
      this.oMyForm.lastModifiedDate = file.lastModifiedDate
      this.oMyForm.size = file.size
      this.oMyForm.name = file.name
    },
    resetPosition () {
      this.edtForm.position = ''
    }
  },
  filter () { },
  watch: {
  }
}
</script>
<style lang="less">
// @import '';
.goods {
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
  width: 178px;
  height: 178px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #cccccc;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  left: 50%;
}
</style>
