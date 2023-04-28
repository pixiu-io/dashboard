<template>
  <el-aside>
    <div class="cloud-title-container">控制台</div>

    <div class="namespace-title-container">集群</div>
    <div class="cloud-select-container">
      <el-select v-model="data.cloud.cluster" style="width: 80%" @change="changeClouds">
        <el-option v-for="item in data.clouds" :key="item.id" :value="item.id" :label="item.id" />
      </el-select>
    </div>
    <div class="namespace-title-container">命名空间</div>
    <div class="namespace-select-container">
      <el-select v-model="data.namespace" style="width: 80%" @change="changeNamespace">
        <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
      </el-select>
    </div>

    <div class="app-title-container">应用中心</div>
    <el-menu
      :default-active="data.path"
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
  namespaces: [],
  path: '',
  items: [
    {
      id: 1,
      name: '工作负载',
      icon: 'icon-xitongfuzai',
      iconType: 'iconfont',
      children: [
        {
          id: 1.1,
          name: 'Deployment',
          url: '/kubernetes/deployments',
        },
        {
          id: 1.2,
          name: 'Statsfulset',
          url: '/kubernetes/statsfulsets',
        },
        {
          id: 1.3,
          name: 'Pod',
          url: '/kubernetes/pods',
        },
        {
          id: 1.4,
          name: 'Helm Release',
          url: '/kubernetes/release',
        },
      ],
    },
    {
      id: 2,
      name: '配置',
      icon: 'icon-peizhiguanli',
      iconType: 'iconfont',
      children: [
        {
          id: 2.1,
          name: 'ConfigMap',
          url: '/kubernetes/comfig-map',
        },
      ],
    },
    {
      id: 4,
      name: '服务发现',
      icon: 'icon-fuwu',
      iconType: 'iconfont',
      children: [
        {
          id: 4.1,
          name: 'Service',
          url: '/kubernetes/services',
        },
        {
          id: 4.2,
          name: 'Ingress',
          url: '/kubernetes/ingress',
        },
      ],
    },
    {
      id: 3,
      name: '存储',
      icon: 'icon-yingpan',
      iconType: 'iconfont',
      children: [
        {
          id: 3.1,
          name: 'Storage class',
          url: '/kubernetes/storage-pv',
        },
      ],
    },
    {
      id: 7,
      name: '监控中心',
      icon: 'Monitor',
      iconType: 'iconfont',
      url: '/kubernetes/monitor',
    },
    {
      id: 5,
      name: 'Pixiu Shell',
      icon: 'icon-a-kuozhanicon_huaban1fuben33',
      iconType: 'iconfont',
      url: '/kubernetes/terminal',
    },
    {
      id: 6,
      name: '貔貅商店',
      icon: 'Shop',
      iconType: 'el',
      children: [
        {
          id: 6.1,
          name: 'Operator',
          url: '/kubernetes/operator',
        },
        {
          id: 6.2,
          name: 'Helm',
          url: '/kubernetes/helm',
        },
      ],
    },
  ],
});

const changeClouds = (value) => {
  const { query } = proxy.$route;
  const { path } = proxy.$route;
  data.items.map((item) => {
    // 如果父级中不存在children,改变父级url
    if (item.children !== undefined) {
      // 子级url拼接集群名称
      item.children.map((childrenItem) => {
        const url = childrenItem.url.split('?')[0];
        childrenItem.url = `${url}?cluster=${data.cloud.cluster}&namespace=${data.namespace}`;
      });
    } else {
      // 父级url拼接集群名称
      const url = item.url.split('?')[0];
      item.url = `${url}?cluster=${data.cloud.cluster}&namespace=${data.namespace}`;
    }
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

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cloud.cluster + '/api/v1/namespaces',
    });

    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
  } catch (error) {}
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;
};

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  changeClouds(data.cloud.cluster);

  getCloudList();
  getNamespaceList();
  getNamespace();
});
</script>

<style scoped="scoped">
.cloud-title-container {
  font-size: 16px;
  color: #4c4e58;
  padding-left: 20px;
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
  border-bottom: 0px rgba(0, 0, 0, 0.1) solid;
}

.namespace-title-container {
  font-size: 15px;
  margin-top: 6px;
  margin-left: 10px;
  margin-bottom: -10px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
}

.app-title-container {
  margin-top: 10px;
  margin-left: 10px;
  font-size: 15px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
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
  height: calc(100% - 300px);
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
</style>
