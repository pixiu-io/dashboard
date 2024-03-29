<template>
  <el-aside style="overflow-x: hidden">
    <div class="namespace-title-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToCluster"
      />
      <div
        style="
          margin-left: 10px;
          margin-top: -2px;
          color: black;
          font-size: 14px;
          font-weight: bold;
        "
      >
        <el-tooltip effect="light" placement="bottom" :content="data.clusterContent">
          <div class="pixiu-ellipsis-style" style="font-size: 14px">{{ data.aliasName }}</div>
        </el-tooltip>
      </div>
    </div>
    <div style="font-size: 13px; margin-left: 45px; margin-top: 5px; color: #909399">
      集群({{ data.cluster }})
    </div>

    <!-- <div class="cloud-select-container">
      <el-select v-model="data.cloud.cluster" style="width: 80%" @change="changeClouds">
        <el-option v-for="item in data.clouds" :key="item.id" :value="item.id" :label="item.id" />
      </el-select>
    </div> -->

    <div style="margin-top: 15px"></div>
    <el-menu
      :default-active="data.path"
      :default-openeds="data.openedMenu"
      :unique-opened="true"
      background-color="#f6f7fb"
      text-color="#000"
      router
      class="deployment-container"
      @open="handleOpen"
    >
      <pixiu-menu :items="data.clusterItems" />
    </el-menu>
  </el-aside>

  <!-- 主体 -->
  <el-main :class="{ 'no-padding': $route.meta.noPadding }">
    <router-view :key="$route.fullPath" />
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import PixiuMenu from '@/components/menu/index.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { proxy } = getCurrentInstance();

const handleOpen = (key, keyPath) => {
  localStorage.setItem('openMenu', JSON.stringify(keyPath));
};

const data = reactive({
  cluster: '',

  aliasName: '',
  clusterContent: '',

  cloud: {},
  clouds: [],
  namespace: 'default',
  namespaces: [],
  path: '',
  openedMenu: JSON.parse(localStorage.getItem('openMenu')) || [],
  clusterItems: [
    {
      name: '基本信息',
      icon: 'Postcard',
      iconType: 'el',
      url: '/kubernetes/info',
    },
    {
      name: '节点管理',
      icon: 'icon-jiedian',
      iconType: 'iconfont',
      url: '/kubernetes/nodes',
    },
    {
      name: '命名空间',
      icon: 'Money',
      iconType: 'el',
      url: '/kubernetes/namespaces',
    },
    // {
    //   name: 'Pixiu Shell',
    //   icon: 'icon-terminal',
    //   iconType: 'iconfont',
    //   url: '/kubernetes/terminal',
    // },

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
        // {
        //   id: 1.2,
        //   name: 'StatefulSet',
        //   url: '/kubernetes/statefulsets',
        // },
        {
          id: 1.3,
          name: 'Pod',
          url: '/kubernetes/pods',
        },
        {
          id: 1.4,
          name: 'Helm',
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
          url: '/kubernetes/configmaps',
        },
        {
          id: 2.2,
          name: 'Secret',
          url: '/kubernetes/secrets',
        },
      ],
    },
    {
      id: 4,
      name: '服务与域名',
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
      id: 9,
      name: '任务',
      icon: 'icon-fuwu',
      iconType: 'iconfont',
      children: [
        {
          id: 1.5,
          name: 'Job',
          url: '/kubernetes/job',
        },
        {
          id: 1.6,
          name: 'CronJob',
          url: '/kubernetes/cronJob',
        },
      ],
    },
    {
      id: 3,
      name: '存储',
      icon: 'icon-yidongyunkongzhitaiicon06',
      iconType: 'iconfont',
      children: [
        {
          id: 3.1,
          name: 'StorageClass',
          url: '/kubernetes/storageclass',
        },
      ],
    },
    {
      id: 5,
      name: 'Cicd',
      icon: 'icon-fuwu',
      iconType: 'iconfont',
      children: [
        {
          id: 5.1,
          name: 'Task',
          url: '/kubernetes/task',
        },
        {
          id: 5.2,
          name: 'TaskRun',
          url: '/kubernetes/taskrun',
        },
        {
          id: 5.3,
          name: 'Pipeline',
          url: '/kubernetes/pipeline',
        },
        {
          id: 5.4,
          name: 'PipelineRun',
          url: '/kubernetes/pipelinerun',
        },
      ],
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
          name: 'StatefulSet',
          url: '/kubernetes/statefulsets',
        },
        {
          id: 1.3,
          name: 'Pod',
          url: '/kubernetes/pods',
        },
        {
          id: 1.4,
          name: 'Helm',
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
          url: '/kubernetes/configmaps',
        },
        {
          id: 2.2,
          name: 'Secret',
          url: '/kubernetes/secrets',
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
      id: 9,
      name: 'Job',
      icon: 'icon-fuwu',
      iconType: 'iconfont',
      children: [
        {
          id: 1.5,
          name: 'Job',
          url: '/kubernetes/job',
        },
        {
          id: 1.6,
          name: 'CronJob',
          url: '/kubernetes/cronJob',
        },
      ],
    },
    {
      id: 3,
      name: '存储',
      icon: 'icon-yidongyunkongzhitaiicon06',
      iconType: 'iconfont',
      children: [
        {
          id: 3.1,
          name: 'StorageClass',
          url: '/kubernetes/storageclass',
        },
      ],
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
  data.clusterItems.map((item) => {
    // 如果父级中不存在children,改变父级url
    if (item.children !== undefined) {
      // 子级url拼接集群名称
      item.children.map((childrenItem) => {
        const url = childrenItem.url.split('?')[0];
        childrenItem.url = `${url}?cluster=${data.cloud.cluster}`;
      });
    } else {
      // 父级url拼接集群名称
      const url = item.url.split('?')[0];
      item.url = `${url}?cluster=${data.cloud.cluster}`;
    }
  });
  data.path = `${path}?cluster=${value}`;
  const newQuery = JSON.parse(JSON.stringify(query));
  newQuery.cluster = value;
  proxy.$router.replace({ path, query: newQuery });
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
      url: '/pixiu/clusters',
    });

    for (let item of result) {
      data.clouds.push({ id: item.name });
    }
  } catch (error) {}
};

onMounted(() => {
  data.cloud = proxy.$route.query;

  // 显示使用
  data.cluster = data.cloud.cluster;
  // 集群的中文名称
  data.aliasName = localStorage.getItem(data.cluster);

  data.clusterContent = data.aliasName + `(${data.cluster})`;

  changeClouds(data.cloud.cluster);

  getCloudList();
  data.path = proxy.$route.fullPath;
  const openMenu = JSON.parse(localStorage.getItem('openMenu'));
  if (openMenu) {
    data.openedMenu = openMenu;
  }
});

const goToCluster = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/clusters' });
};
</script>

<style scoped="scoped">
.cloud-title-container {
  font-size: 8px;
  color: #4c4e58;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
}

.deployment-container {
  --el-menu-item-height: 48px;
  --el-menu-sub-item-height: calc(var(--el-menu-item-height) - 6px);
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
  margin-top: 12px;
  margin-left: 10px;
  margin-bottom: -10px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
}

.app-title-container {
  margin-top: 6px;
  margin-left: 10px;
  font-size: 15px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
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
  border-right: 1px rgba(0, 0, 0, 0.1) solid;
}

.el-menu {
  border-right: none;
  /* height: 100%; */
}
.expand-icon {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>
