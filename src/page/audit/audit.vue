<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 审计管理 </span>
    </el-card>

    <div style="margin-top: 20px"></div>

    <Description
      :description="'审计管理用于查看用户针对平台的操作记录，包括创建、修改、删除等操作。'"
    />

    <div style="margin-top: 20px">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            class="pixiu-button"
            style="margin-left: 1px; width: 85px"
            @click="getAudits"
          >
            刷新
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
              />
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
          header-row-class-name="pixiu-table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="operator" label="操作用户">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.operator }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatterAuditStatus">
          </el-table-column>
          <el-table-column prop="resource_type" label="资源类型">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.resource_type }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作类型">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.action }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="操作IP">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.ip }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="请求路径" min-width="250px">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.path }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="gmt_create" label="操作时间" sortable :formatter="formatterTime" />

          <template #empty>
            <div class="table-inline-word">暂无审计操作记录</div>
          </template>
        </el-table>
        <!-- 分页区域 -->
        <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
      </el-card>
    </div>
  </el-main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime, formatterAuditStatus } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getAuditList } from '@/services/audit/auditService';
import { getTableData, searchData } from '@/utils/utils';
import Description from '@/components/description/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { copy } from '@/utils/utils';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  loading: false,

  tableData: [],
  auditList: [],

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
});

onMounted(() => {
  getAudits();
});

// 分页
const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  getAudits();
};

const getAudits = async () => {
  data.loading = true;
  const [result, err] = await getAuditList();
  data.loading = false;
  if (err) {
    proxy.$message.error(err);
    return;
  }

  data.auditList = result;
  if (result !== null) {
    data.pageInfo.total = data.auditList.length;
  }
  data.tableData = getTableData(data.pageInfo, data.auditList);
};
</script>

<style></style>
