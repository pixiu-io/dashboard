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
          style="width: 480px; float: right"
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
          style="width: 200px; float: right; margin-right: 10px"
          @change="changeNamespace"
        >
          <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
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

        <el-table-column prop="metadata.name" sortable label="名称" min-width="120px">
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

        <el-table-column prop="status" label="状态" :formatter="formatterStatus" />

        <el-table-column
          prop="metadata.labels"
          label="Labels"
          min-width="200px"
          :formatter="formatterLabels"
        />

        <el-table-column prop="status.hostIP" label="所在节点" />
        <el-table-column prop="status.podIP" label="实例IP" min-width="100px">
          <template #default="scope">
            {{ scope.row.status.podIP }}
            <el-tooltip content="复制">
              <pixiu-icon
                name="icon-copy"
                size="11px"
                type="iconfont"
                class-name="icon-box"
                color="#909399"
                @click="copyIP(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        />
        <el-table-column prop="status" label="重启次数" :formatter="formatterRestartNumber" />

        <!-- <el-table-column label="镜像" prop="spec.containers" :formatter="formatterImage" /> -->

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          :formatter="formatterTime"
        />

        <el-table-column fixed="right" label="操作" width="160px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除Pod
            </el-button>

            <el-button
              type="text"
              size="small"
              style="color: #006eff"
              @click="openShell(scope.row)"
            >
              远程登陆
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
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import PixiuTag from '@/components/pixiuTag/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { formatTimestamp, getTableData, searchData } from '@/utils/utils';
import Pagination from '@/components/pagination/index.vue';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { getPodList, deletePod } from '@/services/kubernetes/podService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

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
  namespace: 'default',
  namespaces: [],
  podList: [],

  podReplicasDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'Pod',
    deleteName: '',
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
  let phase = cellValue.phase;
  if (phase == 'Failed') {
    phase = cellValue.reason;
  } else if (phase == 'Pending') {
    return <div class="color-yellow-word">{phase}</div>;
    // const containerStatuses = cellValue.containerStatuses;
    // for (let i = 0; i < containerStatuses.length; i++) {
    //   phase = containerStatuses[i].state.waiting.reason;
    //   break;
    // }
  }

  if (phase == 'Running') {
    return <div class="color-green-word">{phase}</div>;
  }
  return <div>{phase}</div>;
};

// const formatterStatus = (row, column, status) => {
//   let s = <span class="color-green-word">Running</span>;
//   if (status.phase === 'Running') {
//     status.conditions.forEach((item) => {
//       if (item.status !== 'True') {
//         let res = '';
//         status.containerStatuses.forEach((c) => {
//           if (!c.ready) {
//             if (c.state.waiting) {
//               res = (
//                 <div>
//                   <div>${c.state.waiting.reason}</div>
//                   <div style="font-size: 10px">{c.state.waiting.message}</div>
//                 </div>
//               );
//             }
//             if (c.state.terminated) {
//               res = (
//                 <div>
//                   <div>{c.state.waiting.reason}</div>
//                   <div style="font-size: 11px">{c.state.waiting.message}</div>
//                   <div style="font-size: 11px">{c.state.terminated.reason}</div>
//                 </div>
//               );
//             }
//           }
//         });
//         return (s = <span class="color-red-word">{res}</span>);
//       }
//     });
//   } else if (status.phase === 'Succeeded') {
//     let res = '';
//     status.containerStatuses.forEach((c) => {
//       if (!c.ready) {
//         if (c.state.terminated) {
//           res = (
//             <div>
//               <div>{c.state.waiting.reason}</div>
//               <div style="font-size: 11px">{c.state.waiting.message}</div>
//               <div style="font-size: 11px">{c.state.terminated.reason}</div>
//             </div>
//           );
//         }
//       }
//     });
//     return (s = <span style="color: #E6A23C">${res}</span>);
//   } else {
//     let res = status.phase;
//     status.containerStatuses.forEach((c) => {
//       if (!c.ready) {
//         if (c.state.waiting) {
//           res = (
//             <div>
//               <div>{c.state.waiting.reason}</div>
//               <div style="font-size: 11px">{c.state.waiting.message}</div>
//             </div>
//           );
//         }
//         if (c.state.terminated) {
//           res = (
//             <div>
//               <div>{c.state.waiting.reason}</div>
//               <div style="font-size: 11px">{c.state.waiting.message}</div>
//               <div style="font-size: 10px">{c.state.terminated.reason}</div>
//             </div>
//           );
//         }
//       }
//     });
//     return (s = <div style="color: red">{res}</div>);
//   }
//   return s;
// };

const formatterImage = (row, column, cellValue) => {
  return (
    <div>
      {cellValue.map((item) => (
        <div>{item.image}</div>
      ))}
    </div>
  );
};
const formatterRestartNumber = (row, column, status) => {
  let count = 0;
  status.containerStatuses.forEach((item) => {
    count += item.restartCount;
  });
  return <div>{count} 次</div>;
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
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
