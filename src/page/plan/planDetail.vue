<template>
  <el-main style="padding: 0; margin: 0">
    <el-tabs
      v-model="data.activeName"
      style="margin-left: 20px"
      @tab-click="handleClick"
      @tab-change="handleChange"
    >
      <el-tab-pane label="配置信息" name="first"> </el-tab-pane>
      <el-tab-pane label="节点列表" name="second"> </el-tab-pane>
      <el-tab-pane label="组件管理" name="third"></el-tab-pane>
    </el-tabs>

    <div
      v-if="data.activeName === 'first'"
      style="margin-left: 12px; background-color: var(--el-fill-color-light)"
    >
      <el-steps :active="data.active" finish-status="success" simple>
        <el-step title="集群信息" />
        <el-step title="集群配置" />
        <el-step title="组件选项" />
        <el-step title="确认" />
      </el-steps>
      <div class="app-pixiu-content-card">
        <el-card style="width: 97%">
          <el-form :label-position="labelPosition" label-width="140px" :model="data.clusterForm">
            <div style="margin-top: 20px" />
            <div v-if="data.active == 0">
              <el-form-item label="集群名称" style="width: 50%">
                <el-input v-model="data.PlanConfig.name" placeholder="请输入集群名称" />
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Kubernetes 版本">
                <el-select v-model="data.PlanConfig.kubernetes.kubernetes_version">
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
                <el-radio-group v-model="data.PlanConfig.region">
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
                <el-radio-group v-model="data.PlanConfig.runtime.runtime">
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
                <el-radio-group v-model="data.PlanConfig.network.cni">
                  <el-radio-button label="calico">calico</el-radio-button>
                  <el-radio-button label="flannel">flannel</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                选择 kubernetes 集群 pod 网络类型，一经选择无法更改，推荐使用 flannel。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="容器网络">
                <el-card style="width: 90%; background-color: #f2f2f2"
                  >CIDR
                  <el-space>
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
                      disabled />

                    <span style="margin-left: 4px">.</span>
                    <el-input
                      v-model="data.podNetworkForm.d_cidr"
                      class="pod-pixiu-mask"
                      disabled />

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
                      /> </el-select
                  ></el-space>
                  <div class="app-pixiu-describe" style="margin-top: 10px; margin-left: 55px">
                    创建后无法更改
                  </div>
                </el-card>
              </el-form-item>

              <div style="margin-top: 25px" />
              <el-form-item label="Service CIDR">
                <el-space>
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
                </el-space>
              </el-form-item>

              <div class="app-pixiu-describe" style="margin-top: -12px">
                kubernetes 的 service CIDR，不能和宿主机网络以及 Pod 网络冲突，选择后无法更改。
              </div>

              <div style="margin-top: 25px" />
              <el-form-item label="集群描述" style="width: 60%">
                <el-input
                  v-model="data.PlanConfig.description"
                  placeholder="请输入 Kubernentes 集群描述"
                  type="textarea"
                  :autosize="data.autosize"
                />
              </el-form-item>
            </div>

            <div v-if="data.active == 1">
              <div style="margin-top: 20px" />
              <el-form-item label="高可用 kubernetes">
                <el-switch
                  v-model="data.PlanConfig.kubernetes.enable_ha"
                  active-text="启用"
                  inactive-text="关闭"
                />
              </el-form-item>
              <div class="app-pixiu-describe" style="margin-top: -12px">
                启用高可用 Kubernetes 集群时，推荐 master 节点数为 3
              </div>

              <el-form-item label="ApiServer 地址">
                <el-switch v-model="data.PlanConfig.enablePublicIp" />
              </el-form-item>
              <div v-if="data.PlanConfig.enablePublicIp">
                <el-form-item style="width: 40%">
                  <el-input
                    v-model="data.PlanConfig.kubernetes.api_server"
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
                <el-radio-group v-model="data.PlanConfig.network.kube_proxy">
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

            <div v-if="data.active == 2">Continue 下一步</div>

            <div v-if="data.active == 3">DONE</div>

            <div style="display: flex; justify-content: center">
              <el-space>
                <div v-if="data.active == 0">
                  <el-button @click="cancelCreate()">取消</el-button>
                </div>
                <div v-if="data.active > 0">
                  <el-button @click="pre">上一步</el-button>
                </div>
                <div v-if="data.active < 3">
                  <el-button type="primary" @click="next">下一步</el-button>
                </div>
                <div v-if="data.active == 3">
                  <el-button type="primary" @click="confirmCreateConfig">完成</el-button>
                </div>
              </el-space>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>

    <div v-if="data.activeName === 'second'" style="margin-left: 12px">
      <div>
        <el-row>
          <el-card class="detail-docs">
            <el-icon
              style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
              ><WarningFilled
            /></el-icon>
            <div style="vertical-align: middle; margin-top: -40px">获取部署计划的 nodes 列表</div>
          </el-card>

          <el-col>
            <button style="width: 85px" class="pixiu-two-button" @click="handleCreateDialog">
              新增节点
            </button>

            <div style="margin-left: 8px; float: right; margin-left: 12px">
              <button class="pixiu-two-button" @click="GetPlanNodes">搜索</button>
            </div>

            <el-input
              v-model="data.pageInfo.search.searchInfo"
              placeholder="名称搜索关键字"
              style="width: 480px; float: right"
              clearable
            >
              <template #suffix>
                <pixiu-icon
                  name="icon-search"
                  style="cursor: pointer"
                  size="15px"
                  type="iconfont"
                  color="#909399"
                />
              </template>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="data.loading"
        :data="data.tableData"
        stripe
        style="margin-top: 6px"
        header-row-class-name="pixiu-table-header"
        :cell-style="{
          'font-size': '12px',
          color: '#191919',
        }"
        @selection-change="handlePodSelectionChange"
      >
        <el-table-column type="selection" width="30px" />
        <el-table-column prop="metadata.name" label="节点名称">
          <template #default="scope">
            {{ scope.row.name }}
            <pixiu-icon
              name="icon-copy"
              size="11px"
              type="iconfont"
              class-name="icon-box"
              color="#909399"
              style="cursor: pointer"
              @click="copy(scope.row.name)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="role" label="角色" :formatter="formatterNodeRole" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="auth" label="认证方式" :formatter="formatterNodeAuthType">
        </el-table-column>

        <el-table-column prop="gmt_create" label="创建时间" :formatter="formatterTime" />
        <el-table-column fixed="right" label="操作" width="160px">
          <template #default="scope">
            <el-button
              size="small"
              type="text"
              style="margin-right: -25px; margin-left: -10px; color: #006eff"
              @click="handleDeleteDialog(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="table-inline-word">该部署计划暂无节点</div>
        </template>
      </el-table>

      <pagination :total="data.pageInfo.total" @on-change="onChange"></pagination>
    </div>

    <div v-if="data.activeName === 'third'" style="margin-left: 12px">third</div>

    <el-dialog
      v-model="data.createDialog.close"
      style="color: #000000; font: 14px"
      width="580px"
      draggable
      center
      @close="handleCreateCloseDialog"
    >
      <template #header>
        <div style="text-align: left; font-weight: bold; padding-left: 5px">新增节点</div>
      </template>

      <el-card class="app-docs" style="margin-left: 6px; margin-top: 1px; height: 40px">
        <el-icon
          style="vertical-align: middle; font-size: 16px; margin-left: -25px; margin-top: -50px"
          ><WarningFilled
        /></el-icon>
        <div style="vertical-align: middle; margin-top: -40px">
          Kubernetes 的节点选择，选择之后，可以根据实际情况调整。
        </div>
      </el-card>

      <el-form
        ref="userFormRef"
        :label-position="labelPosition"
        :rules="userFormRules"
        label-width="80px"
        :model="data.userForm"
        style="max-width: 90%; margin-left: 6px"
      >
        <el-form-item prop="name">
          <template #label>
            <span style="font-size: 13px; color: #191919">节点名称</span>
          </template>
          <el-input v-model="data.createData.name" />
        </el-form-item>

        <el-form-item prop="role">
          <template #label>
            <span style="font-size: 13px; color: #191919">角色</span>
          </template>

          <el-radio-group v-model="data.createData.role">
            <el-radio style="margin-right: 16px" :value="1">master</el-radio>
            <el-radio :value="0">node</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="ip">
          <template #label>
            <span style="font-size: 13px; color: #191919">IP地址</span>
          </template>
          <el-input v-model="data.createData.ip" />
        </el-form-item>
      </el-form>

      <el-form-item>
        <template #label>
          <span style="font-size: 13px; color: #191919">登陆方式</span>
        </template>

        <el-radio-group v-model="data.createData.auth.type">
          <el-radio-button style="margin-left: 22px" label="password">密码登陆</el-radio-button>
          <el-radio-button label="key">密钥登陆</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div v-if="data.createData.auth.type === 'password'">
        <el-form-item label="用户名">
          <template #label>
            <span style="font-size: 13px; color: #191919">用户名</span>
          </template>
          <div style="margin-left: 38px">root</div>
        </el-form-item>
        <el-form-item label="密码">
          <template #label>
            <span style="font-size: 13px; color: #191919">密码</span>
          </template>
          <el-input
            v-model="data.createData.auth.password.password"
            show-password
            clearable
            style="width: 56%; margin-left: 50px"
          />
        </el-form-item>
        <div class="app-pixiu-describe" style="margin-top: -12px; margin-left: 88px">
          根据实际需要添加节点名，地址，用户名称，和对应密码。
        </div>
      </div>

      <div v-if="data.createData.auth.type === 'key'">
        <div style="margin-top: 25px" />
        <el-form-item label="用户名"> root </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="data.createData.auth.password"
            show-password
            clearable
            style="width: 280px"
          />
        </el-form-item>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="pixiu-small-cancel-button" @click="handleCreateCloseDialog"
            >取消</el-button
          >
          <el-button class="pixiu-small-confirm-button" type="primary" @click="confirmCreate"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <pixiuDialog
      :close-event="data.deleteDialog.close"
      :object-name="data.deleteDialog.objectName"
      :delete-name="data.deleteDialog.deleteName"
      :alias-name="data.deleteDialog.aliasName"
      @confirm="confirm"
      @cancel="cancel"
    ></pixiuDialog>
  </el-main>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import { reactive, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { getTableData, copy } from '@/utils/utils';
import { formatterTime, formatterNodeAuthType, formatterNodeRole } from '@/utils/formatter';
import MyCodeMirror from '@/components/codemirror/index.vue';
import Pagination from '@/components/pagination/index.vue';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import {
  getPlanNodes,
  createPlanNode,
  deletePlanNode,
  createPlanConfig,
  startPlanTask,
} from '@/services/plan/planService';

const { proxy } = getCurrentInstance();
const router = useRouter();

const data = reactive({
  name: '',
  planId: 0,
  loading: false,
  activeName: 'first',

  pageInfo: {
    page: 1,
    limit: 10,
    total: 0,
    search: {
      field: 'name',
      searchInfo: '',
    },
  },

  nodes: [],
  tableData: [],

  // 删除对象属性
  deleteDialog: {
    close: false,
    objectName: '节点',
    deleteName: '',
    aliasName: '',
  },

  // 创建属性
  createDialog: {
    close: false,
  },
  createData: {
    name: '',
    role: 0,
    ip: '',
    auth: {
      type: 'password',
      key: {
        data: '',
      },
      password: {
        user: 'root',
        password: '',
      },
    },
  },

  autosize: {
    minRows: 5,
  },
  enablePublicIp: false,
  active: 0, // 步骤条展示
  PlanConfig: {
    plan_id: 0,
    name: '',
    region: '无锡',
    description: '',
    kubernetes: {
      api_server: '',
      kubernetes_version: '',
      enable_ha: false,
    },
    network: {
      cni: 'flannel',
      pod_network: '',
      service_network: '',
      kube_proxy: 'iptables',
    },
    runtime: {
      runtime: 'docker',
    },
  },

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
  ],
});

const labelPosition = ref('left');

const availableComponents = [
  'Prometheus 监控服务',
  'Nginx Ingress',
  'Pixiu Autoscaler',
  '高性能 eventer',
  'Operator 生命周期管理组件',
];

onMounted(async () => {
  data.name = proxy.$route.query.name;
  data.planId = proxy.$route.query.planId;

  GetPlanNodes();

  newServiceNetwork(data.serviceNetworkForm);
  newPodNetwork(data.podNetworkForm);
});

const onChange = (v) => {
  data.pageInfo.limit = v.limit;
  data.pageInfo.page = v.page;
};

const GetPlanNodes = async () => {
  data.loading = true;
  const [result, err] = await getPlanNodes(data.planId);
  data.loading = false;
  if (err) {
    proxy.$notify.error(err);
    return;
  }

  if (result !== null) {
    data.nodes = result;
  }
  data.pageInfo.total = data.nodes.length;
  data.tableData = getTableData(data.pageInfo, data.nodes);
};

// 开始创建节点
const handleCreateDialog = () => {
  data.createDialog.close = true;
};

const handleCreateCloseDialog = () => {
  data.createDialog.close = false;

  // 初始化创建form
  setTimeout(() => {
    data.createData = {
      name: '',
      role: 0,
      ip: '',
      auth: {
        type: 'key',
        key: {
          data: '',
        },
        password: {
          user: '',
          password: '',
        },
      },
    };
  }, 100);
};

const confirmCreate = async () => {
  const [result, err] = await createPlanNode(data.planId, data.createData);
  if (err) {
    proxy.$notify.error({ message: err });
    return;
  }
  proxy.$notify.success({ message: `节点(${data.createData.name})添加成功` });

  GetPlanNodes();
  handleCreateCloseDialog();
};
// 结束新增节点

// 删除 开始
const handleDeleteDialog = (row) => {
  data.deleteDialog.close = true;
  data.deleteDialog.deleteName = row.id;
  data.deleteDialog.aliasName = row.name;
};

const confirm = async () => {
  const [result, err] = await deletePlanNode(data.planId, data.deleteDialog.deleteName);
  if (err) {
    proxy.$notify.error(err);
    return;
  }
  proxy.$notify.success(`节点(${data.deleteDialog.aliasName}) 删除成功`);

  GetPlanNodes();
  cancel();
};

const cancel = () => {
  data.deleteDialog.close = false;
  // 延迟 1 秒重置数据，否则页面上会显的很怪
  setTimeout(() => {
    data.deleteDialog.deleteName = '';
    data.deleteDialog.aliasName = '';
  }, 100);
};
// 删除 结束

// 开始创建配置 ========
const confirmCreateConfig = async () => {
  const [result, err] = await createPlanConfig(data.planId, data.PlanConfig);
  if (err) {
    proxy.$notify.error({ message: err });
    return;
  }
  proxy.$notify.success({ message: `配置(${data.PlanConfig.name})添加成功` });
};
// 监听整个 serviceNetworkForm
watch(data.serviceNetworkForm, (serviceNetwork, oldServiceNetwork) => {
  newServiceNetwork(serviceNetwork);
});

// 监听整个 podNetworkForm
watch(data.podNetworkForm, (podNetwork, oldPodNetwork) => {
  newPodNetwork(podNetwork);
});
// TODO: 字符串拼接优化
const newServiceNetwork = (serviceNetwork) => {
  data.PlanConfig.network.service_network = `${serviceNetwork.a_cidr}.${serviceNetwork.b_cidr}.${serviceNetwork.c_cidr}.${serviceNetwork.d_cidr}/${serviceNetwork.service_mask}`;
};
// TODO: 字符串拼接优化
const newPodNetwork = (podNetwork) => {
  data.PlanConfig.network.pod_network = `${podNetwork.a_cidr}.${podNetwork.b_cidr}.${podNetwork.c_cidr}.${podNetwork.d_cidr}/${podNetwork.pod_mask}`;
};

const pre = () => {
  if (data.active-- <= 0) data.active = 0;
};

const next = () => {
  if (data.active++ >= 3) data.active = 3;
};
</script>

<style scoped="scoped"></style>
