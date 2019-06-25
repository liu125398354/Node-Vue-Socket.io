<template>
  <div>
    <div class="doctors" v-show="isshow">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in doctors" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
            <span class="text border-bottom1px">
              {{item.department}}
            </span>
          </li>
        </ul>
      </div>
      <div class="doctor-wrapper" ref="doctorWrapper">
        <ul>
          <li v-for="(item,index1) in doctors" class="doctor-list doctor-list-hook">
            <h1 class="title">{{item.department}}</h1>
            <ul>
              <li @click="selectDoctor(physician,$event)" v-for="(physician,index2) in item.physician" class="physician-item border-bottom1px">
                <div class="avatar">
                  <img width="57" height="57" :src="physician.image">
                </div>
                <div class="content">
                  <h2 class="name">{{physician.name}}<span class="position">{{physician.position}}</span></h2>
                  <p class="desc">{{physician.hospital}}</p>
                  <p class="skill">{{physician.skill}}</p>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="msg-wrapper" v-show="!isshow" ref="msgList">
      <ul>
        <li @click="selectContact(item,$event)" v-for="(item,index3) in groupList" class="msg-list border-bottom1px" v-if="item.from != myself">
          <div class="msg-left">
            <img width="40" height="40" :src="item.avatar">
          </div>
          <div class="msg-right">
            <div class="msg-name">
              <h2 class="msg-from">{{item.from}}</h2>
              <div class="msg-time">{{item.time | formatDate}}</div>
            </div>
            <div class="msg-text">{{item.msg}}</div>
          </div>
        </li>
      </ul>
    </div>
    <chat :doctor="selectedDoctor" :consult="selectedContactPerson" ref="chat"></chat>
  </div>
</template>

<script type="text/ecmascript-6">
  import {loadFromLocal} from '../../common/js/store';
  import {mapGetters} from 'vuex';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date';
  import chat from '../chat/chat';

  const OK = 1;
  export default {
    data() {
      return {
        doctors: [],
        listHeight: [],
        scrollY: 0,
        selectedDoctor: {},
        selectedContactPerson: {},
        myself: loadFromLocal('user')
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      groupList() {
        let temp = {};
        let group = [];
        let finallyGroupList = [];
        for (let i = 0; i < this.getMessageList.length; i++) {
          let content = this.getMessageList[i];
          if (!temp[content.from]) {
            group.push({from: content.from, data: [content]});
            temp[content.from] = content;
          } else {
            for (let j = 0; j < group.length; j++) {
              let deepContent = group[j];
              if (deepContent.from === content.from) {
                deepContent.data.push(content);
                break;
              }
            }
          }
        }
        let compare = function (prop) {
          return function (obj1, obj2) {
            let value1 = obj1[prop];
            let value2 = obj2[prop];
            if (!isNaN(Number(value1)) && !isNaN(Number(value2))) {
              value1 = Number(value1);
              value2 = Number(value2);
            }
            if (value1 < value2) {
              return -1;
            } else if (value1 > value2) {
              return 1;
            } else {
              return 0;
            }
          };
        };
        for (let k = 0; k < group.length; k++) {
          group[k].data.sort(compare('time'));
          finallyGroupList.push(group[k].data[group[k].data.length - 1]);
        }
        for (let z = 0; z < finallyGroupList.length; z++) {
          if (finallyGroupList[z].type === 'image') {
            finallyGroupList[z] = {
              'type': 'image',
              'from': finallyGroupList[z].from,
              'avatar': finallyGroupList[z].avatar,
              'time': finallyGroupList[z].time,
              'msg': '[图片]',
              'to': finallyGroupList[z].to
            };
          }
          if (finallyGroupList[z].type === 'audio') {
            finallyGroupList[z] = {
              'type': 'audio',
              'from': finallyGroupList[z].from,
              'avatar': finallyGroupList[z].avatar,
              'time': finallyGroupList[z].time,
              'msg': '[语音]',
              'to': finallyGroupList[z].to
            };
          }
        }
        return finallyGroupList;
      },
      ...mapGetters([
        'isshow',
        'getSocket',
        'getMessageList'
      ])
    },
    created() {
      this.$http.get('/api/doctors/getBasicInformation').then((response) => {
        response = response.body;
        if (response.errno === OK) {
          this.doctors = response.data.doctors;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    mounted() {
      if (!loadFromLocal('user')) {
        this.$router.push({path: '/login'});
      } else {
        this.$store.commit('setload', true);
      }
      if (loadFromLocal('identity') === 1) {
        this.$store.commit('setdoctorlist', false);
      }
    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let doctorList = this.$refs.doctorWrapper.getElementsByClassName('doctor-list-hook');
        let el = doctorList[index];
        this.doctorScroll.scrollToElement(el, 300);
      },
      selectDoctor(physician, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedDoctor = physician;
        this.$refs.chat.show();
      },
      selectContact(person, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedContactPerson = person;
        this.$refs.chat.show();
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.doctorScroll = new BScroll(this.$refs.doctorWrapper, {
          click: true,
          probeType: 3
        });
        this.msgListScroll = new BScroll(this.$refs.msgList, {
          click: true
        });
        this.doctorScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let doctorList = this.$refs.doctorWrapper.getElementsByClassName('doctor-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < doctorList.length; i++) {
          let item = doctorList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      chat
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .doctors
    display: flex
    position: absolute
    top: 48px
    bottom: 48px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-bottom1px(rgba(7,17,27,0.1))
          text-align: center
          font-size: 12px
    .doctor-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .physician-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-bottom1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .avatar
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            corlor: rgb(7,17,27)
            .position
              font-size: 10px;
              color: #93999f;
              margin-left: 12px;
          .desc,.skill
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            margin-bottom: 8px
          .skill
            line-height: 13px
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
  .msg-wrapper
    position: absolute
    top: 48px
    bottom: 48px
    overflow: hidden
    width: 100%
    .msg-list
      display: flex
      position: relative
      padding: 11px 13px
      border-bottom1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
      .msg-left
        flex: 0 0 52px
        width: 52px
        img
          border-radius: 50%
      .msg-right
        flex: 1
        width: 0
        font-size: 13px
        .msg-name
          margin-bottom: 8px
          height: 20px
          line-height: 20px
          &:after
            content: ''
            display: block
            clear: both
          .msg-from
            float: left
            font-size: 17px
          .msg-time
            float: right
        .msg-text
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
</style>
