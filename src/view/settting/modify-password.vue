<template>
  <div>
    <Card :bordered="false">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        修改密码
      </p>
      <Form ref="passForm" :model="passForm" :rules="ruleValidate" :label-width="120">
        <FormItem label="当前密码" prop="curPass">
          <Input type="text" disabled v-model="passForm.curPass" style="width: 200px;"/>
        </FormItem>
        <FormItem label="新密码" prop="createPass">
          <Input type="password" v-model="passForm.createPass" style="width: 200px;"/>
        </FormItem>
        <FormItem label="确认新密码" prop="checkPass">
          <Input type="password" v-model="passForm.checkPass" style="width: 200px;"/>
        </FormItem>
        <FormItem>
          <Button type="primary" style="width: 100px;" @click="handleSubmit">修改</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import {getUserInfo} from '@/api/user'

  export default {
    name: 'modifyPassword',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value !== this.passForm.createPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        passForm: {
          curPass: '',
          createPass: '',
          checkPass: '',
        },
        ruleValidate: {
          createPass: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, max: 30, message: '长度在6-30之间', trigger: 'blur'}
          ],
          checkPass: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {min: 6, max: 30, message: '长度在6-30之间', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'},
          ],
        },
      };

    },
    methods: {
      handleSubmit() {
        this.$refs.passForm.validate(valid => {
          if (valid) {

            console.log(this.passForm.checkPass);
          }
        });
      }
    },
    mounted() {
      let token = this.$store.state.user.token;
      getUserInfo(token).then(res => {
        this.passForm.curPass = res.data.data.password;
      });
    }
  }
</script>

<style scoped>

</style>
