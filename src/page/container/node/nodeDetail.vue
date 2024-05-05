<template>
  <el-card class="detail-card-container">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="getNodeObject">刷新</button>
    </div>

    <div style="display: flex; margin-left: 20px; margin-top: 15px">
      <pixiu-icon name="icon-jiedian" size="40px" type="iconfont" color="#006eff" />
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
              <span style="margin-left: 20px; font-size: 13px; color: #191919">节点名称 </span>
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
              <span style="margin-left: 20px; font-size: 13px; color: #191919">容器运行时 </span>
            </template>
            <span
              v-if="
                data.nodeObject.status &&
                data.nodeObject.status.nodeInfo &&
                data.nodeObject.status.nodeInfo.containerRuntimeVersion
              "
              class="detail-card-style-form2"
              style="margin-left: 93px"
            >
              {{ data.nodeObject.status.nodeInfo.containerRuntimeVersion }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">内核版本 </span>
            </template>
            <span
              v-if="
                data.nodeObject.status &&
                data.nodeObject.status.nodeInfo &&
                data.nodeObject.status.nodeInfo.kernelVersion
              "
              class="detail-card-style-form2"
              style="margin-left: 106px"
            >
              {{ data.nodeObject.status.nodeInfo.kernelVersion }}
            </span>
          </el-form-item>
        </el-form>
      </div>

      <div style="width: 50%">
        <el-form>
          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">创建时间</span>
            </template>
            <span
              v-if="data.nodeObject.metadata && data.nodeObject.metadata.creationTimestamp"
              class="detail-card-style-form2"
              style="margin-left: 106px"
            >
              {{ data.nodeObject.metadata.creationTimestamp }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">操作系统</span>
            </template>
            <span
              v-if="
                data.nodeObject.status &&
                data.nodeObject.status.nodeInfo &&
                data.nodeObject.status.nodeInfo.osImage
              "
              class="detail-card-style-form2"
              style="margin-left: 106px"
            >
              {{ data.nodeObject.status.nodeInfo.osImage }}
            </span>
          </el-form-item>

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">kubelet版本 </span>
            </template>
            <span
              v-if="
                data.nodeObject.status &&
                data.nodeObject.status.nodeInfo &&
                data.nodeObject.status.nodeInfo.kubeletVersion
              "
              class="detail-card-style-form2"
              style="margin-left: 90px"
            >
              {{ data.nodeObject.status.nodeInfo.kubeletVersion }}
            </span>
          </el-form-item>

          <!-- <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">kubeProxy版本 </span>
            </template>
            <span
              v-if="
                data.nodeObject.status &&
                data.nodeObject.status.nodeInfo &&
                data.nodeObject.status.nodeInfo.kubeProxyVersion
              "
              class="detail-card-style-form2"
              style="margin-left: 72px"
            >
              {{ data.nodeObject.status.nodeInfo.kubeProxyVersion }}
            </span>
          </el-form-item> -->

          <div style="margin-top: -12px"></div>
          <el-form-item>
            <template #label>
              <span style="margin-left: 20px; font-size: 13px; color: #191919">PodCIDRs </span>
            </template>
            <span
              v-if="data.nodeObject.spec && data.nodeObject.spec.podCIDR"
              class="detail-card-style-form2"
              style="margin-left: 100px"
            >
              {{ data.nodeObject.spec.podCIDR }}
            </span>
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
      <el-tab-pane label="Pod列表" name="first"> </el-tab-pane>
      <el-tab-pane label="标签信息" name="second"> </el-tab-pane>
      <el-tab-pane label="事件列表" name="third"></el-tab-pane>
      <el-tab-pane label="版本记录" name="four"> </el-tab-pane>
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
              运行在 node 上的 pod 实例列表
            </div>
          </el-card>

          <el-col>
            <button
              class="pixiu-two-button2"
              style="margin-left: 10px; width: 85px"
              @click="handleBatchDeleteDialog"
            >
              批量删除
            </button>

            <div style="margin-left: 8px; float: right; margin-left: 12px">
              <button class="pixiu-two-button" @click="getNodePods">搜索</button>
            </div>

            <el-input
              v-model="data.pageInfo.search.searchInfo"
              placeholder="名称搜索关键字"
              style="width: 480px; float: right"
              clearable
              @clear="getNodePods"
              @input="getNodePods"
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                  @click="getNodePods"
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
      <el-table
        v-loading="data.podData.loading"
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
        <el-table-column prop="metadata.name" label="实例名称" min-width="70px">
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
              <button
                style="margin-left: 10px; width: 85px"
                class="pixiu-two-button2"
                @click="deleteEventsInBatch"
              >
                批量删除
              </button>

              <div style="margin-left: 8px; float: right; margin-left: 12px">
                <button class="pixiu-two-button" @click="getNodeEvents">搜索</button>
              </div>

              <el-input
                v-model="data.pageInfo.search.searchInfo"
                placeholder="名称搜索关键字"
                style="width: 480px; float: right"
                clearable
                @clear="getNodeEvents"
                @input="getNodeEvents"
              >
                <template #suffix>
                  <pixiu-icon
                    name="icon-search"
                    style="cursor: pointer"
                    size="15px"
                    type="iconfont"
                    color="#909399"
                    @click="getNodeEvents"
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
      <el-table
        v-loading="data.eventData.loading"
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
        <el-table-column prop="involvedObject.name" label="资源名称" :formatter="formatString">
        </el-table-column>
        <el-table-column prop="count" label="出现次数"> </el-table-column>
        <el-table-column prop="message" label="内容" min-width="250px" />
        <template #empty>
          <div class="table-inline-word">该 workload 的事件列表为空</div>
        </template>
      </el-table>
      <pagination :total="data.pageEventInfo.total" @on-change="onEventChange"></pagination>
    </div>
  </el-card>
</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getNode } from '@/services/kubernetes/nodeService';
import { getPodsByNode } from '@/services/kubernetes/podService';
import { getTableData, copy } from '@/utils/utils';
import { formatterTime, formatString } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getRawEventList, deleteEvent } from '@/services/kubernetes/eventService';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  name: '',
  clusterName: '',
  cluster: '',

  pageInfo: {
    page: 1,
    total: 0,
    limit: 5,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  podData: {
    loading: false,
  },

  eventData: {
    loading: false,
  },
  pageEventInfo: {
    page: 1,
    limit: 5,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  nodeObject: '',

  crontab: false,
  nodePods: [],
  nodeEvents: [],

  nodeImages: [],

  tableData: [],
  eventTableData: [],

  activeName: 'first',

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);
  data.name = proxy.$route.query.name;

  getNodeObject();
  getNodePods();
  getNodeEvents();
});

const getNodeObject = async () => {
  const [result, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.nodeObject = result;
  data.yaml = jsYaml.dump(data.nodeObject, { quotingType: '"' });

  if (data.nodeObject.status.images !== undefined) {
    for (let image of data.nodeObject.status.images) {
    }
  }
};

const getNodePods = async () => {
  data.podData.loading = true;
  const [result, err] = await getPodsByNode(data.cluster, data.name);
  data.podData.loading = false;
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.nodePods = result.items;
  data.pageInfo.total = result.items.length;
  data.tableData = getTableData(data.pageInfo, data.nodePods);
};

const searchPods = async () => {
  let allSearchedPods = [];
  if (data.pageInfo.search.field === 'name') {
    for (let pod of data.nodePods) {
      if (pod.metadata.name.search(data.pageInfo.search.searchInfo) !== -1) {
        allSearchedPods.push(pod);
      }
    }
  }

  data.pageInfo.total = allSearchedPods.length;
  data.tableData = getTableData(data.pageInfo, allSearchedPods);
};

const getNodeEvents = async () => {
  const [result, err] = await getRawEventList(
    data.cluster,
    data.nodeObject.metadata.name,
    '',
    data.nodeObject.metadata.name,
    'Node',
    false,
  );
  if (err) {
    proxy.$notify.error({ title: 'Event', message: err.response.data.message });
    return;
  }

  data.nodeEvents = result;
  data.pageEventInfo.total = result.length;
  data.eventTableData = getTableData(data.pageEventInfo, data.nodeEvents);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  data.tableData = getTableData(data.pageInfo, data.nodePods);
};

const onEventChange = (v) => {
  data.pageEventInfo.limit = v.limit;
  data.pageEventInfo.page = v.page;

  data.eventTableData = getTableData(data.pageEventInfo, data.nodeEvents);
};

const formatterStatus = (row, column, cellValue) => {
  let phase = cellValue.phase;
  if (phase == 'Failed') {
    phase = cellValue.reason;
  } else if (phase == 'Pending') {
    return <div class="color-yellow-word">{phase}</div>;
  }

  if (phase == 'Running') {
    return <div class="color-green-word">{phase}</div>;
  }
  return <div>{phase}</div>;
};

const getPodRestartCount = (row, column, status) => {
  let count = 0;
  // status.containerStatuses.forEach((item) => {
  //   count += item.restartCount;
  // });
  return <div>{count} 次</div>;
};

const handleClick = (tab, event) => {};
const handleChange = (name) => {};

const confirm = () => {
  data.readOnly = true;
};

const cancel = () => {
  data.readOnly = true;
};

const editYaml = () => {
  data.readOnly = false;
};

const goToNode = () => {
  proxy.$router.push({
    name: 'Node',
    query: { cluster: data.cluster },
  });
};
</script>

<style scoped="scoped"></style>
