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
          @click="deleteEventsInBatch"
        >
          批量删除
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="syncStorageClasses"
          @input="searchStorageClassList"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="syncStorageClasses">
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
        @selection-change="handleSelectionChange"
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
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { getTableData, searchData } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getNamespaceEventList } from '@/services/kubernetes/eventService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
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

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'StorageClass',
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

  getEvents();
});

const getEvents = async () => {
  data.loading = true;
  const [result, err] = await getNamespaceEventList(data.cluster, 'default');
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
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteStorageClass(data.cluster, data.deleteDialog.deleteName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await syncStorageClasses();
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
