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
    <el-card class="contend-card-container2">
      <div class="big-world-style" style="margin-bottom: 20px">基本信息</div>

      <div v-if="data.deployment.metadata" style="margin-top: 8px; width: 100%; border-radius: 0px">
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
      </div></el-card
    >
  </div>

  <div v-if="data.activeName === 'second'">
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <button class="pixiu-two-button">刷新</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">销毁重建</button>

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
    </div>
    <el-card style="margin-top: 15px" class="contend-card-container2">
      <el-table
        v-loading="data.loading"
        :data="data.deploymentPods"
        stripe
        style="margin-top: 10px; width: 100%; margin-bottom: 25px"
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
              @click="openShell(scope.row)"
            >
              远程连接
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <div v-if="data.activeName === 'third'">
    <el-card class="contend-card-container2">
      <div class="big-world-style">筛选条件</div>

      <el-form-item
        label="Pod选项"
        class="deployment-info"
        style="font-size: 15px; margin-left: 8px"
      >
        <span class="deploy-detail-info" style="margin-left: 92px">
          <el-select
            v-model="data.selectedPod"
            style="width: 230px; float: right; margin-right: 10px"
            @change="changePod"
          >
            <el-option v-for="item in data.selectedPods" :key="item" :value="item" :label="item" />
          </el-select>
        </span>

        <span class="deploy-detail-info" style="margin-left: 8px">
          <el-select
            v-model="data.selectedContainer"
            style="width: 230px; float: right; margin-right: 10px"
            @change="changeContainer"
          >
            <el-option
              v-for="item in data.selectedContainers"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </span>

        <div style="margin-left: 4px; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="16px"
            type="iconfont"
            color="#909399"
            @click="getDeploymentPods"
          />
        </div>
      </el-form-item>

      <el-form-item
        label="其他选项"
        class="deployment-info"
        style="font-size: 15px; margin-left: 8px"
      >
        <span class="deploy-detail-info" style="margin-left: 90px">
          <el-select
            v-model="data.logLine"
            style="width: 230px; float: right; margin-right: 10px"
            @change="changeLogLine"
          >
            <el-option v-for="item in data.logLines" :key="item" :value="item" :label="item" />
          </el-select>
        </span>
      </el-form-item>

      <div style="margin-left: 170px; margin-top: -10px; margin-bottom: 10px">
        <el-switch v-model="data.previous" inline-prompt width="36px" /><span
          style="font-size: 14px; margin-left: 5px; margin-right: 10px"
          >查看已退出的容器</span
        >
      </div>
    </el-card>

    <button style="margin-top: 15px" class="pixiu-two-button" @click="getPodLog">刷新</button>

    <div style="float: right; margin-top: 8px">
      <el-switch v-model="data.logAutoRefresh" inline-prompt width="36px" /><span
        style="font-size: 13px; margin-left: 5px; margin-right: 10px"
        >自动刷新</span
      >
      <pixiu-icon
        name="icon-icon-refresh"
        style="cursor: pointer"
        size="16px"
        type="iconfont"
        color="#909399"
        @click="getPodLog"
      />
    </div>

    <div style="margin-top: 15px">
      <el-card class="contend-card-container2">
        <div style="background-color: #29232b; color: white; min-height: 440px">
          <div style="margin-left: 20px">
            <div v-if="data.podLogs.length === 0" style="font-size: 14px">暂无日志</div>
            <div v-else>
              <div v-for="(item, index) in data.podLogs" :key="item" style="font-size: 14px">
                {{ index + 1 }} <span style="margin-left: 18px"></span> {{ item }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <div v-if="data.activeName === 'four'">
    <el-card class="contend-card-container2">
      <div class="big-world-style">筛选条件</div>

      <el-form-item
        label="命令空间"
        class="deployment-info"
        style="font-size: 15px; margin-left: 8px"
      >
        <span class="deploy-detail-info" style="margin-left: 90px">
          <el-select
            v-model="data.namespace"
            style="width: 230px; float: right; margin-right: 10px"
          >
          </el-select>
        </span>
      </el-form-item>

      <el-form-item label="类型" class="deployment-info" style="font-size: 15px; margin-left: 8px">
        <span class="deploy-detail-info" style="margin-left: 120px">
          <el-select
            v-model="data.workloadType"
            style="width: 230px; float: right; margin-right: 10px"
          >
          </el-select>
        </span>
      </el-form-item>
      <el-form-item label="名称" class="deployment-info" style="font-size: 15px; margin-left: 8px">
        <span class="deploy-detail-info" style="margin-left: 120px">
          <el-select v-model="data.name" style="width: 230px; float: right; margin-right: 10px">
          </el-select>
        </span>
      </el-form-item>
    </el-card>

    <el-col>
      <button style="margin-top: 15px" class="pixiu-two-button" @click="getDeploymentEvents">
        刷新
      </button>
      <button style="margin-top: 15px; margin-left: 10px; width: 85px" class="pixiu-two-button2">
        批量删除
      </button>

      <div style="float: right; margin-top: 16px">
        <el-switch v-model="data.eventAutoRefresh" inline-prompt width="36px" /><span
          style="font-size: 13px; margin-left: 5px; margin-right: 10px"
          >自动刷新</span
        >
        <pixiu-icon
          name="icon-icon-refresh"
          style="cursor: pointer"
          size="16px"
          type="iconfont"
          color="#909399"
          @click="getDeploymentEvents"
        />
      </div>
    </el-col>

    <div style="margin-top: 18px">
      <el-card class="contend-card-container2">
        <el-table
          v-loading="data.loading"
          :data="data.deploymentEvents"
          stripe
          style="margin-top: 10px; width: 100%; margin-bottom: 25px"
          header-row-class-name="pixiu-table-header"
          :cell-style="{
            'font-size': '12px',
            color: '#29292b',
          }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30px" />
          <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
          <el-table-column prop="type" label="级别" />
          <el-table-column prop="kind" label="资源类型"> </el-table-column>
          <el-table-column prop="objectName" label="资源名称"> </el-table-column>
          <el-table-column prop="message" label="内容" width="500ox" />

          <el-table-column fixed="right" label="操作" width="100px">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                style="margin-right: -25px; margin-left: -10px; color: #006eff"
                @click="deleteEvent(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>

  <div v-if="data.activeName === 'five'">
    <div style="margin-top: 20px">
      <el-col>
        <button class="pixiu-two-button" style="width: 85px" @click="editYaml">编辑YAML</button>
        <button class="pixiu-two-button" style="margin-left: 10px" @click="copyYmal">复制</button>

        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="getDeployment"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 10px"></div>
    <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly"></MyCodeMirror>
    <div v-if="!data.readOnly" style="margin-top: 10px">
      <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
      <el-button class="pixiu-confirm-button" type="primary" @click="comfirmCreate()"
        >确定</el-button
      >
    </div>
  </div>

  <el-dialog v-model="showDialog" width="300" title="选择要链接的容器">
    <div
      style="display: flex; justify-content: center; align-items: center; flex-direction: column"
    >
      <el-button
        v-for="(item, index) in selectedContainers"
        :key="index"
        type="primary"
        link
        @click="
          selectedContainer = item.name;
          openWindowShell();
          showDialog = false;
          selectedContainer = '';
          selectedContainers = [];
          selectedPod = '';
        "
      >
        {{ item.name }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const showDialog = ref(false);
const selectedContainers = ref([]);
const selectedContainer = ref('');
const selectedPod = ref('');

const data = reactive({
  cluster: '',
  name: '',
  namespace: '',

  workloadType: 'Deployment',

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
  eventAutoRefresh: true,

  activeName: 'second',

  selectedPods: [],
  selectedPod: '',
  selectedContainers: [],
  selectedContainer: '',
  selectedPodMap: {},

  crontab: true,
  previous: false,

  logAutoRefresh: true,
  logLine: '100行日志',
  logLines: ['50行日志', '100行日志', '200行日志', '500行日志'],
  selectedLog: 100,
  podLogs: [],

  yaml: '',
  yamlName: '',
  readOnly: true,
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

const copyYmal = async () => {
  try {
    await toClipboard(data.yaml);
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

const openShell = (val) => {
  selectedPod.value = val.metadata.name;
  selectedContainers.value = val.spec.containers;
  if (val.spec.containers.length > 1) {
    showDialog.value = true;
  } else {
    openWindowShell();
  }
};

const openWindowShell = () => {
  window.open(
    '/#/podshell?pod=' +
      selectedPod.value +
      '&namespace=' +
      data.namespace +
      '&cluster=' +
      data.cluster +
      '&container=' +
      selectedContainer.value,
    '_blank',
    'width=1000,height=600',
  );
};

const changePod = async (val) => {
  data.selectedPod = val;
  data.selectedContainers = data.selectedPodMap[data.selectedPod];

  if (data.selectedContainers.length > 0) {
    data.selectedContainer = data.selectedContainers[0];
  }
};

const changeContainer = async (val) => {
  data.selectedContainer = val;
};

const changeLogLine = async (val) => {
  if (val === '50行日志') {
    data.selectedLog = 50;
  }
  if (val === '100行日志') {
    data.selectedLog = 100;
  }
  if (val === '200行日志') {
    data.selectedLog = 200;
  }
  if (val === '500行日志') {
    data.selectedLog = 500;
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

  data.yaml = jsYaml.dump(data.deployment);
};

const deletePod = async (row) => {
  const pods = await proxy.$http({
    method: 'delete',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${row.metadata.namespace}/pods/${row.metadata.name}`,
  });

  await getDeploymentPods();
};

const getPodLog = async () => {
  // 在指定 pod 和容器的情况下，才请求log
  if (data.selectedPod === '' || data.selectedContainer === '') {
    return;
  }

  const log = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${data.selectedPod}/log`,
    data: { container: data.selectedContainer },
  });

  data.podLogs = log.split('\n');
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

  data.selectedPods = [];
  data.selectedContainers = [];
  data.selectedPodMap = {};
  for (let item of data.deploymentPods) {
    let cs = [];
    for (let c of item.spec.containers) {
      cs.push(c.name);
    }

    data.selectedPodMap[item.metadata.name] = cs;
    data.selectedPods.push(item.metadata.name);
  }
  if (data.selectedPods.length > 0) {
    data.selectedPod = data.selectedPods[0];

    data.selectedContainers = data.selectedPodMap[data.selectedPod];
    if (data.selectedContainers.length > 0) {
      data.selectedContainer = data.selectedContainers[0];
    }
  }
};

const getDeploymentEvents = async () => {
  const events = await proxy.$http({
    method: 'get',
    url: `/pixiu/kubeproxy/clusters/${data.cluster}/namespaces/${data.namespace}/name/${data.name}/kind/deployment/events`,
  });
  data.deploymentEvents = events;
};

const deleteEvent = async () => {
  console.log('delete event');
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

const editYaml = () => {
  data.readOnly = false;
};
</script>

<style scoped="scoped">
.deployment-tab {
  margin-top: 1px;
  margin-bottom: -32px;
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
  margin-left: 8px;
}

.deploy-detail-info {
  font-size: 13px;
  color: #29232b;
}
</style>
