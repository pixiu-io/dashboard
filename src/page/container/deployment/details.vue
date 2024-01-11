<template>
  <el-card class="contend-card-container">
    <div class="font-container" style="display: flex">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="goToDeployment"
      />

      <el-breadcrumb separator="/" style="margin-left: 20px">
        <el-breadcrumb-item><span class="breadcrumb-style">集群</span></el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="breadcrumb-style">{{ data.cluster }}</span>
        </el-breadcrumb-item>

        <el-breadcrumb-item
          ><span class="breadcrumb-style">Deployment:{{ data.name }}({{ data.namespace }})</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 20px"></div>

    <el-tabs
      v-model="data.activeName"
      class="deployment-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="Pod管理" name="second"> </el-tab-pane>
      <el-tab-pane label="日志" name="third"> </el-tab-pane>
      <el-tab-pane label="事件" name="four"></el-tab-pane>
      <el-tab-pane label="YAML" name="five"></el-tab-pane>
    </el-tabs>
  </el-card>

  <div v-if="data.activeName === 'first'">
    <el-card class="contend-card-container2">基本信息</el-card>
  </div>

  <div v-if="data.activeName === 'second'">
    <el-card class="contend-card-container2">Pod管理</el-card>
  </div>

  <div v-if="data.activeName === 'third'">
    <el-card class="contend-card-container2">日志</el-card>
  </div>

  <div v-if="data.activeName === 'four'">
    <el-card class="contend-card-container2">事件</el-card>
  </div>

  <div v-if="data.activeName === 'five'">
    <el-card class="contend-card-container2">YAML</el-card>
  </div>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',
  namespace: '',

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  restarts: 0,
  loading: false,

  deployment: {},
  deploymentPods: [],
  deploymentEvents: [],

  activeName: 'second',

  drawer: false,
  podLog: '',

  crontab: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;
  data.namespace = proxy.$route.query.namespace;

  await getDeployment();
  await getDeploymentPods();
  await getDeploymentEvents();
});

const { toClipboard } = useClipboard();
const copy = async (val) => {
  try {
    await toClipboard(val.metadata.name);
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};

const copyIP = async (val) => {
  try {
    await toClipboard(val.status.podIP);
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};

const getDeployment = async () => {
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${data.name}`,
  });
  data.deployment = res;
};

const deletePod = async (row) => {
  const pods = await proxy.$http({
    method: 'delete',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${row.metadata.namespace}/pods/${row.metadata.name}`,
  });

  await getDeploymentPods();
};

const getPodLog = async (row) => {
  const containers = row.spec.containers;
  const log = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${row.metadata.namespace}/pods/${row.metadata.name}/log`,
    data: { container: containers[0].name },
  });

  data.drawer = true;
  data.podLog = log;
};

const getDeploymentPods = async () => {
  let matchLabels = data.deployment.spec.selector.matchLabels;
  let labels = [];
  for (let key in matchLabels) {
    labels.push(key + '=' + matchLabels[key]);
  }

  const pods = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/pods`,
    data: {
      labelSelector: labels.join(','),
      limit: 500,
    },
  });
  data.deploymentPods = pods.items;
};

const getDeploymentEvents = async () => {
  const events = await proxy.$http({
    method: 'get',
    url: `/pixiu/kubeproxy/clusters/${data.cluster}/namespaces/${data.namespace}/name/${data.name}/kind/deployment/events`,
  });
  data.deploymentEvents = events;
};

const formatterStatus = (row, column, cellValue) => {
  let phase = cellValue.phase;
  if (phase == 'Failed') {
    phase = cellValue.reason;
  } else if (phase == 'Pending') {
    const containerStatuses = cellValue.containerStatuses;
    for (let i = 0; i < containerStatuses.length; i++) {
      phase = containerStatuses[i].state.waiting.reason;
      break;
    }
  }

  if (phase == 'Running') {
    return <div class="color-green-word">{phase}</div>;
  }
  return <div>{phase}</div>;
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div
        class="pixiu-table-formatter"
        style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
      >
        {time}
      </div>
    </el-tooltip>
  );
};

const getPodRestartCount = (row, column, cellValue) => {
  let count = 0;
  if (cellValue === undefined) {
  } else {
    for (let i = 0; i < cellValue.length; i++) {
      count = count + cellValue[i].restartCount;
    }
  }

  return <div>{count} 次</div>;
};

const padZero = (number) => {
  return number.toString().padStart(2, '0');
};

const handleClick = (tab, event) => {};

const handleChange = (name) => {};

const goToDeployment = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/deployments', query: queryParams });
};
</script>

<style scoped="scoped">
.deployment-tab {
  margin-top: 1px;
  margin-bottom: -33px;
}

.demo-tabs .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.deployment-info {
  color: #909399;
  font-size: 13px;
}

.deploy-detail-info {
  font-size: 13px;
  color: #29232b;
}
</style>
