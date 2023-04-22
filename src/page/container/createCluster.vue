<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: #f3f4f7;
    "
  >
    <pixiu-card back="true" title="创建标准集群" height="50px" />
    <el-steps
      :active="data.active"
      finish-status="success"
      simple
      align-center
      style="margin-top: 15px; margin-left: -70px"
    >
      <el-step title="集群信息" />
      <el-step title="新增节点" />
      <el-step title="集群配置" />
      <el-step title="组件选项" />
      <el-step title="确认" />
    </el-steps>
    <el-main>
      <div class="app-pixiu-content-card">
        <el-card style="width: 97%">
          <el-form :label-position="labelPosition" label-width="140px" :model="data.clusterForm">
            <div style="margin-top: 20px" />
            <div v-if="data.active == 0">
              <el-form-item label="集群名称" style="width: 50%">
                <el-input v-model="data.clusterForm.name" placeholder="请输入集群名称" />
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Kubernetes 版本">
                <el-select v-model="data.clusterForm.kubernetes.version">
                  <el-option
                    v-for="item in data.kubernetes_version_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                当前已支持 kubernetes 版本有: 1.18、1.20，1.22 版本。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="所在地域" style="width: 100%">
                <el-radio-group v-model="data.clusterForm.region">
                  <el-radio-button
                    v-for="(item, index) in data.regionOptions"
                    :key="index"
                    :label="item.label"
                  />
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe">
                处在不同地域的云产品内网不通，导入后无法更换。建议选择合适的地域，以提高使用体验。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器运行时">
                <el-radio-group v-model="data.clusterForm.kubernetes.runtime">
                  <el-radio-button label="docker">docker</el-radio-button>
                  <el-radio-button label="containerd">containerd</el-radio-button>
                  <el-radio-button label="cri-O" disabled>cri-O</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                pixiu 支持的容器运行时，目前支持 docker 和 containerd， cri-O 计划被支持，近请期待。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器网络插件">
                <el-radio-group v-model="data.clusterForm.kubernetes.cni">
                  <el-radio-button label="calico">calico</el-radio-button>
                  <el-radio-button label="flannel">flannel</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                选择 kubernetes 集群 pod 网络类型，一经选择无法更改，推荐使用 flannel。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器网络">
                <el-card style="width: 90%; height: 100px; background-color: #f2f2f2">
                  <el-col
                    >CIDR
                    <el-select
                      v-model="data.podNetworkForm.a_cidr"
                      style="width: 70px; margin-left: 15px"
                    >
                      <el-option
                        v-for="item in data.podCidrOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>

                    <span style="margin-left: 4px">.</span>

                    <el-input v-model="data.podNetworkForm.b_cidr" class="pod-pixiu-mask" />

                    <span style="margin-left: 4px">.</span>
                    <el-input
                      v-model="data.podNetworkForm.c_cidr"
                      class="pod-pixiu-mask"
                      disabled
                    />

                    <span style="margin-left: 4px">.</span>
                    <el-input
                      v-model="data.podNetworkForm.d_cidr"
                      class="pod-pixiu-mask"
                      disabled
                    />

                    <span style="margin-left: 4px">/</span>
                    <el-select
                      v-model="data.podNetworkForm.pod_mask"
                      style="width: 70px; margin-left: 4px"
                    >
                      <el-option
                        v-for="item in data.podMaskOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                  <div class="app-pixiu-describe" style="margin-top: 10px; margin-left: 55px">
                    创建后无法更改
                  </div>
                </el-card>
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Service CIDR">
                <div>
                  <el-select v-model="data.serviceNetworkForm.a_cidr" style="width: 70px">
                    <el-option
                      v-for="item in data.serviceCidrOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <span style="margin-left: 4px">.</span>

                  <el-input v-model="data.serviceNetworkForm.b_cidr" class="pod-pixiu-mask" />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    v-model="data.serviceNetworkForm.c_cidr"
                    class="pod-pixiu-mask"
                    disabled
                  />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    v-model="data.serviceNetworkForm.d_cidr"
                    class="pod-pixiu-mask"
                    disabled
                  />

                  <span style="margin-left: 4px">/</span>
                  <el-select
                    v-model="data.serviceNetworkForm.service_mask"
                    style="width: 70px; margin-left: 4px"
                  >
                    <el-option
                      v-for="item in data.serviceMaskOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-form-item>

              <div class="app-pixiu-describe" style="margin-top: -12px">
                kubernetes 的 service CIDR，不能和宿主机网络以及 Pod 网络冲突，选择后无法更改。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="集群描述" style="width: 60%">
                <el-input
                  v-model="data.clusterForm.description"
                  placeholder="请输入 Kubernentes 集群描述"
                  type="textarea"
                  :autosize="data.autosize"
                />
              </el-form-item>
            </div>

            <div v-if="data.active == 1">
              <el-form-item label="集群类型">
                <el-radio-group v-model="data.clusterForm.cloud_type">
                  <el-radio-button label="2">自建集群</el-radio-button>
                  <el-radio-button disabled label="1">标准集群</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -5px">
                集群的 Master， Etcd 和 Node 均由 Pixiu 进行创建和管理。
              </div>

              <div style="margin-top: 20px" />
              <el-form-item label="高可用 kubernetes">
                <el-switch
                  v-model="data.clusterForm.enable_ha_kubernetes"
                  active-text="启用"
                  inactive-text="关闭"
                />
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                启用高可用 Kubernetes 集群时，推荐 master 节点数为 3
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="Master&Etcd 配置">
                <el-table
                  :data="nodeTableData"
                  style="width: 100%; background-color: #f3f4f7; margin-top: 2px"
                  max-height="400"
                  :header-cell-style="{
                    background: '#f4f3f9',
                    color: '#606266',
                    height: '35px',
                  }"
                >
                  <el-table-column prop="name" label="主机名" width="160px" />
                  <el-table-column prop="address" label="地址" width="120px" />
                  <el-table-column prop="user" label="用户名" width="180px" />
                  <el-table-column prop="password" label="密码" />
                  <el-table-column fixed="right" label="操作" width="120px">
                    <template #default="scope">
                      <el-button type="text" size="small" @click.prevent="deleteNode(scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  type="text"
                  class="app-node-add-class"
                  style="width: 100%"
                  @click="onAddNode"
                  >添加 Master 节点</el-button
                >
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Node 节点配置">
                <el-table
                  :data="nodeTableData"
                  style="width: 100%; background-color: #f3f4f7; margin-top: 2px"
                  max-height="400"
                  :header-cell-style="{
                    background: '#f4f3f9',
                    color: '#606266',
                    height: '35px',
                  }"
                >
                  <el-table-column prop="name" label="主机名" width="160px" />
                  <el-table-column prop="address" label="地址" width="120px" />
                  <el-table-column prop="user" label="用户名" width="180px" />
                  <el-table-column prop="password" label="密码" />
                  <el-table-column fixed="right" label="操作" width="120px">
                    <template #default="scope">
                      <el-button type="text" size="small" @click.prevent="deleteNode(scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  type="text"
                  class="app-node-add-class"
                  style="width: 100%"
                  @click="onAddNode"
                  >添加 Node</el-button
                >
              </el-form-item>

              <el-form-item label="登陆方式">
                <el-radio-group v-model="data.clusterForm.login_type">
                  <el-radio-button label="no_password">免密登陆</el-radio-button>
                  <el-radio-button label="password">密码登陆</el-radio-button>
                  <el-radio-button disabled label="key">密钥登陆</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <div class="app-pixiu-describe" style="margin-top: -12px">
                <div v-if="data.clusterForm.login_type === 'no_password'">
                  pixiu 节点和待部署节点已经手动开通免密码登陆
                </div>
              </div>

              <div v-if="data.clusterForm.login_type === 'password'">
                <div style="margin-top: 25px" />
                <el-form-item label="用户名"> root </el-form-item>
                <el-form-item label="密码">
                  <el-input
                    v-model="data.clusterForm.ssh_password"
                    show-password
                    clearable
                    style="width: 280px"
                  />
                </el-form-item>
              </div>

              <el-card class="app-docs" style="margin-left: 140px">
                <div>
                  <el-icon
                    style="
                      vertical-align: middle;
                      font-size: 18px;
                      margin-left: -20px;
                      margin-right: 8px;
                      margin-top: -25px;
                    "
                    ><WarningFilled
                  /></el-icon>
                  <div style="vertical-align: middle; margin-top: -27px; margin-left: 10px">
                    Kubernetes
                    的节点选择，根据实际需要添加节点名，地址，用户名称，和对应密码。选择之后，可以根据实际情况调整。
                  </div>
                </div>
              </el-card>

              <div style="margin-top: 25px" />
            </div>

            <div v-if="data.active == 2">
              <el-form-item label="ApiServer 地址">
                <el-switch v-model="data.clusterForm.enable_public_ip" />
              </el-form-item>
              <div v-if="data.clusterForm.enable_public_ip">
                <el-form-item style="width: 30%">
                  <el-input
                    v-model="data.clusterForm.kubernetes.api_server"
                    style="margin-top: -10px"
                    placeholder="请输入 kubernetes apiserver 地址"
                  />
                </el-form-item>
              </div>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                指定 kubernetes 集群的 ApiServer 地址，指定时需要在云平台上开启该地址到 master
                节点的 6443 端口 4 层转发。非高可用时可不指定，不指定时默认使用 master
                节点的内网地址。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="Kube-proxy 模式">
                <el-radio-group v-model="data.clusterForm.kubernetes.proxy_mode">
                  <el-radio-button label="iptables">iptables</el-radio-button>
                  <el-radio-button disabled label="ipvs">ipvs</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                默认使用 iptables 模式，ipvs 的转发性能更高。选择之后无法修改。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="组件选项">
                <el-checkbox-group v-model="data.clusterForm.install_components">
                  <el-checkbox-button v-for="city in availableComponents" :key="city" :label="city">
                    {{ city }}
                  </el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                如果当前无法评估是否需要安装， 可在集群创建完成后在集群内进行安装
              </div>

              <el-card class="app-docs" style="margin-left: 140px">
                <div>
                  <el-icon
                    style="
                      vertical-align: middle;
                      font-size: 18px;
                      margin-left: -20px;
                      margin-right: 8px;
                      margin-top: -25px;
                    "
                    ><WarningFilled
                  /></el-icon>
                  <div style="vertical-align: middle; margin-top: -27px; margin-left: 10px">
                    TODO: 其他自定义字段的添加
                  </div>
                </div>
              </el-card>
              <div style="margin-top: 25px" />
            </div>

            <div v-if="data.active == 3">Continue 下一步</div>

            <div v-if="data.active == 4">DONE</div>

            <div style="display: flex; justify-content: center">
              <el-space>
                <div v-if="data.active == 0">
                  <el-button @click="cancelCreate()">取消</el-button>
                </div>
                <div v-if="data.active > 0">
                  <el-button @click="pre">上一步</el-button>
                </div>
                <div v-if="data.active < 4">
                  <el-button type="primary" @click="next">下一步</el-button>
                </div>
                <div v-if="data.active == 4">
                  <el-button type="primary" @click="confirmCreate">完成</el-button>
                </div>
              </el-space>
            </div>
          </el-form>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref, watch, onMounted } from 'vue';
import PixiuCard from '@/components/card/index.vue';

const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  autosize: {
    minRows: 5,
  },

  active: 0, // 步骤条展示

  clusterForm: {
    name: '',
    alias_name: '',
    immediate: false,
    create_namespace: true, // 创建 pixiu 的系统命名空间
    enable_pixiu_eventer: false, // 启用高性能事件收集器
    enable_ha_kubernetes: false, // 高可用 k8s 集群
    cloud_type: 2, // 导入集群的类型为 1
    region: '无锡',
    description: '',

    // k8s 的属性定义
    kubernetes: {
      api_server: '',
      version: '1.20.0',
      runtime: 'docker',
      cni: 'flannel', // 默认网络插件
      // k8s service 网段
      service_cidr: '',
      // pod 网络相关设置
      pod_cidr: '',
      // kube-poxy 模式
      proxy_mode: 'iptables',
      masters: [],
      nodes: [],
    },

    // 部署时，登录方式
    login_type: 'no_password',
    ssh_user: 'root',
    ssh_password: '',

    // 安装组件
    install_components: ['Prometheus 监控服务', 'Nginx Ingress'],
  },

  // k8s service 的选项
  serviceNetworkForm: {
    a_cidr: '10',
    b_cidr: '254',
    c_cidr: '0',
    d_cidr: '0',
    service_mask: '16',
  },
  // k8s pod 网络的选项
  podNetworkForm: {
    a_cidr: '172',
    b_cidr: '30',
    c_cidr: '0',
    d_cidr: '0',
    pod_mask: '16',
  },
  kubernetes_version_options: [
    {
      value: '1.22.6',
      label: '1.22.6',
    },
    {
      value: '1.20.0',
      label: '1.20.0',
    },
    {
      value: '1.23.6',
      label: '1.23.6',
    },
  ],

  podCidrOptions: [
    {
      value: '192',
      label: '192',
    },
    {
      value: '172',
      label: '172',
    },
  ],
  serviceCidrOptions: [
    {
      value: '10',
      label: '10',
    },
  ],
  podMaskOptions: [
    {
      value: '16',
      label: '16',
    },
    {
      value: '24',
      label: '24',
    },
  ],

  serviceMaskOptions: [
    {
      value: '16',
      label: '16',
    },
    {
      value: '24',
      label: '24',
    },
  ],

  regionOptions: [
    {
      value: '无锡',
      label: '无锡',
    },
    {
      value: '宿迁',
      label: '宿迁',
    },
    {
      value: '杭州',
      label: '杭州',
    },
    {
      value: '泗阳',
      label: '泗阳',
    },
    {
      value: '苏州',
      label: '苏州',
    },
    {
      value: '南京',
      label: '南京',
    },
    {
      value: '上海',
      label: '上海',
    },
    {
      value: '北京',
      label: '北京',
    },
  ],
});

const availableComponents = [
  'Prometheus 监控服务',
  'Nginx Ingress',
  'Pixiu Autoscaler',
  '高性能 eventer',
  'Operator 生命周期管理组件',
];

const nodeTableData = ref([
  {
    name: 'kube-master',
    address: '192.168.0.1',
    user: 'root',
    password: 'root123456',
  },
]);

const deleteNode = (index) => {
  nodeTableData.value.splice(index, 1);
};

const onAddNode = () => {
  nodeTableData.value.push({
    name: 'node1',
    address: '192.168.0.1',
    user: 'root',
    password: 'root123456',
  });
};

onMounted(() => {
  newServiceNetwork(data.serviceNetworkForm);
  newPodNetwork(data.podNetworkForm);
});

// 监听子属性变化 demo
watch(
  () => data.active,
  (newActive, oldActive) => {},
);

// 监听整个 serviceNetworkForm
watch(data.serviceNetworkForm, (serviceNetwork, oldServiceNetwork) => {
  newServiceNetwork(serviceNetwork);
});

// 监听整个 podNetworkForm
watch(data.podNetworkForm, (podNetwork, oldPodNetwork) => {
  newPodNetwork(podNetwork);
});

const labelPosition = ref('left');

// TODO: 字符串拼接优化
const newServiceNetwork = (serviceNetwork) => {
  data.clusterForm.kubernetes.service_cidr = `${serviceNetwork.a_cidr}.${serviceNetwork.b_cidr}.${serviceNetwork.c_cidr}.${serviceNetwork.d_cidr}/${serviceNetwork.service_mask}`;
};
// TODO: 字符串拼接优化
const newPodNetwork = (podNetwork) => {
  data.clusterForm.kubernetes.pod_cidr = `${podNetwork.a_cidr}.${podNetwork.b_cidr}.${podNetwork.c_cidr}.${podNetwork.d_cidr}/${podNetwork.pod_mask}`;
};

const pre = () => {
  if (data.active-- <= 0) data.active = 0;
};

const next = () => {
  if (data.active++ >= 4) data.active = 4;
};

const confirmCreate = async () => {
  const resp = await proxy.$http({
    method: 'post',
    url: '/clouds/build',
    data: data.clusterForm,
  });
  if (resp.code != 200) {
    return proxy.$message.error(`构造 kubernetes 集群失败: ${resp.message}`); // 连通性检测异常
  }

  proxy.$message.success('成功构造 kubernetes 集群');
  backToContainer();
};

const cancelCreate = () => {
  backToContainer();
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

.pod-pixiu-mask {
  width: 50px;
  margin-left: 4px;
}

.app-pixiu-describe {
  margin-left: 140px;
  font-size: 12px;
  color: #888888;
}

.app-node-add-class {
  line-height: 50px;
  border: 1px dashed #ddd;
  margin-top: 12px;
  font-size: 12px;
  text-align: center;
}
</style>
