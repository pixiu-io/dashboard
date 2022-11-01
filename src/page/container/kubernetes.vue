<template>
  <el-aside>
    <div class="cloud-title-container">控制台</div>

    <div class="cloud-select-container">
      <el-select v-model="data.cloud.cluster" style="width: 80%" @change="changeClouds">
        <el-option v-for="item in data.clouds" :key="item.id" :value="item.id" :label="item.id" />
      </el-select>
    </div>

    <div class="namespace-select-container">
      <el-select v-model="data.namespace" style="width: 80%">
        <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
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
import { reactive, getCurrentInstance, onMounted, watch } from 'vue';
import PixiuMenu from '@/components/menu/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  cloud: {},
  clouds: [],
  namespace: 'default',
  namespaces: ['default', 'kube-system'],
  path: '',
  items: [
    {
      id: 1,
      name: 'Node',
      url: '/kubernetes/nodes',
    },
    { id: 2, name: 'Deployment', url: '/kubernetes/deployments' },
    {
      id: 3,
      name: 'Service',
      url: '/kubernetes/services',
    },
    {
      id: 4,
      name: 'ConfigMap',
      url: '/kubernetes/config-maps',
    },
    {
      id: 5,
      name: 'Terminal',
      url: '/kubernetes/terminal',
    },
  ],
});

const changeClouds = (value) => {
  const { query } = proxy.$route;
  const { path } = proxy.$route;
  data.items.map((item) => {
    const url = item.url.split('?')[0];
    item.url = `${url}?cluster=${value}`;
  });
  data.path = `${path}?cluster=${value}`;

  const newQuery = JSON.parse(JSON.stringify(query));
  newQuery.cluster = value;
  proxy.$router.push({ path, query: newQuery });
};

// watch(
//   () => data.cloud.cluster,
//   (newValue, oldVlue) => {

//   },
//   { immediate: true }
// );

const getCloudList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/clouds',
    });

    for (let item of result) {
      data.clouds.push({ id: item.name });
    }
  } catch (error) {}
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.items.map((item) => {
    const url = item.url.split('?')[0];
    item.url = `${url}?cluster=${data.cloud.cluster}`;
  });
  data.path = proxy.$route.fullPath;
  getCloudList();
});
</script>

<style scoped="scoped">
.cloud-title-container {
  font-size: 16px;
  color: #4c4e58;
  margin-left: 20px;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
}

.cloud-select-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
}

.namespace-select-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background-color: #f6f7fb;
  width: 200px;
}

.el-menu-vertical-no-collapse:not(.el-menu--collapse) {
  width: 180px;
  height: calc(100% - 180px);
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
