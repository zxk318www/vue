<template>
  <div id="nav-wrap">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in rotuers">
        <el-submenu :key="item.id" v-if="!item.hidden" :index="index + ''">
          <!-- 1级菜单 -->
          <template slot="title">
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <el-menu-item
            v-for="item2 in item.children"
            :key="item2.id"
            :index="item2.path"
            >{{ item2.meta.name }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { root }) {
    // console.log(root.$router.options.routes);
    const rotuers = reactive(root.$router.options.routes);

    const isCollapse = ref(false);

    const handleOpen = (key, keyPath) => {
      // console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      //console.log(key, keyPath);
    };

    return {
      rotuers,
      isCollapse,
      handleOpen,
      handleClose
    };
  }
};
</script>
<style lang="scss" scoped>
@import "./../../../styles/config.scss";
#nav-wrap {
  position: fixed;
  width: $navMenu;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: #344a5f;
}
</style>
