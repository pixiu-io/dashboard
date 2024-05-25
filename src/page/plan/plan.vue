<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 部署计划 </span>
    </el-card>

    <el-card class="app-docs">
      <div>
        <el-icon
          style="
            vertical-align: middle;
            font-size: 18px;
            margin-left: -20px;
            margin-right: 8px;
            margin-top: -25px;
          "
          ><WarningFilled
        /></el-icon>

        <div style="vertical-align: middle; margin-top: -27px; margin-left: 10px">
          新建部署计划以自建 kubernetes 集群，完全兼容开源 Kubernetes
          集群标准功能，并强化节点管理、集群网络、容器调度等能力。
        </div>
      </div>
    </el-card>

    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            class="pixiu-button"
            style="margin-left: 1px"
            @click="handleCreateDialog"
          >
            <el-icon style="vertical-align: middle; margin-right: 4px">
              <component :is="'Plus'" />
            </el-icon>
            新建计划
          </el-button>
          <el-input
            v-model="data.pageInfo.search.searchInfo"
            placeholder="多个过滤标签用回车分隔"
            style="width: 560px; float: right"
            clearable
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
                @click="getPlanList"
              />
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-card class="box-card">
        <el-table
          v-loading="data.loading"
          :data="data.planList"
          stripe
          style="margin-top: 2px; width: 100%"
          header-row-class-name="pixiu-table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="name" label="名称" sortable>
            <template #default="scope">
              <el-link
                class="global-table-world"
                style="font-size: 14px"
                type="primary"
                :underline="false"
              >
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          />
          <el-table-column prop="gmt_create" label="创建时间" sortable :formatter="formatterTime" />
          <el-table-column prop="description" label="描述" />

          <el-table-column fixed="right" label="操作" width="160px">
            <template #default="scope">
              <el-button
                text
                size="small"
                style="margin-right: -24px; margin-left: -10px; color: #006eff"
                @click="handleDialogValue(scope.row)"
              >
                更新
              </el-button>
              <el-button
                text
                size="small"
                style="margin-right: -2px; color: #006eff"
                @click="handleDeleteDialog(scope.row)"
              >
                删除
              </el-button>

              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <pixiu-icon name="icon-xiala" size="12px" type="iconfont" color="#006eff" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown-buttons"> </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
          <template #empty>
            <div class="table-inline-word">暂无部署计划</div>
          </template>
        </el-table>
        <!-- 分页区域 -->
        <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
      </el-card>
    </div>
  </el-main>

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { GetUserList, deleteUser, createUser, updatePassword } from '@/services/user/userService';
import pixiuDialog from '@/components/pixiuDialog/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,

  tableData: [],
  planList: [],

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  updateForm: {},
  autosize: {
    minRows: 6,
  },

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '用户',
    deleteName: '',
  },

  // 创建属性
  createDialog: {
    close: false,
  },
  objectForm: {},
});

onMounted(() => {
  getPlanList();
});

// 分页
const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  getPlanList();
};

// 删除 开始
const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.id;
};

const confirm = async () => {
  const [result, err] = await deleteUser(data.deleteDialog.deleteName);
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  proxy.$notify.success(`User(${data.deleteDialog.deleteName}) 删除成功`);

  getUserList();
  cancel();
};

const cancel = () => {
  data.deleteDialog.close = false;
  // 延迟 1 秒重置数据，否则页面上会显的很怪
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};
// 删除 结束

const getPlanList = async () => {
  data.loading = true;

  data.loading = false;
  if (err) {
    proxy.$message.error(err);
    return;
  }

  data.planList = result;
  data.pageInfo.total = result.length;
};
</script>

<style></style>
