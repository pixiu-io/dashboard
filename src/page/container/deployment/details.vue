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

      <el-breadcrumb separator="/" style="margin-left: 10px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Deployment: {{ data.name }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 详情 </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="margin-top: 28px"></div>

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
            <div v-if="data.deployment.spec.selector.matchLabels === undefined">-</div>
            <div v-else>
              <div
                v-for="(item, index) in data.deployment.spec.selector.matchLabels"
                :key="item"
                style="margin-top: -1px"
              >
                {{ index }}: {{ item }}
              </div>
            </div>
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
          <button class="pixiu-two-button" @click="getDeploymentPods">刷新</button>
          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="handleBatchDeleteDialog"
          >
            批量删除
          </button>

          <!-- <div style="margin-left: 8px; float: right; margin-top: 6px">
            <pixiu-icon
              name="icon-icon-refresh"
              style="cursor: pointer"
              size="14px"
              type="iconfont"
              color="#909399"
              @click="getDeploymentPods"
            />
          </div> -->
          <div style="margin-left: 8px; float: right; margin-left: 12px">
            <button class="pixiu-two-button" @click="searchDeploymentPods">搜索</button>
          </div>

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
            <el-switch v-model="data.autoSyncPods" inline-prompt width="36px" /><span
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
        :data="data.tableData"
        stripe
        style="margin-top: 6px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#29292b',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
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
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
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
      <!--
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
      </el-form-item> -->

      <div style="margin-left: 170px; margin-top: -10px; margin-bottom: 10px">
        <el-switch v-model="data.previous" inline-prompt width="36px" /><span
          style="font-size: 14px; margin-left: 5px; margin-right: 10px"
          >查看已退出的容器</span
        >
      </div>
    </el-card>

    <div style="display: flex; margin-top: 15px">
      <button style="width: 85px" class="pixiu-two-button" @click="getPodLogs">获取日志</button>
      <div style="margin-left: 20px">
        <el-switch v-model="data.aggLog" inline-prompt width="36px" /><span
          style="font-size: 13px; margin-left: 5px; margin-right: 10px"
          >聚合查询</span
        >
      </div>
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
    <!-- <el-card class="contend-card-container2">
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
    </el-card> -->
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <div>
            <button class="pixiu-two-button" @click="getDeploymentEvents">刷新</button>
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
              <el-switch v-model="data.crontab" inline-prompt width="36px" /><span
                style="font-size: 13px; margin-left: 5px; margin-right: 10px"
                >自动刷新</span
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px">
      <el-card class="contend-card-container2">
        <el-table
          v-loading="data.loading"
          :data="data.eventTableData"
          stripe
          style="margin-top: 6px"
          header-row-class-name="pixiu-table-header"
          :cell-style="{
            'font-size': '12px',
            color: '#29292b',
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
          <el-table-column prop="message" label="内容" min-width="250px" />
          <el-table-column prop="count" label="出现次数"> </el-table-column>

          <el-table-column fixed="right" label="操作" width="100px">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                style="margin-right: -25px; margin-left: -10px; color: #006eff"
                @click="deleteEventObject(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="data.pageEventInfo.total" @on-change="onEventChange"></pagination>
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
            @click="getDeploymentObject"
          />
        </div>
      </el-col>
    </div>
    <div style="margin-top: 10px"></div>
    <MyCodeMirror :yaml="data.yaml" :read-only="data.readOnly" :height="650"></MyCodeMirror>
    <div v-if="!data.readOnly" style="margin-top: 10px">
      <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
      <el-button class="pixiu-confirm-button" type="primary" @click="confirm()">确定</el-button>
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

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="deleteDeploymentPod"
    @cancel="cancelDeletePod"
  ></pixiuDialog>

  <pixiuDialog
    :close-event="data.batchDeleteDialog.close"
    :object-name="data.batchDeleteDialog.objectName"
    :delete-name="data.batchDeleteDialog.deleteName"
    @confirm="deletePodsInBatch"
    @cancel="canceldeletePodsInBatch"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import { formatTimestamp, getTableData } from '@/utils/utils';
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

  activeName: 'four',

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
  data.yaml = jsYaml.dump(data.deployment);
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

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
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
