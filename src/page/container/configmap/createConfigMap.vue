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
              <!-- <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button> -->
              <div class="configmap-label-title" style="margin-left: 5px">变量名</div>
              <div class="configmap-label-title" style="margin-left: 510px">变量值</div>
              <el-divider />
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.configMapLabels"
              :key="index"
              style="margin-top: -15px"
            >
              <div>
                <el-input
                  v-model="item.key"
                  placeholder="变量名"
                  style="width: 500px; height: 52px"
                />
              </div>
              <div style="margin-right: 10px; margin-left: 10px"></div>
              =
              <div>
                <el-input
                  v-model="item.value"
                  placeholder="请输入变量值"
                  type="textarea"
                  style="width: 500px; margin-left: 20px"
                  :row="1"
                />
              </div>
              <div
                style="float: right; cursor: pointer; margin-left: 10px"
                @click="deleteLabel(index)"
              >
                <el-icon><Delete /></el-icon>
              </div>
              <el-divider />
            </el-form-item>
            <div class="app-pixiu-line-describe4">
              只能包含字母、数字及分隔符"、"”、";变量名为空时，在变量名称中粘贴一行或多行key=valuekey:
              value的键值对可以实现快速批量输入
            </div>
            <el-form-item>
              <el-button class="mt-5" style="width: 5%" @click="addLabel">手动增加</el-button>
              <el-button class="mt-5" style="width: 5%" @click="onAddItem">文件导入</el-button>
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
    minRows: 2,
  },

  configMapLabels: [],

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
      key: '',
      value: '',
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
  data.configMapLabels.forEach((item) => {
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
  data.configmapForm.metadata.namespace = proxy.$route.query.namespace;
  // getNamespace();
  getNamespaceList();
});

const changeNamespace = async (val) => {
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

const addLabel = () => {
  data.configMapLabels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.configMapLabels.splice(index, 1);
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
  font-size: 12px;
  color: #888888;
}

.app-pixiu-line-describe4 {
  margin-left: 105px;
  margin-top: -35px;
  font-size: 12px;
  color: #888888;
}

.configmap-label-title {
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
.mt-5 {
  border: none;
  margin-left: 2px;
  margin-top: 20px;
  color: rgb(64, 64, 237);
}
</style>
