<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <el-row>
      <el-col>
        <div style="float: right">
          <button class="pixiu-two-button" @click="GetPod">刷新</button>
          <button class="pixiu-two-button2" style="margin-left: 10px">日志</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">查看YAML</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px">远程登陆</button>
          <button class="pixiu-two-button2" style="margin-left: 10px; width: 85px; color: #171313">
            更多操作
          </button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div style="display: flex; margin-top: 5px; margin-bottom: -45px">
          <div>
            <Echart :option="data.monitorData.cpuOption"></Echart>
          </div>
          <div>
            <Echart :option="data.monitorData.memoryOption"></Echart>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>

  <el-card class="contend-card-container2">
    <el-tabs
      v-model="data.activeName"
      class="namespace-tab"
      style="margin-left: 10px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="容器" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"> </el-tab-pane>
      <el-tab-pane label="环境变量" name="four"></el-tab-pane>
      <el-tab-pane label="日志" name="five"></el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <div>
        <el-form style="margin-top: 10px">
          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >实例信息
              </span>
            </template>
          </el-form-item>

          <el-row>
            <el-col>
              <el-row :gutter="20">
                <el-col :span="8">
                  <span class="detail-card-key-style">名称 </span>
                  <span class="detail-card-value-style" style="margin-left: 55px">
                    {{ data.pod.metadata.name }}</span
                  >
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <span class="detail-card-key-style">所在节点 </span>
                    <span class="detail-card-value-style">
                      {{ data.pod.spec.nodeName }}: {{ data.pod.status.hostIP }}
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
                  <span class="detail-card-key-style">命名空间 </span>
                  <span class="detail-card-value-style"> {{ data.pod.metadata.namespace }}</span>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <span class="detail-card-key-style">容器地址 </span>
                    <span class="detail-card-value-style">
                      {{ data.pod.status.podIP }}
                    </span>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <span class="detail-card-key-style">QoS类别 </span>
                    <span class="detail-card-value-style">
                      {{ data.pod.status.qosClass }}
                    </span>
                  </el-row>
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin-top: 15px">
                <el-col :span="8">
                  <span class="detail-card-key-style">运行状态 </span>
                  <span class="detail-card-value-style"> Running</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <div style="margin-top: 20px"></div>

          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >标签
              </span>
            </template>
          </el-form-item>

          <el-form-item style="margin-top: -10px">
            <div v-if="data.pod.metadata.labels === undefined" style="margin-left: 10px">-</div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.pod.metadata.labels"
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
            <div v-if="data.pod.metadata.annotations === undefined" style="margin-left: 10px">
              -
            </div>
            <div v-else style="margin-top: -8px">
              <div
                v-for="(item, index) in data.pod.metadata.annotations"
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
      </div>
    </div>

    <div v-if="data.activeName === 'second'">
      <el-card class="app-docs" style="margin-top: 10px; height: 40px; margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">Pod 所包含的容器列表。</div>
      </el-card>

      <el-table
        :data="data.podContainers"
        stripe
        style="margin-top: 2px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="container.name" sortable label="容器名称"> </el-table-column>
        <el-table-column
          prop="status"
          sortable
          label="状态"
          :formatter="formatterContainerStatus"
        ></el-table-column>
        <el-table-column prop="status.restartCount" sortable label="重启次数" />
        <el-table-column
          prop="status"
          label="启动时间"
          sortable
          :formatter="formatterContainerStartTime"
        />
        <el-table-column
          prop="container.image"
          label="镜像"
          :formatter="formatterContainerImage"
          min-width="200px"
        />
      </el-table>
    </div>

    <div v-if="data.activeName === 'third'">
      <el-card class="app-docs" style="margin-top: 10px; height: 40px; margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          Pod 关联相关事件查询，更多查询请至事件中心
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 8px">
            <button class="pixiu-two-button" @click="getPodEvents">查询</button>
            <button
              style="margin-left: 10px; width: 85px"
              class="pixiu-two-button2"
              @click="handleDeleteDialog"
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
        style="margin-top: 25px"
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
      <pagination
        :total="data.eventData.pageEventInfo.total"
        @on-change="onEventChange"
      ></pagination>
    </div>
  </el-card>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import {
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue';
import { formatTimestamp, getTableData } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import {
  deleteEvent,
  getPodEventList,
  deleteEventsInBatch,
} from '@/services/kubernetes/eventService';
import Pagination from '@/components/pagination/index.vue';
import Echart from '@/components/echarts/index.vue';
import {
  formatString,
  formatterContainerImage,
  formatterNamespace,
  formatterPodStatus,
  formatterRestartCount,
  formatterTime,
} from '@/utils/formatter';
import { getPodMetrics } from '@/services/kubernetes/metricsService';
import { getPod } from '@/services/kubernetes/podService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: '',
  name: '',

  pod: {
    metadata: {},
    spec: {},
    status: {},
  },
  podContainers: [],

  activeName: 'first',

  createTime: '',

  monitorData: {
    timer: null,
    cpuOption: {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        },
      },
      title: {
        left: '18px',
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
        left: '18px',
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

  deleteDialog: {
    close: false,
    objectName: 'Event',
    deleteName: '',
    namespace: '',
  },

  eventData: {
    loading: false,

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
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetPod();
  getMetricsInfo(data.name, data.namespace);
});

onBeforeMount(() => {
  data.timer = window.setInterval(() => {
    getMetricsInfo(data.name, data.namespace);
  }, 3000);
});

onBeforeUnmount(() => {
  if (data.monitorData.timer) {
    window.clearInterval(ata.monitorData.timer);
  }
});

const GetPod = async () => {
  const [p, err] = await getPod(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.pod = p;
  data.createTime = formatTimestamp(data.pod.metadata.creationTimestamp);

  let containerStatus = {};
  for (let cs of data.pod.status.containerStatuses) {
    containerStatus[cs.name] = cs;
  }
  data.podContainers = [];
  for (let c of data.pod.spec.containers) {
    data.podContainers.push({
      container: c,
      status: containerStatus[c.name],
    });
  }
};

const getMetricsInfo = async (name, namespace) => {
  const [cpuUsage, memMetric, err] = await getPodMetrics(data.cluster, namespace, name);
  if (err) {
    return;
  }
  data.monitorData.cpuOption.series[0].data = cpuUsage;
  data.monitorData.memoryOption.series[0].data = memMetric;
};

const getPodEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getPodEventList(
    data.cluster,
    data.pod.metadata.uid,
    data.pod.metadata.namespace,
    data.pod.metadata.name,
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

const handleDeleteDialog = () => {
  if (data.eventData.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = 'events';
  data.deleteDialog.namespace = '';
};

const confirm = async () => {
  for (let event of data.eventData.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, event.namespace, event.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }
  cancel();

  proxy.$notify.success('批量删除事件成功');
  getPodEvents();
};

const cancel = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};

const goToPod = () => {
  const queryParams = { cluster: data.cluster };
  router.push({ path: '/kubernetes/pods', query: queryParams });
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
</script>
