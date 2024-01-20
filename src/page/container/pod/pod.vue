<template>
  <el-card class="title-card-container">
    <div class="font-container">Pod</div>
    <PiXiuYaml :yaml-create-url="data.createSecretUrl"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createPod">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getPods">刷新</button>

        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getPods"
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
        v-loading="loading"
        :data="data.podList"
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

        <el-table-column prop="metadata.name" sortable label="名称" min-width="80px">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" :formatter="formatterStatus" />

        <el-table-column
          prop="metadata.labels"
          label="Labels"
          width="260"
          :formatter="formatterLabels"
        />

        <el-table-column prop="status.hostIP" label="所在节点" />
        <el-table-column prop="status.podIP" label="实例IP">
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

        <el-table-column fixed="right" label="操作" width="140px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="deletePod(scope.row)"
            >
              重启
            </el-button>

            <el-button type="text" size="small" style="color: #006eff" @click="podLog(scope.row)">
              远程登陆
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
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PixiuTag from '@/components/pixiuTag/index.vue';
import { formatTimestamp } from '@/utils/utils';
import useClipboard from 'vue-clipboard3';
import PiXiuYaml from '@/components/pixiuYaml/index.vue';

const { toClipboard } = useClipboard();
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

  createSecretUrl: '',

  namespace: 'default',
  namespaces: [],
  podList: [],

  podReplicasDialog: false,
  podRepcliasFrom: {
    name: '',
    origin: '',
    target: 0,
  },
});

const handleSizeChange = (newSize) => {
  data.pageInfo.limit = newSize;
  getPods();
};

const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
  getPods();
};

const createPod = () => {
  const url = `/kubernetes/pod_create?cluster=${data.cluster}&namespace=${data.namespace}`;
  router.push(url);
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getPods();
  getNamespaceList();
});

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

const getPods = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/pods`,
    data: data.pageInfo,
  });

  data.loading = false;
  data.podList = res.items;
  data.pageInfo.total = data.podList.length;
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getPods();
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

const deletePod = (row) => {
  ElMessageBox.confirm('此操作将永久删除 Pod ' + row.metadata.name + ' . 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(() => {
      const res = proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.namespace}/pods/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });
      getPods();
    })
    .catch(() => {}); // 取消
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

const podLog = (row) => {
  ElMessageBox.alert('暂不支持');
};

const closePodScaleDialog = (row) => {
  data.podReplicasDialog = false;

  data.podRepcliasFrom.name = '';
  data.podRepcliasFrom.origin = '';
  data.podRepcliasFrom.target = 0;
};

const confirmPodScale = () => {
  try {
    const res = proxy.$http({
      method: 'patch',
      url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/pods/${data.podRepcliasFrom.name}/scale`,
      data: {
        spec: {
          replicas: Number(data.podRepcliasFrom.target),
        },
      },
      config: {
        header: {
          'Content-Type': 'application/merge-patch+json',
        },
      },
    });
    getPods();
    getPods();
    closePodScaleDialog();
  } catch (error) {}
};

const formatterLabels = (row, column, cellValue) => {
  if (!cellValue) return <div>None</div>;
  const labels = Object.entries(cellValue).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  return (
    <div>
      {' '}
      {labels.map((label) => (
        <div class="pixiu-table-formatter">{label}</div>
      ))}{' '}
    </div>
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
