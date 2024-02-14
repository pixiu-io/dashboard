<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div style="width: 100%; height: 75px; background: #ffffff; display: flex; align-items: center">
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToService"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 集群 </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> {{ data.clusterName }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> Service </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style"> 创建Service </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--
    本身就是在一个el-main下面了，没有特殊需求
    就不要再套一层el-main
    因为el-card下面引用了create-card-style的样式里面width=100%
    导致了下面出现了滚动条
  -->
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
                  @click="getNamespaceList"
                />
              </div>
            </el-form-item>

            <div style="margin-top: 20px" />
            <el-form-item label="类型" style="width: 600px">
              <el-radio-group v-model="data.form.spec.type" style="margin-top: 4px">
                <el-radio-button label="ClusterIP">ClusterIP</el-radio-button>
                <el-radio-button label="NodePort">NodePort</el-radio-button>
                <el-radio-button label="LoadBalancer">LoadBalancer</el-radio-button>
              </el-radio-group>
              <div class="app-pixiu-line-describe2">
                <div v-if="data.form.spec.type === 'ClusterIP'">
                  通过集群的内部 IP 公开 Service，选择该值时 Service 只能够在集群内部访问。
                </div>
                <div v-else-if="data.form.spec.type === 'NodePort'">
                  通过每个节点上的 IP 和静态端口公开 Service
                </div>
                <div v-else>使用云平台的负载均衡器向外部公开 Service。</div>
              </div>
            </el-form-item>

            <div style="margin-top: -6px" />
            <el-form-item label="使用方式" style="width: 600px">
              <el-radio-group v-model="data.serviceType" style="margin-top: 4px">
                <el-radio-button label="常规服务">常规服务</el-radio-button>
                <el-radio-button label="Headless">Headless</el-radio-button>
              </el-radio-group>
              <div class="app-pixiu-line-describe2">
                <div v-if="data.serviceType === 'Headless'">
                  不需要负载均衡，也不需要单独的 Service IP。
                </div>
              </div>
            </el-form-item>

            <el-form-item label="标签">
              <el-button type="text" class="app-action-btn" style="color: #3377ff" @click="addLabel"
                >新增</el-button
              >
            </el-form-item>
            <!--
          el-form的model绑定的是data.form
          所以下面所有要经过表单校验的内容都必须在form里面，
          原来的labels是直接写在data下的会导致校验不成功，需要调整
          其余的参考这个内容去实现
        -->
            <el-form-item
              v-for="(item, index) in data.form.labels"
              :key="index"
              class="labels-item-style"
              style="margin-top: -15px"
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
              标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
            </div>

            <div style="margin-top: 10px" />
            <el-form-item label="Selector" style="width: 600px">
              <el-radio-group v-model="data.selectorType" style="margin-top: 4px">
                <el-radio-button label="普通">普通</el-radio-button>
                <el-radio-button label="高级">高级</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <div v-if="data.selectorType === '普通'">
              <el-form-item style="margin-top: -8px">
                <el-select v-model="data.deployment" style="width: 25%" @change="changeDeployment">
                  <el-option
                    v-for="item in data.deployments"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </el-form-item>

              <div class="app-pixiu-line-describe" style="margin-top: -10px">
                选择 Service 需要关联的后端 workload。
              </div>
            </div>

            <div v-if="data.selectorType === '高级'">
              <el-form-item style="margin-top: -15px">
                <el-button
                  type="text"
                  class="app-action-btn"
                  style="color: #3377ff"
                  @click="addSelector"
                  >新增</el-button
                >
              </el-form-item>

              <el-form-item
                v-for="(item, index) in data.form.selectors"
                :key="index"
                style="margin-top: -15px"
              >
                <el-form-item
                  :prop="'selectors[' + index + '].key'"
                  :rules="[{ required: true, message: 'selector 键不能为空', trigger: 'blur' }]"
                >
                  <el-input v-model="item.key" placeholder="selector 键" style="width: 280px" />
                </el-form-item>
                <div style="margin-right: 10px; margin-left: 10px">=</div>
                <el-form-item
                  :prop="'selectors[' + index + '].value'"
                  :rules="[{ required: true, message: 'selector 键不能为空', trigger: 'blur' }]"
                >
                  <el-input v-model="item.value" placeholder="selector 值" style="width: 280px" />
                </el-form-item>
                <div
                  style="float: right; cursor: pointer; margin-left: 10px"
                  @click="deleteSelector(index)"
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
              <div class="app-pixiu-line-describe" style="margin-top: -10px">
                Selector 以字母、数字开头和结尾, 且只能包含字母、数字及分隔符。
              </div>
            </div>

            <el-form-item label="Ports" style="margin-top: 20px">
              <div class="label-title-style" style="font-size: 13px">服务端口</div>
              <div class="label-title-style" style="margin-left: 120px; font-size: 13px">协议</div>
              <div class="label-title-style" style="margin-left: 180px; font-size: 13px">
                目标端口
              </div>
              <div class="label-title-style" style="margin-left: 120px; font-size: 13px">
                端口名
              </div>

              <el-divider style="width: 85%; margin-top: 2px" />

              <el-form-item style="margin-top: -15px">
                <el-button
                  type="text"
                  class="app-action-btn"
                  style="color: #3377ff"
                  @click="addPort"
                  >新增</el-button
                >
              </el-form-item>

              <el-form-item
                v-for="(item, index) in data.form.ports"
                :key="index"
                style="margin-top: -10px"
              >
                <el-form-item>
                  <el-input
                    v-model="item.port"
                    placeholder="1-65535内的整数"
                    style="width: 150px"
                  />
                </el-form-item>
                <el-form-item style="margin-left: 20px">
                  <el-select v-model="item.protocol">
                    <el-option
                      v-for="item in data.protocols"
                      :key="item"
                      :value="item"
                      :label="item"
                    />
                  </el-select>
                </el-form-item>
                <div style="margin-left: 20px">
                  <el-input
                    v-model="item.targetPort"
                    placeholder="1-65535内的整数"
                    style="width: 150px"
                  />
                </div>
                <div style="margin-left: 20px">
                  <el-input
                    v-model="item.name"
                    placeholder="1-63位小写字母、数字或下划线组成"
                    style="width: 250px"
                  />
                </div>
                <div
                  style="float: right; cursor: pointer; margin-left: 10px"
                  @click="deletePort(index)"
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
            </el-form-item>

            <el-form-item label="会话保持" style="margin-top: 20px">
              <el-switch v-model="data.Session" inline-prompt width="40px" />
            </el-form-item>

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
import { getDeployments } from '@/services/kubernetes/deploymentService';
import { getNamespaceNames } from '@/services/kubernetes/namespaceService';

const ruleFormRef = ref();
const { proxy } = getCurrentInstance();

const data = reactive({
  cluster: '',
  clusterName: '',

  loading: false,
  Session: false,

  namespaces: [],

  serviceType: '常规服务',
  selectorType: '普通',
  form: {
    metadata: {
      name: '',
      namespace: 'default',
    },

    labels: [],
    selectors: [],
    ports: [],

    spec: {
      ports: [],
      selector: [],
      type: 'ClusterIP',
    },
    labels: [],
  },

  objectForm: {
    metadata: {
      name: '',
      namespace: 'default',
    },
    spec: {
      ports: [],
      selector: {},
      type: 'ClusterIP',
    },
  },

  deployment: '',
  deployments: [],
  deploymentMap: {},

  protocols: ['TCP', 'UDP'],
});

const rules = {
  'metadata.name': [{ required: true, message: '请输入 Service 名称', trigger: 'blur' }],
};

onMounted(() => {
  data.query = proxy.$route.query;
  data.cluster = data.query.cluster;
  data.clusterName = localStorage.getItem(data.cluster);

  getNamespaceList();
  // 获取 deployment 列表
  getDeploymentList();

  // addLabel();
  if (data.selectorType === '高级') {
    addSelector();
  }
});

watch(
  () => data.selectorType,
  (newActive, oldActive) => {
    if (newActive === '高级') {
      if (data.form.selectors.length === 0) {
        addSelector();
      }
    } else {
      data.selectors = [];
    }
  },
);

const comfirm = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (data.form.spec.ports.length == 0) {
        proxy.$message.error('ports 为必选项');
        return;
      }
      // 转换 port，从字符串转换成 int32
      for (var i = 0; i < data.form.spec.ports.length; i++) {
        let p = data.form.spec.ports[i];
        const portInt = parseInt(p.port);
        const targetPortInt = parseInt(p.targetPort);

        p.port = portInt;
        p.targetPort = targetPortInt;
      }

      if (data.selectorType === '普通') {
        const d = data.deploymentMap[data.deployment];
        if (d === undefined) {
          proxy.$message.error('未获取到必选的 workload');
          return;
        }
        data.form.spec.selector = d.spec.template.metadata.labels;
      } else {
        if (data.selectors.length == 0) {
          proxy.$message.error('selector 为必选项');
          return;
        }

        for (let selector of data.selectors) {
          data.form.spec.selector[selector.key] = selector.value;
        }
      }

      if (data.labels.length > 0) {
        data.form.metadata['labels'] = {};
        for (let label of data.labels) {
          data.form.metadata['labels'][label.key] = label.value;
        }
      }

      try {
        await proxy.$http({
          method: 'post',
          url: `/proxy/pixiu/${data.cluster}/api/v1/namespaces/${data.form.metadata.namespace}/services`,
          data: data.form,
        });

        proxy.$message.success(`service ${data.form.metadata.name} 创建成功`);
        backToService();
      } catch (error) {
        proxy.$message.error(error.response.data.message);
        return;
      }
    }
  });
};

const cancel = () => {
  backToService();
};

const changeNamespace = async (val) => {
  localStorage.setItem('namespace', val);
  data.form.metadata.namespace = val;

  getDeploymentList();
};

const changeDeployment = async (val) => {};

const getDeploymentList = async () => {
  const [result, err] = await getDeployments(data.cluster, data.form.metadata.namespace);
  if (err) {
    proxy.$message.error(err.response.data.message);
    return;
  }

  data.deployments = [];
  data.deploymentMap = {};
  for (let d of result.items) {
    data.deployments.push(d.metadata.name);
    data.deploymentMap[d.metadata.name] = d;
  }
  if (data.deployments.length > 0) {
    data.deployment = data.deployments[0];
  }
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

const addSelector = () => {
  data.form.selectors.push({
    key: '',
    value: '',
  });
};

const deleteSelector = (index) => {
  data.form.selectors.splice(index, 1);
};

const addPort = () => {
  data.form.ports.push({
    name: '',
    port: '',
    protocol: '',
    targetPort: '',
  });
};

const deletePort = (index) => {
  data.form.ports.splice(index, 1);
};

const backToService = () => {
  proxy.$router.push({
    name: 'Service',
    query: data.query,
  });
};
</script>

<style>
.label-title-style {
  font-size: 12px;
  color: #888888;
}
</style>
