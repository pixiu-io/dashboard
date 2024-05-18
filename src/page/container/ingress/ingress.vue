<template>
  <!-- <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getIngresses"></PiXiuYaml>
    </div>
  </div> -->

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createIngress">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getIngresses">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getIngresses"
          @input="searchIngress"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getIngresses">
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
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="metadata" label="注解" :formatter="formatterAnno"> </el-table-column> -->
        <el-table-column
          prop="spec.rules"
          label="转发规则"
          min-width="120px"
          :formatter="formatterIngressRules"
        >
        </el-table-column>

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
        </el-table-column>

        <el-table-column prop="status" label="地址" :formatter="formatterAddress"></el-table-column>

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
              @click="editIngress(scope.row)"
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
    :refresh="getIngresses"
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
import {
  formatterTime,
  formatterIngressRules,
  formatterAddress,
  formatterNamespace,
} from '@/utils/formatter';
import { reactive, getCurrentInstance, onMounted, ref, onUnmounted } from 'vue';
import jsYaml from 'js-yaml';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  getIngressList,
  updateIngress,
  getIngress,
  deleteIngress,
} from '@/services/kubernetes/ingressService';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
  clusterName: '',
  namespace: 'default',

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

  ingressList: [],

  //  yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Ingress',
    deleteName: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  getIngresses();
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
      getIngresses();
    }
  }
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteIngress(
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
  await getIngresses();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 1000);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.ingressList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchIngress();
  }
};

const getIngresses = async () => {
  data.loading = true;
  const [res, err] = await getIngressList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.ingressList = res.items;
  data.pageInfo.total = data.ingressList.length;
  data.tableData = getTableData(data.pageInfo, data.ingressList);
};

const searchIngress = async () => {
  data.tableData = searchData(data.pageInfo, data.ingressList);
};

const createIngress = () => {
  const url = `/ingresses/createIngress?cluster=${data.cluster}`;
  router.push(url);
};

const editIngress = (row) => {
  const url = `/ingresses/editIngress?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getIngresses();
};

const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getIngress(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.yaml = jsYaml.dump(result, { quotingType: '"' });
  data.editYamlDialog = true;
};

const closeEditYamlDialog = (row) => {
  data.yaml = '';
  data.yamlName = '';
  data.editYamlDialog = false;
};

const confirmEditYaml = async () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  const [result, err] = await updateIngress(data.cluster, data.namespace, data.yamlName, yamlData);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Ingress(${data.yamlName}) YAML 更新成功`);

  closeEditYamlDialog();
  await getIngresses();
};
</script>

<style scoped="scoped"></style>
