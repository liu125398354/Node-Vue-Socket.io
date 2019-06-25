/**
 * Created by liunannan on 2017/12/31.
 */
import {SETLOAD} from './types';
import getters from './getters';
const state = {
  isload: false,
  isshow: true,
  socket: '',
  messageList: [],
  groupMessage: []
};

const mutations = {
  [SETLOAD](state, data) {
    state.isload = data;
  },
  setload(state, data) {
    state.isload = data;
  },
  setdoctorlist(state, data) {
    state.isshow = data;
  },
  setSocket(state, data) {
    state.socket = data;
  },
  setMessageList(state, data) {
    state.messageList.push(data);
  },
  setGroupMessage(state, data) {
    state.groupMessage.push(data);
  }
};

export default {
  state,
  mutations,
  getters
};
