<template>
  <div class="my">
    <div class="my-logout">
      <split></split>
      <div class="my-top">
        <div class="my-img">
          <img width="45" height="45" :src="this.avatar">
        </div>
        <div class="my-username">账号：{{this.myself}}</div>
      </div>
      <split></split>
      <div class="logout" @click="exit">退出登录</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {loadFromLocal, removeLocal} from '../../common/js/store';
  import split from '../split/split';
  export default {
    data() {
      return {
        myself: loadFromLocal('user'),
        avatar: loadFromLocal('image')
      };
    },
    mounted() {
      if (!loadFromLocal('user')) {
        this.$router.push({path: '/login'});
      } else {
        this.$store.commit('setload', true);
      }
    },
    methods: {
      exit() {
        removeLocal('user');
        removeLocal('image');
        removeLocal('identity');
        this.$router.push('/login');
        this.$store.commit('setload', false);
        this.$store.commit('setdoctorlist', true);
      }
    },
    components: {
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .my
    position: absolute
    top: 48px
    bottom: 48px
    width: 100%
    overflow: hidden
    .my-logout
      .my-top
        display: flex
        padding: 8px 13px
        .my-img
          flex: 0 0 57px
          width: 57px
          img
            border-radius: 50%
        .my-username
          flex: 1
          line-height: 48px
      .logout
        margin: 0px auto
        margin-top: 20px
        width: 80%
        height: 40px
        line-height: 40px
        text-align: center
        border-radius: 20px
        font-size: 18px
        color: #fff
        background: #00a0c8
</style>
