<template>
  <el-card class="title-card-container">
    <div class="font-container">ConfigMap</div>
    <PiXiuYaml></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createConfigMap">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getConfigMaps">
          刷新
        </button>
        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getConfigMaps"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getConfigMaps">
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
        :data="data.configMapsList"
        stripe
        style="margin-top: 2px; width: 100%"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#29292b',
        }"
      >
        <!-- <el-table-column type="selection" width="30" /> -->

        <el-table-column prop="metadata.name" sortable label="名称" width="auto">
          <template #default="scope">
            <el-link
              class="global-table-world"
              type="primary"
              style="margin-right: 2px"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>

            <el-tooltip content="复制">
              <pixiu-icon
                name="icon-copy"
                size="11px"
                type="iconfont"
                class-name="icon-box"
                color="#909399"
                @click="copy(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="Labels" width="auto">
          <span>-</span>
        </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />

        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editConfigMap(scope.row)"
            >
              更新配置
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="handleEditYamlDialog(scope.row)"
            >
              编辑yaml
            </el-button>
            <el-button
              link
              type="text"
              size="small"
              style="margin-right: 1px; margin-left: -2px; color: #006eff"
              @click="deleteConfigMap(scope.row)"
            >
              删除
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
      <div style="text-align: left; font-weight: bold; padding-left: 5px">编辑yaml</div>
    </template>
    <div style="margin-top: -18px"></div>
    <MyCodeMirror ref="editYaml" :yaml="data.yaml" :height="620"></MyCodeMirror>
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
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import jsYaml from 'js-yaml';
import { formatTimestamp } from '@/utils/utils';
import MyCodeMirror from '@/components/codemirror/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { updateConfigMap, getConfigMap } from '@/services/kubernetes/configmapService';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },
  loading: false,
  yaml: '',
  yamlName: '',
  namespace: 'default',
  namespaces: [],
  configMapsList: [],
  editYamlDialog: false,
  isShow: false,
  showTooltip: false, // 控制提示信息的显示状态，默认为隐藏
  showIcon: false, // 控制图标的显示状态，默认为隐藏
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaces();
  getConfigMaps();
});

const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;

  getConfigMaps();
};

const createConfigMap = () => {
  const url = `/kubernetes/configmaps/createConfigMap?cluster=${data.cluster}&namespace=${data.namespace}`;
  router.push(url);
};

const editConfigMap = (row) => {
  const url = `/kubernetes/configmaps/editConfigMap?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
};

const deleteConfigMap = (row) => {
  ElMessageBox.confirm('此操作将永久删除 ConfigMap ' + row.metadata.name + ' . 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      await proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/configmaps/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });
      await getConfigMaps();
    })
    .catch(() => {}); // 取消
};

const jumpRoute = (row) => {
  router.push({
    name: 'ConfigMapDetail',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      name: row.metadata.name,
    },
  });
};
const { toClipboard } = useClipboard();
const copy = async (val) => {
  try {
    await toClipboard(val.metadata.name);
    ElMessage({
      type: 'success',
      message: '已复制',
    });
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e.valueOf().toString(),
    });
  }
};

const getConfigMaps = async () => {
  data.loading = true;
  data.namespace = localStorage.getItem('namespace');
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/configmaps`,
    data: data.pageInfo,
  });

  data.loading = false;
  data.configMapsList = res.items;
  data.pageInfo.total = data.configMapsList.length;
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;
  getConfigMaps();
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getConfigMap(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.yaml = jsYaml.dump(result);
  data.editYamlDialog = true;
};

const closeEditYamlDialog = () => {
  data.editYamlDialog = false;
  data.yaml = '';
  data.yamlName = '';
};

const confirmEditYaml = async () => {
  const yamlData = jsYaml.load(editYaml.value.code);
  const [result, err] = await updateConfigMap(
    data.cluster,
    data.namespace,
    data.yamlName,
    yamlData,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Configmap(${data.yamlName}) YAML 更新成功`);
  closeEditYamlDialog();
  await getConfigMaps();
};
</script>

<style scoped="scoped">
.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.namespace-container {
  font-size: 14px;
  margin-top: -2px;
  margin-right: -60px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
}
.tooltip-copy {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
