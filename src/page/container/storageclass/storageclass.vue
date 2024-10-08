<template>
  <!-- <el-card class="title-card-container">
    <div class="font-container">StorageClass</div>
    <PiXiuYaml :refresh="syncStorageClasses"></PiXiuYaml>
  </el-card> -->
  <Description
    :description="'StorageClass 是 Kubernetes 中用来描述存储类的资源对象，它定义了 Kubernetes 集群中如何使用底层存储设备。'"
  />
  <div style="margin-top: 5px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createStorageClass">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="syncStorageClasses">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.search.searchInfo"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="syncStorageClasses"
          @input="searchStorageClassList"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="syncStorageClasses">
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
        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link
              class="global-table-world"
              :underline="false"
              type="primary"
              @click="jumpRoute(scope.row)"
            >
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="provisioner" label="PROVISIONER" :formatter="formatterProvisioner">
        </el-table-column>
        <el-table-column label="回收策略" prop="reclaimPolicy"> </el-table-column>
        <el-table-column label="绑定模式" prop="volumeBindingMode"> </el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="170px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editStorageClass(scope.row)"
            >
              设置
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: -25px; margin-left: 8px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="handleEditYamlDialog(scope.row)"
            >
              YAML 设置
            </el-button>
          </template>
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

  <pixiuDialog
    :close-event="data.deleteDialog.close"
    :object-name="data.deleteDialog.objectName"
    :delete-name="data.deleteDialog.deleteName"
    @confirm="confirm"
    @cancel="cancel"
  ></pixiuDialog>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { getTableData, searchData } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import { formatterTime } from '@/utils/formatter';
import Pagination from '@/components/pagination/index.vue';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';
import {
  getStorageClassList,
  getStorageClass,
  deleteStorageClass,
} from '@/services/kubernetes/storageClassService';
import Description from '@/components/description/index.vue';
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
  stroageClassList: [],

  //  yaml相关属性
  yaml: '',
  yamlName: '',
  editYamlDialog: false,

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: 'StorageClass',
    deleteName: '',
  },
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;

  data.tableData = getTableData(data.pageInfo, data.storageClassList);

  if (data.pageInfo.search.searchInfo !== '') {
    searchStorageClassList();
  }
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  syncStorageClasses();
});

const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.metadata.name;
};

const confirm = async () => {
  const [result, err] = await deleteStorageClass(data.cluster, data.deleteDialog.deleteName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  proxy.$message.success(
    `${data.deleteDialog.objectName}(${data.deleteDialog.deleteName}) 删除成功`,
  );

  clean();
  await syncStorageClasses();
};

const cancel = () => {
  clean();
};

const clean = () => {
  data.deleteDialog.close = false;
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
  }, 100);
};

const syncStorageClasses = async () => {
  data.loading = true;
  const [res, err] = await getStorageClassList(data.cluster, data.pageInfo);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.storageClassList = res.items;
  data.pageInfo.total = data.storageClassList.length;
  data.tableData = getTableData(data.pageInfo, data.storageClassList);
};

const searchStorageClassList = async () => {
  data.tableData = searchData(data.pageInfo, data.storageClassList);
};

const createStorageClass = () => {
  const url = `/storageClasses/createStorageClass?cluster=${data.cluster}`;
  router.push(url);
};

const editStorageClass = (row) => {
  const url = `/storageClasses/editStorageClass?cluster=${data.cluster}&name=${row.metadata.name}`;
  router.push(url);
};

const handleEditYamlDialog = async (row) => {
  data.yamlName = row.metadata.name;
  // 列表中的属性缺少 Kind 和 apiVersion 属性，重新获取补充
  const [result, err] = await getStorageClass(data.cluster, data.yamlName);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.yaml = result;
  data.editYamlDialog = true;
};

const formatterProvisioner = (row, column, cellValue) => {
  return (
    <el-tooltip effect="light" placement="top" content={cellValue}>
      <div class="pixiu-ellipsis-style">{cellValue}</div>
    </el-tooltip>
  );
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
