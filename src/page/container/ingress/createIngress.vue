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
        <el-radio-group v-model="data.targetPort" style="margin-top: 4px">
          <el-radio-button label="80" border>80</el-radio-button>
          <el-radio-button label="443" border>443</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div style="margin-top: -6px" />
      <el-form-item label="转发规则" style="width: 600px">
        <el-button type="text" class="app-action-btn" @click="addRule">增加</el-button>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in data.form.spec.rules"
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
            ref="ruleFormRef"
            :rules="rules"
            label-position="left"
            label-width="100px"
            status-icon
            :model="data.form"
            require-asterisk-position="right"
            style="margin-left: 2%; width: 80%"
          >
            <div style="margin-top: 4px" />

            <el-form-item label="域名">
              <el-input v-model="item.domain" placeholder="" style="width: 70%" />
            </el-form-item>

            <el-form-item label="路径" style="margin-top: 15px">
              <div class="label-title-style" style="font-size: 13px">Path</div>
              <div class="label-title-style" style="margin-left: 160px; font-size: 13px">服务</div>
              <div class="label-title-style" style="margin-left: 185px; font-size: 13px">端口</div>
              <el-divider style="width: 100%; margin-top: 2px" />
            </el-form-item>

            <el-form-item
              v-for="(item, index) in data.form.spec.rules"
              :key="index"
              style="margin-top: -10px; margin-left: 100px"
            >
              <div>
                <el-input v-model="item.path" placeholder="请输入路径或正则" />
              </div>
              <div style="margin-left: 20px">
                <el-select v-model="data.service">
                  <el-option
                    v-for="item in data.services"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </div>
              <div style="margin-left: 20px">
                <el-input v-model="item.port" placeholder="1-65535内的整数" />
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

const ruleFormRef = ref();
const { proxy } = getCurrentInstance();
const data = reactive({
  loading: false,
  Session: false,

  clutser: '',
  targetPort: 80,

  form: {
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
  data.path = proxy.$route.fullPath;

  syncNamespaces();
  syncServices();
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {},
);

const comfirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('data', data.form);
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
  }
};

const addRule = () => {
  data.form.spec.rules.push({
    domain: '',
  });
};

const deleteRule = (index) => {
  data.form.spec.rules.splice(index, 1);
};

const backToIngress = () => {
  proxy.$router.push({
    name: 'Ingress',
    query: data.query,
  });
};
</script>

<style></style>
