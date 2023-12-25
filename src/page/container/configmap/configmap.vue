<template>
  <el-card class="title-card-container">
    <div class="font-container">ConfigMap</div>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createConfigMap">新建</button>
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
        v-loading="loading"
        :data="data.configmMapsList"
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

        <el-table-column prop="metadata.name" sortable label="名称" width="auto">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="Labels" width="530">
          <span>-</span>
        </el-table-column>

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          sortable
          width="auto"
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
              @click="handleDeploymentScaleDialog(scope.row)"
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

      <el-pagination
        v-model:currentPage="data.pageInfo.page"
        v-model:page-size="data.pageInfo.page_size"
        style="float: right; margin-right: 30px; margin-top: 20px; margin-bottom: 20px"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.pageInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
</template>
<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PixiuTag from '@/components/pixiuTag/index.vue';
import { formatTimestamp } from '@/utils/utils';
const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
    total: 0,
  },
  loading: false,

  namespace: 'default',
  namespaces: [],
  configmMapsList: [],

  deploymentReplicasDialog: false,
  deploymentRepcliasFrom: {
    name: '',
    origin: '',
    target: 0,
  },
});

const handleSizeChange = (newSize) => {
  data.pageInfo.limit = newSize;
  getConfigMaps();
};

const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
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
    .then(() => {
      const res = proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/configmaps/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });
      getConfigMaps();
    })
    .catch(() => {}); // 取消
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;
  getNamespaceList();
  getConfigMaps();
});

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

const getConfigMaps = async () => {
  data.loading = true;
  data.namespace = localStorage.getItem('namespace');
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/configmaps`,
    data: data.pageInfo,
  });

  data.loading = false;
  data.configmMapsList = res.items;
  data.pageInfo.total = data.configmMapsList.length;
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getConfigMaps();
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cloud.cluster + '/api/v1/namespaces',
    });

    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
  } catch (error) {}
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

const confirmDeploymentScale = () => {
  try {
    const res = proxy.$http({
      method: 'patch',
      url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${data.deploymentRepcliasFrom.name}/scale`,
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
    getConfigMaps();
    closeDeploymentScaleDialog();
  } catch (error) {}
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return <div>{time}</div>;
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
