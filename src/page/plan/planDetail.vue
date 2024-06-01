<template>
  <el-tabs
    v-model="data.activeName"
    style="margin-left: 20px"
    @tab-click="handleClick"
    @tab-change="handleChange"
  >
    <el-tab-pane label="配置信息" name="first"> </el-tab-pane>
    <el-tab-pane label="节点列表" name="second"> </el-tab-pane>
    <el-tab-pane label="组件管理" name="third"></el-tab-pane>
  </el-tabs>

  <div v-if="data.activeName === 'first'" style="margin-left: 12px">first</div>

  <div v-if="data.activeName === 'second'" style="margin-left: 12px">
    <div>
      <el-row>
        <el-card class="detail-docs">
          <el-icon
            style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
            ><WarningFilled
          /></el-icon>
          <div style="vertical-align: middle; margin-top: -40px">获取部署计划的 nodes 列表</div>
        </el-card>

        <el-col>
          <button style="width: 85px" class="pixiu-two-button" @click="handleCreateDialog">
            新增节点
          </button>

          <div style="margin-left: 8px; float: right; margin-left: 12px">
            <button class="pixiu-two-button" @click="GetPlanNodes">搜索</button>
          </div>

          <el-input
            v-model="data.pageInfo.search.searchInfo"
            placeholder="名称搜索关键字"
            style="width: 480px; float: right"
            clearable
          >
            <template #suffix>
              <pixiu-icon
                name="icon-search"
                style="cursor: pointer"
                size="15px"
                type="iconfont"
                color="#909399"
              />
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="data.loading"
      :data="data.tableData"
      stripe
      style="margin-top: 6px"
      header-row-class-name="pixiu-table-header"
      :cell-style="{
        'font-size': '12px',
        color: '#191919',
      }"
      @selection-change="handlePodSelectionChange"
    >
      <el-table-column type="selection" width="30px" />
      <el-table-column prop="metadata.name" label="节点名称">
        <template #default="scope">
          {{ scope.row.name }}
          <pixiu-icon
            name="icon-copy"
            size="11px"
            type="iconfont"
            class-name="icon-box"
            color="#909399"
            style="cursor: pointer"
            @click="copy(scope.row.name)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="role" label="角色" />
      <el-table-column prop="ip" label="IP地址" />
      <el-table-column prop="auth" label="认证方式"> </el-table-column>

      <el-table-column prop="gmt_create" label="创建时间" :formatter="formatterTime" />
      <el-table-column fixed="right" label="操作" width="160px">
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            style="margin-right: -25px; margin-left: -10px; color: #006eff"
            @click="handleDeleteDialog(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="table-inline-word">该部署计划暂无节点</div>
      </template>
    </el-table>

    <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
  </div>
  <div v-if="data.activeName === 'third'" style="margin-left: 12px">third</div>

  <el-dialog
    v-model="data.createDialog.close"
    style="color: #000000; font: 14px"
    width="500px"
    draggable
    center
    @close="handleCreateCloseDialog"
  >
    <template #header>
      <div style="text-align: left; font-weight: bold; padding-left: 5px">新增节点</div>
    </template>
    <el-form
      ref="userFormRef"
      :label-position="labelPosition"
      :rules="userFormRules"
      label-width="80px"
      :model="data.userForm"
      style="max-width: 90%"
    >
      <el-form-item required prop="name">
        <template #label>
          <span style="font-size: 13px; color: #191919">节点名称</span>
        </template>
        <el-input v-model="data.createData.name" />
      </el-form-item>

      <el-form-item prop="role">
        <template #label>
          <span style="font-size: 13px; color: #191919">角色</span>
        </template>

        <el-radio-group v-model="data.createData.role">
          <el-radio style="margin-right: 16px" :value="1">master</el-radio>
          <el-radio :value="0">node</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="ip">
        <template #label>
          <span style="font-size: 13px; color: #191919">IP地址</span>
        </template>
        <el-input v-model="data.createData.ip" />
      </el-form-item>
    </el-form>

    <div style="margin-top: -20px"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="pixiu-small-cancel-button" @click="handleCreateCloseDialog"
          >取消</el-button
        >
        <el-button class="pixiu-small-confirm-button" type="primary" @click="confirmCreate"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { getTableData, copy } from '@/utils/utils';
import { formatterTime } from '@/utils/formatter';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { getPlanNodes, createPlanNode } from '@/services/plan/planService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  name: '',
  planId: 0,
  loading: false,
  activeName: 'second',

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  nodes: [],
  tableData: [],

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '节点',
    deleteName: '',
    aliasName: '',
  },

  // 创建属性
  createDialog: {
    close: false,
  },
  createData: {
    name: '',
    role: 0,
    ip: '',
    auth: {
      type: 'key',
      key: {},
      password: {},
    },
  },
});

onMounted(async () => {
  data.name = proxy.$route.query.name;
  data.planId = proxy.$route.query.planId;

  GetPlanNodes();
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
};

const GetPlanNodes = async () => {
  data.loading = true;
  const [result, err] = await getPlanNodes(data.planId);
  data.loading = false;
  if (err) {
    proxy.$notify.error(err);
    return;
  }

  if (result !== null) {
    data.nodes = result;
  }
  data.pageInfo.total = data.nodes.length;
  data.tableData = getTableData(data.pageInfo, data.nodes);
};

// 开始创建节点
const handleCreateDialog = () => {
  data.createDialog.close = true;
};

const handleCreateCloseDialog = () => {
  data.createDialog.close = false;

  // 初始化创建form
  setTimeout(() => {
    data.createData = {
      name: '',
      role: 0,
      ip: '',
      auth: {
        type: 'key',
        key: {},
        password: {},
      },
    };
  }, 100);
};

const confirmCreate = async () => {
  const [result, err] = await createPlanNode(data.planId, data.createData);
  if (err) {
    proxy.$notify.error({ message: err });
    return;
  }
  proxy.$notify.success({ message: `节点(${data.createData.name})添加成功` });

  GetPlanNodes();
  handleCreateCloseDialog();
};
// 结束 创建用户
</script>

<style scoped="scoped"></style>
