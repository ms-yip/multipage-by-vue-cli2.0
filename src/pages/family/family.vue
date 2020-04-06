<!--
 * @Description: 邻里邦后台_业主家人
 * @Autor: yeminshan
 * @Date: 2019-10-11 17:44:36
 * @LastEditors: ms.y
 * @LastEditTime: 2020-04-06 22:15:24
 -->

<template>
  <div class="family">
    <grid
      ref="grid"
      :formData="searchForm"
      :tableList="columns"
      :layout="layout"
      :api="getApi"
    >
      <el-form :inline="true" :model="{}" class="demo-form-inline" slot="form">
        <el-form-item label="家人姓名:">
          <el-input
            v-model="searchForm.family_name"
            placeholder="家人姓名"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="家人手机号:">
          <el-input
            v-model="searchForm.family_mobile"
            placeholder="家人手机号"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加时间:">
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
          <el-input
            v-model="searchForm.owner_name"
            placeholder="业主姓名"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
    </grid>
  </div>
</template>

<script type="text/jsx">
import grid from '@/components/grid'
import { login, untiedUser } from '@/api/index.js'

export default {
  name: 'family',
  components: { grid },
  mixins: [],
  props: {},
  data () {
    const self = this
    return {
      self,
      searchForm: {
        family_name: '',
        family_mobile: '',
        startTime: '',
        endTime: '',
        status: '',
        owner_name: ''
      },
      columns: [
        {
          type: 'default',
          label: '家人姓名',
          prop: 'family_name'
        },
        {
          type: 'default',
          label: '家人手机号',
          prop: 'family_mobile'
        },
        {
          type: 'default',
          label: '家人备注',
          prop: 'remark'
        },
        {
          type: 'default',
          label: '添加时间',
          prop: 'add_time'
        },
        {
          type: 'default',
          label: '业主姓名',
          prop: 'owner_name'
        },
        {
          type: 'default',
          label: '小区名称',
          prop: 'owner_estate'
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
      layout: ['form', 'toolbar', 'table', 'pagination'], // 有form 必须要有插槽内容
      getApi: '/LinliUserAuth/UserAuth/FamilyList',
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
      ]
    }
  },
  computed: {},
  created () {
    if (process.env.NODE_ENV === 'development') {
      // alert('开发环境,模拟登录')
      const params = {
        username: 'admin',
        password: '+c42y',
        verify: ''
      }
      login(params).then(res => {
        if (res.code === '0001') {
        }
      })
    }
  },
  mounted () { },
  methods: {
    /**
     * @description: 更改状态
     */
    changeStatus (v) {
      this.untiedUser(2, v.id)
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
.family {
}
</style>
