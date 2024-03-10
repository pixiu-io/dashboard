<template>
  <div
    class="configmap-class"
    style="display: flex; flex-direction: column; width: 100%; height: 100%"
  >
    <div style="width: 100%; height: 85px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToSecret"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.cluster }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Secrets </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.secretForm.metadata.name }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 更新配置 </span>
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
            label-width="110px"
            :rules="dockerRegisterRules"
            status-icon
            :model="data.secretForm"
            style="margin-left: 3%; width: 80%"
          >
            <el-form-item label="基本信息" style="margin-top: 20px" class="base-info">
            </el-form-item>
            <el-form-item label="集群ID" style="margin-top: 10px">{{ data.cluster }}</el-form-item>
            <el-form-item label="所在命名空间" style="margin-top: 10px">{{
              data.secretForm.metadata.namespace
            }}</el-form-item>
            <el-form-item label="资源名称" style="margin-top: 10px">{{
              data.secretForm.metadata.name
            }}</el-form-item>
            <el-divider />

            <div v-if="data.secretType === 'kubernetes.io/dockercfg'">
              <el-form-item label="镜像仓库域名" prop="dockerRegister.domain" style="width: 80%">
                <el-input
                  v-model="data.secretForm.dockerRegister.domain"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>

              <el-form-item label="用户名" prop="dockerRegister.userName" style="width: 80%">
                <el-input
                  v-model="data.secretForm.dockerRegister.userName"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>

              <el-form-item label="密码" prop="dockerRegister.password" style="width: 80%">
                <el-input
                  v-model="data.secretForm.dockerRegister.password"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>

              <el-form-item
                label="密码确认"
                prop="dockerRegister.confirmPassword"
                style="width: 80%"
              >
                <el-input
                  v-model="data.secretForm.dockerRegister.confirmPassword"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>
            </div>
            <div v-else-if="data.secretType === 'Opaque'">
              <div>
                <el-form-item label="内容" style="margin-top: 10px">
                  <div class="configmap-label-title" style="margin-left: 20px">
                    <span>变量名</span>
                    <el-tooltip content="tls.crt" placement="top-start" popper-class="tooltip">
                      <pixiu-icon
                        name="icon-tishi"
                        size="20px"
                        type="iconfont"
                        style="vertical-align: middle; padding-left: 5px"
                        color="#909399"
                      />
                    </el-tooltip>
                  </div>
                  <div class="configmap-label-title" style="margin-left: 320px">变量值</div>
                  <el-divider style="left: 20px; width: 98%" />
                </el-form-item>

                <el-form-item
                  v-for="(item, index) in data.secretForm.labels"
                  :key="index"
                  prop="item.key"
                  style="margin-top: -20px; margin-left: 20px"
                >
                  <el-form-item
                    :prop="'labels[' + index + '].key'"
                    :rules="[{ required: true, message: '变量名不能为空', trigger: 'blur' }]"
                  >
                    <el-input v-model="item.key" placeholder="变量名" style="width: 300px" />
                  </el-form-item>
                  <div style="margin-right: 8px; margin-left: 8px"></div>
                  =
                  <el-form-item
                    :prop="'labels[' + index + '].value'"
                    :rules="[{ required: true, message: '变量值不能为空', trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="item.value"
                      placeholder="请输入变量值"
                      autosize
                      type="textarea"
                      style="width: 350px; margin-left: 20px"
                    />
                  </el-form-item>
                  <div
                    style="float: right; cursor: pointer; margin-left: 15px; margin-top: 6px"
                    @click="deleteLabel(index)"
                  >
                    <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                  </div>
                  <el-divider />
                </el-form-item>
                <div class="app-pixiu-line-describe4" style="margin-left: 120px">
                  只能包含字母、数字及分隔符"."; 变量名为空时，在变量名称中粘贴一行或多行 key=value
                  key: value 的键值对可以实现快速批量输入
                </div>
                <el-form-item>
                  <el-button
                    class="table-inline-btn"
                    style="margin-left: 4px; margin-right: -20px; margin-top: 15px"
                    @click="addLabel"
                    >手动增加</el-button
                  >
                  <el-button class="table-inline-btn" style="margin-top: 15px" @click="addLabel"
                    >文件导入</el-button
                  >
                </el-form-item>
              </div>
            </div>
            <div v-else-if="data.secretType === 'kubernetes.io/tls'">
              <el-form-item label="内容" style="margin-top: 10px"> </el-form-item>

              <el-form-item style="margin-top: -40px; margin-left: 20px">
                <el-card>
                  <div style="margin-top: -15px">
                    <span class="app-pixiu-line-describe-tls">证书</span>
                    <el-tooltip content="tls.crt" placement="top-start" popper-class="tooltip">
                      <pixiu-icon
                        name="icon-wenhao1"
                        size="15px"
                        type="iconfont"
                        style="vertical-align: middle; padding-left: 5px"
                        color="#909399"
                      />
                    </el-tooltip>
                    <span style="display: inline-block"
                      ><el-upload
                        class="pixiu-upload"
                        :style="{ background: '#ffffff', border: 'none' }"
                      >
                        <button class="pixiu-two-button2" style="margin-left: 300px; border: none">
                          文件导入
                        </button></el-upload
                      ></span
                    >
                  </div>
                  <el-input
                    v-model="data.tlsCertificate.crt"
                    type="textarea"
                    :rows="10"
                    style="width: 400px"
                  />
                </el-card>
                <div style="margin-right: 10px; margin-left: 10px"></div>
                <div>
                  <el-card>
                    <div style="margin-top: -15px">
                      <span class="app-pixiu-line-describe-tls">私钥</span>
                      <el-tooltip content="tls.key" placement="top-start" popper-class="tooltip">
                        <pixiu-icon
                          name="icon-wenhao1"
                          size="15px"
                          type="iconfont"
                          style="vertical-align: middle; padding-left: 5px"
                          color="#909399"
                        />
                      </el-tooltip>
                      <span style="display: inline-block"
                        ><el-upload
                          class="pixiu-upload"
                          :style="{ background: '#ffffff', border: 'none', width: '40px' }"
                        >
                          <button
                            class="pixiu-two-button2"
                            style="margin-left: 300px; border: none"
                          >
                            文件导入
                          </button></el-upload
                        ></span
                      >
                    </div>
                    <el-input
                      v-model="data.tlsCertificate.key"
                      type="textarea"
                      :rows="10"
                      style="width: 400px"
                    />
                  </el-card>
                </div>
              </el-form-item>
            </div>
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

<script setup type="text/jsx">
import { reactive, getCurrentInstance, onMounted, ref } from 'vue';
import {
  getSecret,
} from '@/services/kubernetes/secretService';
const { proxy } = getCurrentInstance();

const ruleFormRef = ref();
const data = reactive({
  loading: false,
  cluster: '',
  namespaces: [],
  autosize: {
    minRows: 5,
  },
  secretType: '',
  secretLabels: [],
  // secret 创建初始对象
  secretForm: {
    metadata: {
      name: '',
      namespace: '',
    },
    data: {},
    labels: [{ key: null, value: null }],
    dockerRegister: {
      domain: '',
      userName: '',
      password: '',
      confirmPassword: '',
    },
  },
  secretFormData: {
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
  tlsCertificate: {
    crt: '',
    key: '',
  },
  dockerRegister: {
    domain: '',
    userName: '',
    password: '',
    confirmPassword: '',
  },
});

const dockerRegisterRules = {
  'dockerRegister.domain': [{ required: true, message: '请输入镜像仓库域名', trigger: 'blur' }],
  'dockerRegister.userName': [{ required: true, message: '请输入镜像仓库用户名', trigger: 'blur' }],
  'dockerRegister.password': [{ required: true, message: '请输入镜像仓库密码', trigger: 'blur' }],
  'dockerRegister.confirmPassword': [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
  ],
};

const cancelUpdate = () => {
  backToSecret();
};

onMounted(() => {
  data.cloud = proxy.$route.query;
  data.cluster = proxy.$route.query.cluster;
  data.secretForm.metadata.name = data.cloud.name;
  getNamespace();
  getSecretByName();
});

const getNamespace = async () => {
  const namespace = localStorage.getItem('namespace');
  if (namespace) {
    data.namespace = namespace;
  }
};

const getSecretByName = async () => {
  data.loading = true;
  const [result, err] = await getSecret(data.cluster, data.namespace, data.cloud.name);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.secretForm.metadata = result.metadata;
  data.secretType = result.type;
  if (result.type === 'kubernetes.io/dockercfg') {
    data.secretForm.dockerRegister = JSON.parse(atob(result.data['.dockercfg']));
  }else if (result.type === 'Opaque'){
    let labels = Object.entries(result.data).map(([key, value]) => ({ key, value }));
    data.secretForm.labels = labels.map(label => ({ key: label.key, value: atob(label.value) }))
  }else if (result.type === 'kubernetes.io/tls'){
    data.tlsCertificate = Object.entries(result.data).map(([key, value]) => ({ key, value }));
  }
};

// 回到 secret 页面
const backToSecret = () => {
  proxy.$router.push({
    name: 'Secret',
    query: data.cloud,
  });
};

const comfirmUpdate = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      let name = data.secretForm.metadata.name;
      let url =
          `/pixiu/proxy/${data.cluster}/api/v1/namespaces/${data.namespace}/secrets/` + name;
      let form = {
        metadata: {
          name: name,
        },
        data: {},
      };

      if (data.secretType === 'Opaque') {
        data.secretForm.labels.forEach((item) => {
          form.data[item.key] = btoa(item.value);
        });
        form.type = 'Opaque';
      } else if (data.secretType === 'kubernetes.io/tls') {
        form.type = 'kubernetes.io/tls';
        form.data['tls.crt'] = data.tlsCertificate.crt;
        form.data['tls.key'] = data.tlsCertificate.key;
      } else {
        form.type = 'kubernetes.io/dockercfg';
        form.data['.dockercfg'] = btoa(JSON.stringify(data.secretForm.dockerRegister));
      }
      updateSecret(url, form);
    }
  });
};

const updateSecret = async (url, data) => {
  try {
    const resp = await proxy.$http({
      method: 'PUT',
      url: url,
      data: data,
    });
    proxy.$message.success(`Secret ${data.metadata.name} 更新成功`);
    backToSecret();
  } catch (error) {}
};

const addLabel = () => {
  data.secretForm.labels.push({
    key: '',
    value: '',
  });
};

const deleteLabel = (index) => {
  data.secretForm.labels.splice(index, 1);
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

.app-pixiu-line-describe5 {
  margin-left: 120px;
  margin-top: -10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #888888;
}
.font-container {
  margin-top: -5px;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
}

.base-info .el-form-item__label {
  color: black;
  font-weight: bolder;
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
