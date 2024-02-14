<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
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
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Secret </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 新建Secret </span>
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
            :rules="rules"
            status-icon
            :model="data.secretForm"
            style="margin-left: 3%; width: 80%"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="名称" prop="metadata.name">
              <el-input
                v-model="data.secretForm.metadata.name"
                style="width: 49%; margin-left: 20px"
              />
              <div class="app-pixiu-line-describe2" style="margin-left: 20px">
                最长63个字符，只能包含小写字母、数字及分隔符("-"),且必须以小写字母开头，数字或小写字母结尾
              </div>
            </el-form-item>

            <el-form-item label="Secret类型" style="width: 500px; margin-right: 20px">
              <div style="margin-left: 20px">
                <el-radio-group v-model="data.secretType">
                  <el-radio-button label="Opaque" />
                  <el-radio-button label="TLS证书" />
                  <el-radio-button label="镜像仓库访问凭证" />
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="适用范围" style="width: 1100px">
              <el-card
                style="
                  margin-top: 10px;
                  margin-left: 20px;
                  background-color: #f2f2f2;
                  border-radius: 0px;
                  width: 61%;
                "
              >
                <div>
                  <div>
                    <div style="margin-top: -10px">
                      <input
                        id="huey"
                        v-model="data.namespaceFlag"
                        type="radio"
                        name="drone"
                        :value="true"
                        checked
                      />
                      <label for="huey" class="el-radio-label"
                        ><span class="el-radio-label-value" style="font-size: 12px"
                          >指定命名空间</span
                        ></label
                      >
                    </div>

                    <div style="margin-top: -4px">
                      <input
                        id="dewey"
                        v-model="data.namespaceFlag"
                        type="radio"
                        name="drone"
                        :value="false"
                      />
                      <label for="dewey" class="el-radio-label">
                        <span class="el-radio-label-value" style="font-size: 12px"
                          >存量所有命名空间（不包括系统命名空间和后续增量命名空间）</span
                        ></label
                      >
                    </div>
                  </div>
                  <el-transfer
                    v-if="data.namespaceFlag === true"
                    v-model="data.transferData"
                    :filterable="true"
                    :titles="['当前集群可用命名空间', '已选择 (' + data.transferData.length + ')']"
                    :filter-method="filterMethod"
                    :show-arrow="false"
                    filter-placeholder="请输入命名空间"
                    :data="data.transferOptions"
                  />
                </div>
              </el-card>
            </el-form-item>

            <div v-if="data.secretType === '镜像仓库访问凭证'">
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
            <div v-else>
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
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();
const secretNameSpace = ref(1);
const data = reactive({
  loading: false,
  cluster: '',
  clusterName: '',

  namespaces: [],
  namespaceFlag: true,
  autosize: {
    minRows: 2,
  },
  systemNameSpaces: ['default', 'kube-node-lease', 'kube-public', 'kube-system'],
  labels: [{ key: null, value: null }],
  secretType: 'Opaque',
  secretNameSpace: '',
  // secret 创建初始对象
  secretForm: {
    metadata: {
      name: '',
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
  transferData: [],
  transferOptions: [],
  tlsCertificate: {
    crt: '',
    key: '',
  },
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Secret 名称', trigger: 'blur' }],
  'dockerRegister.domain': [{ required: true, message: '请输入镜像仓库域名', trigger: 'blur' }],
  'dockerRegister.userName': [{ required: true, message: '请输入镜像仓库用户名', trigger: 'blur' }],
  'dockerRegister.password': [{ required: true, message: '请输入镜像仓库密码', trigger: 'blur' }],
  'dockerRegister.confirmPassword': [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
  ],
};
const comfirmCreate = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      let kind = 'Secret';
      let name = data.secretForm.metadata.name;
      let namespaces = data.systemNameSpaces;
      if (data.namespaceFlag) {
        if (data.transferData.length === 0) {
          ElMessage.warning('请指定命名空间或存量所有命名空间');
          return;
        }
        namespaces = data.transferData;
      }
      for (let namespace of namespaces) {
        let url =
          `/proxy/pixiu/${data.cluster}/api/v1/namespaces/` + namespace + `/secrets/` + name;
        const result = await checkExist(kind, name, namespace, url);
        if (!result) {
          return;
        }
      }
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
      } else if (data.secretType === 'TLS证书') {
        form.type = 'kubernetes.io/tls';
        form.data['tls.crt'] = data.tlsCertificate.crt;
        form.data['tls.key'] = data.tlsCertificate.key;
      } else {
        form.type = 'kubernetes.io/dockercfg';
        form.data['.dockercfg'] = btoa(JSON.stringify(data.secretForm.dockerRegister));
      }

      for (let namespace of namespaces) {
        let url = `/proxy/pixiu/${data.cluster}/api/v1/namespaces/` + namespace + `/secrets`;
        await createSecret(url, form);
      }

      backToSecret();
    }
  });
};

const checkExist = async (kind, name, namespace, url) => {
  try {
    const resp = await proxy.$http({
      method: 'get',
      url: url,
    });
    ElMessage.warning(`${kind}: ${name}(${namespace}) 已存在`);
    return false;
  } catch (error) {
    if (error.response.status === 404) {
      return true;
    }
  }
};

const createSecret = async (url, data) => {
  try {
    const resp = await proxy.$http({
      method: 'post',
      url: url,
      data: data,
    });
    proxy.$message.success(`Secret ${data.metadata.name} 创建成功`);
  } catch (error) {}
};

const cancelCreate = () => {
  backToSecret();
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  data.secretForm.metadata.namespace = proxy.$route.query.namespace;
  getNamespaceList();
});

const changeNamespace = async (val) => {
  data.secretForm.metadata.namespace = val;
};

const getNamespaceList = async () => {
  try {
    const result = await proxy.$http({
      method: 'get',
      url: '/proxy/pixiu/' + data.cluster + '/api/v1/namespaces',
    });

    data.namespaces = [];
    for (let item of result.items) {
      data.namespaces.push(item.metadata.name);
    }

    for (let item of result.items) {
      data.transferOptions.push({ key: item.metadata.name, label: item.metadata.name });
    }
  } catch (error) {}
};

// 回到 secret 页面
const backToSecret = () => {
  proxy.$router.push({
    name: 'Secret',
    query: data.query,
  });
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

.deployee-class .el-main {
  background-color: #f3f4f7;
}

.app-pixiu-line-describe {
  margin-left: 100px;
  margin-top: -18px;
  font-size: 12px;
  color: #888888;
}
.pixiu-upload {
  background: #ffffff; /* 设置背景色为白色 */
  border: none; /* 去除边框 */
}

.app-pixiu-line-describe-tls {
  margin-top: -28px;
  font-size: 10px;
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

.el-radio-label {
  margin-top: 15px;
}

.el-radio-label-value {
  font-size: 13px;
  color: #888888;
  padding-left: 3px;
  padding-top: -40px;
}

.el-checkbox__label {
  display: inline-block;
  padding-left: 8px;
  line-height: 1;
  font-size: 13px;
  color: black;
}

.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
  font-size: 12px;
  color: black;
  font-weight: 400;
}
</style>
