<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 60px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToJob"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Jobs </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 新建Job </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="app-pixiu-content-card">
        <el-card class="create-card-style">
          <el-form
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.form"
            style="margin-left: 3%; width: 70%"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="名称" prop="metadata.name" style="width: 500px">
              <el-input v-model="data.form.metadata.name" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
              </div>
            </el-form-item>

            <el-form-item prop="description" label="描述" style="width: 65%">
              <el-input
                v-model="data.form.description"
                placeholder="请输入描述信息, 不超过1000个字符"
                type="textarea"
                :autosize="data.autosize"
              />
            </el-form-item>

            <el-form-item label="命名空间" style="width: 300px">
              <div class="namespace-select-container">
                <el-select v-model="data.form.metadata.namespace" @change="changeNamespace">
                  <el-option
                    v-for="item in data.namespaces"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </div>
            </el-form-item>

            <el-form-item label="Labels" style="margin-top: 10px">
              <el-button type="text" class="app-action-btn" @click="addLabel">新增</el-button>
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item
              v-for="(item, index) in data.form.labels"
              :key="index"
              class="labels-item-style"
            >
              <el-form-item
                :prop="'labels[' + index + '].key'"
                :rules="[{ required: true, message: '标签键不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.key" placeholder="标签键" style="width: 280px" />
              </el-form-item>

              <div style="margin-right: 10px; margin-left: 10px">=</div>

              <el-form-item
                :prop="'labels[' + index + '].value'"
                :rules="[{ required: true, message: '标签值不能为空', trigger: 'blur' }]"
              >
                <el-input v-model="item.value" placeholder="标签值" style="width: 280px" />
              </el-form-item>

              <div
                style="float: right; cursor: pointer; margin-left: 10px"
                @click="deleteLabel(index)"
              >
                <pixiu-icon
                  name="icon-shanchu"
                  size="14px"
                  type="iconfont"
                  style="margin-top: 10px; margin-left: 4px"
                  color="#909399"
                />
              </div>
            </el-form-item>

            <div class="app-pixiu-line-describe" style="margin-top: -5px">
              标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符.
            </div>

            <el-form-item label="Job设置" style="margin-top: 20px"> </el-form-item>
            <el-form-item style="margin-top: -45px">
              <el-card
                style="width: 80%; height: 185px; background-color: #f2f2f2; border-radius: 0px"
              >
                <el-form-item
                  :rules="[{ required: true, message: '重复次数不能为空', trigger: 'blur' }]"
                  style="margin-top: 10px"
                >
                  <span>重复次数</span>
                  <div class="configmap-label-title" style="margin-left: -3px">
                    <el-tooltip content="tls.crt" placement="top-start" popper-class="tooltip">
                      <pixiu-icon
                        name="icon-tishi"
                        size="25px"
                        type="iconfont"
                        style="vertical-align: middle; padding-left: -5px"
                        color="#909399"
                      />
                    </el-tooltip>
                  </div>
                  <el-input
                    v-model="data.job.spec.backoffLimit"
                    class="deploy-pixiu-incard"
                    style="margin-left: 58px"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ required: true, message: '容器名不能为空', trigger: 'blur' }]"
                  style="margin-top: 10px"
                >
                  <span>并行度</span>
                  <div class="configmap-label-title" style="margin-left: -3px">
                    <el-tooltip content="tls.crt" placement="top-start" popper-class="tooltip">
                      <pixiu-icon
                        name="icon-tishi"
                        size="25px"
                        type="iconfont"
                        style="vertical-align: middle; padding-left: -5px"
                        color="#909399"
                      />
                    </el-tooltip>
                  </div>
                  <el-input
                    v-model="data.job.spec.backoffLimit"
                    class="deploy-pixiu-incard"
                    style="margin-left: 72px"
                  />
                </el-form-item>
                <el-form-item
                  :rules="[{ required: true, message: '容器名不能为空', trigger: 'blur' }]"
                  style="margin-top: 10px"
                >
                  <span>失败重启策略</span>
                  <div class="configmap-label-title" style="margin-left: -3px">
                    <el-tooltip content="tls.crt" placement="top-start" popper-class="tooltip">
                      <pixiu-icon
                        name="icon-tishi"
                        size="25px"
                        type="iconfont"
                        style="vertical-align: middle; padding-left: -5px"
                        color="#909399"
                      />
                    </el-tooltip>
                  </div>
                  <el-input
                    v-model="data.job.spec.template.spec.restartPolicy"
                    class="deploy-pixiu-incard"
                    style="margin-left: 30px"
                  />
                </el-form-item>
              </el-card>
            </el-form-item>

            <el-form-item label="可抢占" style="margin-top: 20px">
              <el-switch v-model="data.Session" inline-prompt width="40px" />
            </el-form-item>

            <el-form-item label="容器配置" style="margin-top: 20px">
              <el-button type="text" class="app-action-btn" @click="addContainer"
                >增加容器</el-button
              >
            </el-form-item>
            <div style="margin-top: -15px"></div>
            <el-form-item
              v-for="(item, index) in data.form.containers"
              :key="index"
              style="margin-top: -25px"
            >
              <el-card
                style="
                  width: 80%;
                  height: 185px;
                  background-color: #f2f2f2;
                  margin-top: 20px;
                  border-radius: 0px;
                "
              >
                <div style="float: right; cursor: pointer" @click="deleteContainer(index)">
                  <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                </div>

                <el-form-item
                  :prop="'containers[' + index + '].name'"
                  :rules="[{ required: true, message: '容器名不能为空', trigger: 'blur' }]"
                  >容器名称
                  <el-input
                    v-model="item.name"
                    class="deploy-pixiu-incard"
                    style="margin-left: 30px"
                  />
                </el-form-item>

                <el-form-item
                  style="margin-top: 10px"
                  :prop="'containers[' + index + '].image'"
                  :rules="[{ required: true, message: '镜像不能为空', trigger: 'blur' }]"
                  >镜像
                  <el-input
                    v-model="item.image"
                    style="margin-left: 58px"
                    class="deploy-pixiu-incard"
                  />
                </el-form-item>

                <el-col style="margin-top: 10px" class="deploy-pixiu-column"
                  >拉取策略
                  <el-radio-group v-model="item.imagePullPolicy" style="margin-left: 30px">
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
                v-model="data.job.spec.replicas"
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
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { createDeployment } from '@/services/kubernetes/deploymentService';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Deployment 名称', trigger: 'blur' }],
};

const data = reactive({
  loading: false,
  cluster: '',
  clusterName: '',

  namespaces: [],

  autosize: {
    minRows: 5,
  },

  // 检验 form
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    labels: [],
    selector: [],
    containers: [],
  },

  // deployment 创建初始对象
  job: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      parallelism: '',
      completions: '',
      backoffLimit: '',
      selector: {
        matchLabels: {},
      },
      template: {
        metadata: {
          labels: {},
        },
        spec: {
          containers: [],
          restartPolicy: '',
        },
      },
    },
  },
});

const handleChange = (value) => {
  data.job.spec.replicas = value;
};

const comfirmCreate = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.job.metadata = data.form.metadata;
      data.job.spec.template.spec.containers = data.form.containers;

      data.job.spec.selector.matchLabels['pixiu.io/app'] = data.form.metadata.name;
      data.job.spec.selector.matchLabels['pixiu.io/kind'] = 'deployment';
      data.job.spec.template.metadata.labels = data.job.spec.selector.matchLabels;

      // 追加 labels
      if (data.form.labels.length > 0) {
        data.job.metadata['labels'] = {};
        for (let item of data.form.labels) {
          data.job.metadata['labels'][item.key] = item.value;
        }
      }

      const [result, err] = await createDeployment(
        data.cluster,
        data.form.metadata.namespace,
        data.job,
      );
      if (err) {
        proxy.$message.error(err.response.data.message);
        return;
      }

      proxy.$message.success(`Deployment ${data.form.metadata.name} 创建成功`);

      backToJob();
    }
  });
};

const cancelCreate = () => {
  backToJob();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.cluster = data.cloud.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  addContainer();
  getNamespaceList();
});

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.job.metadata.namespace = val;
};

const getNamespaceList = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const addLabel = () => {
  data.form.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.form.labels.splice(index, 1);
};

const addContainer = () => {
  data.form.containers.push({
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
  });
};

const deleteContainer = (index) => {
  if (data.form.containers.length === 1) {
    proxy.$message.error('至少需要 1 个容器组');
    return;
  }
  data.form.containers.splice(index, 1);
};

// 回到 deployment 页面
const backToJob = () => {
  proxy.$router.push({
    name: 'Job',
    query: data.cloud,
  });
};
</script>

<style>
.box-card {
  margin-top: 20px;
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
