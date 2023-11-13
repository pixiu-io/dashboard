<template>
  <el-card class="title-card-container">
    <div class="font-container">创建 Deployment</div>
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
            <el-form-item label="名称" style="width: 500px">
              <el-input v-model="data.deploymentForm.metadata.name" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
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

            <el-form-item label="Labels" style="margin-top: 20px">
              <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.deploymentLabels"
              :key="index"
              style="margin-top: -15px"
            >
              <div>
                <el-input v-model="item.key" placeholder="标签键" style="width: 200px" />
              </div>
              <div style="margin-right: 10px; margin-left: 10px"></div>
              <div>
                <el-input v-model="item.value" placeholder="标签值" style="width: 200px" />
              </div>
              <div
                style="float: right; cursor: pointer; margin-left: 10px"
                @click="deleteLabel(index)"
              >
                <el-icon><Delete /></el-icon>
              </div>
            </el-form-item>
            <div class="app-pixiu-line-describe">
              标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符.
            </div>

            <el-form-item label="容器配置" style="margin-top: 20px">
              <el-button type="text" class="app-action-btn" @click="addContainer"
                >增加容器</el-button
              >
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.deploymentForm.spec.template.spec.containers"
              :key="index"
              style="margin-top: -25px"
            >
              <el-card
                style="
                  width: 90%;
                  height: 185px;
                  background-color: #f2f2f2;
                  margin-top: 20px;
                  border-radius: 0px;
                "
              >
                <div style="float: right; cursor: pointer" @click="deleteContainer(index)">
                  <el-icon><Delete /></el-icon>
                </div>
                <el-col class="deploy-pixiu-column"
                  >容器名称
                  <el-input
                    v-model="item.name"
                    class="deploy-pixiu-incard"
                    style="margin-left: 30px"
                  />
                </el-col>

                <el-col style="margin-top: 10px" class="deploy-pixiu-column"
                  >镜像
                  <el-input
                    v-model="item.image"
                    style="margin-left: 56px"
                    class="deploy-pixiu-incard"
                  />
                </el-col>

                <el-col style="margin-top: 10px" class="deploy-pixiu-column"
                  >拉取策略
                  <el-radio-group v-model="item.imagePullPolicy" style="margin-left: 30px">
                    <el-radio label="IfNotPresent" border>IfNotPresent</el-radio>
                    <el-radio label="Always" border>Always</el-radio>
                    <el-radio label="Never" border>Never</el-radio>
                  </el-radio-group>
                  <div class="container-line-describe">
                    设置镜像拉取策略，默认使用 IfNotPresent 策略
                  </div>
                </el-col>
              </el-card>
            </el-form-item>

            <el-form-item label="实例数量" style="margin-top: 20px">
              <el-input-number
                v-model="data.deploymentForm.spec.replicas"
                style="margin-top: 8px"
                :min="0"
                size="small"
                @change="handleChange"
            /></el-form-item>
            <div class="app-pixiu-line-describe" style="margin-top: -10px">Deployment 副本设置</div>

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
    minRows: 5,
  },

  deploymentLabels: [],

  // deployment 创建初始对象
  deploymentForm: {
    metadata: {
      name: '',
      namespace: 'default',
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
          containers: [
            {
              name: '',
              image: '',
              imagePullPolicy: 'IfNotPresent',
            },
          ],
        },
      },
    },
  },
});

const handleChange = (value) => {
  data.deploymentForm.spec.replicas = value;
};

const comfirmCreate = async () => {
  data.deploymentForm.spec.selector.matchLabels['pixiu.io/app'] = data.deploymentForm.metadata.name;
  data.deploymentForm.spec.selector.matchLabels['pixiu.io/kind'] = 'deployment';
  data.deploymentForm.spec.template.metadata.labels = data.deploymentForm.spec.selector.matchLabels;

  for (let i = 0; i < data.deploymentLabels.length; i++) {
    data.deploymentForm.spec.template.metadata.labels[data.deploymentLabels[i].key] =
      data.deploymentLabels[i].value;
  }

  try {
    const resp = await proxy.$http({
      method: 'post',
      url:
        `/proxy/pixiu/${data.cluser}/apis/apps/v1/namespaces/` +
        data.deploymentForm.metadata.namespace +
        `/deployments`,
      data: data.deploymentForm,
    });
  } catch (error) {}

  proxy.$message.success(`deployment ${data.deploymentForm.metadata.name} 创建成功`);
  // backToContainer();
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

const addLabel = () => {
  data.deploymentLabels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.deploymentLabels.splice(index, 1);
};

const addContainer = () => {
  data.deploymentForm.spec.template.spec.containers.push({
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
  });
};

const deleteContainer = (index) => {
  data.deploymentForm.spec.template.spec.containers.splice(index, 1);
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: 'Container',
  });
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

.title-card-container {
  height: 50px;
  margin-top: -20px;
  margin-left: -20px;
  margin-right: -20px;
  border-radius: 0px;
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
