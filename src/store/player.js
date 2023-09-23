import { ElMessage } from "element-plus";

export default {
  namespaced: true,
  state: {
    playMusic_index: 0, //播放音乐下标
    playMusic_id: 0, //播放音乐id
    playMusic_status: false, //播放音乐状态 true-表示正在播放
    playMusic_time: 0, //音乐已经播放的时间
    playMusic_list: [], //播放音乐列表 保存歌曲信息
    playMusic_volume:
      parseInt(window.localStorage.getItem("playMusic_volume")) || 50, // 音乐播放音量大小 -- 默认值50
  },
  mutations: {
    SETPLAYMUSIC_INDEX(state, number_index) {
      state.playMusic_index = number_index;
    },
    SETPLAYMUSIC_ID(state, number_id) {
      state.playMusic_id = number_id;
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
      // 添加并播放音乐
      if (Array.isArray(any_data_list)) {
        // 数组处理
        let arr = [];
        state.playMusic_list.forEach((e) => {
          if (
            !any_data_list.some((ee) => {
              return e.id == ee.id;
            })
          ) {
            arr.push(e);
          }
        });
        state.playMusic_list = [...arr, ...any_data_list];
        state.playMusic_index =
          state.playMusic_list.length - any_data_list.length;
        state.playMusic_status = true;
        state.playMusic_id = state.playMusic_list[state.playMusic_index].id;
      } else {
        // 对象处理
        let new_arr = state.playMusic_list.filter((e) => {
          return e.id !== any_data_list.id;
        });
        new_arr.push(any_data_list);
        state.playMusic_list = new_arr;
        state.playMusic_index = state.playMusic_list.length - 1;
        state.playMusic_status = true;
        state.playMusic_id = state.playMusic_list[state.playMusic_index].id;
      }
    },
    ADDPLAYMUSIC_LIST_NOTPLAY(state, any_data_obj) {
      ElMessage.closeAll();
      //添加不播放音乐
      // 对象处理
      let new_arr = state.playMusic_list.filter((e) => {
        return e.id !== any_data_obj.id;
      });
      new_arr.push(any_data_obj);
      state.playMusic_status = true;
      state.playMusic_list = new_arr;
      ElMessage({
        type: "success",
        message: "添加播放列表成功！",
      });
    },
    DELETEPLAYMUSIC_LIST_ALLMUSIC(state) {
      //删除播放列表音乐（全部）
      ElMessage({
        type: "success",
        message: "清空播放列表成功！",
      });
      state.playMusic_index = 0;
      state.playMusic_id = 0;
      state.playMusic_status = false;
      state.playMusic_time = 0;
      state.playMusic_list = [];
    },
    DELETEPLAYMUSIC_LIST_MUSIC(state, number_id) {
      ElMessage.closeAll();
      //删除播放列表音乐（1首）
      if (state.playMusic_list.length <= 1) {
        ElMessage({
          type: "success",
          message: "删除音乐成功！",
        });
        state.playMusic_index = 0;
        state.playMusic_id = 0;
        state.playMusic_status = false;
        state.playMusic_time = 0;
        state.playMusic_list = [];
      } else {
        let old_index = null;
        for (let i = 0; i < state.playMusic_list.length; i++) {
          if (state.playMusic_list[i].id == number_id) {
            old_index = i;
            break;
          }
        }
        state.playMusic_list = state.playMusic_list.filter((el) => {
          return el.id != number_id;
        });
        if (old_index === 0 && state.playMusic_index == 0) {
          state.playMusic_id = state.playMusic_list[state.playMusic_index].id;
        } else if (old_index <= state.playMusic_index) {
          state.playMusic_index--;
        }
        ElMessage({
          type: "success",
          message: "删除音乐成功！",
        });
      }
    },
  },
  getters: {
    playMusic_ID(state) {
      if (state.playMusic_list.length > 0) {
        return state.playMusic_list[state.playMusic_index].id;
      }
    },
  },
};
