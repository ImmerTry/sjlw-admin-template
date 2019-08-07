<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="basic_data">基本资料</DropdownItem>
        <DropdownItem name="modify_password">修改密码</DropdownItem>
        <DropdownItem name="logout" divided>退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions} from 'vuex'

  export default {
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: ''
      }
    },
    methods: {
      ...mapActions([
        'handleLogOut'
      ]),
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.handleLogOut().then(() => {
              this.$router.push({
                name: 'login'
              })
            });
            break;
          case 'basic_data':
            this.$router.push('/basic_data');
            break;
          case 'modify_password':
            this.$router.push('/modify_password');
            break;
        }
      }
    }
  }
</script>
