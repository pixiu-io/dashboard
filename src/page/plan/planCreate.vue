<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div
      style="
        width: 100%;
        height: 60px;
        background: #ffffff;
        flex-shrink: 0;
        display: flex;
        align-items: center;
      "
    >
      <pixiu-icon
        name="icon-back"
        style="cursor: pointer; margin-left: 25px"
        size="16px"
        type="iconfont"
        color="#006eff"
        @click="backToPlan"
      />

      <el-breadcrumb separator="/" style="margin-left: 10px; margin-top: 1px">
        <el-breadcrumb-item
          ><span class="breadcrumb-create-style">
            {{ clusterStore.planId === undefined ? '创建部署计划' : '更新部署计划' }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main style="margin: 0; padding: 0; overflow: hidden">
      <!-- <div style="padding: 10px 0px 0px 0px">
        <el-steps style="max-width: 100%" :space="200" :active="clusterStore.active" simple>
          <el-step title="标题和描述" style="cursor: pointer" @click="goToStep(1)" />
          <el-step title="集群信息" style="cursor: pointer" @click="goToStep(2)" />
          <el-step title="集群配置" style="cursor: pointer" @click="goToStep(3)" />
          <el-step title="节点配置" style="cursor: pointer" @click="goToStep(4)" />
          <el-step title="组件选项" style="cursor: pointer" @click="goToStep(5)" />
        </el-steps>
      </div> -->
      <div
        id="step-container"
        ref="stepContainerRef"
        style="padding: 0px 20px; margin-top: 10px; height: 100%; overflow: auto"
      >
        <el-form
          :ref="(el) => (clusterStore.configFormRef = el)"
          :model="clusterStore.configInfo"
          :label-position="clusterStore.labelPosition"
          label-width="140px"
          :rules="clusterStore.rules"
        >
          <el-card id="step-0" header="集群信息"> </el-card>
          <el-card id="step-1" header="集群信息" style="margin-top: 20px">
            <el-form-item label="集群名称" style="width: 50%" prop="name">
              <el-input v-model="clusterStore.configInfo.name" />
            </el-form-item>

            <el-form-item
              label="Kubernetes 版本"
              style="width: 50%"
              prop="config.kubernetes.kubernetes_version"
            >
              <el-select v-model="clusterStore.configInfo.config.kubernetes.kubernetes_version">
                <el-option
                  v-for="item in clusterStore.options.kubernetesVersionOptions"
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
            <el-form-item label="所在地域" style="width: 100%" prop="config.region">
              <el-radio-group v-model="clusterStore.configInfo.config.region">
                <el-radio-button
                  v-for="(item, index) in clusterStore.options.regionOptions"
                  :key="index"
                  :label="item.label"
                />
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe">
              处在不同地域的云产品内网不通，导入后无法更换。建议选择合适的地域，以提高使用体验。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="操作系统" style="width: 100%" prop="config.os_image">
              <el-radio-group v-model="clusterStore.configInfo.config.os_image">
                <el-radio-button
                  v-for="(item, index) in clusterStore.options.osOptions"
                  :key="index"
                  :label="item.label"
                />
              </el-radio-group>
            </el-form-item>

            <div style="margin-top: 25px" />
            <el-form-item label="容器运行时" prop="config.runtime.runtime">
              <el-radio-group v-model="clusterStore.configInfo.config.runtime.runtime">
                <el-radio-button label="docker">docker</el-radio-button>
                <el-radio-button label="containerd">containerd</el-radio-button>
                <el-radio-button label="cri-O" disabled>cri-O</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              pixiu 支持的容器运行时，目前支持 docker 和 containerd， cri-O 计划被支持，近请期待。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="容器网络插件" prop="config.network.cni">
              <el-radio-group v-model="clusterStore.configInfo.config.network.cni">
                <el-radio-button label="calico">calico</el-radio-button>
                <el-radio-button label="flannel">flannel</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              选择 kubernetes 集群 pod 网络类型，一经选择无法更改，推荐使用 flannel。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item
              label="容器网口"
              style="width: 50%"
              prop="config.network.network_interface"
            >
              <el-input
                v-model="clusterStore.configInfo.config.network.network_interface"
                placeholder="请容器运行时网口"
              />
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -5px">
              选择 kubernetes 集群 pod 运行网口，一经选择无法更改，默认为 eth0
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="容器网络">
              <el-card style="width: 90%; background-color: #f2f2f2"
                >CIDR
                <el-space>
                  <el-select
                    v-model="clusterStore.configInfo.podNetwork.a_cidr"
                    style="width: 70px; margin-left: 15px"
                  >
                    <el-option
                      v-for="item in clusterStore.options.podCidrOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>

                  <span style="margin-left: 4px">.</span>
                  <el-form-item prop="podNetwork.b_cidr">
                    <el-input
                      v-model="clusterStore.configInfo.podNetwork.b_cidr"
                      class="pod-pixiu-mask"
                    />
                  </el-form-item>

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    v-model="clusterStore.configInfo.podNetwork.c_cidr"
                    class="pod-pixiu-mask"
                    disabled />

                  <span style="margin-left: 4px">.</span>
                  <el-input
                    v-model="clusterStore.configInfo.podNetwork.d_cidr"
                    class="pod-pixiu-mask"
                    disabled />

                  <span style="margin-left: 4px">/</span>
                  <el-select
                    v-model="clusterStore.configInfo.podNetwork.pod_mask"
                    style="width: 70px; margin-left: 4px"
                  >
                    <el-option
                      v-for="item in clusterStore.options.podMaskOptions"
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
                <el-select
                  v-model="clusterStore.configInfo.serviceNetwork.a_cidr"
                  style="width: 70px"
                >
                  <el-option
                    v-for="item in clusterStore.options.serviceCidrOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="margin-left: 4px">.</span>
                <el-form-item prop="serviceNetwork.b_cidr">
                  <el-input
                    v-model="clusterStore.configInfo.serviceNetwork.b_cidr"
                    class="pod-pixiu-mask"
                /></el-form-item>

                <span style="margin-left: 4px">.</span>
                <el-input
                  v-model="clusterStore.configInfo.serviceNetwork.c_cidr"
                  class="pod-pixiu-mask"
                  disabled
                />

                <span style="margin-left: 4px">.</span>
                <el-input
                  v-model="clusterStore.configInfo.serviceNetwork.d_cidr"
                  class="pod-pixiu-mask"
                  disabled
                />

                <span style="margin-left: 4px">/</span>
                <el-select
                  v-model="clusterStore.configInfo.serviceNetwork.service_mask"
                  style="width: 70px; margin-left: 4px"
                >
                  <el-option
                    v-for="item in clusterStore.options.serviceMaskOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-space>
            </el-form-item>

            <div class="app-pixiu-describe" style="margin-top: -5px">
              kubernetes 的 service CIDR，不能和宿主机网络以及 Pod 网络冲突，选择后无法更改。
            </div>

            <el-form-item label="集群描述" style="width: 50%; margin-top: 15px" prop="description">
              <el-input
                v-model="clusterStore.configInfo.description"
                type="textarea"
                placeholder="请输入 Kubernentes 集群描述"
                :autosize="data.autosize"
              />
            </el-form-item>
          </el-card>
          <el-card id="step-2" header="集群配置" style="margin-top: 20px">
            <div style="margin-top: 20px" />
            <el-form-item label="高可用 kubernetes">
              <el-switch
                v-model="clusterStore.configInfo.config.kubernetes.enable_ha"
                active-text="启用"
                inactive-text="关闭"
              />
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              启用高可用 Kubernetes 集群时，推荐 master 节点数为 3
            </div>

            <el-form-item label="ApiServer 地址">
              <el-switch v-model="clusterStore.configInfo.config.enablePublicIp" />
            </el-form-item>
            <div v-if="clusterStore.configInfo.config.enablePublicIp">
              <el-form-item style="width: 40%">
                <el-input
                  v-model="clusterStore.configInfo.config.kubernetes.api_server"
                  style="margin-top: -10px"
                  placeholder="请输入 kubernetes apiserver 地址"
                />
              </el-form-item>
            </div>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              指定 kubernetes 集群的 ApiServer 地址，指定时需要在云平台上开启该地址到 master 节点的
              6443 端口 4 层转发。非高可用时可不指定，不指定时默认使用 master 节点的内网地址。
            </div>

            <div style="margin-top: 25px" />
            <el-form-item label="Kube-proxy 模式">
              <el-radio-group v-model="clusterStore.configInfo.config.network.kube_proxy">
                <el-radio-button label="iptables">iptables</el-radio-button>
                <el-radio-button disabled label="ipvs">ipvs</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -12px">
              默认使用 iptables 模式，ipvs 的转发性能更高。选择之后无法修改。
            </div>
          </el-card>
          <el-card id="step-3" header="节点配置" style="margin-top: 20px">
            <div>
              <el-row>
                <el-card class="detail-docs">
                  <el-icon
                    style="
                      vertical-align: middle;
                      font-size: 16px;
                      margin-left: -25px;
                      margin-top: -50px;
                    "
                    ><WarningFilled
                  /></el-icon>
                  <div style="vertical-align: middle; margin-top: -40px">
                    获取部署计划的 nodes 列表
                  </div>
                </el-card>

                <el-col>
                  <button
                    style="width: 85px"
                    type="button"
                    class="pixiu-two-button"
                    @click="clusterStore.handleCreateDialog"
                  >
                    新增节点
                  </button>

                  <!-- <div style="margin-left: 8px; float: right; margin-left: 12px">
                    <button type="button" class="pixiu-two-button" @click="GetPlanNodes">
                      搜索
                    </button>
                  </div>

                  <el-input
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
                  </el-input> -->
                </el-col>
              </el-row>
            </div>
            <el-table :data="clusterStore.configInfo.nodes">
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
              <el-table-column prop="auth" label="认证方式" :formatter="formatterNodeAuthType" />

              <!--<el-table-column prop="gmt_create" label="创建时间" :formatter="formatterTime" />-->
              <el-table-column fixed="right" label="操作" width="160px">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="text"
                    style="margin-right: -25px; margin-left: -10px; color: #006eff"
                    @click="clusterStore.handleDeleteDialog(scope)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card id="step-4" header="组件选项" style="margin-top: 20px">
            <el-form-item label="组件选项">
              <el-checkbox-group v-model="clusterStore.configInfo.install_components">
                <el-checkbox-button
                  v-for="city in clusterStore.options.availableComponents"
                  :key="city"
                  :label="city"
                >
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
          </el-card>
          <el-card
            style="margin-top: 20px; margin-bottom: 100px; display: flex; justify-content: center"
            ><button type="button" class="pixiu-two-button" @click="createPlan">
              确认提交
            </button></el-card
          >
        </el-form>
      </div>
    </el-main>
    <el-dialog
      v-model="clusterStore.showDialog"
      style="color: #000000; font: 14px"
      width="580px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      draggable
      center
      :before-close="clusterStore.clearFormData"
    >
      <template #header>
        <div style="text-align: left; font-weight: bold; padding-left: 5px">新增节点</div>
      </template>
      <template #default>
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
          :ref="(el) => (clusterStore.nodeFormRef = el)"
          label-position="left"
          :rules="clusterStore.nodeRules"
          label-width="80px"
          :model="clusterStore.nodeInfo"
          style="max-width: 90%; margin-left: 6px"
        >
          <el-form-item prop="name">
            <template #label>
              <span style="font-size: 13px; color: #191919">节点名称</span>
            </template>
            <el-input v-model="clusterStore.nodeInfo.name" />
          </el-form-item>
          <el-form-item prop="role">
            <template #label>
              <span style="font-size: 13px; color: #191919">角色</span>
            </template>

            <el-radio-group v-model="clusterStore.nodeInfo.role">
              <el-radio style="margin-right: 16px" :value="1">master</el-radio>
              <el-radio :value="0">node</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item prop="cri">
            <template #label>
              <span style="font-size: 13px; color: #191919">运行时</span>
            </template>

            <el-radio-group v-model="clusterStore.nodeInfo.cri">
              <el-radio-button label="docker">docker</el-radio-button>
              <el-radio-button label="containerd">containerd</el-radio-button>
            </el-radio-group>
          </el-form-item> -->

          <el-form-item prop="ip">
            <template #label>
              <span style="font-size: 13px; color: #191919">IP地址</span>
            </template>
            <el-input v-model="clusterStore.nodeInfo.ip" />
          </el-form-item>

          <el-form-item prop="auth.type">
            <template #label>
              <span style="font-size: 13px; color: #191919">登陆方式</span>
            </template>

            <el-radio-group v-model="clusterStore.nodeInfo.auth.type">
              <el-radio-button label="password">密码登陆</el-radio-button>
              <el-radio-button label="key">密钥登陆</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <div v-if="clusterStore.nodeInfo.auth.type === 'password'">
            <el-form-item prop="auth.password.user">
              <template #label>
                <span style="font-size: 13px; color: #191919">用户名</span>
              </template>
              <div>{{ clusterStore.nodeInfo.auth.password.user }}</div>
            </el-form-item>
            <el-form-item prop="auth.password.password">
              <template #label>
                <span style="font-size: 13px; color: #191919">密码</span>
              </template>
              <el-input
                v-model="clusterStore.nodeInfo.auth.password.password"
                show-password
                clearable
                style="width: 56%"
              />
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -5px; margin-left: 88px">
              根据实际需要添加节点名，地址，用户名称，和对应密码。
            </div>
          </div>

          <div v-if="clusterStore.nodeInfo.auth.type === 'key'">
            <el-form-item prop="auth.key.data">
              <template #label>
                <span style="font-size: 13px; color: #191919">密钥</span>
              </template>
              <el-input
                v-model="clusterStore.nodeInfo.auth.key.data"
                style="width: 82%"
                type="textarea"
                :autosize="{ minRows: 6 }"
              />
            </el-form-item>
            <div class="app-pixiu-describe" style="margin-top: -5px; margin-left: 88px">
              输入对接节点的密码。
            </div>
          </div>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="pixiu-small-confirm-button"
            type="primary"
            @click="clusterStore.confirm"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <pixiuDialog
      :close-event="clusterStore.deleteDialog.close"
      :object-name="clusterStore.deleteDialog.objectName"
      :delete-name="clusterStore.deleteDialog.deleteName"
      :alias-name="clusterStore.deleteDialog.aliasName"
      @confirm="clusterStore.confirmDelete"
      @cancel="clusterStore.cancel"
    ></pixiuDialog>
  </div>
</template>
<script setup>
import { reactive, getCurrentInstance, ref, onMounted } from 'vue';
import useClusterStore from '@/stores/useCluster';
import pixiuDialog from '@/components/pixiuDialog/index.vue';
import { formatterTime, formatterNodeAuthType, formatterNodeRole } from '@/utils/formatter';
import { copy } from '@/utils/utils';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();

const clusterStore = useClusterStore();
const router = useRouter();

const stepContainerRef = ref(null);

const data = reactive({
  autosize: {
    minRows: 5,
  },
});

const backToPlan = () => {
  clusterStore.configFormRef.resetFields();
  clusterStore.configInfo.nodes = [];
  router.replace({
    name: 'Plan',
  });
};

const createPlan = async () => {
  try {
    await clusterStore.createOrEditPlan();
    backToPlan();
  } catch (err) {
    proxy.$message({
      message: err.message,
      type: 'error',
    });
  }
};

/* const goToStep = (index) => {
  clusterStore.active = index - 1;
  const section = ref(document.getElementById(`step-${index - 1}`));
  if (section.value && stepContainerRef.value) {
    stepContainerRef.value.scrollTo({
      top: section.value.offsetTop - stepContainerRef.value.offsetTop,
      behavior: 'smooth',
    });
  }
};

// 定义防抖函数
function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

const extractNumber = (str) => {
  const match = str.match(/\d+/); // 使用正则表达式提取数字部分
  return match ? match[0] : ''; // 返回匹配到的第一个数字，如果没有则返回空字符串
};

const handlerScrollEvent = (e) => {
  const container = stepContainerRef.value;
  const cards = container.querySelectorAll('.el-card');
  let closestCard = null;
  let closestDistance = Infinity;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.top - container.getBoundingClientRect().top);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });

  if (closestCard) {
    // 可以将 closestCard.id 存储到需要的地方，比如 ref 或者状态中
    if (closestCard.id !== '') {
      clusterStore.active = Number(extractNumber(closestCard.id));
    }
  }
};

// 将 handlerScrollEvent 函数使用防抖包装，100ms 内连续触发事件只执行一次处理函数
const debouncedHandlerScrollEvent = debounce(handlerScrollEvent, 100); */

onMounted(() => {
  // 路由上面的planId
  clusterStore.planId = router.currentRoute.value.query.planId;

  // if (stepContainerRef.value) {
  //   stepContainerRef.value.addEventListener('scroll', debouncedHandlerScrollEvent);
  // }
});

// onUnmounted(() => {
//   if (stepContainerRef.value) {
//     stepContainerRef.value.removeEventListener('scroll', debouncedHandlerScrollEvent);
//   }
// });
</script>
<style scoped></style>
