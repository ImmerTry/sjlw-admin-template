<template>
  <div>
    <div
      v-if="searchable && searchPlace === 'top'"
      class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col">
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle'"
          :value="item.key"
          :key="`search-col-${item.key}`">
          {{ item.title }}
        </Option>
      </Select>
      <Input
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"/>
      <Button
        v-if="searchable"
        @click="handleSearch"
        class="search-btn"
        type="primary">
        <Icon type="search"/>&nbsp;&nbsp;搜索
      </Button>
      <Button
        style="display: inline-block;float: right"
        v-if="addAble"
        @click="handleAdd"
        class="plus-btn"
        type="primary">
        <Icon type="plus"/>&nbsp;&nbsp;添加
      </Button>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <Page
      ref="pageMain"
      :total="pTotal"
      :page-size="pSize"
      :current="pIndex"
      @on-change="handlePageIndex"
      @on-page-size-change='handlePageSize'
      show-total
      show-elevator
      show-sizer
      style="margin: 10px 0;float:right;"/>
    <Button
      style="margin: 10px 0;"
      type="primary"
      @click="exportExcel">
      <Icon type="arrow-down-a"/>&nbsp;&nbsp;导出为Csv文件
    </Button>

    <div
      v-if="searchable && searchPlace === 'bottom'"
      class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col">
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle'"
          :value="item.key"
          :key="`search-col-${item.key}`">
          {{ item.title }}
        </Option>
      </Select>
      <Input
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"/>
      <Button class="search-btn" type="primary">
        <Icon type="search"/>&nbsp;&nbsp;搜索
      </Button>
    </div>
    <a id="hrefToExportTable"
       style="display: none;width: 0px;height: 0px;"></a>
  </div>
</template>

<script>
  import TablesEdit from './edit.vue'
  import handleBtns from './handle-btns'
  import './index.less'

  export default {
    name: 'Tables',
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
      columns: {
        type: Array,
        default() {
          return []
        }
      },
      tableDatas: {
        type: Array,
        default() {
          return []
        }
      },
      param: null,
      pageSize: {
        type: [Number, String]
      },
      pageIndex: {
        type: [Number, String]
      },
      pageTotal: {
        type: [Number, String]
      },
      size: String,
      width: {
        type: [Number, String]
      },
      height: {
        type: [Number, String]
      },
      stripe: {
        type: Boolean,
        default: true
      },
      border: {
        type: Boolean,
        default: false
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      highlightRow: {
        type: Boolean,
        default: true
      },
      rowClassName: {
        type: Function,
        default() {
          return ''
        }
      },
      context: {
        type: Object
      },
      noDataText: {
        type: String
      },
      noFilteredDataText: {
        type: String
      },
      disabledHover: {
        type: Boolean
      },
      loading: {
        type: Boolean,
        default: false
      },
      /**
       * @description 全局设置是否可编辑
       */
      editable: {
        type: Boolean,
        default: false
      },
      /**
       * @description 是否可搜索
       */
      searchable: {
        type: Boolean,
        default: false
      },
      /**
       * @description 搜索控件所在位置，'top' / 'bottom'
       */
      searchPlace: {
        type: String,
        default: 'top'
      },
      /**
       * @canAdd 是否允许添加
       */
      canAdd: {
        type: Boolean,
        default: true
      },

    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data() {
      return {
        insideColumns: [],
        insideTableData: [],
        edittingCellId: '',
        edittingText: '',
        searchValue: '',//当前搜索内容
        searchKey: '',
        pSize: 10,
        pTotal: 0,
        pIndex: 1,
        mask: false,
        addAble: true
      }
    },
    methods: {
      suportEdit(item, index) {
        item.render = (h, params) => {
          return h(TablesEdit, {
            props: {
              params: params,
              value: this.insideTableData[params.index][params.column.key],
              edittingCellId: this.edittingCellId,
              editable: this.editable
            },
            on: {
              'input': val => {
                this.edittingText = val
              },
              'on-start-edit': (params) => {
                this.edittingCellId = `editting-${params.index}-${params.column.key}`;
                this.$emit('on-start-edit', params)
              },
              'on-cancel-edit': (params) => {
                this.edittingCellId = '';
                this.$emit('on-cancel-edit', params)
              },
              'on-save-edit': (params) => {
                this.value[params.index][params.column.key] = this.edittingText;
                this.$emit('input', this.value);
                this.$emit('on-save-edit', Object.assign(params, {value: this.edittingText}));
                this.edittingCellId = ''
              }
            }
          })
        };
        return item
      },
      surportHandle(item) {
        let options = item.options || [];
        let insideBtns = [];
        /*      options.forEach(item => {
            if (handleBtns[item]) insideBtns.push(handleBtns[item])
          }) */
        let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
        item.render = (h, params) => {
          params.tableData = this.value;
          return h('div', btns.map(item => item(h, params, this)))
        };
        return item
      },

      handleColumns(columns) {
        this.insideColumns = columns.map((item, index) => {
          let res = item;
          if (res.editable) res = this.suportEdit(res, index);
          if (res.key === 'handle') res = this.surportHandle(res);
          return res
        })
      },
      setDefaultSearchKey() {
        this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
      },
      handleClear(e) {
        if (e.target.value === '') this.insideTableData = this.value
      },
      handleSearch() {
      },
      exportCsv(params) {
        this.$refs.tablesMain.exportCsv(params)
      },
      clearCurrentRow() {
        this.$refs.talbesMain.clearCurrentRow()
      },
      onCurrentChange(currentRow, oldCurrentRow) {
        this.$emit('on-current-change', currentRow, oldCurrentRow)
      },
      onSelect(selection, row) {
        this.$emit('on-select', selection, row)
      },
      onSelectCancel(selection, row) {
        this.$emit('on-select-cancel', selection, row)
      },
      onSelectAll(selection) {
        this.$emit('on-select-all', selection)
      },
      onSelectionChange(selection) {
        this.$emit('on-selection-change', selection)
      },
      onSortChange(column, key, order) {
        this.$emit('on-sort-change', column, key, order)
      },
      onFilterChange(row) {
        this.$emit('on-filter-change', row)
      },
      onRowClick(row, index) {
        this.$emit('on-row-click', row, index)
      },
      onRowDblclick(row, index) {
        this.$emit('on-row-dblclick', row, index)
      },
      onExpand(row, status) {
        this.$emit('on-expand', row, status)
      },
      exportExcel() {
        this.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      handlePageTotal(pageTotal) {
        console.log(pageTotal + "子组件pageTotal");
        this.pTotal = pageTotal
      },
      handlePageSize(pageSize) {
        console.log(pageSize + "子组件pageSize");
        this.pSize = pageSize
      },
      handlePageIndex(pageIndex) {
        console.log(pageIndex + "子组件pageIndex");
        this.pIndex = pageIndex
      },
      handleAdd() {
        this.mask = true;
        this.$emit('showMask', this.mask)
      },
      HandleCanAdd(value) {
        this.addAble = value
      },
      handleTableData(value) {
        // console.log(value);
        this.insideTableData = value
      }
    },
    watch: {
      columns(columns) {
        console.log("监听："+ columns + '子组件columns');
        this.handleColumns(columns);
        this.setDefaultSearchKey()
      },
      tableDatas(value) {
        // console.log("监听："+ value + '子组件tableDatas')
        this.handleTableData(this.tableDatas)
      },
      value(val) {
        // console.log(val);
        this.handleSearch()
      },
      pageTotal(pageTotal) {
        this.pTotal = pageTotal
      },
      pTotal(newV) {
        console.log("监听："+ newV + '子组件Total')
      },
      pSize(newV) {
        this.$emit('changeSize', newV)
      },
      pIndex(newV) {
        console.log("监听："+ newV + '子组件Index');
        this.$emit('changeIndex', newV)
      }

    },
    mounted() {
      this.handleColumns(this.columns);//自动加载父组件传过来的列
      this.handleTableData(this.tableDatas);//自动加载父组件传过来的数据
      this.setDefaultSearchKey();//自动加载搜索的key
      this.HandleCanAdd(this.canAdd)//接收父组件传过来的值是否允许添加按钮
    }
  }
</script>
