<template>
  <el-card class="title-card-container">
    <div class="font-container">Tasks</div>
    <PiXiuYaml :refresh="getTasks"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
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

        <el-select
          v-model="data.namespace"
          filterable
          :filter-method="filterMethod"
          style="width: 200px; float: right; margin-right: 10px"
          @change="changeNamespace"
        >
          <el-option
            v-for="item in data.filterNamespaces"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
        <!-- <dev class="namespace-container" style="width: 112px; float: right">命名空间</dev> -->
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

        <el-table-column prop="metadata.namespace" label="命名空间" :formatter="formatterNamespace">
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

  <el-dialog
    :model-value="data.editYamlDialog"
    style="color: #000000; font: 14px; margin-top: 50px"
    width="800px"
    center
    @close="closeEditYamlDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">YAML 设置</div>
    </template>
    <div style="margin-top: -18px"></div>
    <MyCodeMirror ref="editYaml" :yaml="data.yaml" :height="650"></MyCodeMirror>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeEditYamlDialog">取消</el-button>
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmEditYaml"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

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
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { formatterImage, formatterNamespace, formatterTime } from '@/utils/formatter';
import { deleteTask, getTaskDetail, getTaskList, updateTask } from '@/services/cicd/tektonService';

import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import jsYaml from 'js-yaml';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { getTableData, searchData } from '@/utils/utils';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
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

  namespace: 'default',
  filterNamespaces: [],
  namespaces: [],

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

  getTasks();
});

const filterMethod = (f) => {
  if (f === undefined || f === '') {
    data.filterNamespaces = data.namespaces;
    return;
  }

  data.filterNamespaces = [];
  for (let item of data.namespaces) {
    if (item.includes(f)) {
      data.filterNamespaces.push(item);
    }
  }
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  await getTasks();
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
  data.yaml = jsYaml.dump(result);
  data.editYamlDialog = true;
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
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

const getTasks = async () => {
  data.loading = true;
  const [result, err] = await getTaskList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.taskList = result.items;
  data.pageInfo.total = data.taskList.length;
  data.tableData = getTableData(data.pageInfo, data.taskList);
};

const createTask = () => {
  const url = `/tasks/createTask?cluster=${data.cluster}`;
  router.push(url);
};

const jumpRoute = (row) => {
  router.push({
    name: 'createTaskRun',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      taskName: row.metadata.name,
    },
  });
};
</script>

<style scoped="scoped"></style>
