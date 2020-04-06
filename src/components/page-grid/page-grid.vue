<style scoped>
  /*.page-grid-form,*/
  .page-grid-toolbar,
  .page-grid-table,
  .page-grid-pagination {
    margin-bottom: 30px;
  }
  .page-grid-table {
    /* max-width: calc(100% - 800px); */
  }
  .page-grid-toolbar {
    /*display: flex;*/
    /*justify-content: flex-start;*/
    /*align-items: flex-end;*/
  }
  .page-grid-toolbar .red {
    color: #ff0000;
  }
</style>

<script type="text/jsx">
/*eslint-disable*/
  import cell from './page-grid-cell';

  function isFunction(target) {
    return Object.prototype.toString.call(target) === '[object Function]';
  }

  function renderToolbar(h) {
    const html = this.$slots.toolbar ? <div class="page-grid-toolbar">{this.$slots.toolbar}</div> : <div></div>;
    return html;
  }

  function renderForm(h) {
    const exportButton = this.exportApi && this.disabledExport ?
      <el-button type="info" on-click={this.exportRequest}><i class="el-icon-document"> </i> 导出</el-button> : '';

    return (
      <div class="page-grid-form">
        <el-form ref="form" inline={true} model={this.model} rules={this.validateRules}>
          {this.$slots.form}
          <el-form-item>
            <el-button type="success" on-click={this.search}><i class="el-icon-search"> </i> 查询</el-button>
            {exportButton}
          </el-form-item>
        </el-form>
      </div>
    );
  }

  function renderCell(h, scope, column) {
    return (
      <cell row={scope.row} column={column} index={scope.$index}/>
    )
  }

  function renderColumn(h, column) {
    // 是否使用了render函数
    const isRender = isFunction(column.render);
    // 是否使用了formatter函数
    const isFormatter = isFunction(column.formatter);
    // expand列必须使用render函数
    if ((column.type === 'expand' && isRender) || isRender) {
      // 使用了render函数，使用cell组件进行渲染表格单元格内容，仿iview
      return (<el-table-column width={column.width ? column.width : 100} type={column.type} label={column.label} scopedSlots={
        { default: (scope) => renderCell.call(this, h, scope, column), }
      }>
      </el-table-column>);
    } else {
      // 非render函数渲染
      return (
        <el-table-column label={column.label}
                         prop={column.prop}
                         type={column.type}
                         width={column.checkbox ? 47 : column.width}
                         fixed={column.fixed ? column.fixed : undefined}
                         formatter={isFormatter ? column.formatter : undefined}>
        </el-table-column>
      );
    }
  }

  function renderTable(h) {
    return (
      <div class="page-grid-table">
        <el-table
          ref="table"
          data={this.tableData}
          stripe
          resizable
          border
          height={this.tableHeight}
          tooltip-effect="dark"
          on-selection-change={(selection) => this.selection = selection}
          style="width: 100%">
          {this.columns.map(column => renderColumn.call(this, h, column))}
        </el-table>
      </div>
    )
  }

  function renderPagination(h) {
    return (
      <div class="page-grid-pagination">
        <el-pagination
          current-page={this.page}
          page-sizes={[20, 40, 100, 200]}
          page-size={this.pageSize}
          layout="->, total, sizes, prev, pager, next "
          on-current-change={(p) => this.page = p}
          on-size-change={(ps) => this.pageSize = ps}
          total={this.total}>
        </el-pagination>
        &emsp;
      </div>
    );
  }

  export default {
    components: { cell },
    render(h) {
      const template = (<div class="page-grid"></div>);
      // 定义布局地图
      const layoutMap = {
        toolbar: renderToolbar.call(this, h),
        form: renderForm.call(this, h),
        table: renderTable.call(this, h),
        pagination: renderPagination.call(this, h),
        slot: (<div class="page-grid-slot">{this.$slots.default}</div>),
      };
      // 需先定义children，否则报错
      template.children = [];

      // 根据layout的布局顺序进行按顺序渲染
      this.layout.forEach((vi) => {
        if (Object.prototype.hasOwnProperty.call(layoutMap, vi)) {
          template.children.push(layoutMap[vi]);
        }
      });

      return template;
    },
    data() {
      return {
        tableData: [],
        loading: false,
        page: 1,
        pageSize: 20,
        total: 0,
        selection: [],
      };
    },
    props: {
      // layout 组件的渲染顺序
      // @param toolbar
      layout: {
        type: Array,
        default() {
          return ['toolbar', 'form', 'slot', 'table', 'pagination'];
        },
      },
      columns: {
        type: Array,
        require: true,
      },
      tableHeight: {
        type: String,
        default: null
      },
      model: Object,
      rules: Function,
      getApi: String,
      exportApi: String,
      disabledExport: {
        type: Boolean,
        default: true,
      },
      defaultPage: { type: Number, default: 1 },
      defaultPageSize: { type: Number, default: 20 },
    },
    watch: {
      // 监听页码和每页条目数，若有变化则重新请求数据
      page: 'query',
      pageSize: 'query',
    },
    computed: {
      validateRules() {
        return this.rules ? this.rules.call(this) : {};
      },
      isForm() {
      },
      isPagination() {
        console.log('sss', this.layout);
        console.log('sss',this.layout.indexOf('pagination') >= 0);
        return this.layout.indexOf('pagination') >= 0;
      },
    },
    methods: {
      exportRequest() {
        if (this.loading || !this.exportApi) {
          // 请求状态或者木有配置请求接口
          return;
        }
        if (this.$refs.form) {
          this.$refs.form.validate((validatePass) => {
            // 通过表单验证
            if (validatePass) {
              this.export();
            }
          });
        } else {
          this.export();
        }
      },
      export() {
        // const token = `Bearer ${sessionStorage.getItem('_t')}`;
        const exportParams = {
          // Authorization: token,
          // admin_id: this.$root.user.id,
          // organization_id: this.$root.user.organization_id,
          ...this.model,
        };
        console.log('导出')
        const apiUrl = this.exportApi.indexOf('?') > -1 ? this.exportApi : `${this.exportApi}?`;
        const exportUrl = location.origin + this.$urlPrefix + apiUrl + this.$qs.stringify(exportParams);
        window.open(exportUrl);
      },
      query() {
        if (this.loading || !this.getApi) {
          // 请求状态或者木有配置请求接口
          return;
        }
        if (this.$refs.form) {
          this.$refs.form.validate((validatePass) => {
            // 通过表单验证
            if (validatePass) {
              this.request();
            }
          });
        } else {
          this.request();
        }
      },
      search() {
        // 查询按钮，重置页码为1再请求数据
        this.page = 1;
        this.query();
      },
      request() {
        const isPagination = this.isPagination;
        let params;
        if (isPagination) {
          params = { page: this.page, pageSize: this.pageSize, ...this.model };
        } else {
          params = { ...this.model };
        }

        this.loading = true;
        this.$http.get(this.getApi, { params, loading: true }).then((res) => {
          this.loading = false;
          const success = res.code === '0001';
          if (success) {
            if (isPagination) {
              this.total = Number(res.data.total);
              this.tableData = res.data.data;
            } else {
              this.tableData = res.data;
            }
          } else if (res.code === '0002') {
            this.tableData = [];
            this.$notify.error({
              title: '获取数据失败',
              message: '暂无数据',
            });
          } else {
            this.$notify.error({
              title: '获取数据错误',
              message: res.msg,
            });
          }
        }).catch(() => {
          this.loading = false;
        });
      },
      getRowSelection() {
        return [...this.selection];
      },
    },
    mounted() {
      // 初始化默认页码和每页行数
      this.page = this.defaultPage;
      this.pageSize = this.defaultPageSize;
      this.query();
    },
  };
</script>
