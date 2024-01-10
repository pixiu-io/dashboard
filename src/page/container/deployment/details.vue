<template>
  <!-- <el-card class="contend-card-container"> -->
  <div class="font-container" style="display: flex; padding: 20px; background-color: white">
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

  <el-tabs
    v-model="data.activeName"
    class="deployment-tab"
    @tab-click="handleClick"
    @tab-change="handleChange"
  >
    <!-- <div style="color: #000000; background-color: #006eff; width: calc(100% + 40px)">ddd</div> -->

    <el-tab-pane label="基本信息" name="first">
      <div class="app-pixiu-content-card">
        <div
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
        </div>
      </div>
    </el-tab-pane>

    <el-tab-pane label="Pod管理" name="second"
      ><div style="margin-top: 8px">
        <el-row>
          <el-col>
            <button class="pixiu-two-button2">监控</button>
            <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">
              销毁重建
            </button>

            <div style="margin-left: 8px; float: right; margin-top: 6px">
              <pixiu-icon
                name="icon-icon-refresh"
                style="cursor: pointer"
                size="14px"
                type="iconfont"
                color="#909399"
                @click="getDeploymentPods"
              />
            </div>

            <el-input
              v-model="data.pageInfo.query"
              placeholder="名称搜索关键字"
              style="width: 480px; float: right"
              clearable
              @clear="getDeploymentPods"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="getDeploymentPods"
                />
              </template>
            </el-input>
            <div style="float: right">
              <el-switch v-model="data.crontab" inline-prompt width="36px" /><span
                style="font-size: 13px; margin-left: 5px; margin-right: 10px"
                >自动刷新</span
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="data.loading"
          :data="data.deploymentPods"
          stripe
          style="margin-top: 20px; width: 100%; margin-bottom: 25px"
          header-row-class-name="pixiu-table-header"
          :cell-style="{
            'font-size': '12px',
            color: '#29292b',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" />
          <el-table-column prop="metadata.name" label="实例名称" min-width="70px">
            <template #default="scope">
              {{ scope.row.metadata.name }}
              <el-tooltip content="复制">
                <pixiu-icon
                  name="icon-copy"
                  size="11px"
                  type="iconfont"
                  class-name="icon-box"
                  color="#909399"
                  @click="copy(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" :formatter="formatterStatus" />
          <el-table-column prop="status.hostIP" label="所在节点" />

          <el-table-column prop="status.podIP" label="实例IP">
            <template #default="scope">
              {{ scope.row.status.podIP }}
              <el-tooltip content="复制">
                <pixiu-icon
                  name="icon-copy"
                  size="11px"
                  type="iconfont"
                  class-name="icon-box"
                  color="#909399"
                  @click="copyIP(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            prop="status.containerStatuses"
            label="重启次数"
            :formatter="getPodRestartCount"
          />

          <el-table-column
            prop="metadata.creationTimestamp"
            label="创建时间"
            :formatter="formatterTime"
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
      </div></el-tab-pane
    >
    <el-tab-pane label="日志" name="third">
      <el-card style="border-radius: 0px; margin-top: 20px; margin-left: 2px; margin-right: 2px">
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="事件" name="four">Role</el-tab-pane>

    <el-tab-pane label="YAML" name="five">YAML</el-tab-pane>
  </el-tabs>
  <!-- </el-card> -->

  <el-drawer v-model="data.drawer" title="I am the title" :with-header="false" size="35%">
    <div>容器日志</div>
    <div style="margin-top: 20px; font-size: 14px">{{ data.podLog }}</div>
  </el-drawer>
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

  activeName: 'first',

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

<style>
.el-tabs__nav-scroll {
  background-color: white;
  padding: 0 20px;
}

.deployment-tab .el-tabs__nav-scroll {
  background-color: white;
  padding: 0 20px;
}

.deployment-tab .el-tabs__header {
  background-color: white;
  margin: 0 0 20px;
}

.deployment-tab .el-tabs__content {
  background-color: white;
  padding: 0 20px;
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
