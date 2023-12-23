<template>
  <el-card class="title-card-container">
    <div class="font-container">命名空间</div>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createNamespace">新建</button>
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
        v-loading="loading"
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
        <el-table-column prop="metadata.name" sortable label="名称" min-width="80px">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>

            <el-tooltip content="复制">
              <pixiu-icon
                name="DocumentCopy"
                size="10px"
                type="el"
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

        <el-table-column label="描述" prop="-"> </el-table-column>

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
              @click="handleDeploymentScaleDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">命名空间的列表为空</div>
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
import { formatTimestamp } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { getNamespaces } from '@/services/cloudService';
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';

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

  namespaceList: [],
});

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

const handleSizeChange = (newSize) => {
  data.pageInfo.limit = newSize;
  getNamespace();
};

const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
  getNamespace();
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNamespace();
});

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

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return <div>{time}</div>;
};

const formatStatus = (row, column, cellValue) => {
  return <div class="color-green-word">{cellValue.phase}</div>;
};
</script>

<style scoped="scoped">
.icon-box {
  padding: 3px;
  margin-top: -1px;
}
</style>
