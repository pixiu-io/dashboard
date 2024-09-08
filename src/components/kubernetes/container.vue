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
        <div>
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
        </div>
      </div>
      <div class="group">
        <div class="right-label">端口设置</div>
        <Port :ports="state.container.port" />
      </div>
      <div class="group">
        <div class="right-label">环境变量</div>
        <Environment :env="state.container.env" />
      </div>
      <div class="group">
        <div class="right-label">健康检查</div>
        <div>
          <HealthCheck
            ref="lifeCheckRef"
            :title="'存活检查'"
            :desribe="'用来检查容器是否正常，不正常则重启容器'"
            :check-data="state.container.livenessProbe"
          />
          <HealthCheck
            ref="lifeCheckRef"
            :title="'就绪检查'"
            :desribe="'用来检查容器是否正常，不正常则重启容器'"
            :check-data="state.container.readinessProbe"
          />
          <HealthCheck
            ref="lifeCheckRef"
            :title="'启动探测'"
            :desribe="'用来检查容器是否正常，不正常则重启容器'"
            :check-data="state.container.startupProbe"
          />
        </div>
      </div>
      <div class="group">
        <div class="right-label">生命周期</div>
        <div>
          <el-form-item label="启动前：">
            <template #label>
              <el-tooltip
                class="box-item"
                effect="light"
                content="用来检查容器是否正常，不正常则重启容器"
                placement="top-start"
                raw-content
              >
                启动前：
              </el-tooltip>
            </template>
            <LifeCheck ref="preLifeRef" :life-data="state.container.lifecycle.postStart" />
          </el-form-item>
          <el-form-item label="停止前：">
            <template #label>
              <el-tooltip
                class="box-item"
                effect="light"
                content="用来检查容器是否正常，不正常则重启容器"
                placement="top-start"
                raw-content
              >
                停止前：
              </el-tooltip>
            </template>
            <LifeCheck ref="postLifeRef" :life-data="state.container.lifecycle.preStop" />
          </el-form-item>
        </div>
      </div>
      <div class="group">
        <div class="right-label">启动命令</div>
        <div>
          <StartCommand :args="state.container.arg" :commands="state.container.commands" />
        </div>
      </div>
      <div class="group">
        <div class="right-label">数据卷配置</div>
        <div>
          <Volume :volumes="props.volumes" :volume-mounts="state.container.volumeMounts" />
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';

const Port = defineAsyncComponent(() => import('./port.vue'));
const Environment = defineAsyncComponent(() => import('./environment.vue'));
const HealthCheck = defineAsyncComponent(() => import('./healthCheck.vue'));
const LifeCheck = defineAsyncComponent(() => import('./lifeCheck.vue'));
const StartCommand = defineAsyncComponent(() => import('./StartCommand.vue'));
const Volume = defineAsyncComponent(() => import('./volume.vue'));

const containerRef = ref();

const state = reactive({
  verified: true,
  container: {
    lifecycle: {
      postStart: {},
      preStop: {},
    },
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

const getContainer = async () => {
  state.verified = true;
  if (containerRef.value != null) {
    await containerRef.value.validate((valid) => {
      state.verified = valid;
    });
  }
  return [state.container, state.verified];
};
defineExpose({
  getContainer,
});
onMounted(() => {
  state.container = JSON.parse(JSON.stringify(props.container));
});
</script>

<style scoped>
.group {
  display: flex;
  margin-bottom: 10px;
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
  margin-right: 18px;
  width: 28px;
  font-size: 15px;
  text-align: center;
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
