<template>
  <el-card class="detail-card-container">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px; margin-right: 6px">日志</button>
      <button class="pixiu-two-button2" style="width: 60px">刷新</button>
    </div>

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
            <span class="detail-card-style-form2" style="margin-left: 106px">
              {{ data.name }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">状态 </span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 132px">
              <div style="display: flex">
                <div>
                  <pixiu-icon name="icon-circle-dot" size="12px" type="iconfont" color="#28C65A" />
                </div>
                <div style="margin-left: 6px">运行中</div>
              </div>
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919"
                >实例个数(正常/全部)</span
              >
            </template>
            <span
              v-if="data.deployment && data.deployment.status"
              class="detail-card-style-form2"
              style="margin-left: 40px"
            >
              {{ getDeployReady(data.deployment) }}
            </span>
            <pixiu-icon
              name="icon-edit"
              size="12px"
              style="margin-left: 8px; cursor: pointer"
              type="iconfont"
              color="#909399"
            />
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">运行时</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 120px"> 普通运行时 </span>
          </el-form-item>
        </el-form>
      </div>

      <div style="width: 50%">
        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">命名空间</span>
            </template>
            <span
              v-if="data.deployment.metadata && data.deployment.metadata.namespace"
              class="detail-card-style-form2"
              style="margin-left: 106px"
            >
              {{ data.deployment.metadata.namespace }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">创建时间</span>
            </template>
            <span
              v-if="data.deployment.metadata && data.deployment.metadata.creationTimestamp"
              class="detail-card-style-form2"
              style="margin-left: 106px"
            >
              {{ data.deployment.metadata.creationTimestamp }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">更新策略</span>
            </template>
            <span
              v-if="
                data.deployment.spec &&
                data.deployment.spec.strategy &&
                data.deployment.spec.strategy.type
              "
              class="detail-card-style-form2"
              style="margin-left: 106px"
            >
              {{ data.deployment.spec.strategy.type }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">描述</span>
            </template>
            <span class="detail-card-style-form2" style="margin-left: 132px"> - </span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-tabs
      v-model="data.activeName"
      style="margin-left: 20px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="实例列表" name="first"> </el-tab-pane>
      <el-tab-pane label="标签信息" name="second"> </el-tab-pane>
      <el-tab-pane label="事件列表" name="third"></el-tab-pane>
      <el-tab-pane label="版本记录" name="four"> </el-tab-pane>
      <el-tab-pane label="日志查询" name="five"></el-tab-pane>
      <el-tab-pane label="弹性伸缩" name="six"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'" style="margin-left: 12px">
      <div>
        <el-row>
          <el-card class="detail-docs">
            <el-icon
              style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
              ><WarningFilled
            /></el-icon>
            <div style="vertical-align: middle; margin-top: -40px">
              获取 Deployment 的实时实例列表
            </div>
          </el-card>

          <el-col>
            <button
              class="pixiu-two-button"
              style="margin-left: 10px; width: 85px"
              @click="handleBatchDeleteDialog"
            >
              批量删除
            </button>

            <!-- <div style="margin-left: 8px; float: right; margin-left: 12px">
              <button class="pixiu-two-button" @click="searchDeploymentPods">搜索</button>
            </div> -->

            <el-input
              v-model="data.pageInfo.search.searchInfo"
              placeholder="名称搜索关键字"
              style="width: 480px; float: right"
              clearable
              @clear="getDeploymentPods"
              @input="searchDeploymentPods"
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
              <button
                class="pixiu-two-button2"
                style="width: 60px; margin-right: 10px"
                @click="getDeploymentPods"
              >
                刷新
              </button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="data.tableData"
        stripe
        style="margin-top: 6px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column
          prop="metadata.name"
          label="实例名称"
          min-width="70px"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.metadata.name }}
            <pixiu-icon
              name="icon-copy"
              size="11px"
              type="iconfont"
              class-name="icon-box"
              color="#909399"
              style="cursor: pointer"
              @click="copy(scope.row.metadata.name)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterStatus" />
        <el-table-column prop="status.hostIP" label="所在节点" />
        <el-table-column prop="status.podIP" label="实例IP">
          <template #default="scope">
            {{ scope.row.status.podIP }}
            <pixiu-icon
              name="icon-copy"
              size="11px"
              type="iconfont"
              class-name="icon-box"
              style="cursor: pointer"
              color="#909399"
              @click="copy(scope.row.status.podIP)"
            />
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
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="openShell(scope.row)"
            >
              远程登陆
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">该 workload 的实例列表为空</div>
        </template>
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </div>

    <div v-if="data.activeName === 'third'" style="margin-left: 12px">
      <div>
        <el-card class="detail-docs">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">
            事件保存事件为1小时，1小时后自动清理。
          </div>
        </el-card>

        <el-row>
          <el-col>
            <div>
              <!-- <button class="pixiu-two-button" @click="getDeploymentEvents">刷新</button> -->
              <button
                style="margin-left: 10px; width: 85px"
                class="pixiu-two-button2"
                @click="deleteEventsInBatch"
              >
                批量删除
              </button>

              <div style="margin-left: 8px; float: right; margin-left: 12px">
                <button class="pixiu-two-button" @click="getDeploymentEvents">搜索</button>
              </div>

              <el-input
                v-model="data.pageInfo.search.searchInfo"
                placeholder="名称搜索关键字"
                style="width: 480px; float: right"
                clearable
                @clear="getDeploymentEvents"
                @input="getDeploymentEvents"
              >
                <template #suffix>
                  <pixiu-icon
                    name="icon-search"
                    style="cursor: pointer"
                    size="15px"
                    type="iconfont"
                    color="#909399"
                    @click="getDeploymentEvents"
                  />
                </template>
              </el-input>
              <div style="float: right">
                <el-switch v-model="data.crontab" inline-prompt width="36px" />
                <span style="font-size: 13px; margin-left: 5px; margin-right: 10px">自动刷新</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="data.loading"
        :data="data.eventTableData"
        stripe
        style="margin-top: 6px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleEventSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column
          prop="lastTimestamp"
          label="最后出现时间"
          sortable
          :formatter="formatterTime"
        />
        <el-table-column prop="type" label="级别" />
        <el-table-column prop="involvedObject.kind" label="资源类型"> </el-table-column>
        <el-table-column prop="involvedObject.name" label="资源名称" :formatter="formatterName">
        </el-table-column>
        <el-table-column prop="count" label="出现次数"> </el-table-column>
        <el-table-column prop="message" label="内容" min-width="250px" />
        <template #empty>
          <div class="table-inline-word">该 workload 的事件列表为空</div>
        </template>
      </el-table>
      <pagination :total="data.pageEventInfo.total" @on-change="onEventChange"></pagination>
    </div>
    <div v-if="data.activeName === 'four'">
      <div>
        <el-row>
          <el-card class="detail-docs">
            <el-icon
              style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
              ><WarningFilled
            /></el-icon>
            <div style="vertical-align: middle; margin-top: -40px">获取 Deployment 的历史记录</div>
          </el-card>
        </el-row>
      </div>
      <el-table
        :data="data.replicasets"
        style="margin-top: 6px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column prop="metadata.name" label="版本号" min-width="70px">
          <template #default="scope">
            # {{ scope.row.metadata.annotations['deployment.kubernetes.io/revision'] }}
            <el-tag v-show="scope.row.status.replicas !== 0" type="success">当前版本</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec.template.spec.containers[0].image" label="镜像" />
        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          :formatter="formatterTime"
        />
        <el-table-column fixed="right" label="操作" width="160px">
          <template #default="scope">
            <el-button
              size="small"
              link
              style="margin-right: -10px; margin-left: -10px; color: #006eff"
              @click="showYaml(scope.row)"
            >
              详情
            </el-button>

            <el-button
              link
              size="small"
              style="margin-right: 1px; color: #006eff"
              :disabled="scope.row.status.replicas !== 0"
              @click="rolloback(scope.row)"
            >
              回滚
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">该 workload 的实例列表为空</div>
        </template>
      </el-table>

      <pagination :total="data.pageReplicasetInfo.total" @on-change="onChange"></pagination>
    </div>
  </el-card>
  <PiXiuDiffView
    v-if="data.diffYamlDialog"
    v-model:dialogVisible="data.diffYamlDialog"
    title="版本差异"
    :original="data.deployment.spec.template"
    :modified="data.modifiedYaml"
  ></PiXiuDiffView>
  <!--  删除pod提示框-->
  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirmDeletePod"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import jsYaml from 'js-yaml';
import { getTableData, copy } from '@/utils/utils';
import { formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getPodsByLabels, deletePod, getPodLog } from '@/services/kubernetes/podService';
import {
  getDeployment,
  getDeployReady,
  patchDeployment,
  rolloBackDeployment,
  updateDeployment,
} from '@/services/kubernetes/deploymentService';
import PiXiuDiffView from '@/components/pixiuyaml/diffView/index.vue';
import { getEventList, getNamespaceEventList } from '@/services/kubernetes/eventService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getDeploymentReplicasets } from '@/services/kubernetes/replicasetService';

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
  activeName: 'first',
  labels: '',

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
  replicasets: [],
  pageReplicasetInfo: {
    page: 1,
    limit: 10,
    total: 0,
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
    namespace: '',
  },

  batchDeleteDialog: {
    close: false,
    objectName: 'Pods',
    deleteNames: '',
  },
  diffYamlDialog: false,
  modifiedYaml: '',
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;
  data.namespace = proxy.$route.query.namespace;

  await getDeploymentObject();
  await getDeploymentPods();
  // await getDeploymentEvents();
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
  data.deleteDialog.namespace = row.metadata.namespace;
};

const handleBatchDeleteDialog = async (row) => {
  if (data.multiplePodSelection.length === 0) {
    proxy.$notify.warning({ title: 'Pods', message: '未选择批量删除的 Pods' });
    return;
  }

  for (let pod of data.multiplePodSelection) {
    const [result, err] = await deletePod(data.cluster, pod.namespace, pod.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
  proxy.$notify.success('批量删除Pods成功');
  await getDeploymentPods();
};

const cancelDeletePod = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
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

const showYaml = (replicaset) => {
  data.diffYamlDialog = true;
  data.modifiedYaml = replicaset.spec.template;
};

const rolloback = async (replicaset) => {
  const updateBoyd = [
    {
      op: 'replace',
      path: '/spec/template',
      value: JSON.parse(JSON.stringify(replicaset.spec.template)),
    },
    {
      op: 'replace',
      path: '/metadata/annotations',
      value: JSON.parse(JSON.stringify(data.deployment.metadata.annotations)),
    },
  ];
  const [result, err] = await rolloBackDeployment(
    data.cluster,
    replicaset.metadata.namespace,
    data.name,
    updateBoyd,
  );
  if (err) {
    proxy.$notify.error({ title: 'Deployment', message: err.response.data.message });
    return;
  }
  proxy.$notify.success({
    title: 'Deployment',
    message: `${replicaset.name} 回滚成功`,
  });
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
const confirmDeletePod = async () => {
  const [result, err] = await deletePod(
    data.cluster,
    data.deleteDialog.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await getDeploymentPods();
};
const clean = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
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

const getDeploymentRs = async () => {
  data.loading = true;
  const lables = data.deployment.metadata.labels;
  let labelStr = Object.keys(lables)
    .map((key) => {
      return key + '=' + lables[key];
    })
    .join(',');

  const [result, err] = await getDeploymentReplicasets(data.cluster, data.namespace, labelStr);
  data.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }
  data.replicasets = result.items;
  data.pageReplicasetInfo.total = result.length;
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
    data.multiplePodSelection.push(pod.metadata);
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

const handleClick = (tab, event) => {};

const handleChange = async (name) => {
  switch (name) {
    case 'second':
      await getDeploymentObject();
      break;
    case 'third':
      await getDeploymentEvents();
      break;
    case 'four':
      await getDeploymentRs();
      break;
  }
};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  clean();
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
