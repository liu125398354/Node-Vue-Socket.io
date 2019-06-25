<template>
  <div>
    <transition name="move">
      <div v-show="showFlag" class="chat">
        <div class="chat-header">
          <div class="title">{{title}}</div>
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="chat-content" ref="chatContent">
          <ul>
            <li class="chat-item" v-for="(item,index) in getMessageList">
              <div class="others" v-if="item.from!=myself && judge(item.from)">
                <div class="others-left">
                  <img width="40" height="40" :src="item.avatar">
                </div>
                <div class="others-right">
                  <p class="others-text" v-if="item.type==='text'">{{item.msg}}</p>
                  <span class="icon-volume-medium" v-if="item.type==='audio'" @click="playVoice($event)">
                    <audio class="audio-right" :src="item.msg"></audio>
                  </span>
                  <img class="picture" v-if="item.type==='image'" :src="item.msg">
                </div>
              </div>
              <div class="own" v-if="item.from===myself && judge(item.to)">
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
  import {loadFromLocal} from '../../common/js/store';
  import Recorder from '../../common/js/recorder';
//  import {formatDate} from '../../common/js/date';
  import {mapGetters} from 'vuex';
  export default {
    props: {
      doctor: {
        type: Object
      },
      consult: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        msg: '',
        myself: loadFromLocal('user'),
        identity: loadFromLocal('identity'),
        startTime: 0,
        endTime: 0
      };
    },
    computed: {
      title() {
        if (this.identity === false) {
          return '向' + this.doctor.name + '咨询中...';
        } else if (this.identity === 1) {
          return '为' + this.consult.from + '解答中...';
        }
      },
      ...mapGetters([
        'getSocket',
        'getMessageList'
      ])
    },
    mounted() {
      let self = this;
      this.getSocket.on('message', function(data) {
        self.$store.commit('setMessageList', data);
        self.$nextTick(() => {
          if (self.chatContentScroll) {
            self.chatContentScroll.refresh();
            self.chatContentScroll.scrollTo(0, self.chatContentScroll.maxScrollY);
          }
        });
      });
    },
    methods: {
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.chatContentScroll = new BScroll(this.$refs.chatContent, {
              click: true
            });
            this.chatContentScroll.scrollTo(0, this.chatContentScroll.maxScrollY);
          } else {
            this.chatContentScroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      playVoice(e) {
        let audio = e.target.children[0];
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
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
          let size = this.recorder.play();
          console.log('这是隔断！！！！');
          let toOther;
        //  let self = this;
          if (this.identity === false) {
            toOther = this.doctor.account;
          } else if (this.identity === 1) {
            toOther = this.consult.from;
          }
          let formdata = new FormData();
          formdata.append('type', 'audio');
          formdata.append('from', loadFromLocal('user'));
          formdata.append('avatar', loadFromLocal('image'));
          formdata.append('audio', audioData);
          formdata.append('to', toOther);
          formdata.append('time', (new Date()).getTime());
          formdata.append('new', size);
          this.$http.post('/api/voice/upload', formdata);
        //  let fr = new FileReader();
        //  fr.readAsDataURL(audioData);
        //  fr.onload = function() {
        //    let content = {
        //      type: 'audio',
        //      from: loadFromLocal('user'),
        //      avatar: loadFromLocal('image'),
        //      time: (new Date()).getTime(),
        //      msg: fr.result,
        //      to: toOther
        //    };
        //    self.msg = '';
        //    self.getSocket.emit('sayTo', content);
        //  };
          for (let j = 0; j < size.length; j++) {
            for (let k = 0; k < size[j].length; k++) {
              let a = Math.max(-1, Math.min(1, size[j][k]));
              console.log(a);
            }
          }
          console.log('结束');
        }
      },
      selectImg() {
        this.$refs.fileInput.click();
      },
      sendImg() {
        let picture = this.$refs.fileInput.files[0];
        let toOther;
        if (this.identity === false) {
          toOther = this.doctor.account;
        } else if (this.identity === 1) {
          toOther = this.consult.from;
        }
        let formdata = new FormData();
        formdata.append('type', 'image');
        formdata.append('from', loadFromLocal('user'));
        formdata.append('avatar', loadFromLocal('image'));
        formdata.append('picture', picture);
        formdata.append('to', toOther);
        formdata.append('time', (new Date()).getTime());
        this.$http.post('/api/img/upload', formdata);
        let self = this;
        let fr = new FileReader();
        fr.readAsDataURL(picture);
        fr.onload = function() {
          let content = {
            type: 'image',
            from: loadFromLocal('user'),
            avatar: loadFromLocal('image'),
            time: (new Date()).getTime(),
            msg: fr.result,
            to: toOther
          };
          self.msg = '';
          self.getSocket.emit('sayTo', content);
        };
      },
      sendBtn() {
        if (/^\s*$/.test(this.msg)) {
          alert('不要发空内容');
        } else if (this.msg.length > 600) {
          alert('请不要超过600字');
        } else {
          let toOther;
          if (this.identity === false) {
            toOther = this.doctor.account;
          } else if (this.identity === 1) {
            toOther = this.consult.from;
          }
          let content = {
            type: 'text',
            from: loadFromLocal('user'),
            avatar: loadFromLocal('image'),
            time: (new Date()).getTime(),
            msg: this.msg.trim(),
            to: toOther
          };
          this.msg = '';
          this.getSocket.emit('sayTo', content);
        }
      },
      judge(fromAndTo) {
        if (this.identity === false) {
          if (fromAndTo === this.doctor.account) {
            return true;
          } else {
            return false;
          }
        } else if (this.identity === 1) {
          if (fromAndTo === this.consult.from) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .chat
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
    .chat-header
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
    .chat-content
      position: absolute
      top: 48px
      bottom: 48px
      width: 100%
      overflow: hidden
      background: #f0f0f0
      .chat-item
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
            img
              border-radius: 50%
          .others-right
            position: relative
            float: left
            padding: 10px
            border-radius: 8px
            max-width: 60%
            background: #3c6
            &:after
              content: ""
              display: block
              position: absolute
              left: -7px
              top: 11px
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
            img
              border-radius: 50%
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
