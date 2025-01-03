<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="got">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-zongrongqizu" size="75px" type="iconfont" color="#006eff" />
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 80px;
        "
      >
        <div
          class="breadcrumb-create-style"
          style="font-size: 17px; margin-top: -10px; margin-left: 10px"
        >
          {{ data.name }}
        </div>

        <div style="margin-bottom: 10px">
          <span class="detail-card-key-style" style="font-size: 12.5px">创建时间 </span>
          <span class="detail-card-value-style" style="margin-left: 5px; font-size: 12.5px">
            {{ data.createTime }}</span
          >
        </div>

        <div style="margin-bottom: -10px; margin-left: 10px">
          <button class="pixiu-two-button" @click="GetNode">刷新</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">设置</button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
          </button>

          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
            更多操作
          </button>
        </div>
      </div>
    </el-space>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      style="margin-left: 10px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="容器组" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"></el-tab-pane>
      <el-tab-pane label="版本记录" name="four"> </el-tab-pane>
      <el-tab-pane label="弹性伸缩" name="five"> </el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 10px">
        <el-form-item>
          <template #label>
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
              >基本信息
            </span>
          </template>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">负载名称 </span>
            <span class="detail-card-value-style"> {{ data.object.metadata.name }}</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">命名空间 </span>
              <span class="detail-card-value-style">
                {{ data.object.metadata.namespace }}
              </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">创建时间 </span>
              <span class="detail-card-value-style"> {{ data.createTime }}</span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">状态 </span>
            <span class="detail-card-value-style"> 运行中</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">运行时 </span>
              <span class="detail-card-value-style"> 普通运行时 </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">更新策略 </span>
              <span class="detail-card-value-style">
                {{ data.object.spec.strategy.type }}
              </span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">实例个数 </span>
            <span class="detail-card-value-style"> 1/1 </span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">描述 </span>
              <span class="detail-card-value-style"> - </span>
            </el-row>
          </el-col>
        </el-row>

        <el-form style="margin-top: 25px">
          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >元数据
              </span>
            </template>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >标签
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.object.metadata.labels === undefined" style="margin-left: 10px">-</div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.object.metadata.labels"
                :key="item"
                style="font-size: 14px"
              >
                <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                  >{{ index }}: {{ item }}</el-tag
                >
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >注释
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.object.metadata.annotations === undefined" style="margin-left: 10px">
              -
            </div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.object.metadata.annotations"
                :key="item"
                style="font-size: 14px"
              >
                <el-tag type="primary" style="margin-top: 5px; margin-left: 10px"
                  >{{ index }}: {{ item }}</el-tag
                >
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-form>
    </div>

    <div v-if="data.activeName === 'second'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          管理运行在 deployment 上的全部 pod 实例
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">批量删除</button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="getDeploymentPods"
            >
              查询
            </button>

            <el-input
              v-model="data.pageInfo.search.searchInfo"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="getDeploymentPods"
              @input="getDeploymentPods"
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
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.podData.loading"
        :data="data.podData.tableData"
        stripe
        style="margin-top: 10px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="实例名称" min-width="120px">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterPodStatus" />

        <el-table-column prop="metadata.namespace" label="命名空间"> </el-table-column>

        <el-table-column prop="status.podIP" label="实例IP"> </el-table-column>

        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartCount" />

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />
        <el-table-column fixed="right" label="操作" width="60px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
      <pagination :total="data.podData.pageInfo.total" @on-change="onChange"></pagination>
    </div>

    <div v-if="data.activeName === 'third'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          Deployment 关联事件查询，更多查询请至事件中心
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button class="pixiu-two-button" @click="getNodeEvents">查询</button>
            <button
              style="margin-left: 10px; width: 85px"
              class="pixiu-two-button2"
              @click="handleDeleteEventsDialog"
            >
              批量删除
            </button>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.eventData.loading"
        :data="data.eventData.eventTableData"
        stripe
        style="margin-top: 10px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleEventSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="lastTimestamp" label="最后出现时间" :formatter="formatterTime" />
        <el-table-column prop="type" label="级别" />
        <el-table-column prop="involvedObject.kind" label="资源类型"> </el-table-column>
        <el-table-column prop="count" label="出现次数"> </el-table-column>
        <el-table-column prop="message" label="内容" min-width="260px" />
        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>
      <pagination :total="data.eventData.pageInfo.total" @on-change="onEventChange"></pagination>
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
import { getTableData, copy, formatTimestamp } from '@/utils/utils';
import { formatterTime, formatterPodStatus, formatterRestartCount } from '@/utils/formatter';
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
  name: '',
  namespace: '',

  object: {
    metadata: {},
    spec: {
      strategy: {},
    },
    status: {},
  },
  createTime: '',
  activeName: 'first',

  podData: {
    loading: false,
    pods: [],
    tableData: [],
    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

  nodeEvents: [],
  eventData: {
    loading: false,

    eventTableData: [],
    multipleEventSelection: [],

    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

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
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetDeployment();
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

const GetDeployment = async () => {
  const [result, err] = await getDeployment(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
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
  data.eventData.pageInfo.limit = v.limit;
  data.eventData.pageInfo.page = v.page;
  data.eventData.eventTableData = getTableData(data.eventData.pageInfo, data.nodeEvents);
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

// pod 列表开始
const getDeploymentPods = async () => {
  let matchLabels = data.object.spec.selector.matchLabels;
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
  data.podData.pods = result.items;
  data.podData.pageInfo.total = data.deploymentPods.length;
  data.podData.tableData = getTableData(data.podData.pageInfo, data.podData.pods);
};

// pod 列表结束

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
      getDeploymentPods();
      break;
    case 'third':
      getDeploymentEvents();
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
<style lang="scss" scoped></style>
