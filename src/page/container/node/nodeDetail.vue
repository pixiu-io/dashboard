<template>
  <el-card class="contend-card-container2">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToNode">返回</button>
    </div>

    <el-space style="display: flex; margin: 20px 15px">
      <div style="display: flex; align-items: center; height: 100%">
        <pixiu-icon name="icon-rongqizu" size="75px" type="iconfont" color="#006eff" />
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

          <button class="pixiu-two-button2" style="margin-left: 10px" @click="handleLogDrawer">
            日志
          </button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="viewYaml"
          >
            查看YAML
          </button>

          <button
            class="pixiu-two-button2"
            style="margin-left: 10px; width: 85px"
            @click="handleRemoteLoginDialog"
          >
            远程登录
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

        <el-row>
          <el-col>
            <el-row :gutter="20">
              <el-col :span="8">
                <span class="detail-card-key-style">节点名称 </span>
                <span class="detail-card-value-style" style="margin-left: 55px">
                  {{ data.object.metadata.name }}</span
                >
              </el-col>
              <el-col :span="8">
                <el-row>
                  <span class="detail-card-key-style">容器运行时 </span>
                  <span class="detail-card-value-style">
                    {{ data.object.status.nodeInfo.containerRuntimeVersion }}
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
                <span class="detail-card-key-style">运行状态 </span>
                <span class="detail-card-value-style"> Running</span>
              </el-col>

              <el-col :span="8">
                <el-row>
                  <span class="detail-card-key-style">操作系统 </span>
                  <span class="detail-card-value-style">
                    {{ data.object.status.nodeInfo.osImage }}
                  </span>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <span class="detail-card-key-style">kubelet版本 </span>
                  <span class="detail-card-value-style">
                    {{ data.object.status.nodeInfo.kubeletVersion }}
                  </span>
                </el-row>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 15px">
              <el-col :span="8">
                <span class="detail-card-key-style">PodCIDRs </span>
                <span class="detail-card-value-style"> {{ data.object.spec.podCIDR }}</span>
              </el-col>

              <el-col :span="8">
                <span class="detail-card-key-style">内核版本 </span>
                <span class="detail-card-value-style">
                  {{ data.object.status.nodeInfo.kernelVersion }}</span
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-form style="margin-top: 30px">
          <el-form-item>
            <template #label>
              <span class="detail-card-key-style" style="font-size: 14px; color: #040000"
                >元数据
              </span>
            </template>
          </el-form-item>
        </el-form>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item style="margin-top: -15px">
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

          <el-col :span="12">
            <el-form-item style="margin-top: -10px">
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

    <div v-if="data.activeName === 'second'"></div>
  </el-card>
</template>

<script setup lang="jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getNode } from '@/services/kubernetes/nodeService';
import { getPodsByNode } from '@/services/kubernetes/podService';
import { getTableData, formatTimestamp } from '@/utils/utils';
import { formatterTime, formatString } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getRawEventList, deleteEvent } from '@/services/kubernetes/eventService';

const { proxy } = getCurrentInstance();

const data = reactive({
  name: '',
  cluster: '',

  activeName: 'first',

  object: {
    metadata: {},
    spec: {},
    status: {
      nodeInfo: '',
    },
  },
  createTime: '',

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

  crontab: false,
  nodePods: [],
  nodeEvents: [],

  nodeImages: [],

  tableData: [],
  eventTableData: [],

  yaml: '',
  yamlName: '',
  readOnly: true,
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.name = proxy.$route.query.name;

  GetNode();
});

const GetNode = async () => {
  const [result, err] = await getNode(data.cluster, data.name);
  if (err) {
    proxy.$notify.error({ title: 'Node', message: err.response.data.message });
    return;
  }
  data.object = result;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
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
