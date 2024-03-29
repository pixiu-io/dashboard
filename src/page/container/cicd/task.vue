<template>
  <el-card class="title-card-container">
    <div class="font-container">Tasks</div>
    <PiXiuYaml :refresh="getTasks"></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createTask">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getTasks">刷新</button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 400px; float: right"
          clearable
          @clear="getTasks"
          @input="searchTasks"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getPods">
              <component :is="'Search'" />
            </el-icon>
          </template>
        </el-input>

        <el-select
          v-model="data.namespace"
          filterable
          :filter-method="filterMethod"
          style="width: 200px; float: right; margin-right: 10px"
          @change="changeNamespace"
        >
          <el-option
            v-for="item in data.filterNamespaces"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
        <!-- <dev class="namespace-container" style="width: 112px; float: right">命名空间</dev> -->
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.taskList"
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
        <el-table-column prop="metadata.name" sortable label="任务名称" min-width="100px">
          <template #default="scope">
            {{ scope.row.metadata.name }}
          </template>
        </el-table-column>

        <el-table-column prop="metadata.namespace" label="命名空间" :formatter="formatterNamespace">
        </el-table-column>

        <!-- <el-table-column label="镜像" prop="spec.containers" :formatter="formatterImage" /> -->

        <el-table-column
          prop="metadata.creationTimestamp"
          label="创建时间"
          :formatter="formatterTime"
        />

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
            >
              详情
            </el-button>

            <el-button type="text" size="small" style="color: #006eff"> 事件 </el-button>

            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-buttons">
                  <el-dropdown-item class="dropdown-item-buttons"> 详情 </el-dropdown-item>
                  <el-dropdown-item class="dropdown-item-buttons"> 查看YAML </el-dropdown-item>
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
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import { getTableData, searchData } from '@/utils/utils';
import {
  formatterTime,
  formatterPodStatus,
  formatterRestartCount,
  formatterNamespace,
} from '@/utils/formatter';
import { getTaskList } from '@/services/cicd/taskService';

import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

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

  taskList: [],

  namespace: 'default',
  filterNamespaces: [],
  namespaces: [],
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getTasks();
});

const getTasks = async () => {
  data.loading = true;
  const [result, err] = await getTaskList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.taskList = result.items;
};
</script>

<style scoped="scoped"></style>
