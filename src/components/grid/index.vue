<script type="text/jsx">
import { getGridListApi, postGridListApi } from '../../api'

import bus from '../bus'

// function isFunction (obj) {
//   return Object.prototype.toString.call(obj) === 'object Function'
// }

function tableCell (h, item, context) {
  if (item.render && typeof item.render === 'function') {
    const slotScope = {
      scopedSlots: {
        default: scope => item.render.call(context, h, scope)
      }
    }
    return (<el-table-column
      prop={item.prop || ''}
      label={item.label}
      fixed={item.fixed || false}
      width={item.width || ''}
      {...slotScope}
    >
    </el-table-column>)
  }
  return (<el-table-column
    prop={item.prop || ''}
    label={item.label}
    fixed={item.fixed || false}
    width={item.width || ''}>
  </el-table-column>)
}

function tableRender (h) {
  const table = this.tableList.map(item => tableCell(h, item, this.$parent))
  return (
    <el-table
      class={{ height: this.height }}
      stripe
      border
      highlight-current-row
      size="small"
      data={this.list}
      fit={true}
      style="width: 100%">
      {table}
    </el-table>
  )
}

function formRender (h) {
  if (!this.$slots.form) {
    return (<div></div>)
  }
  return (
    // <el-form inline={true} {...{
    //   props: {
    //     model: this.formData
    //   }
    // }}>
    <div class="grid">
      {this.$slots.form}
      <el-button type="success" size="mini" on-click={() => { this.query(true) }}>
        查询</el-button>
    </div>
    // </el-form>
  )
}

function toolbarRender (h) {
  if (!this.$slots.toolbar) {
    return (<div></div>)
  }
  return (
    <div class="toolbar">
      {this.$slots.toolbar}
    </div>
  )
}

function paginationRender (h) {
  return (
    <el-pagination
      class="pagination"
      on-size-change={(size) => {
        this.pageSize = size
      }}
      on-current-change={(num) => {
        this.page = num
      }}
      currentPage={this.page}
      pageSizes={[10, 20, 30, 40]}
      pageSize={this.pageSize}
      layout="total, sizes, prev, pager, next, jumper"
      total={this.total}>
    </el-pagination>
  )
}
export default {
  props: {
    api: {
      type: String,
      default: ''
    },
    tableList: {
      type: Array,
      default () {
        return []
      }
    },
    layout: {
      type: Array,
      default () {
        return ['form', 'toolbar', 'table', 'pagination']
      }
    },
    formData: {
      type: Object,
      default () {
        return {
        }
      }
    },
    requestType: {
      type: Number,
      default: 1 // 1 get, 2 post
    },
    config: { // 请求配置
      type: Object,
      default: () => { }
    },
    callback: {
      type: Function,
      default: null
    },
    needReady: {
      type: Boolean,
      default: false
    },
    unFixedFistRow: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  watch: {
    pageSize (val) {
      console.log(val)
      this.getList()
    },
    page (val) {
      console.log('page', val)
      this.getList()
    }
    // total (val) {
    //   if (val > 0) {
    //     this.height = '500'
    //   } else {
    //     this.height = 'undefined'
    //   }
    // }
  },
  computed: {
    isPagination () {
      const index = this.layout.indexOf('pagination')
      console.log('grid', index)
      return index >= 0
    },
    height () {
      if (this.unFixedFistRow) return ''
      if (this.total > 0) {
        return '500'
      } else {
        return 'undefined'
      }
    }
  },
  data () {
    return {
      pageSize: 10,
      page: 1,
      list: [],
      total: 0
    }
  },
  methods: {
    query (reset) {
      if (reset) {
        this.page = 1 // 请求页数复原
      }
      // console.log('fuyaun', this.page)
      this.getList()
    },
    async getList () {
      if (!this.api) {
        return
      }
      const isPagination = this.isPagination // 是否要分页
      let params = ''
      if (isPagination) {
        params = {
          page: this.page,
          pageSize: this.pageSize,
          ...this.formData
        }
      } else {
        params = {
          ...this.formData
        }
      }
      let res = ''
      if (this.requestType === 1) {
        res = await getGridListApi(params, this.api, this.config)
      } else if (this.requestType === 2) {
        res = await postGridListApi(params, this.api, this.config)
      }
      if (this.callback !== null) {
        this.callback(res)
        return
      }
      const {
        data, page, pageSize, total
      } = res
      this.list = data
      if (isPagination) {
        this.page = page || 1 // 避免没数据的时候，page = 0的情况
        this.pageSize = pageSize || this.pageSize
        this.total = total || 0
      }
    }
  },
  created () {
    if (!this.needReady) {
      this.getList()
    }
  },
  mounted () {
    bus.$on('refreshGrid', data => {
      // console.log(data)
      this.query()
    })
  },
  render (h) {
    const TEMPLATE_MAP = {
      table: tableRender.call(this, h),
      toolbar: toolbarRender.call(this, h),
      pagination: paginationRender.call(this, h),
      form: formRender.call(this, h)
    }
    const l = this.layout.map(item => TEMPLATE_MAP[item])
    return (
      <div>
        {l}
      </div>
    )
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
