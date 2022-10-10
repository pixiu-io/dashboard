<template>
  <el-aside style="height: 100%">
    <!--  -->
    <div class="cloud-select-container">
      <el-select
        style="width: 80%"
        v-model="data.cloud.cluster"
        @change="changeClouds"
      >
        <el-option
          v-for="item in data.clouds"
          :value="item.id"
          :key="item.id"
          :label="item.id"
        />
      </el-select>
    </div>
    <el-menu
      :default-active="data.path"
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
import { reactive, getCurrentInstance, onMounted, watch } from "vue";
import PixiuMenu from "@/components/menu/index.vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  cloud: {},
  clouds: [
    {
      id: "tencent",
    },
    {
      id: "huawei",
    },
  ],
  path: "",
  items: [
    {
      id: 1,
      name: "Node",
      url: "/kubernetes/nodes",
    },
    { id: 2, name: "Deployment", url: "/kubernetes/deployments" },
    {
      id: 3,
      name: "Service",
      url: "/kubernetes/services",
    },
    {
      id: 4,
      name: "ConfigMap",
      url: "/kubernetes/config-maps",
    },
  ],
});

const changeClouds = (value) => {
  let query = proxy.$route.query;
  let path = proxy.$route.path;
  data.items.map((item) => {
    let url = item.url.split("?")[0];
    item.url = url + `?cluster=${value}`;
  });
  data.path = path + `?cluster=${value}`;

  let newQuery = JSON.parse(JSON.stringify(query));
  newQuery.cluster = value;
  proxy.$router.push({ path, query: newQuery });
};

// watch(
//   () => data.cloud.cluster,
//   (newValue, oldVlue) => {

//   },
//   { immediate: true }
// );

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.items.map((item) => {
    let url = item.url.split("?")[0];
    item.url = url + `?cluster=${data.cloud.cluster}`;
  });
  data.path = proxy.$route.fullPath;
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

.cloud-select-container {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f6f7fb;
  border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
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
  width: 180px !important;
}

.el-menu-vertical-no-collapse:not(.el-menu--collapse) {
  width: 180px;
  height: calc(100% - 57px);
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
