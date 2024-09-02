<template>
  <Description
    :description="'StatefulSet 是 Kubernetes 中用来管理有状态应用的资源对象。它可以保证应用的持久化存储，即使 StatefulSet 中的 Pod 被重新调度，也能保证数据不丢失。'"
  />

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createStatefulSet">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getStatefulsets">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getStatefulsets"
          @input="getStatefulsets"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getStatefulsets"
            />
          </template>
        </el-input>
        <div style="float: right">
          <el-switch
            v-model="data.autoRefresh"
            inline-prompt
            width="36px"
            @change="startAutoRefresh"
          /><span style="font-size: 13px; margin-left: 5px; margin-right: 10px">自动刷新</span>
        </div>
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

        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="spec.template.metadata.labels"
          label="Labels"
          :formatter="formatterLabels"
        />

        <el-table-column
          prop="spec.selector.matchLabels"
          label="Selector"
          :formatter="formatterLabels"
        >
        </el-table-column>

        <el-table-column prop="status" label="实例个数(正常/全部)" :formatter="formatterStatus">
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

        <!-- <el-table-column
          label="镜像"
          prop="spec.template.spec.containers"
          :formatter="formatterImage"
        >
        </el-table-column> -->

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleMonitorDrawer(scope.row)"
            >
              监控
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: -2px; color: #006eff"
              @click="handleEventDrawer(scope.row)"
            >
              事件
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

  <el-dialog
    :model-value="data.statefulSetReplicasDialog"
    style="color: #000000; font: 14px"
    width="500px"
    center
    @close="closeStatefulSetScaleDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">调整副本配置</div>
    </template>

    <el-form label-width="100px" style="max-width: 300px">
      <el-form-item label="原副本数">
        <el-input v-model="data.statefulSetRepcliasFrom.origin" disabled />
      </el-form-item>
      <el-form-item label="新副本数">
        <el-input v-model="data.statefulSetRepcliasFrom.target" placeholder="请输入新副本数" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -18px"></div>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeStatefulSetScaleDialog"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="pixiu-small-confirm-button"
          @click="confirmStatefulSetScale"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>

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
import { reactive, getCurrentInstance, onMounted, onUnmounted, onBeforeUnmount, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getTableData } from '@/utils/utils';
import PixiuTag from '@/components/pixiuTag/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { formatterImage, formatterTime, formatterNamespace } from '@/utils/formatter';
import {
  getStatefulSet,
  updateStatefulSet,
  deleteStatefulSet,
  getStatefulSetList,
} from '@/services/kubernetes/statefulsetService';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',
  namespace: '',

  autoRefresh: false,
  timer: null,

  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },

  tableData: [],
  loading: false,

  statefulSetList: [],

  statefulSetReplicasDialog: false,
  statefulSetRepcliasFrom: {
    name: '',
    origin: '',
    target: 0,
  },

  // yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'StatefulSet',
    deleteName: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  window.addEventListener('setItem', handleStorageChange);

  getStatefulsets();
});

onUnmounted(() => {
  window.removeEventListener('setItem', handleStorageChange);
});

onBeforeUnmount(() => {
  window.clearInterval(data.timer);
});

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取 workload 列表
      getStatefulsets();
    }
  }
};

const confirm = async () => {
  const [result, err] = await deleteStatefulSet(
    data.cluster,
    data.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`StatefulSet(${data.deleteDialog.deleteName}) 删除成功`);

  clean();
  await getStatefulsets();
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

  data.tableData = getTableData(data.pageInfo, data.deploymentList);
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getStatefulSet(data.cluster, data.namespace, data.yamlName);
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
  const [result, err] = await updateStatefulSet(
    data.cluster,
    data.namespace,
    data.yamlName,
    yamlData,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`StatefulSet(${data.yamlName}) YAML 更新成功`);
  closeEditYamlDialog();
  await getStatefulsets();
};

const createStatefulSet = () => {
  const url = `/statefulsets/createStatefulSet?cluster=${data.cluster}`;
  router.push(url);
};

const editStatefulSet = (row) => {
  const url = `/statefulsets/editStatefulSet?cluster=${data.cluster}&name=${row.metadata.name}`;
  router.push(url);
};

const jumpRoute = (row) => {
  router.push({
    name: 'StatefulSetDetail',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      name: row.metadata.name,
    },
  });
};

const getStatefulsets = async () => {
  if (!data.autoRefresh) {
    data.loading = true;
  }
  const [result, err] = await getStatefulSetList(data.cluster, data.namespace, data.pageInfo);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.tableData = result.items;
  data.pageInfo.total = result.total;
};

const startAutoRefresh = () => {
  if (data.autoRefresh) {
    data.timer = window.setInterval(() => {
      getStatefulsets();
    }, 3000);
  } else {
    window.clearInterval(data.timer);
  }
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getStatefulsets();
};

const getNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const handleStatefulSetScaleDialog = (row) => {
  data.statefulSetRepcliasFrom.name = row.metadata.name;
  data.statefulSetRepcliasFrom.target = '';
  data.statefulSetRepcliasFrom.origin = row.spec.replicas;
  data.statefulSetReplicasDialog = true;
};

const closeStatefulSetScaleDialog = (row) => {
  data.statefulSetReplicasDialog = false;

  data.statefulSetRepcliasFrom.name = '';
  data.statefulSetRepcliasFrom.origin = '';
  data.statefulSetRepcliasFrom.target = 0;
};

const confirmStatefulSetScale = async () => {
  try {
    const res = await proxy.$http({
      method: 'patch',
      url: `/pixiu/proxy/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/statefulsets/${data.statefulSetRepcliasFrom.name}/scale`,
      data: {
        spec: {
          replicas: Number(data.statefulSetRepcliasFrom.target),
        },
      },
      config: {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      },
    });

    getStatefulsets();
    closeStatefulSetScaleDialog();
  } catch (error) {}
};

const formatterLabels = (row, column, cellValue) => {
  if (!cellValue) return <div>-</div>;
  const labels = Object.entries(cellValue).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  let labels1 = labels;
  if (labels1.length > 2) {
    labels1 = labels1.slice(0, 2);
    labels1.push('...');
  }

  const displayContent = `
    <div>
      ${labels.map((label) => `<div class="pixiu-table-formatter">${label}</div>`).join('')}
    </div>
  `;

  return (
    <el-tooltip effect="light" placement="top" content={displayContent.toString()} raw-content>
      <div>
        {labels1.map((label) => (
          <div class="pixiu-ellipsis-style">{label}</div>
        ))}
      </div>
    </el-tooltip>
  );
};

const formatterStatus = (row, column, cellValue) => {
  let availableReplicas = cellValue.availableReplicas;
  if (availableReplicas === undefined) {
    availableReplicas = 0;
  }
  return (
    <div>
      {availableReplicas}/{row.spec.replicas}
    </div>
  );
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
  /* margin-left: 10px; */
  margin-right: -60px;
  color: #4c4e58;
  height: 20px;
  padding: 10px;
}
</style>
