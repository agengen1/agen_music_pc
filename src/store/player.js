export default {
  namespaced: true,
  state: {
    playMusic_index: 0, //播放音乐下标
    playMusic_status: false, //播放音乐状态 true-表示正在播放
    playMusic_time: 0, //音乐已经播放的时间
    playMusic_list: [
      {
        name: "热爱105°C的你 (Live版)",
        id: 2048586106,
        playTime: 218307,
        imgUrl:
          "http://p1.music.126.net/4CH5UGoUznqVVMM3k69-QA==/109951168622343007.jpg",
        album: {
          id: 165939450,
          name: "天赐的声音第四季 第4期",
          imgUrl:
            "http://p3.music.126.net/4CH5UGoUznqVVMM3k69-QA==/109951168622343007.jpg",
        },
        artists: {
          id: 34485896,
          name: "天赐的声音",
          imgUrl:
            "http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
        },
      },
    ], //播放音乐列表 保存歌曲信息
    playMusic_volume:
      parseInt(window.localStorage.getItem("playMusic_volume")) || 50, // 音乐播放音量大小 -- 默认值50
  },
  mutations: {
    SETPLAYMUSIC_INDEX(state, number_index) {
      state.playMusic_index = number_index;
    },
    SETPLAYMUSIC_STATUS(state, boolean_status) {
      state.playMusic_status = boolean_status;
    },
    SETPLAYMUSIC_TIME(state, number_time) {
      state.playMusic_time = number_time;
    },
    SETPLAYMUSIC_VOLUME(state, number_volume) {
      state.playMusic_volume = number_volume;
      window.localStorage.setItem("playMusic_volume", number_volume);
    },
    ADDPLAYMUSIC_LIST(state, any_data_list) {
      if (typeof any_data_list == "object") {
        // 对象处理
        let new_arr = state.playMusic_list.filter((e) => {
          return e.id !== any_data_list.id;
        });
        new_arr.push(any_data_list);
        state.playMusic_list = new_arr;
        state.playMusic_index = state.playMusic_list.length - 1;
      } else {
        // 数组处理
        console.log("array", any_data_list);
      }
    },
  },
  getters: {
    playMusic_ID(state) {
      return state.playMusic_list[state.playMusic_index].id;
    },
  },
};
