<template>
  <!-- <div class="title-card-container2">
    <PiXiuYaml :refresh="getDeployments" title=""></PiXiuYaml>
  </div> -->
  <Description
    :description="'Deployment 是 Kubernetes 集群中用来管理应用的一种资源。它定义了应用的期望状态，比如副本数、镜像版本等，并提供策略来控制应用的部署、更新和回滚。'"
  />

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createDeployment">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getDeployments">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getDeployments"
          @input="getDeployments"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getDeployments"
            />
          </template>
        </el-input>
        <div style="float: right">
          <el-switch
            v-model="data.autoRefresh"
            inline-prompt
            width="36px"
            @change="startAutoRefresh"
          /><span style="font-size: 13px; margin-left: 5px; margin-right: 10px">自动刷新</span>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.tableData"
        stripe
        style="margin-top: 2px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />

        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link
              class="global-table-world"
              type="primary"
              :underline="false"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="spec.template.metadata.labels"
          label="Labels"
          :formatter="formatterLabels"
        />

        <el-table-column
          prop="spec.selector.matchLabels"
          label="Selector"
          :formatter="formatterLabels"
        >
        </el-table-column> -->

        <el-table-column prop="status" label="状态" :formatter="runningFormatter">
        </el-table-column>

        <el-table-column prop="status" label="实例个数(正常/全部)">
          <template #default="scope">
            <div style="display: flex">
              {{ getDeployReady(scope.row) }}

              <div style="margin-left: 8px; cursor: pointer">
                <pixiu-icon
                  name="icon-edit"
                  size="12px"
                  type="iconfont"
                  color="#909399"
                  @click="handleDeploymentScaleDialog(scope.row)"
                />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>
        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />

        <!-- <el-table-column
          label="镜像名称"
          prop="spec.template.spec.containers"
          :formatter="formatterImage"
        >
        </el-table-column> -->

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleMonitorDrawer(scope.row)"
            >
              监控
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: -2px; color: #006eff"
              @click="handleEventDrawer(scope.row)"
            >
              事件
            </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleEditYamlDialog(scope.row)"
                  >
                    编辑YAML
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleLogDrawer(scope.row)"
                  >
                    日志
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleImageDialog(scope.row)"
                  >
                    镜像管理
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleRedeploy(scope.row)"
                  >
                    重新部署
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleDeleteDialog(scope.row)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <el-dialog
    :model-value="data.deploymentReplicasDialog"
    style="color: #000000; font: 14px"
    width="400px"
    center
    @close="closeDeploymentScaleDialog"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
          color: #191919;
        "
      >
        调整实例数
      </div>
    </template>

    <el-form label-width="80px" style="max-width: 300px">
      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">原副本数</span>
        </template>
        <el-input v-model="data.deploymentRepcliasFrom.origin" disabled />
      </el-form-item>
      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">新副本数</span>
        </template>
        <el-input v-model="data.deploymentRepcliasFrom.target" placeholder="请输入新副本数" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -10px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeDeploymentScaleDialog"
          >取消</el-button
        >
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmDeploymentScale"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog
    :model-value="data.imageData.close"
    style="color: #000000; font: 14px"
    align-center
    draggable
    center
    @close="cancelImageFunc"
  >
    <template #header>
      <div class="header-docs">镜像列表</div>
    </template>

    <el-card class="app-docs" style="margin-top: -0px; height: 40px; margin-left: 5px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        Workload 包含的镜像列表，支持指定镜像的直接更新。
      </div>
    </el-card>
    <div style="margin-top: -10px" />

    <el-table
      v-loading="data.imageData.loading"
      :data="data.imageData.images"
      stripe
      style="margin-top: 2px; margin-left: 8px"
      header-row-class-name="pixiu-table-header"
      :cell-style="{
        'font-size': '12px',
        color: '#191919',
      }"
    >
      <el-table-column prop="name" sortable label="容器名称" width="280px">
        <template #default="scope">
          {{ scope.row.name
          }}<el-tag v-if="scope.row.init" type="danger" size="small" style="margin-left: 10px"
            >Init容器</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="image" sortable label="镜像">
        <template #default="scope">
          <el-scrollbar>
            <div :style="`${!scope.row.change && 'display: flex'}; overflow: auto`">
              <el-tag round>
                <div style="display: flex">
                  <pixiu-icon name="icon-docker" size="16px" type="iconfont" color="#409EFF" />
                  <div style="margin-left: 6px">{{ scope.row.image }}</div>
                </div>
              </el-tag>

              <div v-if="!scope.row.change">
                <pixiu-icon
                  name="icon-setting"
                  style="cursor: pointer; margin-left: 6px; margin-top: 5px"
                  size="16px"
                  type="iconfont"
                  color="#409EFF"
                  @click="handleImageChange(scope.row)"
                />
              </div>

              <div v-if="scope.row.change" style="margin-top: 4px; width: 50%">
                <el-input v-model="scope.row.newImage"></el-input>
                <div style="display: flex">
                  <div style="cursor: pointer" @click="confirmEvent(scope.row)">确认</div>
                  <div style="margin-left: 10px; cursor: pointer" @click="cancelEvent(scope.row)">
                    取消
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </template>
      </el-table-column>
      />
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button style="float: right" class="pixiu-delete-cancel-button" @click="cancelImageFunc"
          >关闭</el-button
        >
      </span>
      <div style="margin-bottom: 35px" />
    </template>
  </el-dialog>

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getDeployments"
  ></PiXiuViewOrEdit>
  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>

  <el-drawer
    v-model="data.logData.drawer"
    :size="data.drawerWidth"
    :with-header="false"
    @open="openLogDrawer"
    @close="closeLogDrawer"
  >
    <div style="display: flex; flex-direction: column; height: 100%">
      <div>
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 5px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          日志查询
        </div>

        <el-card class="app-docs" style="margin-left: 8px; height: 40px">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">获取 Deployment 的实时日志</div>
        </el-card>

        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 8px; font-size: 13px; color: #191919">Pod选项 </span>
            </template>

            <span style="margin-left: 40px">
              <el-select
                v-model="data.logData.selectedPod"
                style="width: 210px; float: right; margin-right: 10px"
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
              <span style="margin-left: 8px; font-size: 13px; color: #191919">日志行数 </span>
            </template>

            <span style="margin-left: 40px">
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

          <el-form-item>
            <div style="margin-left: 110px; margin-top: -12px">
              <el-switch v-model="data.logData.previous" inline-prompt width="35px" /><span
                style="font-size: 12px; margin-left: 5px; color: #191919"
                >查看已退出的容器</span
              >
            </div>
          </el-form-item>
        </el-form>

        <div style="display: flex; margin-top: 25px; margin-left: 8px">
          <button style="width: 70px" class="pixiu-two-button" @click="getPodLogs">查询</button>
          <div style="margin-left: 30px">
            <el-switch v-model="data.logData.aggLog" inline-prompt width="36px" /><span
              style="font-size: 13px; margin-left: 5px; margin-right: 10px"
              >聚合</span
            >
          </div>
        </div>
      </div>

      <div style="margin-top: 15px; flex: 1">
        <PixiuLog :yaml-dialog="data.logData.drawer" :log="data.logData.podLogs"></PixiuLog>
      </div>
    </div>
  </el-drawer>

  <el-drawer
    v-model="data.monitorData.drawer"
    :size="data.drawerWidth"
    :with-header="false"
    @open="openMonitorDrawer"
    @close="closeMonitorDrawer"
  >
    <div style="display: flex; flex-direction: column; height: 100%">
      <div>
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 5px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          资源监控
        </div>
        <el-card class="app-docs" style="margin-left: 8px; height: 40px">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">查看 Deployment 的资源状态</div>
        </el-card>
      </div>
    </div>
  </el-drawer>

  <el-drawer
    v-model="data.eventData.drawer"
    :size="data.eventData.width"
    :with-header="false"
    @open="openEventDrawer"
    @close="closeEventDrawer"
  >
    <div style="display: flex; flex-direction: column; height: 100%">
      <div>
        <div
          style="
            text-align: left;
            font-weight: bold;
            padding-left: 5px;
            margin-top: 5px;
            font-size: 14.5px;
            color: #191919;
          "
        >
          事件查询
        </div>

        <el-card class="app-docs" style="margin-left: 8px; height: 40px">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">获取 Deployment 的事件</div>
        </el-card>

        <el-row>
          <el-col>
            <div style="margin-left: 8px">
              <button class="pixiu-two-button" @click="getDeploymentEvents">查询</button>
              <button
                style="margin-left: 10px; width: 85px"
                class="pixiu-two-button2"
                @click="deleteEventsInBatch"
              >
                批量删除
              </button>
            </div>
          </el-col>
        </el-row>

        <div style="margin-top: 25px">
          <el-table
            v-loading="data.eventData.loading"
            :data="data.eventData.eventTableData"
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
            <el-table-column prop="involvedObject.name" label="资源名称" :formatter="formatString">
            </el-table-column>
            <el-table-column prop="count" label="出现次数" width="80px"> </el-table-column>
            <el-table-column prop="message" label="内容" min-width="250px" />

            <template #empty>
              <div class="table-inline-word">暂无事件</div>
            </template>
          </el-table>
          <pagination
            :total="data.eventData.pageEventInfo.total"
            @on-change="onEventChange"
          ></pagination>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import {
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  ref,
  watch,
  provide,
} from 'vue';
import jsYaml from 'js-yaml';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import PixiuTag from '@/components/pixiuTag/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import { getPodsByLabels, deletePod, getPodLog } from '@/services/kubernetes/podService';
import {
  getDeploymentList,
  getDeployment,
  updateDeployment,
  deleteDeployment,
  patchDeployment,
  reDeployDeployment,
} from '@/services/kubernetes/deploymentService';
import {
  formatterImage,
  formatterTime,
  formatterNamespace,
  runningFormatter,
  formatterContainerImage,
  formatString,
} from '@/utils/formatter';
import { getEventList, deleteEvent } from '@/services/kubernetes/eventService';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import PixiuLog from '@/components/pixiulog/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
  namespace: 'default',

  autoRefresh: false,
  timer: null,

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    nameSelector: '',
    labelSelector: '',
  },

  tableData: [],
  loading: false,

  deploymentList: [],

  deploymentReplicasDialog: false,
  deploymentRepcliasFrom: {
    name: '',
    namespace: '',
    origin: '',
    target: 0,
  },

  // yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Deployment',
    deleteName: '',
    namespace: '',
  },

  imageData: {
    loading: false,
    close: false,
    images: [],
  },

  drawerWidth: '70%',

  logData: {
    drawer: false,

    deployment: '',
    namespace: '',
    selectedPodMap: {},
    selectedPods: [],
    selectedPod: '',
    selectedContainers: [],
    selectedContainer: '',

    previous: false,
    line: 25,
    lineOptions: [25, 50, 100, 200, 500],
    podLogs: '点击查询获取日志',
    aggLog: false,
  },

  eventData: {
    drawer: false,
    loading: false,
    width: '80%',

    deployment: '',
    eventTableData: [],
    events: [],
    multipleEventSelection: [],

    pageEventInfo: {
      page: 1,
      limit: 10,
      total: 0,
      search: {
        field: 'name',
        searchInfo: '',
      },
    },
  },

  monitorData: {
    drawer: false,
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  // 初始化 workload 列表
  getDeployments();
});

onUnmounted(() => {
  window.removeEventListener('setItem', handleStorageChange);
});

onBeforeUnmount(() => {
  window.clearInterval(data.timer);
});

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取 workload 列表
      getDeployments();
    }
  }
};

const handleMonitorDrawer = (row) => {
  data.monitorData.drawer = true;
};

const handleEventDrawer = (row) => {
  data.eventData.deployment = row;
  data.eventData.drawer = true;
};

const closeEventDrawer = () => {
  data.eventData = {
    drawer: false,
    loading: false,
    width: '80%',
    deployment: '',
    eventTableData: [],
    events: [],
    multipleEventSelection: [],
    pageEventInfo: {
      page: 1,
      limit: 10,
      total: 0,
      search: {
        field: 'name',
        searchInfo: '',
      },
    },
  };
};

const getDeploymentEvents = async () => {
  const namespace = data.eventData.deployment.metadata.namespace;
  const name = data.eventData.deployment.metadata.name;

  data.eventData.loading = true;
  const [result, err] = await getEventList(data.cluster, namespace, name);
  data.eventData.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.eventData.events = result;
  data.eventData.pageEventInfo.total = result.length;
  data.eventData.eventTableData = getTableData(data.eventData.pageEventInfo, data.eventData.events);
};

const handleEventSelectionChange = (events) => {
  data.eventData.multipleEventSelection = [];
  for (let event of events) {
    data.eventData.multipleEventSelection.push(event.metadata.name);
  }
};

const onEventChange = (v) => {
  data.eventData.pageEventInfo.limit = v.limit;
  data.eventData.pageEventInfo.page = v.page;
  data.eventData.eventTableData = getTableData(data.eventData.pageEventInfo, data.eventData.events);
};

const deleteEventsInBatch = async () => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, data.namespace, event);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
  proxy.$notify.success('批量删除事件成功');
  getDeploymentEvents();
};

const handleLogDrawer = (row) => {
  data.logData.deployment = row;
  data.logData.namespace = row.metadata.namespace;

  getDeploymentPods();
  data.logData.drawer = true;
};

const closeLogDrawer = () => {
  data.logData.deployment = '';
  data.logData.namespace = '';
  data.logData.selectedPodMap = {};
  data.logData.selectedPods = [];
  data.logData.selectedPod = '';
  data.logData.containers = [];
  data.logData.selectedContainer = '';
  data.logData.selectedContainers = [];
  data.logData.previous = false;
  data.logData.aggLog = false;
  data.logData.line = 25;
  data.logData.podLogs = '点击查询获取日志';
};

const getDeploymentPods = async () => {
  let matchLabels = data.logData.deployment.spec.selector.matchLabels;
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

const getPodLogs = async () => {
  // 在指定 pod 和容器的情况下，才请求log
  if (data.logData.selectedPod === '' || data.logData.selectedContainer === '') {
    proxy.$notify.warning('查询日志，pod 和 container 为必选项。');
    return;
  }

  if (data.logData.aggLog) {
    let logs = [];
    for (let pod of data.logData.selectedPods) {
      const [result, err] = await getPodLog(
        data.cluster,
        data.logData.namespace,
        pod,
        data.logData.selectedContainer,
        data.logData.line,
      );
      if (err) {
        proxy.$notify.error(err.response.data.message);
        continue;
      }
      logs.push('# ' + pod + '\n' + result);
    }
    data.logData.podLogs = logs.join('\n');
  } else {
    const [result, err] = await getPodLog(
      data.cluster,
      data.logData.namespace,
      data.logData.selectedPod,
      data.logData.selectedContainer,
      data.logData.line,
    );
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
    data.logData.podLogs = result;
  }
};

const getDeployReady = (row) => {
  let availableReplicas = row.status.availableReplicas;
  if (availableReplicas === undefined) {
    availableReplicas = 0;
  }

  return availableReplicas + '/' + row.spec.replicas;
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
  data.deleteDialog.namespace = row.metadata.namespace;
};

const confirm = async () => {
  const [result, err] = await deleteDeployment(
    data.cluster,
    data.deleteDialog.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Deployment(${data.deleteDialog.deleteName}) 删除成功`);

  clean();
  await getDeployments();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};

const onChange = async (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  getDeployments();
};

const confirmEvent = async (row) => {
  if (row.newImage === '') {
    proxy.$notify.warning('新的镜像名称为必选项');
    return;
  }

  const patchData = {
    spec: {
      template: {
        spec: {
          '$setElementOrder/containers': [{ name: row.name }],
          containers: [{ image: row.newImage, name: row.name }],
        },
      },
    },
  };

  const [result, err] = await patchDeployment(data.cluster, row.ns, row.deploymentName, patchData);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  row.image = row.newImage;
  row.newImage = '';
  row.change = false;
};

const cancelEvent = (row) => {
  row.change = false;
  row.newImage = '';
};

const handleImageChange = (row) => {
  row.change = true;
};

const handleRedeploy = async (row) => {
  const patchData = {
    spec: {
      template: {
        metadata: {
          annotations: {
            'deployment.pixiu.io/restartAt': formatTimestamp(new Date()),
          },
        },
      },
    },
  };
  const [result, err] = await reDeployDeployment(
    data.cluster,
    row.metadata.namespace,
    row.metadata.name,
    patchData,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Deployment(${row.metadata.name}) 重新部署执行成功`);
};

const handleImageDialog = async (row) => {
  const namespace = row.metadata.namespace;
  const name = row.metadata.name;
  const [deploy, err] = await getDeployment(data.cluster, namespace, name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  const containers = deploy.spec.template.spec.containers;
  data.imageData.images = [];
  for (let container of containers) {
    data.imageData.images.push({
      init: false,
      image: container.image,
      name: container.name,
      change: false,
      newImage: '',
      deploymentName: row.metadata.name,
      ns: row.metadata.namespace,
    });
  }
  if (deploy.spec.template.spec.initContainers) {
    const containers = deploy.spec.template.spec.initContainers;
    for (let container of containers) {
      data.imageData.images.push({
        init: true,
        image: container.image,
        name: container.name,
        change: false,
        newImage: '',
        deploymentName: row.metadata.name,
        ns: row.metadata.namespace,
      });
    }
  }
  data.imageData.close = true;
};

const cancelImageFunc = () => {
  data.imageData.close = false;
  data.imageData.images = [];
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getDeployment(
    data.cluster,
    row.metadata.namespace,
    row.metadata.name,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = result;
  data.editYamlDialog = true;
};

const createDeployment = () => {
  const url = `/deployments/createDeployment?cluster=${data.cluster}`;
  router.push(url);
};

const editDeployment = (row) => {
  const url = `/deployments/editDeployment?cluster=${data.cluster}&name=${row.metadata.name}`;
  router.push(url);
};

const jumpRoute = (row) => {
  router.push({
    name: 'DeploymentDetail',
    query: {
      cluster: data.cluster,
      namespace: row.metadata.namespace,
      name: row.metadata.name,
    },
  });
};

const getDeployments = async () => {
  if (!data.autoRefresh) {
    data.loading = true;
  }
  const [result, err] = await getDeploymentList(data.cluster, data.namespace, data.pageInfo);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.tableData = result.items;
  data.pageInfo.total = result.total;
};

const startAutoRefresh = () => {
  if (data.autoRefresh) {
    data.timer = window.setInterval(() => {
      getDeployments();
    }, 3000);
  } else {
    window.clearInterval(data.timer);
  }
};

provide('getDeployments', getDeployments);

const searchDeployments = async () => {
  data.tableData = searchData(data.pageInfo, data.deploymentList);
};

const handleDeploymentScaleDialog = (row) => {
  data.deploymentRepcliasFrom.name = row.metadata.name;
  data.deploymentRepcliasFrom.namespace = row.metadata.namespace;
  data.deploymentRepcliasFrom.target = '';
  data.deploymentRepcliasFrom.origin = row.spec.replicas;

  data.deploymentReplicasDialog = true;
};

const closeDeploymentScaleDialog = (row) => {
  data.deploymentReplicasDialog = false;

  setTimeout(() => {
    data.deploymentRepcliasFrom.name = '';
    data.deploymentRepcliasFrom.namespace = '';
    data.deploymentRepcliasFrom.origin = '';
    data.deploymentRepcliasFrom.target = 0;
  }, 1000);
};

const confirmDeploymentScale = async () => {
  const patchData = {
    spec: {
      replicas: Number(data.deploymentRepcliasFrom.target),
    },
  };

  const [result, err] = await patchDeployment(
    data.cluster,
    data.deploymentRepcliasFrom.namespace,
    data.deploymentRepcliasFrom.name,
    patchData,
  );
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  await getDeployments();
  closeDeploymentScaleDialog();
};
</script>

<style></style>
