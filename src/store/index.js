import { createStore } from "vuex";
import user from "./user.js";
import player from "./player.js";
import verify from "./verify.js";
import collect from "./collect.js";
export default createStore({
  modules: {
    user,
    player,
    verify,
    collect,
  },
});
