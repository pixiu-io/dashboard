<template>
  <Description
    :description="'Job 是 Kubernetes 中用于批量执行一组容器的工作流。它可以定义多个容器，并按照顺序执行。当一个容器失败时，Job 会自动重启容器。Job 还可以设置重启策略，以便在失败时自动重试。'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createJob">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getJobs">刷新</button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getJobs"
          @input="getJobs"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getJobs"
            />
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />

        <el-table-column prop="metadata.name" sortable label="任务名称">
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
          prop="status"
          label="状态"
          :formatter="formatterJobStatus"
        ></el-table-column>

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

        <!-- <el-table-column prop="spec.parallelism" label="并行度"></el-table-column> -->
        <!-- <el-table-column prop="spec.backoffLimit" label="重复次数"></el-table-column> -->

        <el-table-column
          prop="status"
          label="执行时间"
          :formatter="formatterJobDuration"
        ></el-table-column>

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

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button type="text" size="small" class="table-item-left1-buttom"> 编辑 </el-button>
            <el-button type="text" size="small" class="table-item-left2-buttom"> 事件 </el-button>
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
                    @click="handleReRunJob(scope.row)"
                  >
                    重新运行
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

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑YAML"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="getJobs"
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
import { reactive, getCurrentInstance, onMounted, ref, onBeforeUnmount, onBeforeMount } from 'vue';
import jsYaml from 'js-yaml';
import { getTableData } from '@/utils/utils';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';
import {
  getJobList,
  getJob,
  deleteJob,
  updateJob,
  reRunJob,
} from '@/services/kubernetes/jobService';
import Description from '@/components/description/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import {
  formatterLabels,
  formatterNamespace,
  formatterTime,
  formatterJobStatus,
  formatterJobDuration,
} from '@/utils/formatter';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  namespace: 'default',

  loading: false,
  noLoading: false,

  timer: null,

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    nameSelector: '',
    labelSelector: '',
  },
  tableData: [],
  jobList: [],

  // yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '任务',
    deleteName: '',
    deleteNamespace: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  getJobs();
});

onBeforeUnmount(() => {
  window.clearInterval(data.timer);
});

onBeforeMount(() => {
  data.timer = window.setInterval(() => {
    getJobs();
  }, 3000);
});

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      getJobs();
    }
  }
};

const handleReRunJob = async (row) => {
  await reRunJob(
    data.cluster,
    row.metadata.namespace,
    row.metadata.name,
    row.metadata.resourceVersion,
  );

  data.noLoading = true;
  getJobs();
  data.noLoading = false;
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
  data.deleteDialog.deleteNamespace = row.metadata.namespace;
};

const confirm = async () => {
  const [result, err] = await deleteJob(
    data.cluster,
    data.deleteDialog.deleteNamespace,
    data.deleteDialog.deleteName,
  );
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`任务(${data.deleteDialog.deleteName}) 删除成功`);

  getJobs();
  clean();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
    data.deleteDialog.deleteNamespace = '';
  }, 100);
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
  getJobs();
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  const [result, err] = await getJob(data.cluster, row.metadata.namespace, row.metadata.name);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = result;
  data.editYamlDialog = true;
};

const createJob = () => {
  const url = `/job/createJob?cluster=${data.cluster}`;
  router.push(url);
};

const jumpRoute = (row) => {
  router.push({
    name: 'JobDetail',
    query: {
      cluster: data.cluster,
      namespace: row.metadata.namespace,
      name: row.metadata.name,
    },
  });
};

const getJobs = async () => {
  const [result, err] = await getJobList(data.cluster, data.namespace, data.pageInfo);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.pageInfo.total = result.total;
  data.tableData = result.items;
};
</script>

<style scoped="scoped"></style>
