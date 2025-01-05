<template>
  <el-card class="contend-card-container2" style="margin-top: 1px">
    <div style="margin-top: 10px; float: right">
      <button class="pixiu-two-button2" style="width: 60px" @click="goToService">返回</button>
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
          <button class="pixiu-two-button" @click="GetService">刷新</button>

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
      class="namespace-tab"
      style="margin-left: 10px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="基本信息" name="first"> </el-tab-pane>
      <el-tab-pane label="服务详情" name="second"> </el-tab-pane>
      <el-tab-pane label="事件" name="third"> </el-tab-pane>
    </el-tabs>

    <div v-if="data.activeName === 'first'">
      <el-form style="margin-top: 10px">
        <el-form-item>
          <template #label>
            <span
              class="detail-card-key-style"
              style="font-size: 14px; color: black; font-weight: bold"
              >实例信息
            </span>
          </template>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <span class="detail-card-key-style">实例名称 </span>
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
            <span class="detail-card-key-style">类型 </span>
            <span class="detail-card-value-style"> {{ data.object.spec.type }}</span>
          </el-col>
          <el-col :span="8">
            <el-row>
              <span class="detail-card-key-style">服务IP </span>
              <span class="detail-card-value-style">
                {{ data.object.spec.clusterIP }}
              </span>
            </el-row>
          </el-col>
        </el-row>

        <div style="margin-top: 20px"></div>

        <el-form-item>
          <template #label>
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000">标签 </span>
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
            <span class="detail-card-key-style" style="font-size: 14px; color: #040000">注释 </span>
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
    </div>

    <div v-if="data.activeName === 'second'">
      <div style="margin-top: 10px">
        <span class="detail-card-key-style">集群域名 </span>
        <span class="detail-card-value-style" style="margin-left: 15px">
          {{ data.object.metadata.name }}.{{ data.namespace }}</span
        >
      </div>

      <el-table
        v-loading="data.loading"
        :data="data.object.spec.ports"
        style="margin-top: 10px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
      >
        <el-table-column prop="name" label="端口名称" />
        <el-table-column prop="port" label="服务端口" />
        <el-table-column prop="protocol" label="协议"> </el-table-column>
        <el-table-column prop="targetPort" label="目标端口"> </el-table-column>
      </el-table>

      <el-card class="detail-docs" style="margin-left: 10px; margin-top: 30px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          管理关联在 Service 上的 pod 实例
        </div>
      </el-card>

      <el-row>
        <el-col>
          <div style="margin-left: 10px">
            <button class="pixiu-two-button" @click="GetServicePods">查询</button>
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
    </div>

    <div v-if="data.activeName === 'third'">
      <el-card class="detail-docs" style="margin-left: 10px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          Service 关联事件查询，更多查询请至事件中心
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
  </el-card>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirmDeletePod"
    @cancel="cancelDeletePod"
  ></pixiuDialog>

  <pixiuDialog
    :close-event="data.deleteEventDialog.close"
    :object-name="data.deleteEventDialog.objectName"
    :delete-name="data.deleteEventDialog.deleteName"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  ></pixiuDialog>

  <PiXiuViewOrEdit
    :yaml-dialog="data.yamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="GetService"
  ></PiXiuViewOrEdit>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatTimestamp, getTableData } from '@/utils/utils';
import { formatterTime, formatterPodStatus, formatterRestartCount } from '@/utils/formatter';
import useClipboard from 'vue-clipboard3';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { getService } from '@/services/kubernetes/serviceService';
import { getPodsByLabels, deletePod } from '@/services/kubernetes/podService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import { getServiceEventList, deleteEvent } from '@/services/kubernetes/eventService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: '',
  name: '',

  createTime: '',

  object: {
    metadata: {},
    spec: {},
    status: {},
  },

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

  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
    namespace: '',
  },

  activeName: 'first',

  // 删除对象属性
  deleteEventDialog: {
    close: false,
    objectName: 'events',
    deleteName: 'events',
    namespace: '',
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
});

onMounted(async () => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
  data.name = proxy.$route.query.name;

  GetService();
});

const { toClipboard } = useClipboard();

const GetService = async () => {
  const [res, err] = await getService(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.object = res;
  data.createTime = formatTimestamp(data.object.metadata.creationTimestamp);
};

const goToService = () => {
  const queryParams = { cluster: data.cluster, namespace: data.namespace };
  router.push({ path: '/kubernetes/services', query: queryParams });
};

// pod 列表开始
const GetServicePods = async () => {
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
  data.podData.tableData = getTableData(data.podData.pageInfo, data.podData.pods);
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
  cancelDeletePod();

  setTimeout(() => {
    GetServicePods();
  }, 100);
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
  data.deleteDialog.namespace = row.metadata.namespace;
};

const cancelDeletePod = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};
// pod 列表结束

// 编辑 yaml 开始
const viewYaml = async () => {
  const [obj, err] = await getService(data.cluster, data.namespace, data.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.yaml = obj;
  data.yamlDialog = true;
};
// 编辑 yaml 结束

// 事件处理开始
const GetEvents = async () => {
  data.eventData.loading = true;
  const [result, err] = await getServiceEventList(
    data.cluster,
    data.object.metadata.uid,
    data.object.metadata.namespace,
    data.object.metadata.name,
  );
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

const handleChange = async (name) => {
  if (name === 'second') {
    GetServicePods();
  } else {
    data.podData.pods = [];
    data.podData.tableData = [];
  }
  if (name === 'third') {
    GetEvents();
  } else {
    data.eventData.events = [];
    data.eventData.eventTableData = [];
  }
};
</script>

<style scoped="scoped"></style>
