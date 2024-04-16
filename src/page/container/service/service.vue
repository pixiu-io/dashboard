<template>
  <el-card class="title-card-container">
    <div class="font-container">Service</div>
    <PiXiuYaml :refresh="getServices"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createService">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getServices">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getServices"
          @input="searchService"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getServices">
              <component :is="'Search'" />
            </el-icon>
          </template>
        </el-input>

        <el-select
          v-model="data.namespace"
          style="width: 200px; float: right; margin-right: 10px"
          @change="changeNamespace"
        >
          <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
        </el-select>
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
        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="spec.type" label="类型"> </el-table-column>
        <el-table-column label="访问入口" prop="spec.clusterIP"> </el-table-column>
        <el-table-column prop="spec.ports" label="端口组" :formatter="formatterPorts">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="170px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editService(scope.row)"
            >
              设置
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: -25px; margin-left: 8px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="handleEditYamlDialog(scope.row)"
            >
              YAML 设置
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

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getServices"
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
import { getTableData, searchData } from '@/utils/utils';
import { formatterTime, formatterPorts } from '@/utils/formatter';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import MyCodeMirror from '@/components/codemirror/index.vue';
import {
  getServiceList,
  updateService,
  getService,
  deleteService,
} from '@/services/kubernetes/serviceService';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
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
  loading: false,

  namespace: 'default',
  namespaces: [],
  serviceList: [],

  //  yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Service',
    deleteName: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getServices();
  getNamespaces();
});

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteService(
    data.cluster,
    data.namespace,
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
  await getServices();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.serviceList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchSecrets();
  }
};

const createService = () => {
  const url = `/services/createService?cluster=${data.cluster}`;
  router.push(url);
};

const editService = (row) => {
  const url = `/services/editService?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getService(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.yaml = result;
  data.editYamlDialog = true;
};

const getServices = async () => {
  data.loading = true;
  const [result, err] = await getServiceList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.serviceList = result.items;
  data.pageInfo.total = data.serviceList.length;
  data.tableData = getTableData(data.pageInfo, data.serviceList);
};

const searchService = async () => {
  data.tableData = searchData(data.pageInfo, data.serviceList);
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getServices();
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const jumpRoute = (row) => {
  router.push({
    name: 'ServiceDetail',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      name: row.metadata.name,
    },
  });
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
