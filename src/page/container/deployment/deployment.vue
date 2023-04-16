<template>
  <el-main style="min-height: calc(100vh - 100px)">
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <!-- <el-button type="primary" style="margin-left: 1px" @click="createDeployment">
            创建
          </el-button> -->
          <button class="pixiu-button" @click="createDeployment">新建</button>
          <el-input
            v-model="data.pageInfo.query"
            placeholder="名称搜索关键字"
            style="width: 420px; float: right"
            clearable
            @input="getDeployments"
            @clear="getDeployments"
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <component :is="'Search'" />
              </el-icon>
            </template>
          </el-input>

          <el-select
            v-model="data.namespace"
            style="width: 160px; float: right; margin-right: 10px"
            @change="changeNamespace"
          >
            <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <el-table
          v-loading="loading"
          :data="data.deploymentList"
          stripe
          style="margin-top: 2px; width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="metadata.name" label="名称" width="200" sortable>
            <template #default="scope">
              <el-link style="color: #006eff" type="primary" @click="jumpRoute(scope.row)">
                {{ scope.row.metadata.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="spec.template.metadata.labels"
            label="Labels"
            :formatter="formatterDeploymentLabel"
          />
          <el-table-column
            prop="spec.selector.matchLabels"
            label="Selector"
            :formatter="formatterDeploymentSelector"
          />
          <el-table-column prop="" label="运行状态" width="300" />
          <el-table-column prop="" label="Request/Limits" width="300" />

          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                type="text"
                style="margin-right: -20px; margin-left: -10px; color: #006eff"
                @click="editDeployment(scope.row)"
              >
                设置
              </el-button>

              <el-button
                type="text"
                size="small"
                style="margin-right: 2px; color: #006eff"
                @click="handleDeploymentScaleDialog(scope.row)"
              >
                调整副本数
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons">
                    <el-dropdown-item style="color: #006eff" @click="deleteDeployment(scope.row)">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>

          <template #empty>
            <div style="text-align: center">
              选择的该命名空间的列表为空，可以切换到其他命名空间或点击创建
            </div>
          </template>
        </el-table>

        <el-pagination
          style="float: right; margin-right: 30px; margin-top: 20px; margin-bottom: 20px"
          v-model:currentPage="data.pageInfo.page"
          v-model:page-size="data.pageInfo.page_size"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.pageInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
  </el-main>

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

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDeploymentScaleDialog">取消</el-button>
        <el-button type="primary" @click="confirmDeploymentScale">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

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
  deploymentList: [],

  deploymentReplicasDialog: false,
  deploymentRepcliasFrom: {
    name: '',
    origin: '',
    target: 0,
  },
});

const handleSizeChange = (newSize) => {
  data.pageInfo.limit = newSize;
  getDeployments();
};

const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
  getDeployments();
};

const createDeployment = () => {
  const url = `/kubernetes/deployment_create?cluster=${data.cluster}&namespace=${data.namespace}`;
  router.push(url);
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getDeployments();
  getNamespaceList();
});

const jumpRoute = (row) => {
  router.push({
    name: 'DeploymentDetail',
    query: {
      name: row.metadata.name,
      namespace: data.namespace,
    },
  });
};

const getDeployments = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments`,
    data: data.pageInfo,
  });

  data.loading = false;
  data.deploymentList = res.items;
  data.pageInfo.total = data.deploymentList.length;
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getDeployments();
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces`,
    });

    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
  } catch (error) {}
};

const deleteDeployment = (row) => {
  ElMessageBox.confirm(
    '此操作将永久删除 Deployment ' + row.metadata.name + ' . 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  )
    .then(() => {
      const res = proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });

      // TODO：一次更新即可
      getDeployments();
      getDeployments();
    })
    .catch(() => {}); // 取消
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
    getDeployments();
    getDeployments();
    closeDeploymentScaleDialog();
  } catch (error) {}
};

const formatterDeploymentSelector = (row, colume, cellValue) => {
  // console.log(row.spec.selector.matchLabels);
};

const formatterDeploymentLabel = (row, colume, cellValue) => {
  const { status } = row;
};
</script>

<style scoped="scoped">
.box-card {
  margin-top: 20px;
  /* width: 480px; */
}
.el-main {
  background-color: #f3f4f7;
.pixiu-button {
  height: 30px;
  width: 70px;
  border-radius: 0%;
  color: white;
  border: none;
  background-color: #0052d9;
  cursor: pointer;
}
</style>
