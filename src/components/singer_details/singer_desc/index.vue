<template>
  <div class="singerDesc">
    <Loading
      v-if="JSON.stringify(singerDesc) == '{}'"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div v-else>
      <div class="desc_brief_top">
        <h2>{{ singerName }}简介</h2>
        <p>{{ singerDesc.briefDesc }}</p>
      </div>
      <div
        class="desc_brief_footer"
        v-if="singerDesc.introduction && singerDesc.introduction.length > 0"
      >
        <div v-for="item in singerDesc.introduction" :key="item.ti">
          <h2>{{ item.ti }}</h2>
          <p>{{ item.txt }}</p>
        </div>
      </div>
      <el-empty
        v-if="!singerDesc.introduction && !singerDesc.briefDesc"
        description="歌手暂无简介"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { getSingerDescapi } from "@/api/singerApi";
export default defineComponent({
  name: "singerDesc",
  props: {
    singerId: {
      required: true,
    },
    singerName: {
      required: true,
    },
  },
  setup(props) {
    let singerDesc = ref({}); //描述信息

    /**
     * 歌手描述获取
     * @param {String | number} id 歌手id
     */
    async function getSingerDesc(id) {
      const { data: res } = await getSingerDescapi(id);
      if (res && res.code === 200) {
        let obj = {
          briefDesc: res.briefDesc,
          introduction: res.introduction,
        };
        singerDesc.value = obj;
      }
    }
    getSingerDesc(props.singerId);
    return {
      singerDesc,
    };
  },
});
</script>

<style lang='less' scoped>
.singerDesc {
  min-height: 400px;
  margin-top: 10px;
  div {
    h2 {
      padding-left: 5px;
      margin: 5px 0;
      border-left: 5px solid #f0483b;
    }
    p {
      padding: 0 10px;
      font: 500 14px "华文楷书";
      line-height: 30px;
    }
  }
}
</style>