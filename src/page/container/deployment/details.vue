<template>
  <el-card class="detail-card-container">
    <div style="display: flex; margin-left: 20px; margin-top: 15px">
      <pixiu-icon name="icon-deploymentunitbeifen" size="40px" type="iconfont" color="#006eff" />
      <div
        class="breadcrumb-create-style"
        style="margin-left: 10px; margin-top: 10px; font-size: 15px"
      >
        {{ data.name }}
        <pixiu-icon
          name="icon-copy"
          size="12px"
          style="cursor: pointer; margin-left: 2px"
          type="iconfont"
          color="#909399"
          @click="copy(data.name)"
        />
      </div>
    </div>

    <div style="margin-top: 25px; display: flex">
      <div style="width: 50%">
        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">负载名称 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">状态 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919"
                >实例个数(正常/全部)</span
              >
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">运行时</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px"> 普通运行时 </span>
          </el-form-item>
        </el-form>
      </div>

      <div style="width: 50%">
        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">命名空间</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">创建时间</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">升级策略</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">描述</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 40px"> - </span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import { getTableData, copy } from '@/utils/utils';
import { formatterTime } from '@/utils/formatter';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getPodsByLabels, deletePod, getPodLog } from '@/services/kubernetes/podService';
import { getDeployment } from '@/services/kubernetes/deploymentService';
import { getEventList, deleteEvent } from '@/services/kubernetes/eventService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const showDialog = ref(false);
const selectedContainers = ref([]);
const selectedContainer = ref('');
const selectedPod = ref('');

const data = reactive({
  cluster: '',
  clusterName: '',
  name: '',
  namespace: '',

  workloadType: 'Deployment',

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  pageEventInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  restarts: 0,
  loading: false,

  deployment: {},
  deploymentPods: [],

  deploymentEvents: [],

  activeName: 'second',

  selectedPods: [],
  selectedPod: '',
  selectedContainers: [],
  selectedContainer: '',
  selectedPodMap: {},

  autoSyncPods: false,
  previous: false,

  tableData: [],
  eventTableData: [],

  aggLog: false,
  logLine: '100行日志',
  logLines: ['50行日志', '100行日志', '200行日志', '500行日志'],
  selectedLog: 100,
  podLogs: [],

  yaml: '',
  yamlName: '',
  readOnly: true,

  multiplePodSelection: [],
  multipleEventSelection: [],

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
  },

  batchDeleteDialog: {
    close: false,
    objectName: 'Pods',
    deleteNames: '',
  },
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  data.name = proxy.$route.query.name;
  data.namespace = proxy.$route.query.namespace;

  await getDeploymentObject();
  await getDeploymentPods();
  await getDeploymentEvents();
});

// 监听子属性变化
watch(
  () => data.autoSyncPods,
  (newActive, oldActive) => {
    // if (newActive) {
    //   var a = window.setInterval(getDeploymentPods, 5000);
    // } else {
    //   window.clearInterval(a);
    // }
  },
);

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
    if (val.status.podIP === undefined) {
      ElMessage({
        type: 'warning',
        message: '数据为空，无法复制',
      });
      return;
    }

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

const getDeploymentObject = async () => {
  const [result, err] = await getDeployment(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.deployment = result;
  data.yaml = jsYaml.dump(data.deployment, { quotingType: '"' });
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const handleBatchDeleteDialog = (row) => {
  if (data.multiplePodSelection.length === 0) {
    proxy.$notify.warning({ title: 'Pods', message: '未选择批量删除的 Pods' });
    return;
  }
  data.batchDeleteDialog.close = true;
  data.batchDeleteDialog.deleteName = data.multiplePodSelection.join(', ');
};

const cancelDeletePod = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};

const deleteDeploymentPod = async () => {
  const [result, err] = await deletePod(data.cluster, data.namespace, data.deleteDialog.deleteName);
  if (err) {
    proxy.$notify.error({ title: 'Pod', message: err.response.data.message });
    return;
  }
  proxy.$notify.success({ title: 'Pod', message: `${data.deleteDialog.deleteName} 删除成功` });

  cancelDeletePod();
  await getDeploymentPods();
};

const canceldeletePodsInBatch = () => {
  data.batchDeleteDialog.close = false;
  data.batchDeleteDialog.deleteName = '';
};

const deletePodsInBatch = async () => {
  for (let pod of data.multiplePodSelection) {
    const [result, err] = await deletePod(data.cluster, data.namespace, pod);
    if (err) {
      proxy.$notify.error({ title: 'Pod', message: err.response.data.message });
    }
  }

  canceldeletePodsInBatch();
  await getDeploymentPods();
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.deploymentPods);

  if (data.pageInfo.search.searchInfo !== '') {
    searchDeploymentPods();
  }
};

const onEventChange = (v) => {
  data.pageEventInfo.limit = v.limit;
  data.pageEventInfo.page = v.page;

  data.eventTableData = getTableData(data.pageEventInfo, data.deploymentEvents);
};

const getPodLogs = async () => {
  // 在指定 pod 和容器的情况下，才请求log
  if (data.selectedPod === '' || data.selectedContainer === '') {
    return;
  }

  if (!data.aggLog) {
    const [result, err] = await getPodLog(
      data.cluster,
      data.namespace,
      data.selectedPod,
      data.selectedContainer,
      50,
    );
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
    data.podLogs = result;
  } else {
    data.podLogs = [];
    for (let pod of data.selectedPods) {
      const [result, err] = await getPodLog(
        data.cluster,
        data.namespace,
        pod,
        data.selectedContainer,
        50,
      );
      if (err) {
        proxy.$notify.error({ title: 'Pod', message: err.response.data.message });
      } else {
        data.podLogs.push('------------------------');
        data.podLogs.push('Pod: ' + pod);
        data.podLogs.push('------------------------');
        for (let line of result) {
          data.podLogs.push(line);
        }
      }
    }
  }
};

const getDeploymentPods = async () => {
  let matchLabels = data.deployment.spec.selector.matchLabels;
  let labels = [];
  for (let key in matchLabels) {
    labels.push(key + '=' + matchLabels[key]);
  }

  data.loading = true;
  const [result, err] = await getPodsByLabels(data.cluster, data.namespace, labels.join(','));
  data.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.deploymentPods = result.items;
  data.pageInfo.total = data.deploymentPods.length;
  data.tableData = getTableData(data.pageInfo, data.deploymentPods);

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

const searchDeploymentPods = async () => {
  let allSearchedPods = [];
  if (data.pageInfo.search.field === 'name') {
    for (let pod of data.deploymentPods) {
      if (pod.metadata.name.search(data.pageInfo.search.searchInfo) !== -1) {
        allSearchedPods.push(pod);
      }
    }
  }

  data.pageInfo.total = allSearchedPods.length;
  data.tableData = getTableData(data.pageInfo, allSearchedPods);
};

const getDeploymentEvents = async () => {
  data.loading = true;
  const [result, err] = await getEventList(data.cluster, data.namespace, data.name);
  data.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }
  data.deploymentEvents = result;
  data.pageEventInfo.total = result.length;
  data.eventTableData = getTableData(data.pageEventInfo, data.deploymentEvents);
};

const deleteEventObject = async (row) => {
  const [result, err] = await deleteEvent(data.cluster, data.namespace, row.metadata.name);
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }
  await getDeploymentEvents();
  proxy.$notify.success({ title: 'Event', message: `${row.metadata.name} 删除成功` });
};

const deleteEventsInBatch = async () => {
  for (let event of data.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, data.namespace, event);
    if (err) {
      proxy.$notify.error({ title: 'Pod', message: err.response.data.message });
    }
  }
  await getDeploymentEvents();
  proxy.$notify.success({ title: 'Events', message: '批量删除事件成功' });
};

const handlePodSelectionChange = (pods) => {
  data.multiplePodSelection = [];
  for (let pod of pods) {
    data.multiplePodSelection.push(pod.metadata.name);
  }
};

const handleEventSelectionChange = (events) => {
  data.multipleEventSelection = [];
  for (let event of events) {
    data.multipleEventSelection.push(event.metadata.name);
  }
};

const formatterStatus = (row, column, cellValue) => {
  let phase = cellValue.phase;
  if (phase == 'Failed') {
    phase = cellValue.reason;
  } else if (phase == 'Pending') {
    return <div class="color-yellow-word">{phase}</div>;
    // const containerStatuses = cellValue.containerStatuses;
    // for (let i = 0; i < containerStatuses.length; i++) {
    //   phase = containerStatuses[i].state.waiting.reason;
    //   break;
    // }
  }

  if (phase == 'Running') {
    return <div class="color-green-word">{phase}</div>;
  }
  return <div>{phase}</div>;
};

const formatterName = (row, column, cellValue) => {
  return (
    <el-tooltip effect="light" placement="top" content={cellValue}>
      <div class="pixiu-ellipsis-style">{cellValue}</div>
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

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
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
