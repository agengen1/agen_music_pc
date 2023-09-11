export default {
  namespaced: true,
  state: {
    verifyCode: "", //验证code
    verifyUrl: "", //验证url
    verifyOpenStatus: false, //验证界面打开状态
  },
  mutations: {
    SETVERIFYCODE(state, data_string) {
      state.verifyCode = data_string;
    },
    SETVERIFYURL(state, data_string) {
      state.verifyUrl = data_string;
    },
    SETVERIFYOPENSTATUS(state, data_bool) {
      state.verifyOpenStatus = data_bool;
    },
  },
};
