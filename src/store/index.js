import { createStore } from "vuex";
import user from "./user.js";
import player from "./player.js";
import verify from "./verify.js";
export default createStore({
  modules: {
    user,
    player,
    verify,
  },
});
