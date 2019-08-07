<template>
  <div>
    <Modal
      v-model="showModal"
      :title="modal.title"
      :loading="loading"
      :closable="true"
      @on-ok="asyncOK"
      @on-cancel="asyncNo">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <Card :bordered="false">
          <FormItem label="新闻类型" prop="newsType">
            <Select
              v-model="formData.newsType"
              placeholder="新闻类型"
              style="width:200px">
              <Option
                v-for="item in newsTypeList"
                :key="item.key"
                :value="item.key">
                {{item.value}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="新闻标题" prop="title">
            <Input type="text" v-model="formData.title"/>
          </FormItem>
          <FormItem label="发布作者" prop="author">
            <Input type="text" v-model="formData.author"/>
          </FormItem>
          <FormItem label="发布状态" prop="newsStatus">
            <i-switch
              v-model="formData.newsStatus"
              :true-value="0"
              :false-value="1"
              size="large">
              <span slot="open">发布</span>
              <span slot="close">保留</span>
            </i-switch>
          </FormItem>
        </Card>
      </Form>
    </Modal>
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
  import {getTableData, insertTableData, deleteTableData, updateTableData} from '@/api/data'
  import {formatDate} from '@/libs/tools'
  import {Message} from 'iview'

  export default {
    name: 'article-list',
    components: {
      Tables
    },
    data() {
      return {
        columns: [
          {
            title: '文章ID',
            key: 'id'
          },
          {
            title: '文章类型',
            key: 'newsType',
            render: (h, params) => {
              let tmpStr = "";
              if (params.row.newsType === 0) {
                tmpStr = "时政要闻";
              } else if (params.row.newsType === 1) {
                tmpStr = "成功案例";
              } else {
                tmpStr = "企业新闻";
              }
              return h('span', {
                // style:{
                //   color: (params.row.newsType==0)?"#ed3f14":(params.row.newsType==1?"#19be6b":"#2d8cf0")
                // }
              }, tmpStr)
            }
          },
          {
            title: '文章标题',
            key: 'title'
          },
          {
            title: '作者',
            key: 'author',
            align: 'center'
          },
          {
            title: '发布状态',
            align: 'center',
            key: 'newsStatus',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    type: 'primary',
                    size: 'large',
                    value: params.row.newsStatus === 0,
                    // disabled:params.row.newsStatus === 1
                  },
                  scopedSlots: {
                    open: () => h('span', '发布'),
                    close: () => h('span', '保留')
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': () => {
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '上传时间',
            key: 'newsCreate',
            render: (h, params) => {
              let newsCreate = params.row.newsCreate;
              // console.log(newsCreate);
              if (newsCreate != null) {
                return h('div',
                  formatDate(new Date(params.row.newsCreate), 'yyyy-MM-dd hh:mm')
                )
              } else {
                return h('div', {
                  style: {
                    color: "#ed3f14"
                  }
                }, '未设置时间')
              }

            }
          },
          {
            title: '操作',
            key: 'handle',
            width: 150,
            align: 'center',
            button: [
              (h, params, vm) => {
                // console.log(tableData)
                return h('p', [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginLeft: '5px'
                    },
                    on: {
                      click: () => {
                        this.handleEdit(params);
                      }
                    }
                  }, [h('Icon', {
                    props: {
                      type: 'edit',
                      size: 18
                    }
                  }), '编辑']),

                  h('Poptip', {
                      props: {
                        confirm: true,
                        title: '你确定要删除吗?',
                        transfer: true
                      },
                      on: {
                        'on-ok': () => {
                          this.handleDelete(params);
                        }
                      }
                    },
                    [
                      h('Button', {
                        props: {
                          type: 'warning',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px',
                          marginLeft: '5px'
                        }

                      }, [h('Icon', {
                        props: {
                          type: 'trash-b',
                          size: 18
                        }
                      }), '删除'])
                    ])
                ])
              }
            ]
          }
        ],
        tableData: [],
        pageSize: 10,
        pageTotal: 0,
        pageIndex: 1,
        canAdd: true,
        showModal: false,
        loading: false,
        modal: {
          title: '',
          option: 'edit',
        },
        formData: {
          newsType:'',
          title:'',
          author:'',
          newsStatus: 1 //默认保留
        },
        ruleValidate: {
          newsType: [
            {
              required: true,
              message: '新闻类型不能为空',
              trigger: 'blur',
              type:'number'
            }
          ],
          title: [
            {
              required: true,
              message: '新闻标题不能为空',
              trigger: 'blur'
            }
          ],
          author: [
            {
              required: true,
              message: '发布作者不能为空',
              trigger: 'blur'
            }
          ],
        },
        newsTypeList: [
          {
            value: '时政要闻',
            key: 0
          },
          {
            value: '成功案例',
            key: 1
          },
          {
            value: '企业新闻',
            key: 2
          },
        ]
      }

    },
    methods: {
      handleDelete(params) {
        // console.log(params)
        let id = params.row.id;
        deleteTableData(id).then(res => {
          Message.success(res.data.data);
          this.initTableData();
        })
      },
      handleAdd() {
        this.modal = {
          title: "添加新闻信息",
          option: "add"
        }
      },
      handleEdit(params) {
        this.modal = {
          title: "修改新闻信息",
          option: "edit"
        };
        this.formData = {
          id: params.row.id,
          newsType: params.row.newsType,
          author: params.row.author,
          title: params.row.title,
          newsStatus: params.row.newsStatus
        };
        this.showModal = true;
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      changeSize(size) {
        this.pageSize = size;
        this.initTableData()
      },
      changeIndex(index) {
        this.pageIndex = index;
        this.initTableData()
      },
      asyncOK() {
        this.$refs.formData.validate(valid => {
          if (valid) {
            let news = this.$refs.formData.model;
            let option = this.modal.option;
            if (option === "add") {
              insertTableData(news).then(res => {
                // console.log(res.data);
                this.asyncNo();
                Message.success(res.data.data);
                this.initTableData()
              })
            } else {
              updateTableData(news).then(res => {
                this.asyncNo();
                Message.success(res.data.data);
                this.initTableData()
              })
            }
            // console.log(this.modal.opotion);
          } else {
            console.log(this.$refs.formData);
            Message.error("验证未通过");
          }
        });
      },
      asyncNo() {
        this.$refs.formData.resetFields();//refs对应form的ref属性
        // this.formData.newType = '';
        // this.formData.title = '';
        // this.formData.newsCreate = '';
        this.initTableData()
      },
      showMask(mask) {
        this.showModal = mask;
        this.handleAdd()
      },

      initTableData() {
        let PageIndex = this.pageIndex;
        let PageSize = this.pageSize;

        getTableData({PageIndex, PageSize}).then(res => {

          this.tableData = res.data.data.list;
          this.pageSize = res.data.data.pageSize;
          this.pageTotal = res.data.data.total;
          this.pageIndex = res.data.data.pageNum
        })
      }
    },
    mounted() {
      this.initTableData()
    },
    watch: {
      pageSize(newV, oldV) {
        console.log(newV + ' , ' + oldV)
      }
    }
  }
</script>

<style scoped>

</style>
