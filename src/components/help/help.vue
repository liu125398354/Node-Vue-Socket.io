<template>
  <div class="help">
    <ul>
      <li @click="selectRoom(item,$event)" v-for="(item,index) in help" class="help-list">
        <div class="help-left">
          <img width="40" height="40" :src="item.img">
        </div>
        <div class="help-right">
          <h2 class="help-title">{{item.room}}</h2>
        </div>
      </li>
    </ul>
    <communication ref="communication" :rooms="roomNumber"></communication>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {loadFromLocal} from '../../common/js/store';
  import communication from '../communication/communication';
  export default {
    data() {
      return {
        help: [
          {'img': 'src/components/help/huzhu.jpg', 'room': '互助交流'}
        ],
        roomNumber: {}
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
      selectRoom(item, event) {
        this.roomNumber = item;
        this.$refs.communication.show();
      }
    },
    computed: mapGetters([
      'getSocket'
    ]),
    components: {
      communication
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .help
    position: absolute
    top: 48px
    bottom: 48px
    overflow: hidden
    width: 100%
    .help-list
      display: flex
      padding: 11px 13px
      border-bottom1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
      .help-left
        flex: 0 0 52px
        width: 52px
      .help-right
        flex: 1
        .help-title
          height: 40px
          line-height: 40px
          margin-left: 20px
</style>
