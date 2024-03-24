<template>
  <el-card class="title-card-container">
    <div class="font-container">Deployment</div>
    <PiXiuYaml :refresh="getDeployments"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createDeployment">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getDeployments">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="Name: 关键字，Label: key1=value1,key2=value2"
          style="width: 400px; float: right"
          class="input-select-style"
          clearable
          @clear="getDeployments"
          @input="searchDeployments"
        >
          <template #prefix>
            <el-select
              v-model="data.pageInfo.search.field"
              class="select-no-arrow"
              style="width: 50px"
            >
              <el-option label="名称" value="name" />
              <el-option label="标签" value="label" />
            </el-select>
          </template>
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getDeployments"
            />
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
          color: '#29292b',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />

        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link
              class="global-table-world"
              type="primary"
              :underline="false"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="spec.template.metadata.labels"
          label="Labels"
          :formatter="formatterLabels"
        />

        <el-table-column
          prop="spec.selector.matchLabels"
          label="Selector"
          :formatter="formatterLabels"
        >
        </el-table-column> -->

        <el-table-column prop="status" label="状态" :formatter="runningFormatter">
        </el-table-column>

        <el-table-column prop="status" label="实例个数(正常/全部)" :formatter="formatterReady">
        </el-table-column>

        <el-table-column prop="metadata.namespace" label="命名空间" :formatter="formatterNamespace">
        </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          :formatter="formatterTime"
        />

        <el-table-column
          label="镜像名称"
          prop="spec.template.spec.containers"
          :formatter="formatterImage"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editDeployment(scope.row)"
            >
              编辑
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="handleDeploymentScaleDialog(scope.row)"
            >
              调整副本数
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
                    @click="handleDeleteDialog(scope.row)"
                  >
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    @click="handleEditYamlDialog(scope.row)"
                  >
                    编辑yaml
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
    :model-value="data.deploymentReplicasDialog"
    style="color: #000000; font: 14px"
    width="500px"
    center
    @close="closeDeploymentScaleDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">调整副本配置</div>
    </template>

    <el-form label-width="100px" style="max-width: 300px">
      <el-form-item label="原副本数">
        <el-input v-model="data.deploymentRepcliasFrom.origin" disabled />
      </el-form-item>
      <el-form-item label="新副本数">
        <el-input v-model="data.deploymentRepcliasFrom.target" placeholder="请输入新副本数" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -18px"></div>

    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="closeDeploymentScaleDialog"
          >取消</el-button
        >
        <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmDeploymentScale"
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
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import jsYaml from 'js-yaml';
import { getTableData, searchData } from '@/utils/utils';
import PixiuTag from '@/components/pixiuTag/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import {
  getDeploymentList,
  getDeployment,
  updateDeployment,
  deleteDeployment,
} from '@/services/kubernetes/deploymentService';
import {
  formatterImage,
  formatterTime,
  formatterNamespace,
  formatterReady,
  runningFormatter,
} from '@/utils/formatter';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
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
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  tableData: [],
  loading: false,

  namespace: 'default',
  namespaces: [],
  filterNamespaces: [],

  deploymentList: [],

  deploymentReplicasDialog: false,
  deploymentRepcliasFrom: {
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
    objectName: 'Deployment',
    deleteName: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getDeployments();
  getNamespaces();
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

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteDeployment(
    data.cluster,
    data.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Deployment(${data.deleteDialog.deleteName}) 删除成功`);

  clean();
  await getDeployments();
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

  data.tableData = getTableData(data.pageInfo, data.deploymentList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchDeployments();
  }
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getDeployment(data.cluster, data.namespace, data.yamlName);
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
  const [result, err] = await updateDeployment(
    data.cluster,
    data.namespace,
    data.yamlName,
    yamlData,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Deployment(${data.yamlName}) YAML 更新成功`);
  closeEditYamlDialog();
  await getDeployments();
};

const createDeployment = () => {
  const url = `/deployments/createDeployment?cluster=${data.cluster}`;
  router.push(url);
};

const editDeployment = (row) => {
  const url = `/deployments/editDeployment?cluster=${data.cluster}&name=${row.metadata.name}`;
  router.push(url);
};

const jumpRoute = (row) => {
  router.push({
    name: 'DeploymentDetail',
    query: {
      cluster: data.cluster,
      namespace: data.namespace,
      name: row.metadata.name,
    },
  });
};

const getDeployments = async () => {
  data.loading = true;
  const [result, err] = await getDeploymentList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.deploymentList = result.items;
  data.pageInfo.total = data.deploymentList.length;
  data.tableData = getTableData(data.pageInfo, data.deploymentList);
};

const searchDeployments = async () => {
  data.tableData = searchData(data.pageInfo, data.deploymentList);
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getDeployments();
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

const handleDeploymentScaleDialog = (row) => {
  data.deploymentRepcliasFrom.name = row.metadata.name;
  data.deploymentRepcliasFrom.target = '';
  data.deploymentRepcliasFrom.origin = row.spec.replicas;
  data.deploymentReplicasDialog = true;
};

const closeDeploymentScaleDialog = (row) => {
  data.deploymentReplicasDialog = false;

  data.deploymentRepcliasFrom.name = '';
  data.deploymentRepcliasFrom.origin = '';
  data.deploymentRepcliasFrom.target = 0;
};

const confirmDeploymentScale = async () => {
  try {
    const res = await proxy.$http({
      method: 'patch',
      url: `/pixiu/proxy/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${data.deploymentRepcliasFrom.name}/scale`,
      data: {
        spec: {
          replicas: Number(data.deploymentRepcliasFrom.target),
        },
      },
      config: {
        header: {
          'Content-Type': 'application/merge-patch+json',
        },
      },
    });

    getDeployments();
    closeDeploymentScaleDialog();
  } catch (error) {}
};
</script>

<style>
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
