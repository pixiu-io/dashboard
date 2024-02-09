<template>
  <el-card class="title-card-container">
    <div class="font-container">节点管理</div>
    <PiXiuYaml></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createStorageClass">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getNodes">刷新</button>

        <div style="margin-left: 8px; float: right; margin-top: 6px">
          <pixiu-icon
            name="icon-icon-refresh"
            style="cursor: pointer"
            size="14px"
            type="iconfont"
            color="#909399"
            @click="getNodes"
          />
        </div>

        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getNodes"
        >
          <template #suffix>
            <pixiu-icon
              name="icon-search"
              style="cursor: pointer"
              size="15px"
              type="iconfont"
              color="#909399"
              @click="getNodes"
            />

            <!-- <el-icon class="el-input__icon" @click="getNodes">
              <component :is="'Search'" />
            </el-icon> -->
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.nodeList"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#29292b',
        }"
        header-row-class-name="pixiu-table-header"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="30" /> -->
        <el-table-column prop="metadata.name" sortable label="名称" width="180px">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" :formatter="formatStatus"> </el-table-column>
        <el-table-column label="角色" prop="metadata" :formatter="formatRole"> </el-table-column>
        <el-table-column label="地址" prop="status" :formatter="formatIp"> </el-table-column>
        <el-table-column label="节点版本" prop="status.nodeInfo.kubeletVersion"> </el-table-column>
        <el-table-column
          label="运行时"
          prop="status.nodeInfo.containerRuntimeVersion"
          width="130px"
        >
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          width="150px"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -22px; margin-left: -10px; color: #006eff"
              @click="editDeployment(scope.row)"
            >
              编辑标签
            </el-button>

            <el-button type="text" size="small" style="color: #006eff" @click="drain(scope.row)">
              驱逐
            </el-button>
            <el-dropdown>
              <span class="cluster-dropdown">
                更多
                <div style="margin-left: 2px"></div>
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    :disabled="
                      scope.row.spec.unschedulable === undefined ||
                      scope.row.spec.unschedulable === false
                    "
                    @click="unCordon(scope.row)"
                  >
                    设置可调度
                  </el-dropdown-item>
                  <el-dropdown-item
                    class="dropdown-item-buttons"
                    :disabled="scope.row.spec.unschedulable === true"
                    @click="cordon(scope.row)"
                  >
                    设置不可调度
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
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatTimestamp } from '@/utils/utils';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 100,
  },

  loading: false,

  nodeList: [],
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNodes();
});

const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;

  getNodes();
};

const getNodes = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/nodes`,
    data: data.pageInfo,
  });
  data.loading = false;

  data.nodeList = res.items;
  data.pageInfo.total = data.nodeList.length;
};

const drain = (row) => {
  ElMessageBox.confirm('此操作将驱逐 ' + row.metadata.name + ' 上的 pod. 是否继续?', '节点驱逐', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      // const res = await proxy.$http({
      //   method: 'delete',
      //   url: `/proxy/pixiu/${data.cluster}/apis/apps/v1/namespaces/${data.namespace}/deployments/${row.metadata.name}`,
      // });
      ElMessage({
        type: 'success',
        message: '驱逐 ' + row.metadata.name + ' 成功',
      });

      getNodes();
    })
    .catch(() => {}); // 取消
};

const jumpRoute = (row) => {
  router.push({
    name: 'NodeDetail',
    query: {
      cluster: data.cluster,
      name: row.metadata.name,
    },
  });
};

const cordon = (row) => {
  if (row.spec.unschedulable === true) {
    return;
  }

  ElMessageBox.confirm('关闭 ' + row.metadata.name + ' 节点调度. 是否继续?', '节点调度', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      const res = await proxy.$http({
        method: 'patch',
        data: {
          spec: {
            unschedulable: true,
          },
        },
        url: `/proxy/pixiu/${data.cluster}/api/v1/nodes/${row.metadata.name}`,
        config: {
          header: {
            'Content-Type': 'application/strategic-merge-patch+json',
          },
        },
      });
      ElMessage({
        type: 'success',
        message: '已关闭 ' + row.metadata.name + ' 节点调度',
      });

      getNodes();
    })
    .catch(() => {});
};

const unCordon = (row) => {
  if (row.spec.unschedulable === undefined || row.spec.unschedulable === false) {
    return;
  }

  ElMessageBox.confirm('开启 ' + row.metadata.name + ' 节点调度. 是否继续?', '节点调度', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      const res = await proxy.$http({
        method: 'patch',
        data: {
          spec: {
            unschedulable: null,
          },
        },
        url: `/proxy/pixiu/${data.cluster}/api/v1/nodes/${row.metadata.name}`,
        config: {
          header: {
            'Content-Type': 'application/strategic-merge-patch+json',
          },
        },
      });
      ElMessage({
        type: 'success',
        message: '已开启 ' + row.metadata.name + ' 节点调度',
      });

      getNodes();
    })
    .catch(() => {});
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return (
    <el-tooltip effect="light" placement="top" content={time}>
      <div class="pixiu-ellipsis-style">{time}</div>
    </el-tooltip>
  );
};

const formatStatus = (row, column, cellValue) => {
  let status = 'NotReady';
  for (let c of cellValue.conditions) {
    if (c.type === 'Ready') {
      if (c.status === 'True') {
        status = 'Ready';
      }
      break;
    }
  }

  return <div class="color-green-word">{status}</div>;
};

const formatRole = (row, column, cellValue) => {
  let roles = [];
  let ls = JSON.parse(JSON.stringify(cellValue.labels));
  for (let [label, v] of Object.entries(ls)) {
    if (label.indexOf('node-role.kubernetes.io') !== -1) {
      let parts = label.split('/');
      roles.push(parts[1]);
    }
  }

  let roleContent = roles.toString();
  return (
    <el-tooltip effect="light" placement="top" content={roleContent}>
      <div class="hidden-style">{roleContent}</div>
    </el-tooltip>
  );
};

const formatIp = (row, column, cellValue) => {
  let address = '';
  for (let i of cellValue.addresses) {
    if (i.type === 'InternalIP') {
      address = i.address;
      break;
    }
  }
  return <div>{address}</div>;
};
</script>

<style scoped="scoped"></style>
