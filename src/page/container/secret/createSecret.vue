<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="backToSecret"
          ><span style="color: black; cursor: pointer"> Secret </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item style="color: black">{{ data.cluster }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: black"> 新建Secret </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <div
    class="deployee-class"
    style="display: flex; flex-direction: column; width: 100%; height: 100%"
  >
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="margin-top: 8px; width: 100%; border-radius: 0px">
          <el-form
            ref="ruleFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="100px"
            :rules="rules"
            status-icon
            :model="data.configmapForm"
            style="margin-left: 3%; width: 80%"
          >
            <div style="margin-top: 20px" />

            <el-form-item label="名称" prop="metadata.name" style="width: 80%">
              <el-input
                v-model="data.configmapForm.metadata.name"
                style="width: 40%; margin-left: 20px"
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
            <el-form-item label="适用范围">
              <el-card
                style="
                  margin-top: 10px;
                  margin-left: 20px;
                  background-color: #f2f2f2;
                  border-radius: 0px;
                  width: 60%;
                "
              >
                <div>ddd</div>
              </el-card>
            </el-form-item>

            <div v-if="data.secretType === '镜像仓库访问凭证'">
              <el-form-item label="镜像仓库域名" prop="dockerRegister.domain" style="width: 80%">
                <el-input
                  v-model="data.dockerRegister.domain"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>

              <el-form-item label="用户名" prop="dockerRegister.userName" style="width: 80%">
                <el-input
                  v-model="data.dockerRegister.userName"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>

              <el-form-item label="密码" prop="dockerRegister.password" style="width: 80%">
                <el-input
                  v-model="data.dockerRegister.password"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>

              <el-form-item
                label="密码确认"
                prop="dockerRegister.confirmPassword"
                style="width: 80%"
              >
                <el-input
                  v-model="data.dockerRegister.confirmPassword"
                  style="width: 30%; margin-left: 20px"
                />
              </el-form-item>
            </div>
            <div v-else-if="data.secretType === 'Opaque'">
              <div>
                <el-form-item label="内容" style="margin-top: 10px">
                  <div class="configmap-label-title" style="margin-left: 20px">变量名</div>
                  <div class="configmap-label-title" style="margin-left: 320px">变量值</div>
                  <el-divider style="left: 20px; width: 98%" />
                </el-form-item>

                <el-form-item
                  v-for="(item, index) in data.configMapLabels"
                  :key="index"
                  prop="item.key"
                  style="margin-top: -20px; margin-left: 20px"
                >
                  <div>
                    <el-input v-model="item.key" placeholder="变量名" style="width: 300px" />
                  </div>
                  <div style="margin-right: 8px; margin-left: 8px"></div>
                  =
                  <div>
                    <el-input
                      v-model="item.value"
                      placeholder="请输入变量值"
                      autosize
                      type="textarea"
                      style="width: 350px; margin-left: 20px"
                    />
                  </div>
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
                    <el-icon color=""><QuestionFilled /></el-icon>
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
                      <el-icon><QuestionFilled /></el-icon>
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

const { proxy } = getCurrentInstance();
const ruleFormRef = ref();
const secretNameSpace = ref(1);
const data = reactive({
  loading: false,
  cluster: '',
  namespaces: [],
  autosize: {
    minRows: 2,
  },

  configMapLabels: [{ key: null, value: null }],
  secretType: 'Opaque',
  secretNameSpace: '',
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

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Secret 名称', trigger: 'blur' }],
  'item.key': [{ required: true, message: 'key 不能为空', trigger: 'blur' }],
};

const dockerRegisterRules = {
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
      data.configMapLabels.forEach((item) => {
        data.configmapForm.data[item.key] = item.value;
      });
      try {
        const resp = await proxy.$http({
          method: 'post',
          url:
            `/proxy/pixiu/${data.cluster}/api/v1/namespaces/` +
            data.configmapForm.metadata.namespace +
            `/secrets`,
          data: data.configmapForm,
        });
        proxy.$message.success(`Secret ${data.configmapForm.metadata.name} 创建成功`);
        backToSecret();
      } catch (error) {}
    }
  });
};

const cancelCreate = () => {
  backToSecret();
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;

  data.path = proxy.$route.fullPath;

  data.configmapForm.metadata.namespace = proxy.$route.query.namespace;
  getNamespaceList();
});

const changeNamespace = async (val) => {
  data.configmapForm.metadata.namespace = val;
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
  } catch (error) {}
};

// 回到 configmap 页面
const backToSecret = () => {
  proxy.$router.push({
    name: 'Secret',
    query: data.query,
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

.secretNameSpace-class {
  margin: 0 auto;
  width: auto;
  text-align: left;
}
</style>
