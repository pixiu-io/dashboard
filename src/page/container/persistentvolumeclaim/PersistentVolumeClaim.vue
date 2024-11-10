<template>
  <Description :description="'持久卷声明定义了存储需求，Kubernetes 会根据持久卷声明创建持久卷。'" />

  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createPersistentVolumeClaim">新建</button>
        <button
          class="pixiu-two-button2"
          style="margin-left: 10px"
          @click="getPersistentVolumeClaims"
        >
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.nameSelector"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getPersistentVolumeClaims"
          @input="getPersistentVolumeClaims"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getPersistentVolumeClaims"
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
              type="primary"
              :underline="false"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态"> </el-table-column>

        <el-table-column prop="status" label="容量"> </el-table-column>
        <el-table-column prop="status" label="访问模式"> </el-table-column>
        <el-table-column prop="status" label="挂载状态"> </el-table-column>

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
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import {
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  ref,
  watch,
  provide,
} from 'vue';
import jsYaml from 'js-yaml';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import PixiuTag from '@/components/pixiuTag/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getLocalNamespace } from '@/services/kubernetes/namespaceService';

import {
  formatterImage,
  formatterTime,
  formatterNamespace,
  runningFormatter,
  formatterContainerImage,
  formatString,
} from '@/utils/formatter';
import { getPersistentVolumeClaimList } from '@/services/kubernetes/persistentVolumeClaimService';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';
import PixiuLog from '@/components/pixiulog/index.vue';

const data = reactive({
  cluster: '',
  namespace: 'default',

  autoRefresh: true,
  timer: null,

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    nameSelector: '',
    labelSelector: '',
  },

  tableData: [],
  loading: false,
});

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = getLocalNamespace();

  // 启动 localstorage 缓存监听，用于检测命名空间是否发生了变化
  window.addEventListener('setItem', handleStorageChange);

  // 初始化 workload 列表
  getPersistentVolumeClaims();
});

onUnmounted(() => {
  window.removeEventListener('setItem', handleStorageChange);
});

onBeforeUnmount(() => {
  window.clearInterval(data.timer);
});

const handleStorageChange = (e) => {
  if (e.storageArea === localStorage) {
    if (e.key === 'namespace') {
      if (e.oldValue === e.newValue) {
        return;
      }
      data.namespace = e.newValue;
      // 监控到切换命名空间之后，重新获取 workload 列表
      getPersistentVolumeClaims();
    }
  }
};

const getPersistentVolumeClaims = async () => {
  if (!data.autoRefresh) {
    data.loading = true;
  }

  const [result, err] = await getPersistentVolumeClaimList(
    data.cluster,
    data.namespace,
    data.pageInfo,
  );
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  console.log('result.items', result.items);

  data.tableData = result.items;
  data.pageInfo.total = result.total;
};
</script>

<style></style>
