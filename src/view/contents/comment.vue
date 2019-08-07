<template>
  <div>
    <Card>
      <Form
        ref="editorData"
        :model="editorData"
        :rules="ruleValidate"
        :label-width="80"
        @update="getLocalStorage">
        <FormItem prop="title" label="文章标题">
          <Input type="text" v-model="editorData.title" placeholder="文章标题"/>
        </FormItem>
        <Row>
          <Col span="8">
          <FormItem prop="newsType" label="新闻类型">
            <Select
              v-model="editorData.newsType"
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
          </Col>
          <Col span="8">
          <FormItem prop="newsFrom" label="新闻来源">
            <Input type="text" v-model="editorData.newsFrom" placeholder="新闻来源"/>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem prop="newsAuthor" label="发布人">
            <Input type="text" disabled v-model="editorData.newsAuthor"/>
          </FormItem>
          </Col>
        </Row>
        <FormItem prop="newsContnet" label="文章内容">
          <editor
            :cache="cache"
            :value="editorData.newsContnet"
            :editorReset="editorReset"
            :valueType="valueType"
            @on-change="uploadChange"
            @input="uploadData"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('editorData')">提交</Button>
          <Button style="margin-left: 8px" @click="handleReset">重置</Button>
          <Button style="margin-left: 8px" type="primary" @click="handleSaveLocal('editorData')">存入草稿</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import Editor from '_c/editor'
  import {Message} from 'iview'

  export default {
    name: 'comment',
    data() {
      return {
        editorData: {
          title: '',
          newsContnet: '',
          newsType: '',
          newsFrom: '',
          newsAuthor: 'admin'
        },
        ruleValidate: {
          title: [
            {
              required: true,
              message: '文章标题不能为空',
              trigger: 'blur'
            }
          ],
          newsContnet: [
            {
              required: true,
              message: '请核实是否添加文章内容',
              trigger: 'blur',
            }
          ],
          newsType: [
            {
              required: true,
              message: '新闻类型不能为空',
              trigger: 'blur',
              type: 'number'
            }
          ],
          newsFrom: [
            {
              required: true,
              message: '新闻来源不能为空',
              trigger: 'blur',
            }
          ],
        },
        valueType: 'html',
        cache: true,
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
        ],
        editorReset: false,
      }
    },
    components: {
      Editor
    },
    methods: {
      uploadData(data) {
        this.editorData.newsContnet = data;
      },
      uploadChange(html, text) {
        // console.log(text);
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(this.$refs.editorData.model);
            Message.success("添加成功")
          } else {
            Message.error("未通过验证")
          }
        })
      },
      deleteLocalStorage() {
        localStorage.removeItem('editorData');
        localStorage.removeItem('editorCache');
        // this.$refs.editorData.resetFields();
        this.editorData.title = '';
        this.editorData.newsContnet = '';
        this.editorData.newsType = '';
        this.editorData.newsFrom = '';
        this.editorReset = true;
      },
      handleReset() {
        this.$Modal.confirm({
          title: "提示",
          content: `<div class="modal-bd modal-bd2">
                        <p>确定重置该条信息？</p><br>
                        <p>如想恢复需重新手动添加</p>
                     </div>`,
          onOk: () => {
            this.deleteLocalStorage();
          }
        })
      },
      handleSaveLocal(name) {
        const editorData = this.$refs[name].model;
        if (this.cache) {
          localStorage.setItem('editorData', JSON.stringify(editorData));
        }
        Message.success("存入草稿成功");
      },
      getLocalStorage() {
        // 如果本地有存储加载本地存储内容
        let test = localStorage.getItem("editorData");
        var obj = JSON.parse(test);
        if (obj) this.editorData = obj;// 设置内容
      }
    },
    mounted() {
      this.getLocalStorage();
    }
  }
</script>

<style scoped>

</style>
