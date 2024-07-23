<template>
  <!-- <div class="title-card-container2"> -->
  <!-- <div class="font-container2">Pod</div> -->
  <!-- <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getPods"></PiXiuYaml>
    </div>
  </div> -->
  <!-- <el-card class="title-card-container">
    <div class="font-container">Pod</div>
    <div>
      <PiXiuYaml :refresh="getPods"></PiXiuYaml>
    </div>
  </el-card> -->

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createPod">新建</button>
        <button
          style="margin-left: 10px; width: 85px"
          class="pixiu-two-button2"
          @click="deletePodsInBatch"
        >
          批量删除
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 400px; float: right"
          clearable
          @clear="getPods"
          @input="searchPods"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getPods">
              <component :is="'Search'" />
            </el-icon>
          </template>
        </el-input>
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
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="实例名称" :formatter="formatString">
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterPodStatus" />

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>

        <el-table-column prop="status.podIP" label="实例IP"> </el-table-column>

        <el-table-column prop="status.hostIP" sortable label="所在节点">
          <template #default="scope">
            <div style="display: flex">
              <div>
                {{ scope.row.status.hostIP }}
              </div>
              <div style="margin-left: 5px">
                <pixiu-icon
                  name="icon-share"
                  style="cursor: pointer"
                  size="12px"
                  type="iconfont"
                  color="#191919"
                />
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="镜像" prop="spec.containers" :formatter="formatterImage" /> -->

        <!-- <el-table-column
          prop="spec.containers"
          label="CPU申请值/限制值"
          :formatter="formatterContainersCPU"
        />
        <el-table-column
          prop="spec.containers"
          label="内存申请值/限制值"
          :formatter="formatterContainersMem"
        /> -->

        <el-table-column
          prop="spec.containers"
          label="资源申请值/限制值"
          :formatter="formatterContainersResource"
        />

        <el-table-column
          prop="status"
          label="重启次数"
          :formatter="formatterRestartCount"
          width="90px"
        />

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          :formatter="formatterTime"
        />

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
              style="color: #006eff"
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
                  <!-- <el-dropdown-item class="dropdown-item-buttons"> 详情 </el-dropdown-item> -->
                  <el-dropdown-item class="dropdown-item-buttons" @click="viewYaml(scope.row)">
                    查看YAML
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleLogDrawer(scope.row)"
                  >
                    日志
                  </el-dropdown-item>

                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleRemoteLoginDialog(scope.row)"
                  >
                    远程登陆
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleContainerListDialog(scope.row)"
                  >
                    容器列表
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

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>

  <el-dialog
    :model-value="data.remoteLogin.close"
    style="color: #000000; font: 14px"
    width="500px"
    align-center
    center
    draggable
    @close="cancelRemoteLogin"
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
        远程登录
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">基于 WebShell 提供登陆容器的功能</div>
    </el-card>

    <el-form>
      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">容器名称</span>
        </template>

        <el-select
          v-model="data.remoteLogin.container"
          style="margin-left: 25px; width: 300px"
          @change="changeContainer"
        >
          <el-option
            v-for="item in data.remoteLogin.containers"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">Command</span>
        </template>

        <el-radio-group v-model="data.remoteLogin.command" style="margin-left: 15px">
          <el-radio label="/bin/sh">
            <span style="font-size: 13px">/bin/sh</span>
          </el-radio>
          <el-radio label="/bin/bash"> <span style="font-size: 13px"> /bin/bash</span></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="margin-top: -25px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelRemoteLogin">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmRemoteLogin"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <PiXiuViewOrEdit
    :yaml-dialog="data.yamlDialog"
    :yaml="data.yaml"
    title="查看Yaml"
  ></PiXiuViewOrEdit>

  <el-dialog
    :model-value="data.podContainers.close"
    style="color: #000000; font: 14px"
    align-center
    draggable
    center
    @close="cancelpodContainers"
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
        容器列表
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">Pod 所包含的容器列表。</div>
    </el-card>
    <div style="margin-top: -10px" />

    <el-table
      v-loading="data.podContainers.loading"
      :data="data.podContainers.containers"
      stripe
      style="margin-top: 2px"
      header-row-class-name="pixiu-table-header"
      :cell-style="{
        'font-size': '12px',
        color: '#191919',
      }"
    >
      <el-table-column prop="container.name" sortable label="容器名称" width="150px">
      </el-table-column>

      <el-table-column
        prop="status"
        sortable
        label="状态"
        :formatter="formatterContainerStatus"
        width="140px"
      />

      <el-table-column prop="status.restartCount" sortable label="重启次数" width="110px" />

      <el-table-column
        prop="status"
        label="创建时间"
        sortable
        :formatter="formatterContainerStartTime"
        width="160px"
      />

      <el-table-column prop="container.image" label="镜像" :formatter="formatterContainerImage" />
    </el-table>

    <div style="margin-bottom: -15px" />
    <template #footer>
      <span class="dialog-footer">
        <el-button
          style="float: right"
          class="pixiu-delete-cancel-button"
          @click="cancelpodContainers"
          >关闭</el-button
        >
      </span>
      <div style="margin-bottom: 35px" />
    </template>
  </el-dialog>

  <el-drawer
    v-model="data.logData.drawer"
    :size="data.logData.width"
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
          <div style="vertical-align: middle; margin-top: -40px">获取 Pod 的实时日志</div>
        </el-card>

        <el-form>
          <el-form-item>
            <template #label>
              <span style="margin-left: 8px; font-size: 13px; color: #191919">容器选项 </span>
            </template>

            <span style="margin-left: 40px">
              <el-select
                v-model="data.logData.selectedContainer"
                style="width: 260px; float: right; margin-right: 10px"
              >
                <el-option
                  v-for="item in data.logData.containers"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </span>
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
      </div>

      <div style="display: flex; margin-top: -20px; margin-left: 8px">
        <button style="width: 70px" class="pixiu-two-button" @click="getPodLogs">查询</button>
      </div>

      <div style="margin-top: 15px; margin-left: 8px; flex: 1">
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
          <div style="vertical-align: middle; margin-top: -40px">查看 Pod 的资源状态</div>
        </el-card>
      </div>
    </div>
  </el-drawer>

  <el-drawer
    v-model="data.eventData.drawer"
    :size="data.eventData.width"
    :with-header="false"
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
          <div style="vertical-align: middle; margin-top: -40px">获取 Pod 的事件</div>
        </el-card>

        <el-row>
          <el-col>
            <div style="margin-left: 8px">
              <button class="pixiu-two-button" @click="getPodEvents">查询</button>
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
import { reactive, getCurrentInstance, onMounted, ref, onUnmounted, provide } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getTableData, searchData } from '@/utils/utils';
import {
  formatterTime,
  formatterPodStatus,
  formatterRestartCount,
  formatterNamespace,
  formatString,
  formatterContainersCPU,
  formatterContainersMem,
  formatterContainersResource,
  formatterContainerImage,
} from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  getPodList,
  deletePod,
  getPodByName,
  getPod,
  getPodLog,
  watchPodLog,
} from '@/services/kubernetes/podService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getNode } from '@/services/kubernetes/nodeService';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import PixiuLog from '@/components/pixiulog/index.vue';
import { getRawEventList, deleteEvent } from '@/services/kubernetes/eventService';

const { toClipboard } = useClipboard();
const { proxy } = getCurrentInstance();
const router = useRouter();

const selectedContainers = ref([]);
const selectedContainer = ref('');
const selectedPod = ref('');

const data = reactive({
  cluster: '',
  namespace: 'default',

  drawerWidth: '70%',

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
  tableData: [],
  loading: false,
  multipleSelection: [],
  yamlDialog: false,
  yaml: '',

  podList: [],
  podReplicasDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
  },

  remoteLogin: {
    close: false,
    pod: '',
    container: '',
    containers: [],
    command: '/bin/sh',
  },

  podContainers: {
    close: false,
    containers: [],
  },
  streams: [],
  logData: {
    width: '70%',
    drawer: false,
    pod: '',
    namespace: '',
    containers: [],
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

    pod: '',
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

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  data.tableData = getTableData(data.pageInfo, data.podList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchPods();
  }
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  getPods();
});
onUnmounted(() => {
  window.removeEventListener('setItem', handleStorageChange);
});

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取 workload 列表
      getPods();
    }
  }
};

const handleMonitorDrawer = (row) => {
  data.monitorData.drawer = true;
};

const handleEventDrawer = (row) => {
  data.eventData.pod = row;
  data.eventData.drawer = true;
};

const getPodEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getRawEventList(
    data.cluster,
    data.eventData.pod.metadata.uid,
    data.eventData.pod.metadata.namespace,
    data.eventData.pod.metadata.name,
    '',
    true,
  );
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
  getPodEvents();
};

const closeEventDrawer = () => {
  data.eventData = {
    drawer: false,
    loading: false,
    width: '80%',
    pod: '',
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

const createPod = () => {
  const url = `/pods/createPod?cluster=${data.cluster}`;
  router.push(url);
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const cancelRemoteLogin = () => {
  data.remoteLogin.close = false;
  data.remoteLogin.container = '';
  data.remoteLogin.containers = [];
  data.remoteLogin.pod = '';
  data.remoteLogin.command = '/bin/sh';
};

const confirmRemoteLogin = () => {
  window.open(
    '/#/podshell?pod=' +
      data.remoteLogin.pod +
      '&namespace=' +
      data.namespace +
      '&cluster=' +
      data.cluster +
      '&container=' +
      data.remoteLogin.container +
      '&command=' +
      data.remoteLogin.command,
    '_blank',
    'width=1000,height=600',
  );
  cancelRemoteLogin();
};

const handleRemoteLoginDialog = (row) => {
  data.remoteLogin.close = true;
  data.remoteLogin.pod = row.metadata.name;
  data.remoteLogin.containers = [];
  for (let c of row.spec.containers) {
    data.remoteLogin.containers.push(c.name);
  }
  if (data.remoteLogin.containers.length >= 1) {
    data.remoteLogin.container = data.remoteLogin.containers[0];
  }
};

const handleContainerListDialog = async (row) => {
  const [pod, err] = await getPod(data.cluster, data.namespace, row.metadata.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  let containerStatus = {};
  for (let cs of pod.status.containerStatuses) {
    containerStatus[cs.name] = cs;
  }
  for (let c of pod.spec.containers) {
    data.podContainers.containers.push({
      container: c,
      status: containerStatus[c.name],
    });
  }

  data.podContainers.close = true;
};

const getPodLogs = async () => {
  if (data.logData.selectedContainer === '') {
    proxy.$notify.error('查询日志时，容器名称为必选项');
    return;
  }

  // const [result, err] = await getPodLog(
  //   data.cluster,
  //   data.logData.namespace,
  //   data.logData.pod,
  //   data.logData.selectedContainer,
  //   data.logData.line,
  // );
  // if (err) {
  //   proxy.$notify.error(err.response.data.message);
  //   return;
  // }
  // data.logData.podLogs = result;

  if (data.streams.length !== 0) {
    for (const s of data.streams) {
      s.abort();
    }
    data.streams = [];
  }
  let controller = new AbortController();
  let single = controller.signal;
  data.streams.push(controller);
  const { body, e } = await watchPodLog(
    data.cluster,
    data.logData.namespace,
    data.logData.pod,
    data.logData.selectedContainer,
    data.logData.line,
    single,
  );

  if (e) {
    proxy.$message.error('Failed to get task list', e);
    return;
  }
  if (body) {
    const reader = body.getReader();
    await readStream(reader);
  }
};

const readStream = async (reader) => {
  data.logData.podLogs = '';
  const decoder = new TextDecoder('utf-8');
  while (true) {
    try {
      const { value, done } = await reader.read();
      if (done) {
        reader.cancel();
        break;
      }
      const uint8Array = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let decodedString = decoder.decode(uint8Array, { stream: true });

      data.logData.podLogs += decodedString;
      data.logData.podLogs = data.logData.podLogs.replace(/^"|"$/g, '');
      data.logData.podLogs = data.logData.podLogs.replace(/\\"/g, '"');
      console.log('----', decodedString);
      // 解析JSON数据
      // try {
      //   const result = JSON.parse(decodedString);
      //   data.logData.podLogs += result;
      // } catch (e) {
      //   console.log('解析日志失败： ', e);
      //   proxy.$message.error('Error parsing JSON:', e);
      // }
    } catch (e) {
      console.log(e);
      break;
    }
  }
};

const cancelpodContainers = () => {
  data.podContainers.close = false;
  data.podContainers.containers = [];
};

const formatterContainerStatus = (row, column, cellValue) => {
  let status = '运行中';
  let color = '#28C65A';

  const state = cellValue.state;
  if (state.terminated !== undefined) {
    status = state.terminated.reason;
    color = '#0000FF';
  }

  return (
    <div style="display: flex">
      <div>
        <pixiu-icon name="icon-circle-dot" size="12px" type="iconfont" color={color} />
      </div>
      <div style="margin-left: 6px"> {status}</div>
    </div>
  );
};

const handleLogDrawer = (row) => {
  data.logData.pod = row.metadata.name;
  data.logData.namespace = row.metadata.namespace;

  data.logData.containers = [];
  for (let c of row.spec.containers) {
    data.logData.containers.push(c.name);
  }
  data.logData.drawer = true;
};

const openLogDrawer = () => {
  if (data.logData.containers.length > 0) {
    data.logData.selectedContainer = data.logData.containers[0];
  }
};

const closeLogDrawer = () => {
  if (data.streams.length !== 0) {
    for (const s of data.streams) {
      s.abort();
    }
    data.streams = [];
  }
  data.logData.pod = '';
  data.logData.namespace = '';
  data.logData.containers = [];
  data.logData.selectedContainer = '';
  data.logData.previous = false;
  data.logData.line = 25;
  data.logData.podLogs = '点击查询获取日志';
};

const formatterContainerStartTime = (row, column, cellValue) => {
  const state = cellValue.state;
  const time = '';
  if (state.terminated !== undefined) {
    const time = state.terminated.startedAt;
    return formatterTime(row, column, time);
  }
  if (state.running !== undefined) {
    const time = state.running.startedAt;
    return formatterTime(row, column, time);
  }
};

const confirm = async () => {
  const [result, err] = await deletePod(data.cluster, data.namespace, data.deleteDialog.deleteName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await getPods();
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

const jumpRoute = (row) => {
  router.push({
    name: 'PodDetail',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      name: row.metadata.name,
    },
  });
};

const handlePodSelectionChange = (pods) => {
  data.multipleSelection = [];
  for (let pod of pods) {
    data.multipleSelection.push(pod.metadata.name);
  }
};

const deletePodsInBatch = async () => {
  if (data.multipleSelection.length === 0) {
    proxy.$notify.warning('未选择待删除Pod');
    return;
  }

  for (let pod of data.multipleSelection) {
    const [result, err] = await deletePod(data.cluster, data.namespace, pod);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
  proxy.$notify.success('批量删除Pods成功');
  getPods();
};

const getPods = async () => {
  data.loading = true;
  const [result, err] = await getPodList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.podList = result.items;
  data.pageInfo.total = data.podList.length;
  data.tableData = getTableData(data.pageInfo, data.podList);
};

provide('getPods', getPods);

const searchPods = async () => {
  data.tableData = searchData(data.pageInfo, data.podList);
};

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

const viewYaml = async (row) => {
  const [result, err] = await getPodByName(data.cluster, data.namespace, row.metadata.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yamlDialog = true;
  data.yaml = result;
};
</script>

<style scoped="scoped"></style>
