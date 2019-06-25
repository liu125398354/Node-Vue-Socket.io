<template>
  <div>
    <transition name="move">
      <div v-show="showFlag" class="communicate">
        <div class="communicate-header">
          <div class="title">{{this.rooms.room}}</div>
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="help-content" ref="helpContent">
          <ul>
            <li class="help-item" v-for="(item,index) in getGroupMessage">
              <div class="others" v-if="item.from!=myself">
                <div class="others-left">
                  <img width="40" height="40" :src="item.avatar">
                </div>
                <div class="others-right">
                  <div class="others-username">
                    <span>{{item.from}}</span>
                  </div>
                  <div class="others-content">
                    <p class="others-text" v-if="item.type==='text'">{{item.msg}}</p>
                    <span class="icon-volume-medium" v-if="item.type==='audio'" @click="playVoice($event)">
                      <audio class="audio-right" :src="item.msg"></audio>
                    </span>
                    <img class="picture" v-if="item.type==='image'" :src="item.msg">
                  </div>
                </div>
              </div>
              <div class="own" v-if="item.from===myself">
                <div class="own-left">
                  <img width="40" height="40" :src="item.avatar">
                </div>
                <div class="own-right">
                  <p class="own-text" v-if="item.type==='text'">{{item.msg}}</p>
                  <span class="icon-volume-medium" v-if="item.type==='audio'" @click="playVoice($event)">
                    <audio class="audio-right" :src="item.msg"></audio>
                  </span>
                  <img class="picture" v-if="item.type==='image'" :src="item.msg">
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="chat-bottom">
          <div class="text">
            <textarea v-model="msg"></textarea>
          </div>
          <div class="voice">
            <div class="voice-btn icon-mic" @touchstart="start" @touchend="end"></div>
          </div>
          <div class="uploadImg">
            <div class="img-btn icon-image" @click="selectImg"></div>
            <input type="file" class="fileControl" ref="fileInput" @change="sendImg">
          </div>
          <div class="send">
            <div class="send-btn" @click="sendBtn">发送</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {mapGetters} from 'vuex';
  import {loadFromLocal} from '../../common/js/store';
  import Recorder from '../../common/js/recorder';
  export default {
    props: {
      rooms: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        msg: '',
        myself: loadFromLocal('user'),
        startTime: 0,
        endTime: 0
      };
    },
    mounted() {
      let self = this;
      this.getSocket.on('group', function(data) {
        self.$store.commit('setGroupMessage', data);
        self.$nextTick(() => {
          if (self.helpContentScroll) {
            self.helpContentScroll.refresh();
            self.helpContentScroll.scrollTo(0, self.helpContentScroll.maxScrollY);
          }
        });
      });
    },
    methods: {
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
        if (!this.scroll) {
          this.helpContentScroll = new BScroll(this.$refs.helpContent, {
            click: true
          });
          this.helpContentScroll.scrollTo(0, this.helpContentScroll.maxScrollY);
        } else {
          this.helpContentScroll.refresh();
        }
      });
      },
      hide() {
        this.showFlag = false;
      },
      start(event) {
        event.preventDefault();
        this.startTime = new Date().getTime();
        let self = this;
        Recorder.get(function (rec) {
          self.recorder = rec;
          self.recorder.start();
        });
      },
      end(event) {
        event.preventDefault();
        this.endTime = new Date().getTime();
        if (event.changedTouches[0].clientY < document.body.clientHeight - 48) {
          alert('取消录音');
          this.recorder.stop();
        } else if (this.endTime - this.startTime < 1000) {
          alert('说话时间太短了');
          this.recorder.stop();
        } else {
          let audioData = this.recorder.getBlob();
          let fd = new FormData();
          fd.append('audioData', 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png');
          console.log(audioData);
          console.log(fd.get('audioData'));
          let content = {
            type: 'audio',
            from: loadFromLocal('user'),
            avatar: loadFromLocal('image'),
            time: (new Date()).getTime(),
            msg: window.URL.createObjectURL(audioData)
          };
          this.getSocket.emit('all', content);
        }
      },
      selectImg() {
        this.$refs.fileInput.click();
      },
      sendImg() {
        let file = this.$refs.fileInput.files[0];
        console.log(file);
        let fr = new FileReader();
        let self = this;
        fr.readAsDataURL(file);
        fr.onload = function() {
          let content = {
            type: 'image',
            from: loadFromLocal('user'),
            avatar: loadFromLocal('image'),
            time: (new Date()).getTime(),
            msg: fr.result
          };
          self.getSocket.emit('all', content);
        };
      },
      sendBtn() {
        if (/^\s*$/.test(this.msg)) {
          alert('不要发空内容');
        } else if (this.msg.length > 600) {
          alert('请不要超过600字');
        } else {
          let content = {
            type: 'text',
            from: loadFromLocal('user'),
            avatar: loadFromLocal('image'),
            time: (new Date()).getTime(),
            msg: this.msg.trim()
          };
          this.msg = '';
          this.getSocket.emit('all', content);
        }
      }
    },
    computed: mapGetters([
      'getSocket',
      'getGroupMessage'
    ])
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .communicate
    position: fixed
    left: 0
    top: 0
    bottom: 0
    width: 100%
    background: #fff
    &.move-enter-active,&.move-leave-active
      transition: all 0.2s linear
    &.move-enter-active
      transform: translate3d(0,0,0)
    &.move-enter,&.move-leave-active
      transform: translate3d(100%,0,0)
    .communicate-header
      position: relative
      width: 100%
      height: 48px
      line-height: 48px
      color: #fff;
      background: #141d27;
      .title
        text-align: center;
        font-size: 16px;
      .back
        position: absolute
        top: 7px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 14px
          color: #fff
    .help-content
      position: absolute
      top: 48px
      bottom: 48px
      width: 100%
      overflow: hidden
      background: #f0f0f0
      .help-item
        &:first-child
          padding-top: 10px
        &:last-child
          padding-bottom: 10px
        .others
          overflow: hidden
          padding: 10px
          .others-left
            float: left
            margin-right: 12px
          .others-right
            position: relative
            float: left
            max-width: 60%
            .others-username
              font-size: 11px
              margin-bottom: 2px
              color: #bf3eff
            .others-content
              padding: 10px
              border-radius: 8px
              background: #3c6
              &:after
                content: ""
                display: block
                position: absolute
                left: -7px
                top: 25px
                width: 0
                height: 0
                border-top: 8px solid transparent;
                border-right: 8px solid #3c6;
                border-bottom: 8px solid transparent;
              .others-text
                line-height: 1.2
                text-align: justify;
              .picture
                max-width:100%;
        .own
          overflow: hidden
          padding: 10px
          .own-left
            float: right
            margin-left: 12px
          .own-right
            position: relative
            float: right
            padding: 10px
            border-radius: 8px
            max-width: 60%
            background: rgb(58,179,255)
            &:after
              content: ""
              display: block
              position: absolute
              right: -7px
              top: 11px
              width: 0
              height: 0
              border-top: 8px solid transparent;
              border-left: 8px solid rgb(58,179,255);
              border-bottom: 8px solid transparent;
            .own-text
              line-height: 1.2
              text-align: justify;
            .picture
              max-width:100%;
    .chat-bottom
      display: flex
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 48px
      .text
        flex: 1
        textarea
          box-sizing: border-box
          resize: none
          width: 100%
          height: 100%
      .voice
        margin: 0 2px
        .voice-btn
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 25px
          color: rgb(0,160,200)
      .uploadImg
        margin: 0 2px
        .img-btn
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 25px
          color: rgb(0,160,200)
        .fileControl
          display: none
      .send
        flex: 0 0 80px
        width: 80px
        .send-btn
          height: 48px
          line-height: 48px
          text-align: center
          color: #fff
          background: rgb(75,166,52)
</style>
