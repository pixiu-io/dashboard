<template>
  <div style="margin-top: 20px">
    <el-form
      ref="containerRef"
      :model="state.container"
      label-width="100px"
      status-icon
      label-position="left"
      require-asterisk-position="right"
    >
      <div class="group">
        <div class="right-label">基础信息</div>
        <div class="context">
          <el-form-item label="初始化容器">
            <el-checkbox
              v-model="state.container.isInitContainer"
              label="设置为Init容器"
              size="default"
            />
          </el-form-item>
          <el-form-item
            label="容器名称"
            prop="name"
            :rules="[{ required: true, message: '容器名不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="state.container.name" />
          </el-form-item>
          <el-form-item
            label="镜像"
            style="margin-top: 10px"
            prop="image"
            :rules="[{ required: true, message: '镜像不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="state.container.image" />
          </el-form-item>
          <el-form-item label="拉取策略">
            <div>
              <el-radio-group v-model="state.container.imagePullPolicy">
                <el-radio-button label="IfNotPresent" value="IfNotPresent" />
                <el-radio-button label="Always" value="Always" />
                <el-radio-button label="Never" value="Never" />
              </el-radio-group>
              <div class="pixiu-describe">设置镜像拉取策略，默认使用 IfNotPresent 策略</div>
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <div style="display: flex; align-items: center">
                资源配置
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="<div>即为该应用预留资源额度，包括CPU和内存两种资源，即容器独占该资源，</div><div> 防止因资源不足而被其他服务或进程争夺资源，导致应用不可用</div>"
                  placement="top-start"
                  raw-content
                >
                  <el-icon size="13px" color="#181a18" style="margin-left: 3px">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip></div
            ></template>
            <el-button
              v-if="!state.resourceSet"
              icon="Edit"
              type="primary"
              size="small"
              text
              style="padding-left: 0"
              @click="setResource"
              >配置</el-button
            >
            <el-button
              v-else
              icon="Delete"
              type="primary"
              size="small"
              text
              style="padding-left: 0"
              @click="cancelResource"
              >取消配置</el-button
            >
          </el-form-item>
          <div v-if="state.resourceSet">
            <el-form-item v-if="state.container.resources">
              <div>
                <div v-if="state.container.resources.requests">
                  <span>所需资源： CPU</span>
                  <el-input
                    v-model="state.container.resources.requests.cpu"
                    placeholder="如：10m"
                    size="small"
                    class="limit"
                  />
                  <span> Core</span>
                  <el-divider direction="vertical" />
                  <a>内存</a>
                  <el-input
                    v-model="state.container.resources.requests.memory"
                    placeholder="如：300Mi"
                    size="small"
                    class="limit"
                  />
                </div>
                <div class="pixiu-describe">
                  建议根据实际使用情况设置，防止由于资源约束而无法调度或引发内存不足(OOM)错误
                </div>

                <div v-if="state.container.resources.limits">
                  <span>资源限制： CPU</span>
                  <el-input
                    v-model="state.container.resources.limits.cpu"
                    placeholder="如：10m"
                    size="small"
                    class="limit"
                  />
                  <span> Core</span>
                  <el-divider direction="vertical" />
                  <a>内存</a>
                  <el-input
                    v-model="state.container.resources.limits.memory"
                    placeholder="如：500Mi"
                    size="small"
                    class="limit"
                  />
                </div>
                <div class="pixiu-describe">
                  建议根据实际使用情况设置，防止因资源不足导致应用不可用
                </div>
              </div>
            </el-form-item>
          </div>

          <el-form-item>
            <template #label>
              <el-tooltip
                class="box-item"
                effect="light"
                content="<div>默认情况下，容器是不可以访问宿主上的任何设备；特权容器则</div><div> 被授权访问宿主上所有设备，享有宿主上运行的进程的所有访问权限</div>"
                placement="top-start"
                raw-content
              >
                容器启动项
              </el-tooltip>
            </template>
            <el-checkbox v-model="state.container.stdin" label="stdin" />
            <el-checkbox v-model="state.container.tty" label="tty" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-tooltip
                class="box-item"
                effect="light"
                content="<div>默认情况下，容器是不可以访问宿主上的任何设备；特权容器则</div><div> 被授权访问宿主上所有设备，享有宿主上运行的进程的所有访问权限</div>"
                placement="top-start"
                raw-content
              >
                特权容器
              </el-tooltip>
            </template>
            <el-checkbox
              v-if="state.container.securityContext"
              v-model="state.container.securityContext.privileged"
            />
          </el-form-item>
        </div>
      </div>
      <div class="group">
        <div class="right-label">端口设置</div>
        <div class="context">
          <Port ref="portRef" :ports="state.container.ports" />
        </div>
      </div>
      <div class="group">
        <div class="right-label">环境变量</div>
        <div class="context">
          <Environment ref="envRef" :env="state.container.env" />
        </div>
      </div>
      <div v-if="!state.container.isInitContainer" class="group">
        <div class="right-label">健康检查</div>
        <div class="context">
          <HealthCheck
            ref="liveCheckRef"
            :title="'存活检查'"
            :desribe="'用来检查容器是否正常，不正常则重启容器'"
            :check-data="state.container.livenessProbe"
          />
          <HealthCheck
            ref="readyCheckRef"
            :title="'就绪检查'"
            :desribe="'用来检查容器是否正常，不正常则重启容器'"
            :check-data="state.container.readinessProbe"
          />
          <HealthCheck
            ref="startCheckRef"
            :title="'启动探测'"
            :desribe="'用来检查容器是否正常，不正常则重启容器'"
            :check-data="state.container.startupProbe"
          />
        </div>
      </div>
      <div v-if="!state.container.isInitContainer" class="group">
        <div class="right-label">生命周期</div>
        <div class="context">
          <el-form-item>
            <template #label>
              <el-tooltip
                class="box-item"
                effect="light"
                content="用来检查容器是否正常，不正常则重启容器"
                placement="top-start"
                raw-content
              >
                启动前
              </el-tooltip>
            </template>
            <LifeCheck ref="preLifeRef" :life-data="state.container.lifecycle.postStart" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-tooltip
                class="box-item"
                effect="light"
                content="用来检查容器是否正常，不正常则重启容器"
                placement="top-start"
                raw-content
              >
                停止前
              </el-tooltip>
            </template>
            <LifeCheck ref="postLifeRef" :life-data="state.container.lifecycle.preStop" />
          </el-form-item>
        </div>
      </div>
      <div class="group">
        <div class="right-label">启动命令</div>
        <div class="context">
          <StartCommand
            ref="startCmdRef"
            :args="state.container.args"
            :commands="state.container.command"
          />
        </div>
      </div>
      <div class="group">
        <div class="right-label">数据卷配置</div>
        <div class="context">
          <VolumeMount
            ref="volumeMountRef"
            :volumes="props.volumes"
            :volume-mounts="state.container.volumeMounts"
          />
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import { isObjectValueEqual } from '@/utils/utils';
import { InfoFilled } from '@element-plus/icons-vue';

const Port = defineAsyncComponent(() => import('./port.vue'));
const Environment = defineAsyncComponent(() => import('./environment.vue'));
const HealthCheck = defineAsyncComponent(() => import('./healthCheck.vue'));
const LifeCheck = defineAsyncComponent(() => import('./lifeCheck.vue'));
const StartCommand = defineAsyncComponent(() => import('./StartCommand.vue'));
const VolumeMount = defineAsyncComponent(() => import('./volume.vue'));

const containerRef = ref();
const portRef = ref();
const envRef = ref();
const liveCheckRef = ref();
const readyCheckRef = ref();
const startCheckRef = ref();

const preLifeRef = ref();
const postLifeRef = ref();

const startCmdRef = ref();
const volumeMountRef = ref();
const state = reactive({
  resourceSet: false,
  verified: true,
  container: {
    isInitContainer: false,
    name: '',
    image: '',
    imagePullPolicy: 'IfNotPresent',
    securityContext: {
      privileged: false,
    },
    stdin: false,
    tty: false,
    env: [],
    ports: [],
    resources: {
      limits: {
        memory: '',
        cpu: '',
      },
      requests: {
        memory: '',
        cpu: '',
      },
    },
    livenessProbe: {},
    readinessProbe: {},
    startupProbe: {},
    lifecycle: {
      postStart: {},
      preStop: {},
    },
    command: [],
    args: [],
    volumeMounts: [],
  },
});

const props = defineProps({
  container: {
    type: Object,
    required: true,
  },
  volumes: {
    type: Array,
    required: true,
  },
});

const setResource = () => {
  state.resourceSet = !state.resourceSet;
  state.container.resources = {
    limits: {
      cpu: '',
      memory: '',
    },
    requests: {
      cpu: '',
      memory: '',
    },
  };
};

const cancelResource = () => {
  state.resourceSet = !state.resourceSet;
  delete state.container.resources;
};

const getPorts = async () => {
  if (!portRef.value) return;
  const [ports, verified] = await portRef.value.getPorts();
  if (state.verified && !verified) state.verified = false;
  if (ports.length > 0) {
    state.container.ports = ports;
  } else {
    delete state.container.ports;
  }
};
// 更新存活检查数据
const getLivenessData = async () => {
  if (!liveCheckRef.value) return;
  const { set, probe, verified } = await liveCheckRef.value.getHealthCheck();
  if (state.verified && !verified) state.verified = false;
  if (set) {
    state.container.livenessProbe = probe;
  } else {
    delete state.container.livenessProbe;
  }
};

const getReadinessData = async () => {
  if (!readyCheckRef.value) return;
  const { set, probe, verified } = await readyCheckRef.value.getHealthCheck();
  if (state.verified && !verified) state.verified = false;
  if (set) {
    state.container.readinessProbe = probe;
  } else {
    delete state.container.readinessProbe;
  }
};

const getStartupData = async () => {
  if (!startCheckRef.value) return;
  const { set, probe, verified } = await startCheckRef.value.getHealthCheck();
  if (state.verified && !verified) state.verified = false;
  if (set) {
    state.container.startupProbe = probe;
  } else {
    delete state.container.startupProbe;
  }
};

const getPostStart = async () => {
  if (!postLifeRef.value) return;
  const { set, lifeProbe, verified } = await postLifeRef.value.getLife();
  if (state.verified && !verified) state.verified = false;
  if (set) {
    state.container.lifecycle = {
      postStart: lifeProbe,
    };
  } else {
    delete state.container.lifecycle.postStart;
  }
};

const getPreStop = async () => {
  if (!preLifeRef.value) return;
  const { set, lifeProbe, verified } = await preLifeRef.value.getLife();
  if (state.verified && !verified) state.verified = false;
  if (set) {
    state.container.lifecycle = {
      preStop: lifeProbe,
    };
  } else {
    delete state.container.lifecycle.preStop;
  }
};

const getCommands = async () => {
  if (!startCmdRef.value) return;
  const { set, commands, args, verified } = await startCmdRef.value.getStartCommand();
  if (state.verified && !verified) state.verified = false;
  if (set) {
    state.container.command = commands;
    state.container.args = args;
  } else {
    delete state.container.command;
    delete state.container.args;
  }
};

const getEnv = async () => {
  if (!envRef.value) return;
  const [envs, verified] = await envRef.value.getEnvs();
  if (state.verified && !verified) {
    state.verified = false;
  } else {
    if (envs.length > 0) {
      state.container.env = envs;
    } else {
      delete state.container.env;
    }
  }
};

const getVolumeMount = async () => {
  if (!volumeMountRef.value) return;
  const [volumeMount, verified] = await volumeMountRef.value.getVolumeMounts();
  if (state.verified && !verified) {
    state.verified = false;
  } else {
    state.container.volumeMounts = volumeMount;
  }
};
const getContainer = async () => {
  state.verified = true;
  if (containerRef.value) {
    await containerRef.value.validate((valid) => {
      if (state.verified && !valid) state.verified = false;
    });
  }
  await getPorts();
  await getEnv();
  await getLivenessData();
  await getStartupData();
  await getReadinessData();
  await getPreStop();
  await getPostStart();
  await getCommands();
  await getVolumeMount();

  let volumes = [];
  if (volumeMountRef.value) {
    volumes = volumeMountRef.value.getVolumes();
  }
  // TODO 优化
  if (state.container.isInitContainer) {
    delete state.container.lifecycle;
    delete state.container.livenessProbe;
    delete state.container.readinessProbe;
    delete state.container.startupProbe;
  }
  return [state.container, volumes, state.verified];
};
defineExpose({
  getContainer,
});
onMounted(() => {
  state.container = JSON.parse(JSON.stringify(props.container));
  if (!isObjectValueEqual(state.container.resources, {})) {
    state.resourceSet = true;
  }
});
</script>

<style scoped>
.group {
  display: flex;
  margin-bottom: 10px;
  background-color: rgb(248, 247, 247);
}

.group:hover {
  -webkit-box-shadow: #ccc 0px 5px 5px;
  -moz-box-shadow: #ccc 0px 5px 5px;
  box-shadow: #ccc 0px 5px 5px;
  .right-label {
    background-color: #a5a5a5;
  }
}

.right-label {
  background-color: #cfcfcf;
  display: flex;
  align-items: center;
  justify-items: center;
  margin-right: 42px;
  width: 28px;
  font-size: 15px;
  text-align: center;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
}
.context {
  margin-top: 10px;
}
.limit {
  margin-left: 10px;
  width: 90px;
}
</style>
