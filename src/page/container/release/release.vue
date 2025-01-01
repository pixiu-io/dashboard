<template>
  <Description
    :description="'Helm 是 Kubernetes 的包管理工具，利用 charts 部署、更新、回滚和管理应用, 它可以帮助我们管理复杂的 Kubernetes 应用'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getReleases">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @input="searchReleases"
          @clear="getReleases"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getReleases">
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
        <el-table-column type="selection" width="30" />

        <el-table-column prop="metadata.name" label="实例名称" sortable min-width="100px">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.info.status === 'deployed'" type="success">{{
              scope.row.info.status
            }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.info.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Chart" prop="chart" :formatter="formatterHelmChart">
        </el-table-column>

        <el-table-column label="版本" prop="version"> </el-table-column>

        <el-table-column label="APP版本" prop="chart.metadata.appVersion"> </el-table-column>

        <el-table-column
          prop="info.first_deployed"
          label="部署时间"
          :formatter="formatterTime"
        ></el-table-column>

        <el-table-column prop="info.first_deployed" label="更新时间" :formatter="formatterTime">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="190px">
          <template #default="scope">
            <el-button size="small" type="text" class="table-item-left1-buttom">
              历史版本
            </el-button>

            <el-button type="text" size="small" class="table-item-left2-buttom">
              版本回滚
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
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">
            选择的该命名空间的列表为空，可以切换到其他命名空间进行查看
          </div>
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
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import { formatterHelmChart, formatterNamespace, formatterTime } from '@/utils/formatter';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import { getReleaseList, deleteRelease } from '@/services/kubernetes/releaseService';
const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: 'default',

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    nameSelector: '',
    labelSelector: '',
  },
  tableData: [],
  loading: false,

  releasesList: [],

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'HelmRelease',
    deleteName: '',
    deleteNamespace: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);
  getReleases();
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
      getReleases();
    }
  }
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.releasesList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchReleases();
  }
};

const jumpRoute = (row) => {
  router.push({
    name: 'ReleaseDetail',
    query: {
      cluster: data.cluster,
      name: row.name,
      namespace: row.namespace,
    },
  });
};

const getReleases = async () => {
  data.loading = true;
  const [result, err] = await getReleaseList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.releasesList = result;
  if (data.releasesList !== null) {
    data.pageInfo.total = data.releasesList.length;
    data.tableData = getTableData(data.pageInfo, data.releasesList);
  } else {
    data.pageInfo.total = 0;
    data.tableData = [];
  }
};

const searchReleases = async () => {
  data.tableData = searchData(data.pageInfo, data.releasesList);
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.name;
  data.deleteDialog.deleteNamespace = row.namespace;
};

const confirm = async () => {
  const [result, err] = await deleteRelease(
    data.cluster,
    data.namespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    return;
  }
  proxy.$message.success(`(${data.deleteDialog.deleteName}) 删除成功`);

  getReleases();
  cancel();
};

const cancel = async () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
    data.deleteDialog.deleteNamespace = '';
  }, 100);
};
</script>

<style scoped="scoped"></style>
