<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 50px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToIngress"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Ingresses </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建Ingress </span>
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
            class="create-card-form"
          >
            <div style="margin-top: 20px" />
            <el-form-item label="名称" prop="metadata.name" style="width: 500px">
              <el-input v-model="data.form.metadata.name" />
              <div class="app-pixiu-line-describe2">
                最长63个字符，只能包含小写字母、数字及分隔符("-")
              </div>
            </el-form-item>

            <div style="margin-top: -10px" />
            <el-form-item label="命名空间" style="width: 380px">
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

              <div style="margin-left: 10px; margin-top: 6px">
                <pixiu-icon
                  name="icon-icon-refresh"
                  style="cursor: pointer"
                  size="16px"
                  type="iconfont"
                  color="#909399"
                  @click="syncNamespaces"
                />
              </div>
            </el-form-item>

            <div style="margin-top: 20px" />
            <el-form-item label="端口" style="width: 600px">
              <el-radio-group v-model="data.ingressPort" style="margin-top: 4px">
                <el-radio-button label="http">http</el-radio-button>
                <el-radio-button label="https">https</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <div style="margin-top: -6px" />
            <el-form-item label="转发规则" style="width: 600px">
              <el-button type="text" class="app-action-btn" @click="addRule">增加</el-button>
            </el-form-item>
            <el-form-item
              v-for="(item, index) in data.form.rules"
              :key="index"
              style="margin-top: -30px"
            >
              <el-card
                style="
                  width: 80%;
                  height: 180px;
                  background-color: #f2f2f2;
                  margin-top: 15px;
                  border-radius: 0px;
                "
              >
                <div style="float: right; cursor: pointer" @click="deleteRule(index)">
                  <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
                </div>

                <el-form-item
                  label="域名"
                  :prop="'rules[' + index + '].domain'"
                  :rules="[{ required: true, message: '域名不能为空', trigger: 'blur' }]"
                >
                  <el-input
                    v-model="item.domain"
                    placeholder="请输入 ingress 的全称域名"
                    style="width: 60%; margin-left: -40px"
                  />
                </el-form-item>

                <el-form-item
                  label="路径"
                  style="margin-top: 15px"
                  :rules="[{ required: true, trigger: 'blur' }]"
                >
                  <div class="label-title-style" style="font-size: 13px; margin-left: -40px">
                    Path
                  </div>
                  <div class="label-title-style" style="margin-left: 150px; font-size: 13px">
                    服务
                  </div>
                  <div class="label-title-style" style="margin-left: 145px; font-size: 13px">
                    端口
                  </div>
                  <el-divider style="width: 100%; margin-top: 2px; margin-left: -40px" />
                </el-form-item>

                <el-form-item style="margin-top: -10px; margin-left: 60px">
                  <el-form-item
                    :prop="'rules[' + index + '].path'"
                    :rules="[{ required: true, message: 'Path 不能为空', trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="item.path"
                      placeholder="请输入路径或正则"
                      style="width: 160px"
                    />
                  </el-form-item>
                  <el-form-item
                    style="margin-left: 20px; width: 150px"
                    :prop="'rules[' + index + '].service'"
                    :rules="[{ required: true, message: '服务不能为空', trigger: 'blur' }]"
                  >
                    <el-select v-model="item.service">
                      <el-option
                        v-for="svc in data.services"
                        :key="svc"
                        :value="svc"
                        :label="svc"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item
                    style="margin-left: 20px"
                    :prop="'rules[' + index + '].port'"
                    :rules="[{ required: true, message: '服务端口不能为空', trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="item.port"
                      placeholder="1-65535内的整数"
                      style="width: 150px"
                    />
                  </el-form-item>
                </el-form-item>
              </el-card>
            </el-form-item>

            <!-- <el-form-item label="会话保持" style="margin-top: 20px">
              <el-switch v-model="data.Session" inline-prompt width="40px" />
            </el-form-item> -->

            <div style="margin-top: 30px" />
            <el-form-item style="margin-left: 30%">
              <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
              <el-button class="pixiu-confirm-button" type="primary" @click="comfirm()"
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
import { getServiceList } from '@/services/kubernetes/serviceService';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';
import { createIngress } from '@/services/kubernetes/ingressService';

const ruleFormRef = ref();
const { proxy } = getCurrentInstance();
const data = reactive({
  loading: false,
  cluster: '',
  clusterName: '',

  Session: false,
  ingressPort: 'http',

  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    rules: [],
  },
  objectForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      rules: [],
    },
  },

  namespaces: [],
  services: [],
  service: '',
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Ingress 名称', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  syncNamespaces();
  syncServices();
  addRule();
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

const comfirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      data.objectForm.metadata = data.form.metadata;

      for (let rule of data.form.rules) {
        let paths = [];
        paths.push({
          pathType: 'ImplementationSpecific',
          backend: {
            service: {
              name: rule.service,
              port: {
                number: parseInt(rule.port),
              },
            },
          },
        });

        data.objectForm.spec.rules.push({
          host: rule.domain,
          http: {
            paths: paths,
          },
        });
      }

      const [result, err] = await createIngress(
        data.cluster,
        data.objectForm.metadata.namespace,
        data.objectForm,
      );
      if (err) {
        proxy.$message.error(err.response.data.message);
        return;
      }

      proxy.$message.success(`Ingress ${data.form.metadata.name} 创建成功`);
      backToIngress();
    }
  });
};

const cancel = () => {
  backToIngress();
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.form.metadata.namespace = val;

  syncServices();
};

const syncNamespaces = async () => {
  const [result, err] = await getNamespaceNames(data.cluster);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }
  data.namespaces = result;
};

const syncServices = async () => {
  const [err, svc] = await getServiceList(data.cluster, data.form.metadata.namespace);
  if (err) {
    return;
  }

  data.services = [];
  for (let item of svc.items) {
    data.services.push(item.metadata.name);
  }

  if (data.services.length > 0) {
    data.service = data.services[0];
  } else {
    data.service = '';
  }
};

const addRule = () => {
  data.form.rules.push({
    domain: '',
    path: '',
    service: '',
    port: '',
  });
};

const deleteRule = (index) => {
  if (data.form.rules.length === 1) {
    proxy.$message.error('至少需要 1 域名规则');
    return;
  }
  data.form.rules.splice(index, 1);
};

const backToIngress = () => {
  proxy.$router.push({
    name: 'Ingress',
    query: data.query,
  });
};
</script>

<style></style>
