<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="goToDeployment"
          ><span style="color: black"> Deployment </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ data.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <el-card style="border-radius: 0px; margin-top: 20px; margin-left: 2px; margin-right: 2px">
    <el-tabs
      v-model="data.activeName"
      class="deployment-tab"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first">
        <div class="app-pixiu-content-card">
          <el-card
            v-if="data.deployment.metadata"
            style="margin-top: 8px; width: 100%; border-radius: 0px"
          >
            <el-form-item label="名称" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 90px">
                {{ data.deployment.metadata.name }}
              </span>
            </el-form-item>
            <el-form-item label="命名空间" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 63px">
                {{ data.deployment.metadata.namespace }}
              </span>
            </el-form-item>
            <el-form-item label="创建时间" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 63px">
                {{ data.deployment.metadata.creationTimestamp }}
              </span>
            </el-form-item>
            <el-form-item label="Labels" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 75px">
                {{ data.deployment.spec.selector.matchLabels }}
              </span>
            </el-form-item>
            <el-form-item label="更新策略" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 63px">
                {{ data.deployment.spec.strategy.type }}
              </span>
            </el-form-item>
            <el-form-item label="副本数" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 75px">
                {{ data.deployment.spec.replicas }}
              </span>
            </el-form-item>
            <el-form-item label="其他" class="deployment-info">
              <span class="deploy-detail-info" style="margin-left: 88px"> - </span>
            </el-form-item>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Pod管理" name="second"
        ><el-card style="margin-top: 8px">
          <el-table
            v-loading="data.loading"
            :data="data.deploymentPods"
            stripe
            style="margin-top: 2px; width: 100%"
            header-row-class-name="pixiu-table-header"
            @selection-change="handleSelectionChange"
            :cell-style="{
              'font-size': '12px',
              color: '#29292b',
            }"
          >
            <el-table-column type="selection" width="30" />
            <el-table-column prop="metadata.name" label="实例名称" min-width="200px" />
            <el-table-column
              prop="metadata.creationTimestamp"
              label="创建时间"
              width="170px"
              :formatter="formatterTime"
            />
            <el-table-column
              prop="status"
              label="状态"
              :formatter="formatterStatus"
              min-width="80px"
            />
            <el-table-column prop="status.hostIP" label="所在节点" width="120px" />
            <el-table-column prop="status.podIP" label="实例IP" width="120px" />
            <el-table-column
              prop="status.containerStatuses"
              label="重启次数"
              width="80px"
              :formatter="getPodRestartCount"
            />
            <el-table-column fixed="right" label="操作" width="160px">
              <template #default="scope">
                <el-button
                  size="small"
                  type="text"
                  style="margin-right: -25px; margin-left: -10px; color: #006eff"
                  @click="deletePod(scope.row)"
                >
                  销毁重建
                </el-button>

                <el-button
                  type="text"
                  size="small"
                  style="margin-right: 1px; color: #006eff"
                  @click="getPodLog(scope.row)"
                >
                  查看日志
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card></el-tab-pane
      >
      <el-tab-pane label="事件" name="third">Role</el-tab-pane>
    </el-tabs>
  </el-card>

  <el-drawer v-model="data.drawer" title="I am the title" :with-header="false" size="35%">
    <div>容器日志</div>
    <div style="margin-top: 20px; font-size: 14px">{{ data.podLog }}</div>
  </el-drawer>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',
  namespace: '',

  restarts: 0,
  loading: false,

  deployment: {},
  deploymentPods: [],
  deploymentEvents: [],

  activeName: 'first',

  drawer: false,
  podLog: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;
  data.namespace = proxy.$route.query.namespace;

  await getDeployment();
  await getDeploymentPods();
  await getDeploymentEvents();
});

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

  return <div>{phase}</div>;
};

const formatterTime = (row, column, cellValue) => {
  const date = new Date(cellValue);
  const formattedDateTime = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
    date.getDate(),
  )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

  return <div>{formattedDateTime}</div>;
};

const getPodRestartCount = (row, column, cellValue) => {
  let count = 0;
  if (cellValue === undefined) {
  } else {
    for (let i = 0; i < cellValue.length; i++) {
      count = count + cellValue[i].restartCount;
    }
  }

  return <div>{count}</div>;
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
