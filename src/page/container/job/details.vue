<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToJob">返回</button>
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
          <button class="pixiu-two-button" @click="GetDaemonset">刷新</button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
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
      <el-tab-pane label="日志查询" name="four"> </el-tab-pane>
      <el-tab-pane label="监控" name="five"> </el-tab-pane>
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
            <span class="detail-card-value-style" style="margin-left: 55px"> 运行中</span>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">运行时 </span>
              <span class="detail-card-value-style" style="margin-left: 40px"> 普通运行时 </span>
            </el-row>
          </el-col>

          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">更新策略 </span>
              <span class="detail-card-value-style"> 未知 </span>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="8">
            <span class="detail-card-key-style">实例个数 </span>
            <span class="detail-card-value-style"> 1/1 </span>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 25px">
          <el-col :span="10">
            <el-form-item>
              <template #label>
                <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                  >标签
                </span>
              </template>
            </el-form-item>

            <el-form-item style="margin-top: -10px">
              <div v-if="data.object.metadata.labels === undefined" style="margin-left: 10px">
                -
              </div>
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
          </el-col>

          <el-col :span="10">
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
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="data.activeName === 'second'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          管理运行在 sts 上的全部 pod 实例
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">批量删除</button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="GetObjectPods"
            >
              查询
            </button>

            <el-input
              v-model="data.podData.pageInfo.nameSelector"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="GetObjectPods"
              @input="GetObjectPods"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="GetObjectPods"
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
          StatefulSet 关联事件查询，更多查询请至事件中心
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button class="pixiu-two-button" @click="GetEvents">查询</button>
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
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          支持选项应用的标准输出日志，更多类型日志查询，请至日志服务中心
        </div>
      </el-card>

      <el-form>
        <el-form-item>
          <template #label>
            <span style="margin-left: 10px; font-size: 13px; color: #191919">Pod选项 </span>
          </template>

          <span style="margin-left: 5px">
            <el-select
              v-model="data.logData.selectedPod"
              style="width: 210px; float: right"
              @change="changePod"
            >
              <el-option
                v-for="item in data.logData.selectedPods"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </span>

          <span style="margin-left: 10px">
            <el-select
              v-model="data.logData.selectedContainer"
              style="width: 210px; float: right; margin-right: 10px"
            >
              <el-option
                v-for="item in data.logData.selectedContainers"
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

        <el-form-item>
          <template #label>
            <span style="margin-left: 10px; font-size: 13px; color: #191919">选择行数 </span>
          </template>

          <span style="margin-left: 5px">
            <el-select
              v-model="data.logData.line"
              style="width: 80px; float: right; margin-right: 10px"
            >
              <el-option
                v-for="item in data.logData.lineOptions"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </span>
          行
        </el-form-item>
      </el-form>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button style="width: 85px" class="pixiu-two-button2">历史日志</button>
            <button style="width: 85px; margin-left: 10px" class="pixiu-two-button2">
              实时日志
            </button>

            <button
              class="pixiu-two-button"
              style="float: right; margin-left: 12px"
              @click="GetPodLogs"
            >
              查询
            </button>

            <el-input
              v-model="data.logData.pageInfo.nameSelector"
              placeholder="名称搜索关键字"
              style="width: 35%; float: right"
              clearable
              @clear="GetPodLogs"
              @input="GetPodLogs"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="GetPodLogs"
                />
              </template>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <el-table
        v-loading="data.logData.loading"
        :data="data.logData.podLogs"
        style="margin-top: 10px; width: 100%; margin-left: 10px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column label="日志内容" prop="lineContent" />
        <template #empty>
          <div class="table-inline-word">暂无日志</div>
        </template>
      </el-table>
    </div>

    <div v-if="data.activeName === 'five'">
      <div
        class="app-pixiu-describe"
        style="margin-left: 10px; margin-top: 10px; font-size: 14px; color: #000000"
      >
        暂不支持
      </div>
    </div>
  </el-card>

  <PiXiuViewOrEdit
    :yaml-dialog="data.yamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="GetJob"
  ></PiXiuViewOrEdit>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import MyCodeMirror from '@/components/codemirror/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getTableData, copy, formatTimestamp } from '@/utils/utils';
import { formatterTime, formatterPodStatus, formatterRestartCount } from '@/utils/formatter';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import Pagination from '@/components/pagination/index.vue';
import {
  getPodsByLabels,
  getPodContainerLog,
  deletePod,
  getPodLog,
} from '@/services/kubernetes/podService';
import { getStatefulSetEventList } from '@/services/kubernetes/eventService';
import { getJob } from '@/services/kubernetes/jobService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  name: '',
  namespace: '',

  activeName: 'first',

  object: {
    metadata: {},
    spec: {},
    status: {},
  },

  createTime: '',

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

  eventData: {
    loading: false,
    events: [],
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

  logData: {
    loading: false,
    selectedPodMap: {},
    selectedPods: [],
    selectedPod: '',
    selectedContainers: [],
    selectedContainer: '',

    previous: false,
    line: 10,
    lineOptions: [10, 25, 50, 100],

    podLogs: [],
    tableData: [],

    pageInfo: {
      page: 1,
      limit: 10,
      total: 0,
      nameSelector: '',
      labelSelector: '',
    },
  },

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
    namespace: '',
  },
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetJob();
});

const GetJob = async () => {
  const [result, err] = await getJob(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
};

// 处理 pod 开始
const GetObjectPods = async () => {
  let matchLabels = data.object.spec.selector.matchLabels;
  let labels = [];
  for (let key in matchLabels) {
    labels.push(key + '=' + matchLabels[key]);
  }

  data.podData.loading = true;
  const [result, err] = await getPodsByLabels(data.cluster, data.namespace, labels.join(','));
  data.podData.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.podData.pods = result.items;
  data.podData.pageInfo.total = data.podData.pods.length;
  data.podData.tableData = getTableData(data.podData.pageInfo, data.podData.pods);
};
// 处理 pod 结束

// 事件处理开始
const GetEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getStatefulSetEventList(data.cluster, data.namespace, data.name);
  data.eventData.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }
  data.eventData.events = result;
  data.eventData.pageInfo.total = result.length;
  data.eventData.eventTableData = getTableData(data.eventData.pageInfo, data.eventData.events);
};

const onEventChange = (v) => {
  data.eventData.pageInfo.limit = v.limit;
  data.eventData.pageInfo.page = v.page;
  data.eventData.eventTableData = getTableData(data.eventData.pageInfo, data.nodeEvents);
};

const handleEventSelectionChange = (events) => {
  data.eventData.multipleEventSelection = [];
  for (let event of events) {
    data.eventData.multipleEventSelection.push(event.metadata);
  }
};
const handleDeleteEventsDialog = (row) => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  data.deleteEventDialog.close = true;
  data.deleteEventDialog.deleteName = 'events';
  data.deleteEventDialog.namespace = '';
};

const confirmEvent = async () => {
  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, event.namespace, event.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }

  cancelEvent();
  proxy.$notify.success('批量删除事件成功');
  GetEvents();
};

const cancelEvent = () => {
  data.deleteEventDialog.close = false;
  setTimeout(() => {
    data.deleteEventDialog.deleteName = '';
  }, 100);
};
// 事件处理结束

// 日志处理开始
const initLogOptions = async () => {
  let matchLabels = data.object.spec.selector.matchLabels;
  let labels = [];
  for (let key in matchLabels) {
    labels.push(key + '=' + matchLabels[key]);
  }
  const [result, err] = await getPodsByLabels(data.cluster, data.namespace, labels.join(','));
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.logData.selectedPodMap = {};
  data.logData.selectedPods = [];
  for (let item of result.items) {
    let cs = [];
    for (let c of item.spec.containers) {
      cs.push(c.name);
    }

    data.logData.selectedPods.push(item.metadata.name);
    data.logData.selectedPodMap[item.metadata.name] = cs;
  }

  if (data.logData.selectedPods.length > 0) {
    data.logData.selectedPod = data.logData.selectedPods[0];
    data.logData.selectedContainers = data.logData.selectedPodMap[data.logData.selectedPod];
    if (data.logData.selectedContainers.length > 0) {
      data.logData.selectedContainer = data.logData.selectedContainers[0];
    }
  }
};

const changePod = async (val) => {
  data.logData.selectedPod = val;
  data.logData.selectedContainers = data.logData.selectedPodMap[data.logData.selectedPod];
};

const GetPodLogs = async () => {
  // 在指定 pod 和容器的情况下，才请求log
  if (data.logData.selectedPod === '' || data.logData.selectedContainer === '') {
    return;
  }

  data.logData.loading = true;
  const [result, err] = await getPodContainerLog(
    data.cluster,
    data.namespace,
    data.logData.selectedPod,
    data.logData.selectedContainer,
    data.logData.line,
  );
  data.logData.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.logData.podLogs = [];
  for (let content of result) {
    data.logData.podLogs.push({ lineContent: content });
  }
};
//日志处理结束

// 编辑 yaml 开始
const viewYaml = async () => {
  const [obj, err] = await getStatefulSet(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yaml = obj;
  data.yamlDialog = true;
};
// 编辑 yaml 结束

const handleClick = (tab, event) => {};

const handleChange = (name) => {
  if (name === 'second') {
    GetObjectPods();
  } else {
    data.podData.pods = [];
    data.podData.pageInfo.total = 0;
    data.podData.tableData = [];
  }

  if (name === 'third') {
    GetEvents();
  } else {
    data.eventData.events = [];
    data.eventData.pageInfo.total = 0;
    data.eventData.eventTableData = [];
  }

  if (name === 'four') {
    initLogOptions();
  } else {
    data.logData.podLogs = [];
    data.logData.selectedPodMap = {};
    data.logData.selectedPods = [];
    data.logData.selectedContainers = [];
    data.logData.selectedPod = '';
    data.logData.selectedContainer = '';
  }
};

const goToJob = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/jobs', query: queryParams });
};
</script>

<style scoped="scoped"></style>
