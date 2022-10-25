<template>
  <el-main>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            v-permissions="'user:cloud:add'"
            type="primary"
            style="margin-left: 1px"
            @click="handleCreate"
          >
            新建 Deployment
          </el-button>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="loading"
          :data="data.deploymentList"
          stripe
          style="margin-top: 2px; width: 100%"
          @selection-change="handleSelectionChange"
        >
        </el-table>
      </el-card>
    </div>
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

  deploymentList: [],
});

onMounted(() => {
  console.log('dddd');
  getDeployments();
});

const getDeployments = async () => {
  // TODO 考虑将loading取到全局上面来，避免过多的去写loading状态管理
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: '/clouds',
    data: data.pageInfo,
  });
  data.loading = false;

  data.deploymentList = res.result.data;
};
</script>

<style scoped="scoped"></style>
