<template>
  <el-card class="title-card-container">
    <div class="font-container">命名空间</div>
    <PiXiuYaml></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createNamespace">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getNamespace">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getNamespace"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getNamespace">
              <component :is="'Search'" />
            </el-icon>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.namespaceList"
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
        <el-table-column prop="metadata.name" sortable label="名称" width="auto">
          <template #default="scope">
            <el-link
              class="global-table-world"
              type="primary"
              @click="jumpNamespaceRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>

            <el-tooltip content="复制">
              <pixiu-icon
                name="icon-copy"
                size="11px"
                type="iconfont"
                class-name="icon-box"
                color="#909399"
                @click="copy(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" width="160px" :formatter="formatStatus">
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          width="220px"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column label="描述" prop="-"> <span>-</span> </el-table-column>

        <el-table-column fixed="right" label="操作" width="180px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editDeployment(scope.row)"
            >
              配额管理
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">命名空间的列表为空</div>
        </template>
      </el-table>
      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <pixiuDialog
    :closeEvent="data.deleteDialog.close"
    :dialogTitle="data.deleteDialog.title"
    :objectName="data.deleteDialog.objectName"
    :deleteName="data.deleteDialog.deleteName"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { formatTimestamp } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { getNamespaces } from '@/services/cloudService';
import useClipboard from 'vue-clipboard3';
import { ElMessage, ElMessageBox } from 'element-plus';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

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

  deleteDialog: {
    close: false,
    title: '删除命名空间',
    objectName: '命名空间',
    deleteName: 'default',
  },

  namespaceList: [],
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNamespace();
});

const onChange = (v) => {
  data.pageInfo.limit = 10;
  data.pageInfo.page = v.page;

  getNamespace();
};

const { toClipboard } = useClipboard();
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

const createNamespace = () => {
  const url = `/kubernetes/createNamespace?cluster=${data.cluster}`;
  router.push(url);
};

const getNamespace = async () => {
  data.loading = true;
  const [err, result] = await getNamespaces(data.cluster);
  if (err) {
    return;
  }
  data.loading = false;

  data.namespaceList = result.items;
  data.pageInfo.total = data.namespaceList.length;
};

const jumpNamespaceRoute = (row) => {
  router.push({
    name: 'NamespaceDetail',
    query: {
      cluster: data.cluster,
      name: row.metadata.name,
    },
  });
};

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
};

const deleteNamespace = (row) => {
  ElMessageBox.confirm('此操作将永久删除 ' + row.metadata.name + ' 命名空间. 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      const res = await proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });

      getNamespace();
    })
    .catch(() => {}); // 取消
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
  if (cellValue.phase === 'Active') {
    return <div class="color-green-word">{cellValue.phase}</div>;
  }

  return <div>{cellValue.phase}</div>;
};
</script>

<style scoped="scoped">
.icon-box {
  padding: 3px;
  margin-top: -1px;
}
</style>
