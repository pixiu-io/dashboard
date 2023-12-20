<template>
  <el-card class="title-card-container">
    <div class="font-container">节点管理</div>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createStorageClass">新建</button>
        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getNodes"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getNodes">
              <component :is="'Search'" />
            </el-icon>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="loading"
        :data="data.nodeList"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#29292b',
        }"
        header-row-class-name="pixiu-table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="名称" width="180px">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="状态" prop="status" :formatter="formatStatus"> </el-table-column>
        <el-table-column label="角色" prop="metadata" :formatter="formatRole"> </el-table-column>
        <el-table-column label="地址" prop="status" :formatter="formatIp"> </el-table-column>
        <el-table-column label="版本" prop="status.nodeInfo.kubeletVersion"> </el-table-column>
        <el-table-column
          label="运行时"
          prop="status.nodeInfo.containerRuntimeVersion"
          width="120px"
        >
        </el-table-column>

        <el-table-column
          label="创建时间"
          prop="metadata.creationTimestamp"
          width="160px"
          :formatter="formatterTime"
        >
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="180px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -20px; margin-left: -10px; color: #006eff"
              @click="editDeployment(scope.row)"
            >
              更新配置
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="handleDeploymentScaleDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <div class="table-inline-word">选择的该命名空间的列表为空，可以切换到其他命名空间</div>
        </template>
      </el-table>

      <el-pagination
        v-model:currentPage="data.pageInfo.page"
        v-model:page-size="data.pageInfo.page_size"
        style="float: right; margin-right: 30px; margin-top: 20px; margin-bottom: 20px"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.pageInfo.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { formatTimestamp } from '@/utils/utils';
import { reactive, getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  cluster: '',
  pageInfo: {
    page: 1,
    query: '',
    total: 0,
    limit: 100,
  },

  loading: false,

  nodeList: [],
});

const handleSizeChange = (newSize) => {
  data.pageInfo.limit = newSize;
  getNodes();
};

const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
  getNodes();
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getNodes();
});

const getNodes = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cluster}/api/v1/nodes`,
    data: data.pageInfo,
  });
  data.loading = false;

  data.nodeList = res.items;
  data.pageInfo.total = data.nodeList.length;
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return <div>{time}</div>;
};

const formatStatus = (row, column, cellValue) => {
  let status = 'NotReady';
  for (let c of cellValue.conditions) {
    if (c.type === 'Ready') {
      if (c.status === 'True') {
        status = 'Ready';
      }
      break;
    }
  }

  return <div>{status}</div>;
};

const formatRole = (row, column, cellValue) => {
  let roles = [];
  let ls = JSON.parse(JSON.stringify(cellValue.labels));
  console.log('ls', ls);
  for (let [label, v] of ls) {
    if (label.indexOf('node-role.kubernetes.io')) {
      let parts = str.split('/');
      roles.push(parts[1]);
    }
  }

  return <div>master</div>;
};

const formatIp = (row, column, cellValue) => {
  let address = '';
  for (let i of cellValue.addresses) {
    if (i.type === 'InternalIP') {
      address = i.address;
      break;
    }
  }
  return <div>{address}</div>;
};
</script>

<style scoped="scoped"></style>
