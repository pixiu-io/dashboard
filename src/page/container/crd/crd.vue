<template>
  <div style="margin-top: 5px">
    <Description
      :description="'自定义资源 (CRD) 是一种 Kubernetes 实现自定义资源类型的扩展方式, 您可以像操作内置资源对象一样操作 CRD 对象.'"
    />

    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="getCRDs">刷新</button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 35%; float: right"
          clearable
          @clear="getCRDs"
          @input="getCRDs"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getCRDs">
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
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="资源名称" min-width="150px">
          <template #default="scope">
            <el-tooltip effect="dark" :content="scope.row.metadata.name" placement="top-start">
              <el-link
                class="global-table-world"
                :underline="false"
                type="primary"
                @click="jumpRoute(scope.row)"
              >
                {{ scope.row.metadata.name }}
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="spec.names.shortNames" label="简写名称"> </el-table-column>

        <el-table-column prop="spec.names.kind" label="类型"> </el-table-column>
        <el-table-column prop="spec" label="最新版本" :formatter="formatterVersion">
        </el-table-column>
        <el-table-column prop="spec.scope" label="作用域"> </el-table-column>
        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <!-- 分页区域 -->
      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </el-card>
  </div>

  <PiXiuViewOrEdit
    :yaml-dialog="data.editYamlDialog"
    title="编辑Yaml"
    :yaml="data.yaml"
    :read-only="false"
    :refresh="syncStorageClasses"
  ></PiXiuViewOrEdit>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { getTableData, searchData } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime } from '@/utils/formatter';
import { getCRDList } from '@/services/kubernetes/crdService';
import Pagination from '@/components/pagination/index.vue';
import Description from '@/components/description/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import PiXiuViewOrEdit from '@/components/pixiuyaml/viewOrEdit/index.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const editYaml = ref();

const data = reactive({
  cluster: '',

  loading: false,

  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 10,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },
  tableData: [],
  crdList: [],

  //  yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.crdList);
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getCRDs();
});

const getCRDs = async () => {
  data.loading = true;
  const [result, err] = await getCRDList(data.cluster);
  data.loading = false;
  if (err) {
    proxy.$notify.error(err.response.data.message);
    return;
  }

  data.crdList = result.items;
  data.pageInfo.total = data.crdList.length;
  data.tableData = getTableData(data.pageInfo, data.crdList);
};

const formatterVersion = (row, column, spec) => {
  const group = spec.group;
  const versions = spec.versions;
  if (versions.length === 0) {
    return group;
  }

  return group + '/' + versions[0].name;
};
</script>

<style scoped="scoped">
.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}
</style>
