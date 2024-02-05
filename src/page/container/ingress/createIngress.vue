<template>
  <el-card class="title-card-container">
    <div class="font-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="backToIngress"
          ><span style="color: black; cursor: pointer"> Ingress </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item style="color: black">{{ data.cluster }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: black"> 创建 Ingress </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-card>

  <el-card class="create-card-style">
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      label-position="left"
      label-width="100px"
      require-asterisk-position="right"
      status-icon
      :model="data.form"
      style="margin-left: 3%; width: 80%"
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
            <el-option v-for="item in data.namespaces" :key="item" :value="item" :label="item" />
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
          <el-radio-button label="http" border>http</el-radio-button>
          <el-radio-button label="https" border>https</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div style="margin-top: -6px" />
      <el-form-item label="转发规则" style="width: 600px">
        <el-button type="text" class="app-action-btn" @click="addRule">增加</el-button>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in data.ingressRules"
        :key="index"
        style="margin-top: -30px"
      >
        <el-card
          style="
            width: 90%;
            height: 180px;
            background-color: #f2f2f2;
            margin-top: 20px;
            border-radius: 0px;
          "
        >
          <div style="float: right; cursor: pointer" @click="deleteRule(index)">
            <pixiu-icon name="icon-shanchu" size="14px" type="iconfont" color="#909399" />
          </div>

          <el-form
            label-position="left"
            label-width="100px"
            status-icon
            :model="data.ingressRules"
            require-asterisk-position="right"
            style="margin-left: 2%; width: 90%"
          >
            <div style="margin-top: 4px" />

            <el-form-item label="域名">
              <el-input
                v-model="item.domain"
                placeholder=""
                style="width: 70%; margin-left: -40px"
              />
            </el-form-item>

            <el-form-item label="路径" style="margin-top: 15px">
              <div class="label-title-style" style="font-size: 13px; margin-left: -40px">Path</div>
              <div class="label-title-style" style="margin-left: 150px; font-size: 13px">服务</div>
              <div class="label-title-style" style="margin-left: 155px; font-size: 13px">端口</div>
              <el-divider style="width: 100%; margin-top: 2px; margin-left: -40px" />
            </el-form-item>

            <el-form-item
              v-for="(ruleItem, ruleIndex) in data.ingressRules"
              :key="ruleIndex"
              style="margin-top: -10px; margin-left: 60px"
            >
              <div>
                <el-input
                  v-model="ruleItem.path"
                  placeholder="请输入路径或正则"
                  style="width: 160px"
                />
              </div>
              <div style="margin-left: 20px; width: 160px">
                <el-select v-model="ruleItem.service">
                  <el-option v-for="svc in data.services" :key="svc" :value="svc" :label="svc" />
                </el-select>
              </div>

              <div style="margin-left: 20px">
                <el-input
                  v-model="ruleItem.port"
                  placeholder="1-65535内的整数"
                  style="width: 130px"
                />
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-form-item>

      <el-form-item label="会话保持" style="margin-top: 20px">
        <el-switch v-model="data.Session" inline-prompt width="40px" />
      </el-form-item>

      <div style="margin-top: 30px" />
      <el-form-item style="margin-left: 30%">
        <el-button class="pixiu-cancel-button" @click="cancel()">取消</el-button>
        <el-button class="pixiu-confirm-button" type="primary" @click="comfirm()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, getCurrentInstance, onMounted, watch, ref } from 'vue';
import { getServiceList } from '@/services/kubernetes/serviceService';
import { getNamespaceList } from '@/services/kubernetes/namespaceService';
import { createIngress } from '@/services/kubernetes/ingressService';

const ruleFormRef = ref();
const { proxy } = getCurrentInstance();
const data = reactive({
  loading: false,
  Session: false,

  cluster: '',
  ingressPort: 'http',

  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      rules: [],
    },
  },

  ingressRules: [],

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
  data.path = proxy.$route.fullPath;

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
      if (data.ingressRules.length === 0) {
        proxy.$message.error('转发规则为必填项');
        return;
      }

      for (let rule of data.ingressRules) {
        let paths = [];
        paths.push({
          pathType: 'ImplementationSpecific',
          path: rule.path,
          backend: {
            service: {
              name: rule.service,
              port: {
                number: parseInt(rule.port),
              },
            },
          },
        });

        data.form.spec.rules.push({
          host: rule.domain,
          http: {
            paths: paths,
          },
        });
      }

      const [result, err] = await createIngress(
        data.cluster,
        data.form.metadata.namespace,
        data.form,
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
  const [err, ns] = await getNamespaceList(data.cluster, data.form.metadata.namespace);
  if (err) {
    return;
  }

  data.namespaces = [];
  for (let item of ns.items) {
    data.namespaces.push(item.metadata.name);
  }
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
  data.ingressRules.push({
    domain: '',
    path: '',
    service: '',
    port: '',
  });
};

const deleteRule = (index) => {
  data.ingressRules.splice(index, 1);
};

const backToIngress = () => {
  proxy.$router.push({
    name: 'Ingress',
    query: data.query,
  });
};
</script>

<style></style>
