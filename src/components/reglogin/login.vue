<template>
  <div class="loginContainer">
    <div class="loginWrapper">
      <div class="loginInput">
        <div class="loginAP border-bottom1px">
          <span class="item-left">账号</span>
          <input type="text" maxlength="20" placeholder="请输入账号" class="form-control" v-model="account">
        </div>
        <div class="loginAP border-bottom1px">
          <span class="item-left">密码</span>
          <input type="password" maxlength="20" placeholder="请输入密码" class="form-control" v-model="password">
        </div>
      </div>
      <div class="loginBtn">
        <div class="leftBtn" @click="login">登录</div>
        <div class="rightBtn" @click="register">去注册</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saveToLocal} from '../../common/js/store';
  export default {
    data () {
      return {
        account: '',
        password: ''
      };
    },
    methods: {
      login() {
        if (this.account === '') {
          alert('用户名不能为空');
          return;
        } else if (this.password === '') {
          alert('密码不能为空');
          return;
        }
        let params = {
          account: this.account,
          password: this.password
        };
        this.$http.post('/api/login/getAccount', params).then((response) => {
          if (response.body.errno === 1) {
            alert('登录成功');
            saveToLocal('user', this.account);
            saveToLocal('image', response.body.data.image);
            saveToLocal('identity', response.body.data.identity);
            if (response.body.data.identity === 1) {
              this.$store.commit('setdoctorlist', false);
            }
            this.$store.commit('setload', true);
            this.$router.push({path: './list'});
          } else if (response.body.errno === 0) {
            alert('用户不存在');
            this.account = '';
            this.password = '';
          } else if (response.body.errno === 2) {
            alert('密码不正确');
            this.password = '';
          }
        });
      },
      register() {
        this.$router.push({path: '/register'});
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
