<template>
  <div id="app">
    <v-header v-if="isload"></v-header>
    <div class="tab border-top1px" v-if="isload">
      <div class="tab-item">
        <router-link to='./list'>{{hpContent}}</router-link>
      </div>
      <div class="tab-item">
        <router-link to='./help'>互助</router-link>
      </div>
      <div class="tab-item">
        <router-link to='./my'>我的</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {loadFromLocal} from './common/js/store';
  import header from './components/header/header.vue';
  import io from 'socket.io-client';

  export default {
    created() {
      if (!this.getSocket) {
        let socket = io('ws://192.168.1.115:3000/');
        this.$store.commit('setSocket', socket);
        socket.emit('setName', loadFromLocal('user'));
      }
    },
    computed: {
      hpContent() {
        if (loadFromLocal('identity') === false) {
          return '医师';
        } else if (loadFromLocal('identity') === 1) {
          return '消息';
        }
      },
      ...mapGetters([
        'isload',
        'getSocket'
      ])
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
  #app
    width: 100%
    height: 100%
    .tab
      position: fixed
      left: 0
      bottom: 0
      display: flex
      width: 100%
      height: 48px
      line-height: 48px
      border-top1px(rgba(7,17,27,0.1))
      .tab-item
        flex: 1
        text-align: center
        &>a
          display: block
          font-size: 14px
          color: rgb(77,85,93)
          &.active
            color: rgb(0,160,200)
</style>
