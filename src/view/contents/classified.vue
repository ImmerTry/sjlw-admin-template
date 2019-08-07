<template>
  <div>
    <Card>
      <tables ref="tables"
              editable searchable search-place="top"
              :columns="columns"
              v-model="tableData"
              :pageTotal="pageTotal"
              :pageIndex="pageIndex"
              :pageSize="pageSize"
              :canAdd="canAdd"
              :tableDatas="tableData"
              @showMask="showMask"
              @on-delete="handleDelete"
              @changeSize="changeSize"
              @changeIndex="changeIndex"
      />
    </Card>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import {getTableData} from '@/api/data'

  export default {
    name: 'classified',
    components: {
      Tables
    },

  }
</script>

<style scoped>

</style>
