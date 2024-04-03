<template>
  <el-card class="title-card-container">
    <div class="font-container">Pod</div>
    <PiXiuYaml :refresh="getPods"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createPod">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getPods">刷新</button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 400px; float: right"
          clearable
          @clear="getPods"
          @input="searchPods"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getPods">
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
        <el-table-column prop="metadata.name" sortable label="实例名称" min-width="100px">
          <template #default="scope">
            {{ scope.row.metadata.name }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterPodStatus" />

        <el-table-column prop="metadata.namespace" label="命名空间" :formatter="formatterNamespace">
        </el-table-column>

        <el-table-column prop="status.podIP" label="实例IP"> </el-table-column>

        <el-table-column prop="status.hostIP" sortable label="所在节点">
          <template #default="scope">
            <div style="display: flex">
              <div>
                {{ scope.row.status.hostIP }}
              </div>
              <div style="margin-left: 5px">
                <pixiu-icon
                  name="icon-share"
                  style="cursor: pointer"
                  size="12px"
                  type="iconfont"
                  color="#191919"
                />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartCount" />

        <!-- <el-table-column label="镜像" prop="spec.containers" :formatter="formatterImage" /> -->

        <!-- <el-table-column
          prop="spec.containers"
          label="CPU申请值/限制值"
          :formatter="formatterContainersCPU"
        />
        <el-table-column
          prop="spec.containers"
          label="内存申请值/限制值"
          :formatter="formatterContainersMem"
        /> -->

        <el-table-column
          prop="spec.containers"
          label="资源申请值/限制值"
          :formatter="formatterContainersResource"
        />

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
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
            >
              监控
            </el-button>

            <el-button type="text" size="small" style="color: #006eff"> 事件 </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item class="dropdown-item-buttons"> 详情 </el-dropdown-item>
                  <el-dropdown-item class="dropdown-item-buttons"> 查看YAML </el-dropdown-item>
                  <el-dropdown-item class="dropdown-item-buttons"> 日志 </el-dropdown-item>

                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleRemoteLoginDialog(scope.row)"
                  >
                    远程登陆
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleContainerListDialog(scope.row)"
                  >
                    容器列表
                  </el-dropdown-item>

                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleDeleteDialog(scope.row)"
                  >
                    删除
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

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>

  <el-dialog
    :model-value="data.remoteLogin.close"
    style="color: #000000; font: 14px"
    width="500px"
    align-center
    center
    @close="cancelRemoteLogin"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
          color: #191919;
        "
      >
        远程登录
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">基于 WebShell 提供登陆容器的功能</div>
    </el-card>

    <el-form>
      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">容器名称</span>
        </template>

        <el-select
          v-model="data.remoteLogin.container"
          style="margin-left: 25px; width: 300px"
          @change="changeContainer"
        >
          <el-option
            v-for="item in data.remoteLogin.containers"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">Command</span>
        </template>

        <el-radio-group v-model="data.remoteLogin.command" style="margin-left: 15px">
          <el-radio label="/bin/sh">
            <span style="font-size: 13px">/bin/sh</span>
          </el-radio>
          <el-radio label="/bin/bash"> <span style="font-size: 13px"> /bin/bash</span></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="margin-top: -25px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelRemoteLogin">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmRemoteLogin"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>

  <PiXiuViewOrEdit :yaml-dialog="data.yamlDialog" :yaml="data.yaml"></PiXiuViewOrEdit>

  <el-dialog
    :model-value="data.podContainers.close"
    style="color: #000000; font: 14px"
    align-center
    center
    @close="cancelpodContainers"
  >
    <template #header>
      <div
        style="
          text-align: left;
          font-weight: bold;
          padding-left: 5px;
          margin-top: 5px;
          font-size: 14.5px;
          color: #191919;
        "
      >
        容器列表
      </div>
    </template>

    <el-card class="app-docs" style="margin-top: -10px; height: 40px">
      <el-icon
        style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
        ><WarningFilled
      /></el-icon>
      <div style="vertical-align: middle; margin-top: -40px">
        Pod 所包含的容器列表。支持指定镜像的直接更新
      </div>
    </el-card>
    <div style="margin-top: -10px" />

    <el-table
      v-loading="data.podContainers.loading"
      :data="data.podContainers.containers"
      stripe
      style="margin-top: 2px"
      header-row-class-name="pixiu-table-header"
      :cell-style="{
        'font-size': '12px',
        color: '#191919',
      }"
    >
      <el-table-column prop="metadata.name" sortable label="容器名称"> </el-table-column>

      <el-table-column prop="status" label="状态" />

      <el-table-column prop="status" label="重启次数" />

      <el-table-column
        prop="metadata.creationTimestamp"
        label="创建时间"
        :formatter="formatterTime"
      />

      <el-table-column label="镜像" />
    </el-table>

    <div style="margin-top: -5px" />

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-delete-cancel-button" @click="cancelpodContainers">取消</el-button>
        <el-button type="primary" class="pixiu-delete-confirm-button" @click="confirmpodContainers"
          >确认</el-button
        >
      </span>
      <div style="margin-bottom: 10px" />
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getTableData, searchData } from '@/utils/utils';
import {
  formatterTime,
  formatterPodStatus,
  formatterRestartCount,
  formatterNamespace,
  formatterContainersCPU,
  formatterContainersMem,
  formatterContainersResource,
} from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { getPodList, deletePod, getPodByName, getPod } from '@/services/kubernetes/podService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getNode } from '@/services/kubernetes/nodeService';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { toClipboard } = useClipboard();
const { proxy } = getCurrentInstance();
const router = useRouter();

const selectedContainers = ref([]);
const selectedContainer = ref('');
const selectedPod = ref('');

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
  multipleSelection: [],
  yamlDialog: false,
  yaml: '',

  namespace: 'default',
  filterNamespaces: [],
  namespaces: [],

  podList: [],

  podReplicasDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
  },

  remoteLogin: {
    close: false,
    pod: '',
    container: '',
    containers: [],
    command: '/bin/sh',
  },

  podContainers: {
    close: false,
    podName: '',
    containers: [],
  },
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.podList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchPods();
  }
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getPods();
  getNamespaces();
});

const createPod = () => {
  const url = `/pods/createPod?cluster=${data.cluster}`;
  router.push(url);
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const cancelRemoteLogin = () => {
  data.remoteLogin.close = false;
  data.remoteLogin.container = '';
  data.remoteLogin.containers = [];
  data.remoteLogin.pod = '';
  data.remoteLogin.command = '/bin/sh';
};

const confirmRemoteLogin = () => {
  window.open(
    '/#/podshell?pod=' +
      data.remoteLogin.pod +
      '&namespace=' +
      data.namespace +
      '&cluster=' +
      data.cluster +
      '&container=' +
      data.remoteLogin.container +
      '&command=' +
      data.remoteLogin.command,
    '_blank',
    'width=1000,height=600',
  );
  cancelRemoteLogin();
};

const handleRemoteLoginDialog = (row) => {
  data.remoteLogin.close = true;
  data.remoteLogin.pod = row.metadata.name;
  data.remoteLogin.containers = [];
  for (let c of row.spec.containers) {
    data.remoteLogin.containers.push(c.name);
  }
  if (data.remoteLogin.containers.length >= 1) {
    data.remoteLogin.container = data.remoteLogin.containers[0];
  }
};

const handleContainerListDialog = async (row) => {
  const [pod, err] = await getPod(data.cluster, data.namespace, row.metadata.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  let containerStatus = {};
  for (let cs of pod.status.containerStatuses) {
    containerStatus[cs.name] = cs;
  }
  for (let c of pod.spec.containers) {
    data.podContainers.containers.push({
      container: c,
      status: containerStatus[c.name],
    });
  }

  data.podContainers.close = true;
};

const cancelpodContainers = () => {
  data.podContainers.close = false;
};
const confirmpodContainers = () => {
  data.podContainers.close = false;
};

const confirm = async () => {
  const [result, err] = await deletePod(data.cluster, data.namespace, data.deleteDialog.deleteName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await getPods();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};

const jumpRoute = (row) => {
  router.push({
    name: 'PodDetail',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      name: row.metadata.name,
    },
  });
};

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

const handleSelectionChange = (pods) => {
  data.multipleSelection = [];
  for (let pod of pods) {
    data.multipleSelection.push(pod.metadata.name);
  }
};

const getPods = async () => {
  data.loading = true;
  const [result, err] = await getPodList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.podList = result.items;
  data.pageInfo.total = data.podList.length;
  data.tableData = getTableData(data.pageInfo, data.podList);
};

const searchPods = async () => {
  data.tableData = searchData(data.pageInfo, data.podList);
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getPods();
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
  data.filterNamespaces = result;
};

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

const copyIP = async (val) => {
  try {
    if (val.status.podIP === undefined) {
      ElMessage({
        type: 'warning',
        message: '数据为空，无法复制',
      });
      return;
    }

    await toClipboard(val.status.podIP);
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

const openShell = (val) => {
  selectedPod.value = val.metadata.name;
  selectedContainers.value = val.spec.containers;
  if (val.spec.containers.length > 1) {
    showDialog.value = true;
  } else {
    openWindowShell();
  }
};

const openWindowShell = () => {
  window.open(
    '/#/podshell?pod=' +
      selectedPod.value +
      '&namespace=' +
      data.namespace +
      '&cluster=' +
      data.cluster +
      '&container=' +
      selectedContainer.value,
    '_blank',
    'width=1000,height=600',
  );
};

const viewYaml = async (row) => {
  const [result, err] = await getPodByName(data.cluster, data.namespace, row.metadata.name);
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }
  data.yamlDialog = true;
  data.yaml = result;
};
</script>

<style scoped="scoped">
.namespace-container {
  font-size: 14px;
  margin-top: -2px;
  /* margin-left: 10px; */
  margin-right: -60px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
}
</style>
