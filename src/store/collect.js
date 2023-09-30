export default {
  namespaced: true,
  state: {
    collectMusic_id: 0, //收藏音乐id
    collectMusic_status: false, //收藏音乐页面打开状态
  },
  mutations: {
    SETCOLLECTMUSIC_ID(state, number_id) {
      state.collectMusic_id = number_id;
    },
    SETCOLLECTMUSIC_STATUS(state, bool_status) {
      state.collectMusic_status = bool_status;
    },
  },
};
