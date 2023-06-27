import { createStore } from "vuex";
import player from "./player.js";
export default createStore({
  modules: {
    player,
  },
});
