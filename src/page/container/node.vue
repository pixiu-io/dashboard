<template>
  <el-main>
    <!-- <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button type="primary" style="margin-left: 1px" @click="handleCreate">
            新增节点
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="data.nodeList"
        stripe
        style="margin-top: 40px; width: 100%"
        :header-cell-style="{
          background: '#f4f3f9',
          color: '#606266',
          height: '40px',
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="名称" width="120">
          <template #default="scope">
            <el-link style="color: #006eff" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色" width="180" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column prop="internal_ip" label="IP" width="200" />
        <el-table-column prop="container_runtime" label="容器运行时" width="200" />
        <el-table-column prop="osImage" label="操作系统" width="200" />
        <el-table-column prop="version" label="版本" />
        <el-table-column prop="create_at" label="创建时间" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="color: #006eff"
              @click="handleEdit(scope.row)"
            >
              设置
            </el-button>

            <el-button
              v-permissions="'user:cloud:delete'"
              type="text"
              size="small"
              style="margin-right: 10px; color: #006eff"
              @click="deleteCloud(scope.row)"
            >
              删除
            </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <el-icon><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item style="color: #006eff"> 启动 </el-dropdown-item>
                  <el-dropdown-item style="color: #006eff"> 详情 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div>还没有任何 Deployments , [立即创建]</div>
        </template>
      </el-table>

      <el-pagination
        style="float: right; margin-right: 40px; margin-top: 20px; margin-bottom: 20px"
        :current-page="data.pageInfo.page"
        :page-size="data.pageInfo.limit"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const { proxy } = getCurrentInstance();

const data = reactive({
  pageInfo: {
    query: '',
    page: 1,
    limit: 10, // 默认值需要是分页定义的值
  },
  loading: false,
  total: 10,
  nodeList: [],
});

// onMounted(() => {
//   nodeList();
// });

const handleSizeChange = (newSize) => {
  data.pageInfo.page_size = newSize;
  // nodeList();
};
const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
  // nodeList();
};

const nodeList = async () => {
  // TODO 考虑将loading取到全局上面来，避免过多的去写loading状态管理
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: '/clouds/v1/tencent/nodes',
    data: data.pageInfo,
  });
  data.loading = false;
  data.nodeList = res.result;
};
</script>

<style scoped="scoped"></style>
