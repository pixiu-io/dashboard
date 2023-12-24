<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 ConfigMap</div>
  </el-card>

  <div
    class="deployee-class"
    style="display: flex; flex-direction: column; width: 100%; height: 100%"
  >
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 8px; width: 100%; border-radius: 0px">
          <el-form label-position="left" label-width="100px" style="margin-left: 3%; width: 80%">
            <div style="margin-top: 20px" />
            <el-form-item label="名称" style="width: 700px">
              <el-input v-model="data.configmapForm.metadata.name" style="width: 200px" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-"),且必须以小写字母开头，数字或小写字母结尾
              </div>
            </el-form-item>

            <el-form-item label="命名空间" style="width: 300px">
              <div class="namespace-select-container">
                <el-select
                  v-model="data.configmapForm.metadata.namespace"
                  @change="changeNamespace"
                >
                  <el-option
                    v-for="item in data.namespaces"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-divider />
            <el-form-item label="内容" style="margin-top: 20px">
              <el-table :data="data.tableData" style="width: 100%" max-height="250">
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
              <el-button class="mt-4" style="width: 5%" @click="onAddItem">手动增加</el-button>
              <el-button class="mt-4" style="width: 5%" @click="onAddItem">文件导入</el-button>
            </el-form-item>
            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancelCreate()">取消</el-button>
              <el-button class="pixiu-confirm-button" type="primary" @click="comfirmCreate()"
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

  deploymentLabels: [],

  // configmap 创建初始对象
  configmapForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    data: {},
  },
  tableData: [
    {
      key: '1',
      value: '22',
    },
  ],
  configmapDialog: false,
  configmapDataFrom: {
    key: '',
    value: '',
    target: 0,
  },
});

const comfirmCreate = async () => {
  data.tableData.forEach((item) => {
    data.configmapForm.data[item.key] = item.value;
  });
  try {
    const resp = await proxy.$http({
      method: 'post',
      url:
        `/proxy/pixiu/${data.cloud.cluster}/api/v1/namespaces/` +
        data.configmapForm.metadata.namespace +
        `/configmaps`,
      data: data.configmapForm,
    });
  } catch (error) {}

  proxy.$message.success(`configmap ${data.configmapForm.metadata.name} 创建成功`);
  backToConfigmap();
};

const cancelCreate = () => {
  backToConfigmap();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.configmapForm.metadata.namespace = val;
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
</script>

<style>
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.deployee-class .el-main {
  background-color: #f3f4f7;
}

.app-pixiu-line-describe {
  margin-left: 100px;
  margin-top: -18px;
  font-size: 12px;
  color: #888888;
}

.app-pixiu-line-describe2 {
  margin-left: 2px;
  font-size: 10px;
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

.deployee-class .el-radio {
  background-color: white;
  border-radius: 0;
  margin-right: 0;
  width: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deployee-class .el-radio.is-bordered.is-checked {
  border-color: blue; /* 颜色待定 */
}

.deployee-class .el-radio__input.is-checked + .el-radio__label {
  color: blue; /* 颜色待定 */
}

.deployee-class .el-radio__label {
  font-size: 13px;
}

.deployee-class .el-radio__inner {
  display: none;
}
</style>
