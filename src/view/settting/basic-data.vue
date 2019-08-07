<template>
  <div>
    <Card :bordered="false">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        基本资料
      </p>
      <Form ref="basicDataFrom" :model="basicDataForm" :rules="ruleValidate" :label-width="80">
        <FormItem label="用户名" prop="userName">
          <Input v-model="basicDataForm.userName" disabled style="width: 200px" placeholder=""/>
        </FormItem>
        <FormItem label="我的角色" prop="access">
          <Select
            v-model="basicDataForm.access"
            placeholder="角色类型"
            disabled
            style="width:200px">
            <Option
              v-for="item in accessList"
              :key="item.key"
              :value="item.key">
              {{item.value}}
            </Option>
          </Select>
        </FormItem>
        <Row>
          <Col :xs="18" :sm="14" :md="12" :lg="8">
          <FormItem label="我的头像" prop="avatar">
            <Input v-model="basicDataForm.avatar" style="width: 350px" placeholder=""/>
          </FormItem>
          </Col>
          <Col :xs="6" :sm="10" :md="12" :lg="16">
          <upload
            :defaultList="defaultList"
            @insideDefaultList="handleDefaultList"
          />
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" @click="handleSubmit" style="width: 100px;">修改</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import upload from '_c/upload'
  import {editAvatarUrl} from "@/api/user";
  import Message from 'iview'

  export default {
    name: 'basicData',
    components: {
      upload
    },
    data() {
      return {
        ruleValidate: {},
        accessList: [
          {
            value: '超级管理员',
            key: 'super_admin'
          },
          {
            value: '普通管理员',
            key: 'admin'
          }
        ],
        basicDataForm: {
          userName: '',
          access: '',
          avatar: '',
          userId: ''
        },
        defaultList: {
          status: 'finished',
          url: '',
          showProgress: 'false',
          percentage: '',
        }
      }
    },
    computed: {},
    methods: {
      handleSubmit() {
        // let avatarUrl = this.basicDataForm.avatar;
        console.log(this.basicDataForm);
      },
      handleDefaultList(defaultList) {
        console.log(this.basicDataForm.userId);
        this.basicDataForm.avatar = defaultList.url;
        this.defaultList = defaultList;
      },
    },
    mounted() {
      let user = this.$store.state.user;
      this.basicDataForm = {
        userName: user.userName,
        access: user.access,
        avatar: user.avatar,
        userId: user.userId
      };
      this.defaultList.url = user.avatar;
    }
  }
</script>

<style scoped>

</style>
