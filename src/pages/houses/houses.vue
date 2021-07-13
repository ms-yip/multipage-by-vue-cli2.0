
<template>
  <div class="houses">
    <grid ref="grid" :formData="searchForm" :tableList="columns" :layout="layout" :api="getApi">
      <el-form :inline="true" :model="{}" class="demo-form-inline" slot="form">
        <el-form-item label="业主姓名:">
          <el-input v-model="searchForm.owner_name" placeholder="业主姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="房屋号:">
          <el-input v-model="searchForm.room" placeholder="房屋号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机号:">
          <el-input v-model="searchForm.mobile" placeholder="绑定家人手机号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="认证状态">
          <el-select
            v-model="searchForm.identity_status"
            clearable
            filterable
            size="small"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认证时间:">
          <el-date-picker
            type="datetime"
            v-model="searchForm.identity_begin_time"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间开始时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="至:">
          <el-date-picker
            type="datetime"
            v-model="searchForm.identity_end_time"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间结束时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select
            v-model="searchForm.id_card_type"
            clearable
            filterable
            size="small"
            placeholder="请选择证件类型"
          >
            <el-option
              v-for="item in cardTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号:">
          <el-input v-model="searchForm.id_card" placeholder="证件号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="认证方式">
          <el-select
            v-model="searchForm.identity_type"
            clearable
            filterable
            size="small"
            placeholder="请选择认证方式"
          >
            <el-option
              v-for="item in attestationTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提交时间:">
          <el-date-picker
            type="datetime"
            v-model="searchForm.submit_begin_time"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间开始时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="至:">
          <el-date-picker
            type="datetime"
            v-model="searchForm.submit_end_time"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择时间结束时间"
            size="small"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </grid>
  </div>
</template>

<script type="text/jsx">
import grid from '@/components/grid'
import { getIdType, untiedUser } from '@/api/index.js'

export default {
  name: 'houses',
  components: { grid },
  mixins: [],
  props: {},
  data () {
    return {
      searchForm: {
        owner_name: '',
        room: '',
        mobile: '',
        identity_status: '',
        identity_begin_time: '',
        identity_end_time: '',
        id_card_type: '',
        id_card: '',
        identity_type: '',
        submit_begin_time: '',
        submit_end_time: ''
      },
      columns: [
        {
          type: 'default',
          label: '业主姓名',
          prop: 'owner_name'
        },
        {
          type: 'default',
          label: '房屋号',
          prop: 'room'
        },
        {
          type: 'default',
          label: '绑定手机号',
          prop: 'mobile'
        },
        {
          type: 'default',
          label: '证件类型',
          prop: 'id_card_type'
        },
        {
          type: 'default',
          label: '证件号',
          prop: 'id_card'
        },
        {
          type: 'default',
          label: '认证方式',
          prop: 'auth_type'
        },
        {
          type: 'default',
          label: '提交时间',
          prop: 'submit_time'
        },
        {
          type: 'default',
          label: '认证时间',
          prop: 'add_time'
        },
        {
          type: 'default',
          label: '认证状态',
          prop: 'auth_status_name'
        },
        {
          type: 'default',
          label: '失败原因',
          prop: 'remark'
        },
        {
          type: 'default',
          label: '操作',
          render (h, { row }) {
            return <el-button type="text" size="mini" onClick={() => { this.changeStatus(row) }}>解绑</el-button>
          }
        }
      ],
      layout: ['form', 'table', 'pagination'], // 有form 必须要有插槽内容
      getApi: '/LinliUserAuth/UserAuth/OwnerList',
      statusList: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '已认证',
          value: 1
        },
        {
          name: '取消认证',
          value: 2
        },
        {
          name: '待审核',
          value: 3
        },
        {
          name: '审核失败',
          value: 4
        }
      ],
      cardTypeList: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '身份证',
          id: 1
        },
        {
          name: '户口本',
          id: 2
        },
        {
          name: '港澳居住证',
          id: 3
        }
      ],
      attestationTypeList: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '系统认证',
          value: 1
        },
        {
          name: '人工认证',
          value: 2
        }
      ]
    }
  },
  computed: {},
  created () {
    this.getIdType()
  },
  mounted () { },
  methods: {
    /**
    * @description: 更改状态
    */
    changeStatus (v) {
      this.untiedUser(1, v.id)
    },
    async getIdType () {
      const res = await getIdType({})
      this.cardTypeList = res
    },
    // 解绑
    async untiedUser (type, id) {
      const res = await untiedUser({
        type: type, // 1业主 2家人 3租客
        id: id // 主键ID
      })
      if (res.code === '0001') {
        console.log(this.$refs.grid.query)
        this.$refs.grid.query()
      }
    }
  },
  filter () { },
  watch: {}
}
</script>
<style lang="less" scoped>
// @import '';
.houses {
}
</style>
