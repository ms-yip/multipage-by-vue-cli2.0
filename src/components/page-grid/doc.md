### 使用

``` js
import PageGrid from '@/components/page-grid/page-grid'

export default {
  components:{ PageGrid },
};
```

``` html
<template>
  <div>
    <page-grid :model="form" :rules="formRule" :columns="columns" :layout="['form','slot','table','pagination']">
      <template slot="form">
        <el-form-item label="num1" prop="num1">
          <el-input-number v-model="form.num1" :min="1" :max="10" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="num2" prop="num2">
          <el-input-number v-model="form.num2" :min="1" :max="10" size="small"></el-input-number>
        </el-form-item>
      </template>

      <template>
        <h1>slot test</h1>
      </template>

    </page-grid>
  </div>
</template>
```

### Attributes
|     参数    | 说明           | 类型  | 可选值 | 默认值 | 备注|
| ------------- |:-------------:| ----- | ----- | ----- | ----- |
| layout      | 页面模块布局顺序 | Array |'toolbar', 'form', 'slot', 'table', 'pagination'| ['toolbar', 'form', 'slot', 'table', 'pagination']||
| columns      | 表头配置      |   Array(Object) | - | [] ||
| model |  表单整合的参数对象   |   Object | - | {} ||
| rules | 表单校验规则 | function | | function() { return {} }| 返回一个[对象](http://element.eleme.io/#/zh-CN/component/form#zi-ding-yi-xiao-yan-gui-ze)，函数体内 this.model 访问传进去的model表单对象 |
| getApi | 请求数据的接口   | String | - | ''||
| exportApi | 导出数据的接口   | String | - | ''||
| defaultPage | 初始化的默认页码 | Number | - | 1 ||
| defaultPageSize | 初始化的每页条目数 | Number | - | 20 ||

### columns 表格列配置
|     参数    | 说明           | 类型  | 可选值 | 默认值 | 备注|
| ------------- |:-------------:| ----- | ----- | ----- | ---- |
| type      | 类型 | String | expand, default, selection | default | |
| label     | 表头 | String | - | '' | 表头文本 |
| width     |  列宽度 | Number | - |  |  |
| prop     | 字段 | String | - | '' | 读取该行数据的prop字段作为表格文本，优先级最低 |
| render    | 编译 | function(h,{row,index,column}) | - | - | 需要自定义表格内容模板时使用，expand必须使用，优先级高于 formatter|
| formatter    | 计算 | function(row) | - | - | 需要自定义表格内容时使用（仅限文本）|

#### example:
``` js
const columns = [
      { type: 'selection' },
      {
        type: 'expand',
        label: '展开',
        render: (h, { row, column, index, }) => {
          return <span>{JSON.stringify({ ...row })}</span>;
        },
      },
      { label: 'id', prop: 'id' },
      { label: 'name', prop: 'name' },
      {
        label: '表头一号',
        formatter(row) {
          return row.name;
        },
      },
      {
        label: '操作',
        render: (h, { row, column, index, }) => {
          return <el-button type="text" on-click={() => this.testClick(row)}>test</el-button>;
        },
      },
    ];
```

### slot 组件插槽
|     参数    | 说明         |
| ------------- |:-------------:|
| -   | 内嵌html内容 对应 layout 值为slot |
| toolbar     | 内嵌html内容 对应 layout 值为toolbar |
