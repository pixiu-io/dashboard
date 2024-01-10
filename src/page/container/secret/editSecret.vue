<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <span> Secret :</span>
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
          <el-form>
            <el-form-item label="基本信息" style="margin-top: 20px">
              <el-form style="margin-top: 20px; margin-left: -70px">
                <el-form-item
                  class="configmap-info"
                  label="所在地域"
                  style="margin-top: 20px; width: 200px"
                  ><el-form-item style="margin-left: 50px" label="华东地区(南京)"></el-form-item>
                </el-form-item>
                <el-form-item label="集群ID" style="margin-top: 10px; width: 200px">
                  <el-form-item style="margin-left: 61px" :label="data.configmapForm.metadata.uid">
                  </el-form-item>
                </el-form-item>
                <el-form-item label="所在命名空间" style="margin-top: 10px; width: 200px">
                  <el-form-item
                    style="margin-left: 19px"
                    :label="data.configmapForm.metadata.namespace"
                  ></el-form-item>
                </el-form-item>
                <el-form-item label="资源名称" style="margin-top: 10px; width: 200px">
                  <el-form-item
                    style="margin-left: 47px"
                    :label="data.configmapForm.metadata.name"
                  ></el-form-item>
                </el-form-item>
              </el-form>
            </el-form-item>
            <el-divider />
            <el-form-item label="内容" style="margin-top: 20px">
              <div class="configmap-label-title" style="margin-left: 100px">变量名</div>
              <div class="configmap-label-title" style="margin-left: 510px">变量值</div>
              <el-divider style="margin-left: 80px" />
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.configMapLabels"
              :key="index"
              style="margin-top: -15px; margin-left: 120px"
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
              <el-button class="mt-4" style="width: 5%" @click="addLabel">手动增加</el-button>
              <el-button class="mt-4" style="width: 5%" @click="addLabel">文件导入</el-button>
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
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  cluser: '',
  namespaces: [],
  autosize: {
    minRows: 5,
  },

  configMapLabels: [],

  // configmap 创建初始对象
  configmapForm: {
    metadata: {
      name: '',
      namespace: 'default',
      uid: '-',
    },
    data: {},
  },
  configmapFormData: {
    data: {
      key: '',
      value: '',
    },
  },
  configmapDataFrom: {
    key: '',
    value: '',
    target: 0,
  },
});

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
  data.configMapLabels = Object.entries(res.data).map(([key, value]) => ({ key, value }));
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

const comfirmUpdate = async () => {
  data.configMapLabels.forEach((item) => {
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

.mt-4 {
  border: none;
  margin-left: 150px;
  margin-top: 20px;
  color: rgb(64, 64, 237);
}

.configmap-info {
  word-wrap: break-word;
}
</style>
