<template>
  <el-aside style="height: 100%">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#f6f7fb"
      text-color="#000"
      router
      class="el-menu-vertical-no-collapse"
    >
      <pixiu-menu :items="data.items" />
    </el-menu>
  </el-aside>

  <!-- 主体 -->
  <el-main>
    <router-view />
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from "vue";
import PixiuMenu from "@/components/menu/index.vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  cloud: {},
  items: [
    {
      name: "Node",
      url: "/kubernetes/nodes",
    },
    {
      name: "Deployment",
      url: "/kubernetes/deployments",
    },
    {
      name: "Service",
      url: "/kubernetes/services",
    },
    {
      name: "ConfigMap",
      url: "/kubernetes/config-maps",
    },
  ],
});

onMounted(() => {
  data.cloud = proxy.$route.params;
});
</script>

<style scoped="scoped">
.modules-header-cf-header-container {
  height: 100%;
  width: 100%;
  font-weight: 400;
  font-style: normal;
  /* position: fixed; */
  min-width: 1120px;
  z-index: 1002;
  top: 0;
  left: 0;
  background-color: #ebe7e7;
}

.el-header {
  background: rgb(55, 61, 61);
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  color: #fff;
  font-size: 25px;
}

.el-header img {
  vertical-align: middle;
  /* 调整图片高度 */
  height: 80%;
  width: auto;
  margin: 5px;
}

.el-aside {
  height: 100%;
  width: auto !important;
}

.el-menu-vertical-no-collapse:not(.el-menu--collapse) {
  width: 180px;
  height: 100%;
  margin-left: -20px;
}

.el-menu {
  border-right: none;
  height: 100%;
}

.expand-icon {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.el-main {
  background: #fff;
}
</style>
