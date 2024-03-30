<template>
  <el-card class="title-card-container">
    <div class="font-container">命名空间</div>
    <PiXiuYaml :refresh="getNamespace"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createNamespace">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getNamespace">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getNamespace"
          @input="searchNamespace"
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
        :data="data.tableData"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        header-row-class-name="pixiu-table-header"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="30" /> -->
        <el-table-column prop="metadata.name" sortable label="命名空间">
          <template #default="scope">
            <el-link
              class="global-table-world"
              type="primary"
              @click="jumpNamespaceRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>

            <!-- <el-tooltip content="复制">
              <pixiu-icon
                name="icon-copy"
                size="11px"
                type="iconfont"
                class-name="icon-box"
                color="#909399"
                @click="copy(scope.row)"
              />
            </el-tooltip> -->
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" :formatter="formatStatus"> </el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column label="描述" prop="-"> <span>-</span> </el-table-column>

        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="editDeployment(scope.row)"
            >
              管理配额
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: -2px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>

            <el-dropdown>
              <span class="cluster-dropdown">
                更多
                <div style="margin-left: 2px"></div>
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item class="dropdown-item-buttons"> 编辑YAML </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import useClipboard from 'vue-clipboard3';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getNamespaceList, deleteNamespace } from '@/services/kubernetes/namespaceService';
import { getTableData, searchData } from '@/utils/utils';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { formatterTime, formatterIcon } from '@/utils/formatter';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  tableData: [],
  loading: false,
  namespaceList: [],

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '命名空间',
    deleteName: '',
  },
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNamespace();
});

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteNamespace(data.cluster, data.deleteDialog.deleteName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(`Namespace(${data.deleteDialog.deleteName}) 删除成功`);

  clean();
  getNamespace();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  data.deleteDialog.deleteName = '';
};

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.namespaceList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchNamespace();
  }
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
  const url = `/namespaces/createNamespace?cluster=${data.cluster}`;
  router.push(url);
};

const getNamespace = async () => {
  data.loading = true;
  const [result, err] = await getNamespaceList(data.cluster);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.namespaceList = result.items;
  data.pageInfo.total = data.namespaceList.length;
  data.tableData = getTableData(data.pageInfo, data.namespaceList);
};

const searchNamespace = async () => {
  data.tableData = searchData(data.pageInfo, data.namespaceList);
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

const formatStatus = (row, column, cellValue) => {
  if (cellValue.phase === 'Active') {
    return formatterIcon('#28C65A', '运行中');
  }
  return formatterIcon('#FFFF00', cellValue.phase);
};
</script>

<style scoped="scoped">
.icon-box {
  padding: 3px;
  margin-top: -1px;
}
</style>
