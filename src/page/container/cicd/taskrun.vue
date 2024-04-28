<template>
  <!-- <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getTaskRuns"></PiXiuYaml>
    </div>
  </div> -->
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createTaskRunPage">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getTaskRuns">
          刷新
        </button>
        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 400px; float: right"
          clearable
          @clear="getTaskRuns"
          @input="searchTaskRuns"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getTaskRuns">
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="任务名称" min-width="100px">
          <template #default="scope">
            {{ scope.row.metadata.name }}
          </template>
        </el-table-column>

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus"> </el-table-column>
        <el-table-column prop="spec.taskRef.name" label="Task" />

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
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
            <el-button
              size="small"
              type="text"
              style="margin-right: -1px; margin-left: 5px; color: #006eff"
              @click="handleReset(scope.row)"
            >
              重新运行
            </el-button>
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
</template>
<script setup>
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import {
  createTaskRun,
  deleteTaskRun,
  getTaskRunDetail,
  getTaskRunList,
  updateTaskRun,
} from '@/services/cicd/tektonService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

import { getCurrentInstance, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  formatterIcon,
  formatterImage,
  formatterNamespace,
  formatterPodStatus,
  formatterTime,
} from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getTableData, searchData } from '@/utils/utils';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();
const data = reactive({
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
  cluster: '',
  namespace: 'default',
  namespaces: [],
  taskRunsList: [],
  editYamlDialog: false,
  deleteDialog: {
    close: false,
    objectName: 'TaskRun',
    deleteName: '',
  },
});
const router = useRouter();
const editYaml = ref();

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  getTaskRuns();
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
      getTaskRuns();
    }
  }
};

const createTaskRunPage = () => {
  const url = `/taskruns/createTaskRun?cluster=${data.cluster}`;
  router.push(url);
};

const getTaskRuns = async () => {
  data.loading = true;
  const [result, err] = await getTaskRunList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.taskRunsList = result.items;
  data.pageInfo.total = data.taskRunsList.length;
  data.tableData = getTableData(data.pageInfo, data.taskRunsList);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.taskRunsList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchTaskRuns;
  }
};

const searchTaskRuns = async () => {
  data.tableData = searchData(data.pageInfo, data.taskRunsList);
};

const handleDeleteDialog = async (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};
const clean = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};
const cancel = () => {
  clean();
};
const confirm = async () => {
  const [result, err] = await deleteTaskRun(
    data.cluster,
    data.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  proxy.$notify.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await getTaskRuns();
};

const formatStatus = (row, column, cellValue) => {
  if (row.status.conditions) {
    let reason = row.status.conditions[0].reason;
    if (reason === 'Succeeded') {
      return formatterIcon('#28C65A', reason);
    }
    if (reason === 'Failed') {
      return formatterIcon('rgba(250,56,91,0.8)', reason);
    }
    return formatterIcon('#FFFF00', reason);
  }
  return null;
};
const handleReset = async (row) => {
  const str = row.metadata.name;
  const array = str.split('-');
  let objectForm = reactive({
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      namespace: 'default',
      generateName: array[0] + '-r-',
    },
    spec: {
      serviceAccountName: 'default',
      taskRef: {
        name: row.spec.taskRef.name,
        kind: row.spec.taskRef.kind,
      },
    },
  });
  const [result, err] = await createTaskRun(data.cluster, data.namespace, objectForm);
  await getTaskRuns();
};
</script>
<style scoped="scoped">
.info-tooltip {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px; /* 设置一个最大宽度 */
  display: inline-block;
  vertical-align: bottom;
}
</style>
