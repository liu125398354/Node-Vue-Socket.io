<template>
  <div class="loginContainer">
    <div class="loginWrapper">
      <div class="loginInput">
        <div class="loginAP">
          <span class="item-left">账号</span>
          <input type="text" maxlength="20" placeholder="请输入账号" class="form-control" v-model="account">
        </div>
        <div class="loginAP border-bottom1px">
          <span class="item-left">密码</span>
          <input type="password" maxlength="20" placeholder="请输入密码" class="form-control" v-model="password">
        </div>
      </div>
      <div class="loginBtn">
        <div class="leftBtn" @click="register">注册</div>
        <div class="rightBtn" @click="login">去登录</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        account: '',
        password: ''
      };
    },
    methods: {
      register() {
        if (this.account === '') {
          alert('用户名不能为空');
          return;
        } else if (this.account.length > 18) {
          alert('用户名最多18位');
          return;
        } else if (/[^a-zA-Z0-9]/.test(this.account)) {
          alert('用户名只能填字母或数字');
          return;
        } else if (this.password === '') {
          alert('密码不能为空');
          return;
        } else if (this.password.length < 6) {
          alert('密码至少需要6位');
          return;
        }
        let params = {
          account: this.account,
          password: this.password,
          image: 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png',
          identity: 0
        };
        this.$http.post('/api/login/createAccount', params).then((response) => {
          if (response.body.errno === 0) {
            alert('用户已存在');
            this.account = '';
            this.password = '';
          } else if (response.body.errno === 1) {
            alert('注册成功');
            this.$router.push({path: 'login'});
          }
        });
      },
      login() {
        this.$router.push({path: '/login'});
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .loginContainer
    position: relative
    background: url('bg.png') no-repeat center center
    background-size: 100% 100%
    width: 100%
    height: 100%
    .loginWrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%);
      color: #fff
      width: 80%
      .loginInput
        margin: 20px auto
        .loginAP
          margin-bottom: 14px
          line-height: 2
          border-bottom1px(#fff)
          .item-left
            position: absolute
          .form-control
            box-sizing: border-box
            padding-left: 45px
            outline: none
            color: #fff
            background: transparent
            width: 100%
            &::placeholder
              color: #fff
      .loginBtn
        display: flex
        .leftBtn,.rightBtn
          flex: 1
          margin: 0 10px
          border-radius: 15px
          text-align: center
          background: rgba(7,17,27,0.1)
          height: 30px
          line-height: 30px
</style>
