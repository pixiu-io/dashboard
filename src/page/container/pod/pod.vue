<template>
  <Description
    :description="'Pod 是可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元。它包含一个或多个容器，共享网络命名空间，存储，以及唯一的标识符。'"
  />

  <div style="margin-top: 5px">
    <el-row style="display: flex; align-items: center">
      <el-col style="display: flex; justify-content: space-between">
        <el-space>
          <button class="pixiu-two-button" @click="createPod">新建</button>
          <button
            style="margin-left: 10px; width: 85px"
            class="pixiu-two-button2"
            @click="deletePodsInBatch"
          >
            批量删除
          </button>
        </el-space>
        <el-space style="display: flex; align-items: center">
          <div>
            <el-switch
              v-model="data.refresh"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              @change="startRefresh"
            />
            <!-- <span style="font-size: 13px; margin-left: 5px; margin-right: 5px">自动刷新</span> -->
            <el-text style="font-size: 13px; margin-left: 5px; margin-right: 5px">自动刷新</el-text>
          </div>

          <pixiu-input
            placeholder="名称搜索关键字"
            :options="data.options"
            :enter-event="getPods"
            style="width: 460px; font-size: 12px"
            @update:tags="handleDynamicTags"
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
                @click="getPods"
              />
            </template>
          </pixiu-input>
        </el-space>
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
        <!--
        <el-table-column
          prop="spec.containers"
          label="资源申请值/限制值"
          :formatter="formatterContainersResource"
        />-->

        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartCount" />

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
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

      <pagination :total="data.total" @on-change="onChange"></pagination>
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

      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-top: -20px;
          margin-left: 8px;
          margin-right: 20px;
        "
      >
        <div>
          <button style="width: 70px" class="pixiu-two-button" @click="getPodLogs">查询</button>
        </div>
        <div>
          <el-switch v-model="data.logData.follow" /><span
            style="font-size: 12px; margin-left: 5px; color: #191919"
            >实时刷新</span
          >
        </div>
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
      <el-space style="margin-left: 8px; margin-top: 15px" wrap>
        <Echart :option="data.monitorData.cpuOption"></Echart>
        <Echart :option="data.monitorData.memoryOption"></Echart>
      </el-space>
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
import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  ref,
} from 'vue';
import { ElMessage } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import PixiuInput from '@/components/pixiuInput/index.vue';
import { getTableData, searchFromData } from '@/utils/utils';

import {
  formatString,
  formatterContainerImage,
  formatterNamespace,
  formatterPodStatus,
  formatterRestartCount,
  formatterTime,
} from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  deletePod,
  getPod,
  getPodByName,
  getPodListByCache,
  getPodLog,
  watchPodLog,
} from '@/services/kubernetes/podService';
import {
  getPodCpuUsageMetrics,
  getPodMemoryUsageMetrics,
} from '@/services/kubernetes/metricsService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import PixiuLog from '@/components/pixiulog/index.vue';
import { deleteEvent, getRawEventList } from '@/services/kubernetes/eventService';
import Echart from '@/components/echarts/index.vue';

const { toClipboard } = useClipboard();
const { proxy } = getCurrentInstance();
const router = useRouter();

const selectedContainers = ref([]);
const selectedContainer = ref('');
const selectedPod = ref('');

const data = reactive({
  total: 0,
  search: {},
  timer: null,
  cluster: '',
  namespace: 'default',
  refresh: false,
  drawerWidth: '70%',
  options: [
    { label: '名字', value: 'nameSelector' },
    { label: '标签', value: 'labelSelector' },
  ],
  pageInfo: {
    page: 1,
    limit: 10,
    nameSelector: '',
    labelSelector: '',
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
    namespace: '',
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
    //实时日志
    follow: false,
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
    timer: null,
    drawer: false,
    cpuOption: {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
      },
      title: {
        left: '0px',
        text: 'CPU使用率（%）',
        textStyle: {
          fontSize: 13,
          fontWeight: 'bold',
          color: '#191919',
        },
      },

      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: 'CPU（ cores ）',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 13,
          color: '#191919',
        },
      },

      series: [
        {
          name: 'CPU使用率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#5dd183',
          },
          areaStyle: {
            color: '#5dd183',
          },
          data: [],
        },
      ],
    },
    memoryOption: {
      tooltip: {
        trigger: 'axis',
        confine: true,
        position: function (pt) {
          return [pt[0], '10%'];
        },
        formatter: function (params) {
          let str =
            params[0].axisValueLabel +
            '<br/>' +
            params[0].marker +
            params[0].seriesName +
            '<span style="margin-left: 15px; font-size: 13px; color: green">';
          let v = params[0].value[1];
          if (v >= 1024 * 1024 * 1024) {
            str += (v / 1024 / 1024 / 1024).toFixed(2) + ' GB';
          } else {
            str += (v / 1024 / 1024).toFixed(2) + ' MB';
          }
          str += '</span>';
          return str;
        },
        axisPointer: {},
      },
      title: {
        left: '0px',
        text: '内存使用量',
        textStyle: {
          fontSize: 13,
          fontWeight: 'bold',
          color: '#191919',
        },
      },

      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            if (value >= 1024 * 1024 * 1024) {
              return (value / 1024 / 1024 / 1024).toFixed(0) + ' GB';
            } else {
              return (value / 1024 / 1024).toFixed(0) + ' MB';
            }
          },
        },
      },
      series: [
        {
          name: 'Memory Usage',
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#a8baee',
          },
          areaStyle: {
            color: '#a8baee',
          },
          data: [],
        },
      ],
    },
  },
});

const handleDynamicTags = (tags) => {
  const ret = tags.reduce((obj, item) => {
    obj[item.value] = item.inputValue;
    return obj;
  }, {});
  data.pageInfo.labelSelector = ret['labelSelector'];
  data.pageInfo.nameSelector = ret['nameSelector'];
  if (!data.pageInfo.nameSelector && !data.pageInfo.labelSelector) {
    getPods();
  }
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  getPods();
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

const parseMetrics = (metricPoints) => {
  return metricPoints.map(({ timestamp, value }) => [new Date(timestamp).getTime(), value]);
};

const getMetricsInfo = async (name, namespace) => {
  try {
    const [cpuUsage] = await getPodCpuUsageMetrics(data.cluster, namespace, name);
    data.monitorData.cpuOption.series[0].data = parseMetrics(cpuUsage.items[0].metricPoints);
    const [memoryUsage] = await getPodMemoryUsageMetrics(data.cluster, namespace, name);
    data.monitorData.memoryOption.series[0].data = parseMetrics(memoryUsage.items[0].metricPoints);
  } catch (error) {
    proxy.$notify.error(error.response?.data?.message || 'Failed to fetch metrics');
  }
};

const handleMonitorDrawer = async (row) => {
  const { name, namespace } = row.metadata;
  await getMetricsInfo(name, namespace);
  data.monitorData.drawer = true;
  //定时刷新 3秒
  data.monitorData.timer = setInterval(async () => {
    await getMetricsInfo(name, namespace);
  }, 3000);
};
const closeMonitorDrawer = () => {
  //关闭定时器
  if (data.monitorData.timer) {
    clearInterval(data.monitorData.timer);
  }
};
onUnmounted(() => {
  if (data.monitorData.timer) {
    clearInterval(data.monitorData.timer);
  }
});
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
    data.eventData.multipleEventSelection.push(event.metadata);
  }
};

const deleteEventsInBatch = async () => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, event.namespace, event.name);
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
  data.deleteDialog.namespace = row.metadata.namespace;
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
  const [pod, err] = await getPod(data.cluster, row.metadata.namespace, row.metadata.name);
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
const ws = ref(null);
const getPodLogs = async () => {
  if (data.logData.selectedContainer === '') {
    proxy.$notify.error('查询日志时，容器名称为必选项');
    return;
  }

  if (ws.value !== null) {
    ws.value.close();
  }
  if (data.logData.follow) {
    ws.value = watchPodLog(
      data.cluster,
      data.logData.namespace,
      data.logData.pod,
      data.logData.selectedContainer,
      data.logData.line,
    );
    data.logData.podLogs = '';
    ws.value.onclose = () => {
      //关闭连接后打印在终端里
      data.logData.follow = false;
      data.logData.podLogs = '';
      ws.value = null;
    };
    let tmpLog = '';
    ws.value.onmessage = (e) => {
      if (e.data === 'ping' || !data.logData.follow) {
        tmpLog += e.data;
        return;
      } else {
        data.logData.podLogs += tmpLog + e.data;
        tmpLog = '';
      }
    };
  } else {
    data.logData.podLogs = '';
    const [result, err] = await getPodLog(
      data.cluster,
      data.logData.namespace,
      data.logData.pod,
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

onBeforeUnmount(() => {
  if (ws.value !== null) {
    ws.value.close();
  }
  window.clearInterval(data.timer);
});

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
  if (ws.value !== null) {
    ws.value.close();
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
      namespace: row.metadata.namespace,
      name: row.metadata.name,
    },
  });
};

const handlePodSelectionChange = (pods) => {
  data.multipleSelection = [];
  for (let pod of pods) {
    data.multipleSelection.push(pod.metadata);
  }
};

const deletePodsInBatch = async () => {
  if (data.multipleSelection.length === 0) {
    proxy.$notify.warning('未选择待删除Pod');
    return;
  }

  for (let pod of data.multipleSelection) {
    const [result, err] = await deletePod(data.cluster, pod.namespace, pod.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
  proxy.$notify.success('批量删除Pods成功');
  getPods();
};

const getPods = async () => {
  if (!data.refresh) {
    data.loading = true;
  }
  // const [result, err] = await getPodList(state.cluster, state.namespace);
  const [result, err] = await getPodListByCache(data.cluster, data.namespace, data.pageInfo);

  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  // state.podList = result.items;
  data.total = result.total;
  data.tableData = result.items;
  // state.tableData = getTableData(state.pageInfo, state.podList);
};

//每3s请求一次 getPods()
const startRefresh = () => {
  if (data.refresh) {
    data.timer = window.setInterval(() => {
      getPods();
    }, 3000);
  } else {
    //清除定时器
    window.clearInterval(data.timer);
  }
};

provide('getPods', getPods);

const searchPods = async () => {
  data.tableData = searchFromData(data.pageInfo, data.tableData);
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
  const [result, err] = await getPodByName(data.cluster, row.metadata.namespace, row.metadata.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yamlDialog = true;
  data.yaml = result;
};
</script>

<style scoped="scoped"></style>
