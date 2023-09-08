export default {
  namespaced: true,
  state: {
    user_isLogin: false, //用户是否登录 （false表示未登录）
    userinfo: {}, //登录用户信息
    login_openState: false, //登录页面是否打开
    userLikeMusicListId: [], //用户喜欢音乐列表id
  },
  mutations: {
    SETUSERISLOGIN(state, bool_flag) {
      state.user_isLogin = bool_flag;
    },
    SETUSERINFO(state, obj_data) {
      // 判断设置用户信息是，（用户信息为{}表示在退出登录，直接将localStorage中的userId删除,剩下则相反）
      if (obj_data.userId) {
        localStorage.setItem("userId", obj_data.userId);
      } else {
        localStorage.removeItem("userId");
      }
      state.userinfo = obj_data;
    },
    SETLOGINOPENSTATE(state, bool_flag) {
      state.login_openState = bool_flag;
    },
    SETUSERLIKEMUSICLISTID(state, arr_data) {
      state.userLikeMusicListId = arr_data;
    },
  },
};
