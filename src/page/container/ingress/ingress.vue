<template>
  <el-card class="title-card-container">
    <div class="font-container">Ingress</div>
    <PiXiuYaml :refresh="getIngresses"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
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
          color: '#29292b',
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
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import {
  getIngressList,
  updateIngress,
  getIngress,
  deleteIngress,
} from '@/services/kubernetes/ingressService';
import MyCodeMirror from '@/components/codemirror/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
  clusterName: '',

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

  getIngresses();
  getNamespaceList();
});

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
  data.deleteDialog.deleteName = '';
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

  data.yaml = jsYaml.dump(result);
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

const formatterAnno = (row, column, cellValue) => {
  if (cellValue.annotations === undefined) {
    return <div>-</div>;
  }

  const annotations = Object.entries(cellValue.annotations).map(([key, value]) => {
    return `${key}: ${value}`;
  });
  return (
    <div>
      {annotations.map((anno) => (
        <div class="pixiu-table-formatter">{anno}</div>
      ))}
    </div>
  );
};

const formatterAddress = (row, column, cellValue) => {
  if (
    cellValue === undefined ||
    cellValue.loadBalancer === undefined ||
    cellValue.loadBalancer.ingress === undefined ||
    cellValue.loadBalancer.ingress.length === 0
  ) {
    return <div class="pixiu-table-formatter">-</div>;
  }

  const ingress = cellValue.loadBalancer.ingress;
  return (
    <div>
      {ingress.map((ing) => (
        <div class="pixiu-table-formatter">{ing}</div>
      ))}
    </div>
  );
};

const formatterIngressRules = (row, column, cellValue) => {
  let ingress = [];
  for (let item of cellValue) {
    const host = item.host;
    for (let path of item.http.paths) {
      const ingressPath = path.path;
      const name = path.backend.service.name;
      const port = path.backend.service.port.number;
      if (ingressPath === undefined || ingressPath === '/') {
        ingress.push(`${host} -> ${name}:${port}`);
      } else {
        ingress.push(`${host}${ingressPath} -> ${name}:${port}`);
      }
    }
  }
  return (
    <div>
      {ingress.map((ing) => (
        <div class="pixiu-table-formatter">{ing}</div>
      ))}
    </div>
  );
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
};
</script>

<style scoped="scoped"></style>
