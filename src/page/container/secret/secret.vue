<template>
  <el-card class="title-card-container">
    <div class="font-container">Secret</div>
    <PiXiuYaml :cluster="data.cluster"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createSecret">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getSecrets">
          刷新
        </button>
        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getSecrets"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getSecrets">
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
        :data="data.secretList"
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

        <el-table-column label="类型" width="auto" prop="type"> </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />

        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button
              :disabled="
                scope.row.type !== 'kubernetes.io/dockercfg' &&
                scope.row.type !== 'Opaque' &&
                scope.row.type !== 'kubernetes.io/tls'
              "
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editSecret(scope.row)"
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
              @click="handleDeleteDialog(scope.row)"
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
    @close="closeYamlDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">编辑yaml</div>
    </template>
    <div style="margin-top: -18px"></div>
    <MyCodeMirror ref="editYaml" :yaml="data.yaml" :height="560"></MyCodeMirror>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeYamlDialog">取消</el-button>
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmEditYaml"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

  <pixiuDialog
    :closeEvent="data.deleteDialog.close"
    :objectName="data.deleteDialog.objectName"
    :deleteName="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import jsYaml from 'js-yaml';
import { formatTimestamp } from '@/utils/utils';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { updateSecret, getSecret, deleteSecret } from '@/services/kubernetes/secretService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

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
  secretList: [],
  editYamlDialog: false,
  isShow: false,
  showTooltip: false, // 控制提示信息的显示状态，默认为隐藏
  showIcon: false, // 控制图标的显示状态，默认为隐藏

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Secret',
    deleteName: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaces();
  getSecrets();
});

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteSecret(
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
  await getSecrets();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};

const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;

  getSecrets();
};

const createSecret = () => {
  const url = `/kubernetes/secrets/createSecret?cluster=${data.cluster}&namespace=${data.namespace}`;
  router.push(url);
};

const editSecret = (row) => {
  const url = `/kubernetes/secrets/editSecret?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
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

const getSecrets = async () => {
  data.loading = true;
  data.namespace = localStorage.getItem('namespace');
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/secrets`,
    data: data.pageInfo,
  });

  data.loading = false;
  data.secretList = res.items;
  data.pageInfo.total = data.secretList.length;
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;
  getSecrets();
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
  const [result, err] = await getSecret(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = jsYaml.dump(result);
  data.editYamlDialog = true;
};

const closeYamlDialog = () => {
  data.yaml = '';
  data.yamlName = '';
  data.editYamlDialog = false;
};

const confirmEditYaml = async () => {
  let yamlData = jsYaml.load(editYaml.value.code);
  const [result, err] = await updateSecret(data.cluster, data.namespace, data.yamlName, yamlData);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  closeYamlDialog();
  proxy.$message.success(`Secret(${data.yamlName}) YAML 更新成功`);
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
