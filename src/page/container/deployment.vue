<template>
  <el-main>
    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button type="primary" style="margin-left: 1px" @click="createDeployment">
            创建
          </el-button>
          <el-input
            v-model="data.pageInfo.query"
            placeholder="请输入需要搜索的名称"
            style="width: 480px; float: right"
            clearable
            @input="getDeployments"
            @clear="getDeployments"
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <component :is="'Search'" />
              </el-icon>
            </template>
          </el-input>
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
        <el-table-column prop="name" label="名称" width="300" sortable>
          <template #default="scope">
            <el-link style="color: #006eff" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="create_at" label="创建时间" width="300" sortable />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="color: #006eff"
              @click="editDeployment(scope.row)"
            >
              设置
            </el-button>

            <el-button
              v-permissions="'user:cloud:delete'"
              type="text"
              size="small"
              style="margin-right: 10px; color: #006eff"
              @click="editReplicas(scope.row)"
            >
              调整副本数
            </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <el-icon><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item style="color: #006eff"> 删除 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <template #empty>
          <div style="text-align: center">
            还没有 deployments，现在就
            <button class="app-pixiu-btn--link" @click="createDeployment">立即创建</button> 一个吧
          </div>
        </template>
      </el-table>
    </div>
  </el-main>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  pageInfo: {
    page: 1,
    limit: 10,
    query: '',
  },
  loading: false,

  deploymentList: [],
});

onMounted(() => {
  getDeployments();
});

const getDeployments = async () => {
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
