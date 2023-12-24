<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <span> ConfigMap :</span>
      <span> {{ data.configmapForm.metadata.name }} </span>
      <span>({{ data.configmapForm.metadata.namespace }})</span>
      <span> / 更新配置</span>
    </div>
  </el-card>

  <div
    class="configmap-class"
    style="display: flex; flex-direction: column; width: 100%; height: 100%"
  >
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 8px; width: 100%; border-radius: 0px">
          <template #header>
            <el-descriptions
              class="no-border"
              title="基本信息"
              :direction="vertical"
              :column="1"
              width="100%"
              border
            >
              <el-descriptions-item label="所在地域">华东地区(南京)</el-descriptions-item>
              <el-descriptions-item label="集群ID">
                {{ data.configmapForm.metadata.uid }}
              </el-descriptions-item>
              <el-descriptions-item label="所在命名空间">
                {{ data.configmapForm.metadata.namespace }}
              </el-descriptions-item>
              <el-descriptions-item label="资源名称">
                {{ data.configmapForm.metadata.name }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
          <el-form>
            <el-form-item label="内容" style="margin-top: 20px">
              <el-table
                :data="data.tableData"
                style="width: 100%; padding-left: 150px"
                max-height="250"
              >
                <el-table-column prop="key" label="变量名" width="120" />
                <el-table-column prop="value" label="变量值" width="auto" />
                <el-table-column fixed="right" label="操作" width="120">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="handleConfigmapDialog(scope.$index)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="deleteRow(scope.$index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="app-pixiu-line-describe3">
                只能包含字母、数字及分隔符"、"”、";
                变量名为空时，在变量名称中粘贴一行或多行key=valuekey:
                value的键值对可以实现快速批量输入
              </div>
            </el-form-item>
            <el-form-item>
              <el-button class="mt-4" style="width: 5%" @click="onAddItem">手动增加</el-button>
              <el-button class="mt-4" style="width: 5%" @click="onAddItem">文件导入</el-button>
            </el-form-item>
            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancelUpdate()">取消</el-button>
              <el-button class="pixiu-confirm-button" type="primary" @click="comfirmUpdate()"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>
    <el-dialog
      :model-value="data.configmapDialog"
      style="color: #000000; font: 14px"
      width="500px"
      center
      @close="closeDeploymentScaleDialog"
    >
      <template #header>
        <div style="text-align: left; font-weight: bold; padding-left: 5px">输入内容</div>
      </template>

      <el-form label-width="100px" style="max-width: 300px">
        <el-form-item label="变量名">
          <el-input v-model="data.configmapDataFrom.key" placeholder="请输入变量值" />
        </el-form-item>
        <el-form-item label="变量值">
          <el-input v-model="data.configmapDataFrom.value" placeholder="请输入新副本数" />
        </el-form-item>
      </el-form>

      <div style="margin-top: -18px"></div>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="pixiu-small-cancel-button" @click="closeConfigmapDialog"
            >取消</el-button
          >
          <el-button type="primary" class="pixiu-small-confirm-button" @click="confirmconfigmap"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';

import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  cluser: '',
  namespaces: [],
  autosize: {
    minRows: 5,
  },

  configmapLabels: [],

  // configmap 创建初始对象
  configmapForm: {
    metadata: {
      name: '',
      namespace: 'default',
      uid: '-',
    },
    data: {},
  },
  tableData: [
    {
      ket: '1',
      value: '22',
    },
  ],
  configmapFormData: {
    data: {
      key: '',
      value: '',
    },
  },
  configmapDialog: false,
  configmapDataFrom: {
    key: '',
    value: '',
    target: 0,
  },
});

const handleChange = (value) => {
  data.configmapForm.spec.replicas = value;
};

const cancelUpdate = () => {
  backToConfigmap();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.configmapForm.metadata.name = data.cloud.name;
  data.path = proxy.$route.fullPath;
  getConfigMap();
  getNamespace();
  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.configmapForm.metadata.namespace = val;
};

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
};

const getConfigMap = async () => {
  data.loading = true;
  const res = await proxy.$http({
    method: 'get',
    url: `/proxy/pixiu/${data.cloud.cluster}/api/v1/namespaces/${data.cloud.namespace}/configmaps/${data.cloud.name}`,
    data: '',
  });
  data.configmapForm.metadata = res.metadata;
  data.tableData = Object.entries(res.data).map(([key, value]) => ({ key, value }));
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cloud.cluster + '/api/v1/namespaces',
    });

    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }
  } catch (error) {}
};

// 回到 configmap 页面
const backToConfigmap = () => {
  proxy.$router.push({
    name: 'ConfigMap',
    query: data.cloud,
  });
};

const deleteRow = (index) => {
  data.tableData.splice(index, 1);
};

const onAddItem = () => {
  data.tableData.push({
    key: '',
    value: '',
  });
};

const handleConfigmapDialog = (index) => {
  data.configmapDataFrom.key = data.tableData[index].key;
  data.configmapDataFrom.target = index;
  data.configmapDataFrom.value = data.tableData[index].value;
  data.configmapDialog = true;
};

const closeConfigmapDialog = () => {
  data.configmapDialog = false;
};

const confirmconfigmap = () => {
  const dataVlue = data.configmapDataFrom;
  data.tableData[dataVlue.target].key = dataVlue.key;
  data.tableData[dataVlue.target].value = dataVlue.value;
  data.configmapDialog = false;
};

const comfirmUpdate = async () => {
  data.tableData.forEach((item) => {
    data.configmapForm.data[item.key] = item.value;
  });
  try {
    const resp = await proxy.$http({
      method: 'put',
      url:
        `/proxy/pixiu/${data.cloud.cluster}/api/v1/namespaces/` +
        data.configmapForm.metadata.namespace +
        `/configmaps/` +
        data.configmapForm.metadata.name,
      data: data.configmapForm,
    });
  } catch (error) {}

  proxy.$message.success(`configmap ${data.configmapForm.metadata.name} 更新成功`);
  backToConfigmap();
};
</script>

<style>
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.configmap-class .el-main {
  background-color: #f3f4f7;
}

.app-pixiu-line-describe {
  margin-left: 100px;
  margin-top: -18px;
  font-size: 12px;
  color: #888888;
}

.app-pixiu-line-describe3 {
  margin-left: 165px;
  font-size: 12px;
  color: #888888;
}

.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.deploy-pixiu-column {
  font-size: 13px;
  color: #606266;
}

.deploy-pixiu-incard {
  /* width: 323px; */
  width: 53%;
}

.container-line-describe {
  margin-left: 90px;
  font-size: 12px;
  color: #888888;
}
.configmap-class .el-radio {
  background-color: white;
  border-radius: 0;
  margin-right: 0;
  width: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.configmap-class .el-radio.is-bordered.is-checked {
  border-color: blue; /* 颜色待定 */
}

.configmap-class .el-radio__input.is-checked + .el-radio__label {
  color: blue; /* 颜色待定 */
}

.configmap-class .el-radio__label {
  font-size: 13px;
}

.configmap-class .el-radio__inner {
  display: none;
}

.el-descriptions__cell {
  width: 30%;
  display: inline-flex;
  border: none !important;
}
.el-descriptions__content {
  flex: 1;
  border: none !important;
  background: white;
}
.mt-4 {
  border: none;
  margin-left: 150px;
  margin-top: 20px;
  color: rgb(64, 64, 237);
}
</style>
