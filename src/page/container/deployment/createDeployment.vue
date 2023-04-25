<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 Deployment</div>
  </el-card>

  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 16px; width: 100%">
          <el-form :label-position="labelPosition" label-width="120px">
            <div style="margin-top: 20px" />
            <el-form-item label="名称" style="width: 500px">
              <el-input v-model="data.deploymentForm.metadata.name" />
              <div class="app-pixiu-describe">
                最长63个字符，只能包含小写字母、数字及分隔符(“-")
              </div>
            </el-form-item>

            <el-form-item label="命名空间" style="width: 300px">
              <div class="namespace-select-container">
                <el-select
                  v-model="data.deploymentForm.metadata.namespace"
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

            <div style="margin-top: 20px" />
            <el-form-item label="Labels">
              <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
            </el-form-item>
            <div class="app-pixiu-line-describe">
              标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符.
            </div>

            <el-form-item label="容器配置" style="margin-top: 20px">
              <el-button type="text" class="app-action-btn" @click="addLabel">增加容器</el-button>
            </el-form-item>

            <el-form-item style="margin-top: -35px">
              <el-card
                style="width: 90%; height: 210px; background-color: #f2f2f2; margin-top: 20px"
              >
                <el-col style="margin-top: -10px"
                  >名称
                  <el-input
                    v-model="data.containers.name"
                    class="deploy-pixiu-incard"
                    style="margin-left: 60px"
                    placeholder="请输入容器的名称"
                  />
                </el-col>

                <el-col style="margin-top: 10px"
                  >镜像
                  <el-input
                    v-model="data.containers.image"
                    style="margin-left: 60px"
                    class="deploy-pixiu-incard"
                  />
                </el-col>

                <el-col style="margin-top: 10px"
                  >镜像版本
                  <el-input
                    v-model="data.containers.image"
                    class="deploy-pixiu-incard"
                    style="margin-left: 32px"
                  />
                </el-col>

                <el-col style="margin-top: 10px"
                  >镜像拉取策略
                  <el-radio-group v-model="data.containers.pullpolicy" style="margin-left: 6px">
                    <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                    <el-radio-button label="Always">Always</el-radio-button>
                    <el-radio-button label="Never">Never</el-radio-button>
                  </el-radio-group>
                  <div class="container-line-describe">
                    设置镜像拉取策略，默认使用 IfNotPresent 策略
                  </div>
                </el-col>
              </el-card>
            </el-form-item>

            <el-form-item label="实例数量" style="margin-top: 20px">
              <el-input-number
                style="margin-top: 8px"
                v-model="data.deploymentForm.spec.replicas"
                :min="0"
                @change="handleChange"
            /></el-form-item>
            <div class="app-pixiu-line-describe" style="margin-top: -10px">
              Deployment replicas 设置
            </div>

            <div style="margin-top: 40px" />
            <el-form-item>
              <el-button type="primary" @click="comfirmCreate()">完成</el-button>
              <el-button @click="cancelCreate()">取消</el-button>
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
    minRows: 5,
  },

  containers: {
    name: '',
    image: '',
    pullpolicy: 'IfNotPresent',
  },

  deploymentForm: {
    kind: 'Deployment',
    apiVersion: 'apps/v1',
    metadata: {
      name: '',
      namespace: 'default',
      labels: ref([]),
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {},
      },
      template: {
        metadata: {
          labels: {},
        },
        spec: {
          containers: [],
        },
      },
    },
  },
});

const handleChange = (value) => {
  data.deploymentForm.spec.replicas = value;
};

const comfirmCreate = async () => {
  try {
    const resp = await proxy.$http({
      method: 'post',
      url: `/proxy/pixiu/${data.cluser}/api/v1/namespaces`,
      data: fileFormData,
    });
  } catch (error) {}

  proxy.$message.success(`集群 ${data.clusterForm.name} 导入成功`);
  backToContainer();
};

const cancelCreate = () => {
  backToContainer();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.path = proxy.$route.fullPath;

  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.deploymentForm.metadata.namespace = val;
};

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
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

const deleteLabel = (index) => {
  nodeTableData.value.splice(index, 1);
};

const addLabel = () => {
  nodeTableData.value.push({
    name: 'node1',
    address: '192.168.0.1',
    user: 'root',
    password: 'root123456',
  });
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: 'Container',
  });
};
</script>

<style scoped="scoped">
.box-card {
  margin-top: 20px;
}

.app-pixiu-content-card {
  display: flex;
  justify-content: space-around;
}

.el-main {
  background-color: #f3f4f7;
}

.app-pixiu-describe {
  font-size: 10px;
  color: #888888;
}

.app-pixiu-line-describe {
  margin-left: 120px;
  margin-top: -18px;
  font-size: 10px;
  color: #888888;
}

.app-action-btn {
  color: #006eff;
  font-size: 12px;
}

.title-card-container {
  height: 50px;
  margin-top: -20px;
  margin-left: -20px;
  margin-right: -20px;
}

.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.deploy-pixiu-incard {
  width: 200px;
  margin-left: 5px;
}

.container-line-describe {
  margin-left: 95px;
  font-size: 10px;
  color: #888888;
}
</style>
