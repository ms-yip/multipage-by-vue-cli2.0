

<template>
  <div class="tenants">
    <grid ref="grid" :formData="searchForm" :tableList="columns" :layout="layout" :api="getApi">
      <el-form :inline="true" :model="{}" class="demo-form-inline" slot="form">
        <el-form-item label="租客姓名:">
          <el-input v-model="searchForm.renter_name" placeholder="租客姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="租客手机号:">
          <el-input v-model="searchForm.renter_mobile" placeholder="租客手机号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="租期:">
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
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
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
        <el-form-item label="业主姓名">
          <el-input v-model="searchForm.owner_name" placeholder="业主姓名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="证件号">
          <el-input v-model="searchForm.family_license" placeholder="证件号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="所在小区">
          <el-input v-model="searchForm.owner_estate" placeholder="所在小区" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template slot="toolbar">
        <el-button type="primary" size="small">
          <i class="el-icon-plus"></i> 导出
        </el-button>
      </template>
    </grid>
  </div>
</template>

<script type="text/jsx">
import grid from '@/components/grid'
import { untiedUser } from '@/api/index.js'

export default {
  name: 'tenants',
  components: { grid },
  mixins: [],
  props: {},
  data () {
    return {
      searchForm: {
        renter_name: '',
        renter_mobile: '',
        status: '',
        family_license: '',
        startTime: '',
        endTime: '',
        owner_estate: '',
        owner_name: ''
      },
      columns: [{
        type: 'default',
        label: '租客姓名',
        prop: 'renter_name'
      },
      {
        type: 'default',
        label: '租客手机号',
        prop: 'renter_mobile'
      },
      {
        type: 'default',
        label: '证件号',
        prop: 'renter_license'
      },
      {
        type: 'default',
        label: '业主名称',
        prop: 'owner_name'
      },
      {
        type: 'default',
        label: '所在小区',
        prop: 'owner_estate'
      },
      {
        type: 'default',
        label: '租期',
        prop: 'rent_data'
      },
      {
        type: 'default',
        label: '添加时间',
        prop: 'add_time'
      },
      {
        type: 'default',
        label: '状态',
        prop: 'status'
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
      getApi: '/LinliUserAuth/UserAuth/RenterList',
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
          name: '失效',
          value: 2
        },
        {
          name: '已解绑',
          value: 3
        }
      ]
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    /**
    * @description: 更改状态
    */
    changeStatus (v) {
      this.untiedUser(3, v.id)
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
.tenants {
}
</style>
