<template>
  <div style="margin-top: 5px">
    <el-card class="app-docs" style="height: 40px; margin-top: 5px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        Event 是集群中某个事件的报告。它一般表示系统的某些状态变化。Event
        的保留时间有限，触发器和消息可能会随着时间的推移而演变。
      </div>
    </el-card>
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="getEvents">刷新</button>
        <button
          style="margin-left: 10px; width: 85px"
          class="pixiu-two-button2"
          @click="handleDeleteDialog"
        >
          批量删除
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getEvents"
          @input="getEvents"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getEvents">
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
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        header-row-class-name="pixiu-table-header"
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
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <!-- 分页区域 -->
      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    :bulk-delete="true"
    @confirm="deleteEventsInBatch"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { getTableData, searchData } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getNamespaceEventList, deleteEvent } from '@/services/kubernetes/eventService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: 'default',

  loading: false,

  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  tableData: [],
  eventList: [],

  multipleEventSelection: [],

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Event',
    deleteName: '',
  },
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.eventList);

  if (data.pageInfo.search.searchInfo !== '') {
    getEvents();
  }
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  getEvents();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleNamespaceChange);
});

onUnmounted(() => {
  window.removeEventListener('setItem', handleNamespaceChange);
});

const handleNamespaceChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取列表
      getEvents();
    }
  }
};

const handleEventSelectionChange = (events) => {
  data.multipleEventSelection = [];
  for (let event of events) {
    data.multipleEventSelection.push({
      name: event.metadata.name,
      namespace: event.metadata.namespace,
    });
  }
};

const deleteEventsInBatch = async () => {
  for (let event of data.multipleEventSelection) {
    const [result, err] = await deleteEvent(data.cluster, event.namespace, event.name);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
  }

  proxy.$notify.success('批量删除事件成功');
  clean();
  getEvents();
};

const getEvents = async () => {
  data.loading = true;
  const [result, err] = await getNamespaceEventList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.eventList = result;
  data.pageInfo.total = result.length;
  data.tableData = getTableData(data.pageInfo, data.eventList);
};

const handleDeleteDialog = (row) => {
  if (data.multipleEventSelection.length === 0) {
    proxy.$notify.warning('未选择待删除事件');
    return;
  }

  data.deleteDialog.close = true;
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
</script>

<style scoped="scoped">
.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}
</style>
