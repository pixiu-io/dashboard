<template>
  <!-- <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getSecrets"></PiXiuYaml>
    </div>
  </div> -->
  <Description
    :description="'Secret 是一种包含少量敏感信息例如密码、令牌或密钥的对象。 这样的信息可能会被放在 Pod 规约中或者镜像中。 使用 Secret 意味着你不需要在应用程序代码中包含机密数据。'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createSecret">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getSecrets">
          刷新
        </button>
        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getSecrets"
          @input="searchSecrets"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getSecrets">
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
      >
        <!-- <el-table-column type="selection" width="30" /> -->

        <el-table-column prop="metadata.name" sortable label="名称" min-width="110px">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              style="margin-right: 2px"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="auto" prop="type" :formatter="formatString">
        </el-table-column>

        <el-table-column
          v-if="data.namespace === '全部空间'"
          prop="metadata.namespace"
          label="命名空间"
          :formatter="formatterNamespace"
        >
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

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getSecrets"
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
import { reactive, getCurrentInstance, onMounted, ref, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import { getTableData, searchData } from '@/utils/utils';
import { formatterTime, formatString, formatterNamespace } from '@/utils/formatter';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import Pagination from '@/components/pagination/index.vue';
import { getSecretList, getSecret, deleteSecret } from '@/services/kubernetes/secretService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { updateConfigMap } from '@/services/kubernetes/configmapService';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();
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
  yaml: '',
  yamlName: '',

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

  data.namespace = getLocalNamespace();
  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  getSecrets();
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
      getSecrets();
    }
  }
};

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
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  data.tableData = getTableData(data.pageInfo, data.secretList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchSecrets();
  }
};

const createSecret = () => {
  const url = `/secrets/createSecret?cluster=${data.cluster}`;
  router.push(url);
};

const editSecret = (row) => {
  const url = `/secrets/editSecret?cluster=${data.cluster}&name=${row.metadata.name}`;
  router.push(url);
};

const jumpRoute = (row) => {
  router.push({
    name: 'SecretDetail',
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
  const [res, err] = await getSecretList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.secretList = res.items;
  data.pageInfo.total = data.secretList.length;
  data.tableData = getTableData(data.pageInfo, data.secretList);
};

const searchSecrets = async () => {
  data.tableData = searchData(data.pageInfo, data.secretList);
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getSecret(data.cluster, data.namespace, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = result;
  data.editYamlDialog = true;
};
</script>

<style scoped="scoped">
.icon-box {
  padding: 3px;
  margin-top: -1px;
}
</style>
