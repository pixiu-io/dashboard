<template>
  <!-- <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getTasks"></PiXiuYaml>
    </div>
  </div> -->

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createTask">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getTasks">刷新</button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 400px; float: right"
          clearable
          @clear="getTasks"
          @input="searchTasks"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getTasks">
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
        <el-table-column prop="metadata.name" label="任务名称" min-width="100px">
          <template #default="scope">
            {{ scope.row.metadata.name }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>

        <el-table-column
          prop="spec.steps"
          label="镜像名称"
          :formatter="formatterImage"
          min-width="180px"
        >
        </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          :formatter="formatterTime"
        />

        <el-table-column fixed="right" label="操作" width="180px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="jumpRoute(scope.row)"
            >
              启动
            </el-button>

            <el-button
              size="small"
              type="text"
              style="color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
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

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getTasks"
  ></PiXiuViewOrEdit>

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
import { getCurrentInstance, onMounted, onUnmounted, reactive, ref } from 'vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  formatterIcon,
  formatterImage,
  formatterNamespace,
  formatterTime,
} from '@/utils/formatter';
import {
  createTaskRun,
  deleteTask,
  deleteTaskRun,
  getTaskDetail,
  getTaskList,
  getTaskRunList,
} from '@/services/cicd/tektonService';

import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import jsYaml from 'js-yaml';
import { getTableData, searchData } from '@/utils/utils';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();

const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: 'default',

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

  taskList: [],
  taskRunList: [],

  deleteDialog: {
    close: false,
    objectName: 'Task',
    deleteName: '',
  },

  yaml: '',
  yamlName: '',
  editYamlDialog: false,
});

const editYaml = ref();

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  window.addEventListener('setItem', handleStorageChange);

  getTasks();
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
      getTasks();
    }
  }
};

const searchTasks = async () => {
  data.tableData = searchData(data.pageInfo, data.taskList);
};
const confirmEditYaml = async () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  const [result, err] = await updateTask(data.cluster, data.namespace, data.yamlName, yamlData);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  proxy.$notify.success(`Task (${data.yamlName}) YAML 更新成功`);
  closeEditYamlDialog();
  await getTasks();
};

const closeEditYamlDialog = (row) => {
  data.yaml = '';
  data.yamlName = '';
  data.editYamlDialog = false;
};
const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getTaskDetail(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.yaml = result;
  data.editYamlDialog = true;
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const task = data.taskRunList.filter((task) => task.taskName === data.deleteDialog.deleteName);
  for (const taskElement of task) {
    const [result, err] = await deleteTaskRun(data.cluster, data.namespace, taskElement.runName);
    if (err) {
      proxy.$notify.error(err.response.data.message);
      return;
    }
    proxy.$notify.success(`TaskRun(${taskElement.runName}) 删除成功`);
  }

  const [result, err] = await deleteTask(
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
  await getTasks();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};

const getTaskRunStatus = async (name) => {
  const [res, err] = await getTaskRunList(data.cluster, data.namespace);

  for (const re of res.items) {
    let stats = {
      taskName: '',
      runName: '',
      status: '',
    };
    stats.runName = re.metadata.name;
    stats.taskName = re.spec.taskRef.name;
    stats.status = re.status.conditions[0].reason;
    data.taskRunList.push(stats);
  }
};

const getTasks = async () => {
  await getTaskRunStatus();
  data.loading = true;
  const [result, err] = await getTaskList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.taskList = result.items;
  data.taskList = [];
  for (const item of result.items) {
    const taskDetail = {
      metadata: {},
      spec: {
        steps: [],
      },
      status: '',
    };
    // let a = [{ runName: 'sys-hello', status: 'Succeeded', taskName: 'sys' }];
    const task = data.taskRunList.find((task) => task.taskName === item.metadata.name);
    if (typeof task == 'undefined') {
      taskDetail.status = 'notCreated';
    } else {
      taskDetail.status = task.status;
    }
    taskDetail.metadata = item.metadata;
    taskDetail.spec = item.spec;
    data.taskList.push(taskDetail);
  }
  data.pageInfo.total = data.taskList.length;
  data.tableData = getTableData(data.pageInfo, data.taskList);
};

const createTask = () => {
  const url = `/tasks/createTask?cluster=${data.cluster}`;
  router.push(url);
};

const jumpRoute = async (row) => {
  const objectForm = {
    apiVersion: 'tekton.dev/v1',
    kind: 'TaskRun',
    metadata: {
      namespace: 'default',
      generateName: row.metadata.name + '-r-',
    },
    spec: {
      serviceAccountName: 'default',
      taskRef: {
        name: row.metadata.name,
        kind: 'Task',
      },
      podTemplate: {
        nodeSelector: {},
      },
    },
  };

  const [result, err] = await createTaskRun(data.cluster, data.namespace, objectForm);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  proxy.$notify.success(`TaskRun (${result.metadata.name}) 创建成功`);
};

const formatStatus = (row) => {
  if (row.status === 'Succeeded') {
    return formatterIcon('#28C65A', '已完成');
  }
  if (row.status === 'Running') {
    return formatterIcon('#FFFF00', '在运行中');
  }
  if (row.status === 'notCreated') {
    return formatterIcon('#727272', '未创建');
  }
  if (row.status === 'Failed') {
    return formatterIcon('rgba(250,56,91,0.8)', '失败');
  }
  return formatterIcon('#FFFF00', row.status);
};
</script>

<style scoped="scoped"></style>
