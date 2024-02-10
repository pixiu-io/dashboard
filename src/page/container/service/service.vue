<template>
  <el-card class="title-card-container">
    <div class="font-container">Service</div>
    <PiXiuYaml></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createService">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getServices">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getServices"
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
        :data="data.serviceList"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#29292b',
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
              @click="deleteService(scope.row)"
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

  <!-- 编辑 yaml 页面 -->
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
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { formatTimestamp } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import jsYaml from 'js-yaml';
import { getNamespaceList } from '@/services/kubernetes/namespaceService';
import MyCodeMirror from '@/components/codemirror/index.vue';
import { updateService, getService } from '@/services/kubernetes/serviceService';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 100,
  },
  loading: false,

  namespace: 'default',
  namespaces: [],
  serviceList: [],

  //  yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getServices();
  getNamespaces();
});

const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;

  getServices();
};

const createService = () => {
  const url = `/kubernetes/services/createService?cluster=${data.cluster}&namespace=${data.namespace}`;
  router.push(url);
};

const editService = (row) => {
  const url = `/kubernetes/services/editService?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getService(data.cluster, data.namespace, data.yamlName);
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
  const [result, err] = await updateService(data.cluster, data.namespace, data.yamlName, yamlData);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Service(${data.yamlName}) YAML 更新成功`);

  closeEditYamlDialog();
  await getServices();
};

const getServices = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/services`,
    data: data.pageInfo,
  });

  data.loading = false;
  data.serviceList = res.items;
  data.pageInfo.total = data.serviceList.length;
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getServices();
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceList(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  for (let item of result.items) {
    data.namespaces.push(item.metadata.name);
  }
};

const deleteService = (row) => {
  ElMessageBox.confirm('此操作将永久删除 ' + row.metadata.name + 'Service . 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      await proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/services/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });

      await getServices();
    })
    .catch(() => {}); // 取消
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
};

const formatterPorts = (row, column, cellValue) => {
  let ports = [];
  for (let item of cellValue) {
    ports.push(`${item.port}/${item.protocol}`);
  }
  return <div>{ports.join(',')}</div>;
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
