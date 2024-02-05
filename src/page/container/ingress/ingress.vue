<template>
  <el-card class="title-card-container">
    <div class="font-container">Ingress</div>
    <PiXiuYaml></PiXiuYaml>
  </el-card>

  <div style="margin-top: 25px">
    <el-row>
      <el-col>
        <button class="pixiu-two-button" @click="createIngress">新建</button>
        <button class="pixiu-two-button2" style="margin-left: 10px" @click="getIngresses">
          刷新
        </button>

        <el-input
          v-model="data.pageInfo.query"
          placeholder="名称搜索关键字"
          style="width: 480px; float: right"
          clearable
          @clear="getIngresses"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="getIngresses">
              <component :is="'Search'" />
            </el-icon>
          </template>
        </el-input>

        <el-select
          v-model="data.namespace"
          style="width: 200px; float: right; margin-right: 10px"
          @change="changeNamespace"
        >
          <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
        </el-select>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        v-loading="data.loading"
        :data="data.ingressList"
        stripe
        style="margin-top: 2px; width: 100%"
        :cell-style="{
          'font-size': '12px',
          color: '#29292b',
        }"
        header-row-class-name="pixiu-table-header"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="metadata.name" sortable label="名称">
          <template #default="scope">
            <el-link class="global-table-world" type="primary" @click="jumpRoute(scope.row)">
              {{ scope.row.metadata.name }}
            </el-link>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="metadata" label="注解" :formatter="formatterAnno"> </el-table-column> -->
        <el-table-column prop="spec.rules" label="转发规则" :formatter="formatterIngressRules">
        </el-table-column>

        <el-table-column prop="metadata" label="地址">-</el-table-column>

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
              @click="editIngress(scope.row)"
            >
              设置
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: -25px; margin-left: 8px; color: #006eff"
              @click="deleteIngress(scope.row)"
            >
              删除
            </el-button>

            <el-button
              type="text"
              size="small"
              style="margin-right: 1px; color: #006eff"
              @click="editYamlIngress(scope.row)"
            >
              YAML 设置
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { getNamespaces } from '@/services/cloudService';
import { getIngressList } from '@/services/kubernetes/ingressService';
import PiXiuYaml from '@/components/pixiuyaml/index.vue';

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

  namespace: 'default',
  namespaces: [],
  ingressList: [],
});

const handleSizeChange = (newSize) => {
  data.pageInfo.limit = newSize;
  getIngresses();
};

const handleCurrentChange = (newPage) => {
  data.pageInfo.page = newPage;
  getIngresses();
};

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;

  getIngresses();
  getNamespaceList();
});

const getIngresses = async () => {
  data.loading = true;
  const [res, err] = await getIngressList(data.cluster, data.namespace);
  data.loading = false;
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.ingressList = res.items;
  data.pageInfo.total = data.ingressList.length;
};

const createIngress = () => {
  const url = `/kubernetes/ingresses/createIngress?cluster=${data.cluster}&namespace=${data.namespace}`;
  router.push(url);
};

const editIngress = (row) => {
  const url = `/kubernetes/ingresses/editIngress?cluster=${data.cluster}&namespace=${data.namespace}&name=${row.metadata.name}`;
  router.push(url);
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.namespace = val;

  getIngresses();
};

const getNamespaceList = async () => {
  const [err, result] = await getNamespaces(data.cluster);
  if (err) {
    return;
  }

  for (let item of result.items) {
    data.namespaces.push(item.metadata.name);
  }
};

const deleteIngress = (row) => {
  ElMessageBox.confirm('此操作将永久删除 Ingress(' + row.metadata.name + ') 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      await proxy.$http({
        method: 'delete',
        url: `/proxy/pixiu/${data.cluster}/apis/networking.k8s.io/v1/namespaces/${data.namespace}/ingresses/${row.metadata.name}`,
      });
      ElMessage({
        type: 'success',
        message: '删除 ' + row.metadata.name + ' 成功',
      });

      await getIngresses();
    })
    .catch(() => {}); // 取消
};

const editYamlIngress = (row) => {
  console.log('edit yaml ingress');
};

const formatterAnno = (row, column, cellValue) => {
  if (cellValue.annotations === undefined) {
    return <div>-</div>;
  }

  const annotations = Object.entries(cellValue.annotations).map(([key, value]) => {
    return `${key}: ${value}`;
  });
  return (
    <div>
      {annotations.map((anno) => (
        <div class="pixiu-table-formatter">{anno}</div>
      ))}
    </div>
  );
};

const formatterIngressRules = (row, column, cellValue) => {
  let ingress = [];
  for (let item of cellValue) {
    const host = item.host;
    for (let path of item.http.paths) {
      const ingressPath = path.path;
      const name = path.backend.service.name;
      const port = path.backend.service.port.number;
      if (ingressPath === '/') {
        ingress.push(`${host} -> ${name}:${port}`);
      } else {
        ingress.push(`${host}${ingressPath} -> ${name}:${port}`);
      }
    }
  }
  return (
    <div>
      {ingress.map((ing) => (
        <div class="pixiu-table-formatter">{ing}</div>
      ))}
    </div>
  );
};

const formatterTime = (row, column, cellValue) => {
  const time = formatTimestamp(cellValue);
  return <div>{time}</div>;
};
</script>

<style scoped="scoped"></style>
