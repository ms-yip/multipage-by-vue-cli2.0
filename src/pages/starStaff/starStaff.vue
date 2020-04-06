<template>
  <div class="el-container">
    <div class="tree" style="">
      <!-- <estates v-model="edtForm.estate_id" :type="2"></estates> -->
      <el-tree
        :data="estateList"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :highlight-current="true"
        node-key="id"
        :default-expanded-keys="openKeyArr"
      ></el-tree>
    </div>
    <grid
      class="flex-r el-main"
      ref="grid"
      :formData="searchForm"
      :tableList="columns"
      :layout="layout"
      :api="getApi"
    >
      <el-form :inline="true" :model="{}" class="demo-form-inline" slot="form">
        <!-- <el-form-item v-if="searchForm.estate_id">
          可见楼盘筛选: {{selectedKeyNode.account_name }}
        </el-form-item> -->
        <el-form-item label="员工姓名:">
          <el-input
            v-model="searchForm.name"
            placeholder="员工姓名"
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
        <el-form-item label="至:">
          <el-date-picker
            type="datetime"
            v-model="searchForm.endTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间结束时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 对话框，按钮 -->
      <div slot="toolbar">
        <exporter
          api="/qwerty.php/LinliStar/Star/getStarList"
          :params="{ ...searchForm, export: 1 }"
          buttonName="导出"
        ></exporter>
        <el-button type="primary" @click="openDlg">新增员工</el-button>
        <!-- 编辑 -->
        <el-dialog
          :title="type === 1 ? '新增员工' : '编辑员工'"
          :visible.sync="visibled"
          @close="closeDlg"
          width="700px"
        >
          <el-form
            v-if="visibled"
            label-width="150px"
            ref="edtForm"
            :rules="rules"
            :model="edtForm"
          >
            <h3>基本信息</h3>
            <el-form-item label="员工姓名:" prop="name">
              <el-input v-model="edtForm.name" style="width:250px"></el-input>
            </el-form-item>
            <el-form-item label="员工岗位:" prop="station">
              <el-input
                v-model="edtForm.station"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="员工所属楼盘:" prop="estate">
              <el-input v-model="edtForm.estate" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="员工头像:" prop="pic_face">
              <span>(建议尺寸233px*233px）</span>
              <el-upload
                class="avatar-uploader"
                name="img"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeUpload"
                :data="oMyForm"
              >
                <img v-if="imgUrl1" :src="imgUrl1" class="avatar" />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="line-height:178px;"
                ></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="员工封面:" prop="pic">
              <span>(建议尺寸1036px*744px）</span>
              <el-upload
                class="avatar-uploader"
                name="img"
                :action="action"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeUpload"
                :data="oMyForm"
              >
                <img v-if="imgUrl2" :src="imgUrl2" class="avatar" />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="line-height:178px;"
                ></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="排序:" prop="sorting">
              <el-input
                v-model.number="edtForm.sorting"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="可见楼盘:">
              <div style="max-height: 300px;overflow:auto">
                <div v-if="type === 1">
                  <estates v-model="edtForm.estate_id"></estates>
                  <!-- <el-tree
                    v-if="visibled"
                    ref="tree"
                    :data="estateList"
                    :props="defaultProps"
                    @node-click="handleNodeClickSelect"
                    :expand-on-click-node="false"
                    node-key="pk_corp"
                    show-checkbox
                    :default-checked-keys="edtForm.estate_id"
                    :default-expanded-keys="openKeyArr"
                  ></el-tree> -->
                </div>
                <div v-if="type === 2">
                  {{ disabledEstateList }}
                </div>
              </div>
            </el-form-item>
            <h3>员工介绍</h3>
            <el-form-item label="员工简介:" prop="detail">
              <editor
                :content.sync="edtForm.detail"
                v-model="edtForm.detail"
                @validata="valicontent('detail')"
              ></editor>
            </el-form-item>
            <el-form-item label="员工成就:" prop="detail_new">
              <editor
                :content.sync="edtForm.detail_new"
                v-model="edtForm.detail_new"
                @validata="valicontent('detail_new')"
              ></editor>
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
import { changeStaffStatus, updateStaff, getEstateList, getOneStar } from '@/api/index.js'
import ImgUploader from '@/components/uploader/img-uploader'

// import ImgUploader from '@/components/uploader/img-uploader'
import editor from '../../components/editor/index'
import exporter from '../../components/exporter/exportor'
import estates from '../../components/estates.vue'

export default {
  name: 'starStaff',
  components: { grid, ImgUploader, editor, exporter, estates },
  // components: { grid, editor },
  // components: { grid, editor, ImgUploader },
  mixins: [],
  props: {},
  data () {
    const self = this
    return {
      // 数
      data: [],
      defaultProps: {
        children: 'children',
        label: 'account_smart_name'
      },
      self,
      estateList: [], // 小区列表
      disabledEstateList: [], // 小区禁选
      openKeyArr: [],
      selectedKeyNode: {},
      searchForm: {
        estate_id: '',
        name: '',
        startTime: '',
        endTime: ''
      },
      type: 1, // dialog type [ 1 add ,2 edit]
      edtForm: {
        name: '', // 名字
        station: '', // 岗位
        estate: '', // 员工所在楼盘
        pic: '', //
        pic_face: '', // 照片
        sorting: '', // 表面照片
        estate_id: [], // 小区id
        detail: '', // 员工介绍
        id: '', // 更新带id，添加数据不要带id
        detail_new: '' /// 员工成就
      },
      edtFormTreeNodes: [],
      columns: [
        {
          type: 'default',
          label: '员工姓名',
          prop: 'name'
        },
        {
          type: 'default',
          label: '员工图片',
          prop: 'pic',
          render (h, {row}) {
            return (<img src={row.pic_url} style="width:40px;height:40px;"/>)
          }
        },
        {
          type: 'default',
          label: '排序',
          prop: 'sorting'
        },
        {
          type: 'default',
          label: '创建时间',
          prop: 'create_time'
        },
        {
          type: 'default',
          label: '操作',
          render (h, { row }) {
            const edit = <el-button type="text" size="mini" onClick={() => { this.goEdt(row) }}>编辑</el-button>
            const del = <el-button type="text" size="mini" onClick={() => { this.changeStatus(row, 2) }}>删除</el-button>
            const changStatus = <el-button type="text" size="mini" onClick={() => { this.changeStatus(row, 1) }}>{
              Number(row.status) === 1 ? '下架' : '上架'
            }</el-button>
            return [edit, del, changStatus]
          }
        }
      ],
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        station: [{ required: true, message: '不能为空', trigger: 'blur' }],
        estate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        degree: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pic: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pic_face: [{ required: true, message: '不能为空', trigger: 'blur' }],
        sorting: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值', trigger: 'blur' }],
        // estate_id: [{ required: true, message: '不能为空', trigger: 'change' }],
        detail: [{ required: true, message: '不能为空', trigger: 'blur' }],
        detail_new: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      layout: ['form', 'toolbar', 'table', 'pagination'], // 有form 必须要有插槽内容
      getApi: '/LinliStar/Star/getStarList',
      statusList: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '生效',
          value: 1
        },
        {
          name: '已解绑',
          value: 2
        }
      ],
      visibled: false, // 对话框
      innerVisible: false, // 内层对话框
      action: '/qwerty.php/LinliAPPHomePage/BannerManage/uploadImage',
      oMyForm: {}, // 图片上传数据源
      imgUrl1: '', // 员工图片
      imgUrl2: '' // 员工图片
    }
  },
  computed: {},
  created () {
    this.getEstateList()
  },
  mounted () { },
  methods: {
    closeDlg () {
      this.type = 1 // 复原
      this.resetForm('edtForm')
    },
    resetForm (formName) {
      this.$refs.edtForm.resetFields()
      console.log(this.edtForm)
      this.imgUrl1 = ''
      this.imgUrl2 = ''
      this.edtForm.detail = ''
      this.edtForm.id = ''
      this.edtForm.detail_new = ''
      this.edtForm.name = ''
      this.edtForm.estate = ''
      this.edtForm.station = ''
      this.edtForm.pic = ''
      this.edtForm.pic_face = ''
      this.edtForm.sorting = ''
      this.edtForm.estate_id = []
      this.edtFormTreeNodes = []

      this.visibled = false
    },
    valicontent (val) {
      this.$refs.edtForm.validateField(val)
    },
    /**
     * @description:
     * @param {type}
     * @return:
     */
    handleSuccess () {
      console.log('enter pic success handler')
    },
    /**
     * @description: 更改状态
     */
    async changeStatus (row, type) {
      //  type 1 上下架 2 删除
      let params = ''
      if (type === 1) {
        params = {
          status: Number(row.status) === 1 ? 2 : 1, // 1:上架2：下架
          id: row.id
        }
      } else {
        params = {
          is_delete: 2, // 1:正常 2：删除  status 只能选中其中一个字段
          id: row.id
        }
      }
      /* status: '', // 1:上架2：下架
        is_delete: '', // 1:正常 2：删除  status 只能选中其中一个字段
        id: ''
        */
      const res = await changeStaffStatus(params)
      if (res.code === '0001') {
        console.log(this.$refs.grid.query)
        this.$refs.grid.query()
      }
    },
    /**
     * @description: request staff detail & open dialog
     * @param {Object} row
     * @return: undefined
     */
    async goEdt (row) {
      const res = await getOneStar({
        id: row.id
      })
      if (res.code === '0001') {
        this.openDlg()
        this.edtForm.name = res.data.name // 名字
        this.edtForm.station = res.data.station // 岗位
        this.edtForm.estate = res.data.estate // 岗位
        this.edtForm.pic = res.data.pic //
        this.edtForm.pic_face = res.data.pic_face // 照片
        this.imgUrl1 = res.data.pic_url
        this.imgUrl2 = res.data.pic_face_url
        this.edtForm.sorting = Number(res.data.sorting) // 表面照片
        this.edtForm.estate_id = res.data.estate_id.split(',')// 小区id
        this.edtForm.detail = res.data.detail // 员工介绍
        this.edtForm.id = res.data.id // 更新带id，添加数据不要带id
        this.edtForm.detail_new = res.data.detail_new /// 员工成就
        this.disabledEstateList = res.data.estate_name
        this.type = 2
      }
    },
    async updateStaff (type) {
      // type 1 add 2 edit
      let params = ''
      if (type === 1) {
        params = Object.assign({}, this.edtForm)
        console.log(params)
        params.estate_id = params.estate_id.join(',')
      } else {
        params = Object.assign({}, this.edtForm)
        params.estate_id = params.estate_id.join(',')
      }
      const res = await updateStaff(params)
      if (res.code === '0001') {
        this.closeDlg()
        this.$refs.grid.query()
      }
    },

    async getEstateList () {
      const res = await getEstateList()
      if (res.code === '0001') {
        this.estateList = res.data
        this.openKeyArr = []
        this.estateList.forEach(element => {
          this.openKeyArr.push(element.id)
          // element.children.forEach(x => {
          //   this.openKeyArr.push(x.id)
          // })
        })
        console.log(this.openKeyArr)
      }
    },
    openDlg () {
      this.visibled = true
    },
    submitForm (form) {
      this.$refs.edtForm.validate((valid) => {
        if (valid) {
          this.updateStaff(1)
        } else {
          return false
        }
      })
    },
    // 图片相关
    handleAvatarSuccess1 (res, file) {
      if (res.code === '0001') {
        this.edtForm.pic = res.data.id
        this.imgUrl1 = res.data.url
      } else {
        // this.Ids.push('101');//非法请求就写默认
        this.$message(res.msg)
      }
    },
    handleAvatarSuccess2 (res, file) {
      if (res.code === '0001') {
        this.edtForm.pic_face = res.data.id
        this.imgUrl2 = res.data.url
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
    handleNodeClick (data) {
      console.log(data)
      this.selectedKeyNode = data
      this.searchForm.estate_id = this.selectedKeyNode.id
      this.$refs.grid.query()
    },
    handleNodeClickSelect (data) {
      console.log(data)
    },
    submitFormSelect () {
      this.innerVisible = false
      const nodes = this.$refs.tree.getCheckedNodes(true, false)
      this.edtFormTreeNodes = nodes
      this.edtForm.estate_id = []
      this.edtFormTreeNodes.forEach(i => {
        this.edtForm.estate_id.push(i.id)
      })
    }
  },
  filter () { },
  watch: {}
}
</script>
<style lang="less">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}
.tree {
  width: 200px;
  overflow: auto;
  min-height: calc(100vh - 145px);
  max-height: calc(100vh - 145px);
}
.tree, .el-tree{
  background: rgba(240, 240, 240, 0.10);;

}
// @import '';
.starStaff {
  display: flex;
  .flex-l {
    width: 250px;
    max-width: 250px;
    background-color: #eeeeee;
    height: 95vh;
    overflow: auto;
  }
  .flex-r {
    // min-width: 800px;
    margin-left: 20px;
  }
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
