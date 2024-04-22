<template>
  <div class="title-card-container2">
    <div style="flex-grow: 1">
      <PiXiuYaml :refresh="getReleases"></PiXiuYaml>
    </div>
  </div>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getReleases">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 400px; float: right"
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

        <el-table-column prop="metadata.name" label="名称" min-width="150px">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="版本" width="100px">
          <template #default="scope">
            {{ scope.row.version }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态" width="150px">
          <template #default="scope">
            <el-tag v-if="scope.row.info.status === 'deployed'" type="success">{{
              scope.row.info.status
            }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.info.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="Chart" min-width="200px">
          <template #default="scope">
            {{ scope.row.chart.metadata.name }}-{{ scope.row.chart.metadata.version }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="APP版本" width="150px">
          <template #default="scope">
            {{ scope.row.chart.metadata.appVersion }}
          </template>
        </el-table-column>
        <el-table-column label="部署时间" width="180px">
          <template #default="scope">
            {{ formatTimestamp(scope.row.info.first_deployed) }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="上次部署时间" width="180px">
          <template #default="scope">
            {{ formatTimestamp(scope.row.info.first_deployed) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
            >
              查看历史版本
            </el-button>

            <el-button type="text" size="small" style="margin-right: 2px; color: #006eff">
              版本回滚
            </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <el-icon><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item style="color: #006eff" @click="deleteRelease(scope.row)">
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
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import { getReleaseList } from '@/services/kubernetes/releaseService';
const { proxy } = getCurrentInstance();
const router = useRouter();

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

  releasesList: [],

  deploymentReplicasDialog: false,
  deploymentRepcliasFrom: {
    name: '',
    origin: '',
    target: 0,
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
    name: 'DeploymentDetail',
    query: {
      name: row.metadata.name,
      namespace: data.namespace,
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
  data.pageInfo.total = data.releasesList.length;
  data.tableData = getTableData(data.pageInfo, data.releasesList);
};

const searchReleases = async () => {
  data.tableData = searchData(data.pageInfo, data.releasesList);
};

const deleteRelease = async (val) => {};
</script>

<style scoped="scoped">
.box-card {
  margin-top: 20px;
}
</style>
