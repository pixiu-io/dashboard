<template>
  <el-main>
    <el-card style="margin-top: -20px; margin-left: -20px; margin-right: -20px; border-radius: 0px">
      <span style="font-weight: bold; font-size: 18px; vertical-align: middle"> 审计管理 </span>
    </el-card>

    <Description
      :description="'补充点关于审计的文案说明。'"
      :icon-style="{
        fontSize: '18px',
        verticalAlign: 'middle',
        marginLeft: '-20px',
        marginRight: '8px',
        marginTop: '-20px',
      }"
      :text-style="{
        verticalAlign: 'middle',
        marginTop: '-27px',
        marginLeft: '10px',
      }"
      :card-style="{
        marginTop: '',
        marginLeft: '',
      }"
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
          :data="data.planList"
          stripe
          style="margin-top: 2px; width: 100%"
          header-row-class-name="pixiu-table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="gmt_create" label="创建时间" sortable :formatter="formatterTime" />

          <el-table-column prop="description" label="描述">
            <template #default="scope">
              <div style="font-size: 12px; color: #29292b" type="primary" :underline="false">
                {{ scope.row.description }}
              </div>
            </template>
          </el-table-column>

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
import { formatterTime, formatterPlanStatus } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import { getAuditList } from '@/services/audit/auditService';
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
};
</script>

<style></style>
