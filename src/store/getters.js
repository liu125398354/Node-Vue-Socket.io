/**
 * Created by liunannan on 2017/12/31.
 */
export default {
  isload: (state) => {
    return state.isload;
  },
  isshow: (state) => {
    return state.isshow;
  },
  getSocket: (state) => {
    return state.socket;
  },
  getMessageList: (state) => {
    return state.messageList;
  },
  getGroupMessage: (state) => {
    return state.groupMessage;
  }
};
