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
    <pixiu-card title="创建标准集群" height="50px" />
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
          <el-form
            :label-position="labelPosition"
            label-width="140px"
            :model="data.clusterForm"
          >
            <div style="margin-top: 20px" />
            <div v-if="data.active == 0">
              <el-form-item label="集群名称" style="width: 50%">
                <el-input
                  v-model="data.clusterForm.name"
                  placeholder="请输入集群名称"
                />
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Kubernetes 版本">
                <el-select v-model="data.clusterForm.kubernetes_version">
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
                    :label="item.label"
                    v-for="item in data.regionOptions"
                  />
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe">
                处在不同地域的云产品内网不通，导入后无法更换。建议选择合适的地域，以提高使用体验。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器运行时">
                <el-radio-group v-model="data.clusterForm.kubernetes_runtime">
                  <el-radio-button label="docker">docker</el-radio-button>
                  <el-radio-button label="containerd"
                    >containerd</el-radio-button
                  >
                  <el-radio-button label="cri-O" disabled
                    >cri-O</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                pixiu 支持的容器运行时，目前支持 docker 和 containerd， cri-O
                计划被支持，近请期待。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器网络插件">
                <el-radio-group v-model="data.clusterForm.cni">
                  <el-radio-button label="calico">calico</el-radio-button>
                  <el-radio-button label="flannel">flannel</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                选择 kubernetes 集群 pod 网络类型，一经选择无法更改，推荐使用
                flannel。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器网络">
                <el-card
                  style="width: 90%; height: 100px; background-color: #f2f2f2"
                >
                  <el-col>CIDR</el-col>

                  <el-select
                    v-model="data.podNetworkForm.a_cidr"
                    style="width: 70px; margin-left: 30px"
                  >
                    <el-option
                      v-for="item in data.podCidrOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <span style="margin-left: 4px">.</span>

                  <el-input
                    class="pod-pixiu-mask"
                    v-model="data.podNetworkForm.b_cidr"
                  />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    class="pod-pixiu-mask"
                    v-model="data.podNetworkForm.c_cidr"
                    disabled
                  />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    class="pod-pixiu-mask"
                    v-model="data.podNetworkForm.d_cidr"
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
                  <div
                    class="app-pixiu-describe"
                    style="margin-top: 10px; margin-left: 62px"
                  >
                    创建后无法更改
                  </div>
                </el-card>
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Service CIDR">
                <div>
                  <el-select
                    v-model="data.serviceNetworkForm.a_cidr"
                    style="width: 70px"
                  >
                    <el-option
                      v-for="item in data.serviceCidrOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <span style="margin-left: 4px">.</span>

                  <el-input
                    class="pod-pixiu-mask"
                    v-model="data.serviceNetworkForm.b_cidr"
                  />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    class="pod-pixiu-mask"
                    v-model="data.serviceNetworkForm.c_cidr"
                    disabled
                  />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    class="pod-pixiu-mask"
                    v-model="data.serviceNetworkForm.d_cidr"
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
                kubernetes 的 service CIDR，不能和宿主机网络以及 Pod
                网络冲突，选择后无法更改。
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
                  <el-radio-button label="1">自建集群</el-radio-button>
                  <el-radio-button disabled label="0">标准集群</el-radio-button>
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
                  style="
                    width: 100%;
                    background-color: #f3f4f7;
                    margin-top: 2px;
                  "
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
                      <el-button
                        type="text"
                        size="small"
                        @click.prevent="deleteNode(scope.$index)"
                      >
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
                  style="
                    width: 100%;
                    background-color: #f3f4f7;
                    margin-top: 2px;
                  "
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
                      <el-button
                        type="text"
                        size="small"
                        @click.prevent="deleteNode(scope.$index)"
                      >
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
                  <div
                    style="
                      vertical-align: middle;
                      margin-top: -27px;
                      margin-left: 10px;
                    "
                  >
                    Kubernetes
                    的节点选择，根据实际需要添加节点名，地址，用户名称，和对应密码。选择之后，可以根据实际情况调整。
                  </div>
                </div>
              </el-card>

              <div style="margin-top: 25px" />
            </div>

            <div v-if="data.active == 2">
              <el-form-item label="公网 apiserver 地址">
                <el-switch v-model="data.clusterForm.enable_public_ip" />
              </el-form-item>
              <div v-if="data.clusterForm.enable_public_ip">
                <el-form-item style="width: 30%">
                  <el-input
                    style="margin-top: -10px"
                    v-model="data.clusterForm.public_apiserver_ip"
                    placeholder="公网地址，格式如: 10.0.0.8"
                  />
                </el-form-item>
              </div>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                启用公网apiserver时，填入外部的公网 IP 地址
              </div>
            </div>

            <div v-if="data.active == 3">444</div>

            <div v-if="data.active == 4">555</div>

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
                  <el-button type="primary" @click="confirmCreate"
                    >完成</el-button
                  >
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
import { reactive, getCurrentInstance, ref, watch, onMounted } from "vue";
import PixiuCard from "@/components/card/index.vue";
const { proxy } = getCurrentInstance();

const data = reactive({
  loading: false,
  autosize: {
    minRows: 5,
  },

  active: 0, // 步骤条展示

  clusterForm: {
    name: "",
    create_ns: true, // 创建 pixiu 的系统命名空间
    enable_pixiu_eventer: false, // 启用高性能事件收集器
    enable_ha_kubernetes: false, // 高可用 k8s 集群
    cloud_type: "1", // 导入集群的类型为 1
    region: "无锡",
    description: "",
    kubernetes_version: "1.20.0",
    kubernetes_runtime: "docker",
    cni: "flannel", // 默认网络插件
    // k8s service 网段
    service_cidr: "",
    // pod 网络相关设置
    pod_cidr: "",

    // 启用公网 ip
    enable_public_ip: true,
    public_apiserver_ip: "",
  },

  // k8s service 的选项
  serviceNetworkForm: {
    a_cidr: "10",
    b_cidr: "254",
    c_cidr: "0",
    d_cidr: "0",
    service_mask: "16",
  },
  // k8s pod 网络的选项
  podNetworkForm: {
    a_cidr: "172",
    b_cidr: "30",
    c_cidr: "0",
    d_cidr: "0",
    pod_mask: "16",
  },
  kubernetes_version_options: [
    {
      value: "1.22.6",
      label: "1.22.6",
    },
    {
      value: "1.20.0",
      label: "1.20.0",
    },
    {
      value: "1.23.6",
      label: "1.23.6",
    },
  ],

  podCidrOptions: [
    {
      value: "192",
      label: "192",
    },
    {
      value: "172",
      label: "172",
    },
  ],
  serviceCidrOptions: [
    {
      value: "10",
      label: "10",
    },
  ],
  podMaskOptions: [
    {
      value: "16",
      label: "16",
    },
    {
      value: "24",
      label: "24",
    },
  ],

  serviceMaskOptions: [
    {
      value: "16",
      label: "16",
    },
    {
      value: "24",
      label: "24",
    },
  ],

  regionOptions: [
    {
      value: "无锡",
      label: "无锡",
    },
    {
      value: "宿迁",
      label: "宿迁",
    },
    {
      value: "杭州",
      label: "杭州",
    },
    {
      value: "泗阳",
      label: "泗阳",
    },
    {
      value: "苏州",
      label: "苏州",
    },
    {
      value: "南京",
      label: "南京",
    },
    {
      value: "上海",
      label: "上海",
    },
    {
      value: "北京",
      label: "北京",
    },
  ],
});

const nodeTableData = ref([
  {
    name: "kube-master",
    address: "192.168.0.1",
    user: "root",
    password: "root123456",
  },
]);

const deleteNode = (index) => {
  nodeTableData.value.splice(index, 1);
};

const onAddNode = () => {
  nodeTableData.value.push({
    name: "node1",
    address: "192.168.0.1",
    user: "root",
    password: "root123456",
  });
};

onMounted(() => {
  newServiceNetwork(data.serviceNetworkForm);
  newPodNetwork(data.podNetworkForm);
});

// 监听子属性变化 demo
watch(
  () => data.active,
  (newActive, oldActive) => {
    console.log("newActive", newActive, "oldActive", oldActive);
  }
);

// 监听整个 serviceNetworkForm
watch(data.serviceNetworkForm, (serviceNetwork, oldServiceNetwork) => {
  newServiceNetwork(serviceNetwork);
});

// 监听整个 podNetworkForm
watch(data.podNetworkForm, (podNetwork, oldPodNetwork) => {
  newPodNetwork(podNetwork);
});

const labelPosition = ref("left");

// TODO: 字符串拼接优化
const newServiceNetwork = (serviceNetwork) => {
  data.clusterForm.service_cidr =
    serviceNetwork.a_cidr +
    "." +
    serviceNetwork.b_cidr +
    "." +
    serviceNetwork.c_cidr +
    "." +
    serviceNetwork.d_cidr +
    "/" +
    serviceNetwork.service_mask;
};
// TODO: 字符串拼接优化
const newPodNetwork = (podNetwork) => {
  data.clusterForm.pod_cidr =
    podNetwork.a_cidr +
    "." +
    podNetwork.b_cidr +
    "." +
    podNetwork.c_cidr +
    "." +
    podNetwork.d_cidr +
    "/" +
    podNetwork.pod_mask;
};

const pre = () => {
  if (data.active-- <= 0) data.active = 0;
};

const next = () => {
  if (data.active++ >= 4) data.active = 4;
};

const confirmCreate = async () => {};

const cancelCreate = () => {
  backToContainer();
};

// 回到 container 页面
const backToContainer = () => {
  proxy.$router.push({
    name: "Container",
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
