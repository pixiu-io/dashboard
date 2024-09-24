<template>
  <div style="margin-top: 20px; margin-left: 20px">
    <el-form
      ref="advanceRef"
      label-width="100px"
      :model="state"
      status-icon
      label-position="left"
      require-asterisk-position="right"
    >
      <div class="group">
        <div class="right-label">访问设置</div>
        <div class="context">
          <el-form-item label="服务(Service)">
            <el-button link type="primary">TODO</el-button>
          </el-form-item>
          <el-form-item label="路由(Ingress)">
            <el-button link type="primary">TODO</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="group">
        <div class="right-label">调度设置</div>
        <div class="context">
          <el-form-item label="升级策略">
            <div>
              <div>
                <el-checkbox v-model="state.set" label="开启" size="small" />
                <el-button
                  v-if="state.show"
                  v-show="state.set"
                  type="info"
                  text
                  icon="CaretTop"
                  size="small"
                  style="margin-left: 30px"
                  @click="state.show = !state.show"
                  >隐藏</el-button
                >
                <el-button
                  v-else
                  v-show="state.set"
                  type="info"
                  text
                  icon="CaretBottom"
                  size="small"
                  style="margin-left: 30px"
                  @click="state.show = !state.show"
                  >展开</el-button
                >
              </div>
              <div v-show="state.set && state.show">
                <el-form-item>
                  <el-radio-group v-model="state.strategy.type">
                    <el-radio-button
                      label="滚动升级"
                      value="RollingUpdate"
                      size="small"
                      @click="onChange"
                    />
                    <el-radio-button
                      label="替换升级"
                      value="Recreate"
                      size="small"
                    /> </el-radio-group
                ></el-form-item>
                <div v-if="state.strategy.type === 'RollingUpdate'">
                  <el-form-item
                    label="不可用Pod最大数量"
                    label-width="150"
                    prop="strategy.rollingUpdate.maxSurge"
                    :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="state.strategy.rollingUpdate.maxSurge"
                      size="small"
                      style="width: 100px; margin-right: 20px"
                    />
                    <div class="pixiu-describe">可以是个数例如：5 ; 可以是填百分比，例如：25%</div>
                  </el-form-item>
                  <el-form-item
                    label="超过期望的Pod数量"
                    label-width="150"
                    prop="strategy.rollingUpdate.maxUnavailable"
                    :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="state.strategy.rollingUpdate.maxUnavailable"
                      size="small"
                      style="width: 100px; margin-right: 20px"
                    />
                    <div class="pixiu-describe">可以是个数例如：5 ; 可以是填百分比，例如：25%</div>
                  </el-form-item>
                </div>
                <div v-else>
                  <div class="pixiu-describe">在创建新 Pod 之前，所有现有的 Pod 会被杀死</div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="节点亲和性">TODO</el-form-item>
          <el-form-item label="应用亲和性">TODO</el-form-item>
          <el-form-item label="应用反亲和性">TODO</el-form-item>
          <el-form-item label="调度容忍"
            ><Toleration ref="tolerationRef" :tolerations="tolerations"
          /></el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import { isObjectValueEqual } from '@/utils/utils';

const Toleration = defineAsyncComponent(() => import('./tolerations.vue'));
const advanceRef = ref();
const tolerationRef = ref();

const state = reactive({
  set: false,
  show: true,
  verified: false,
  strategy: {
    rollingUpdate: {
      maxSurge: '25%',
      maxUnavailable: '25%',
    },
    type: 'RollingUpdate',
  },
});

const props = defineProps({
  strategy: {
    type: Object,
    default: () => {},
  },
  tolerations: {
    type: Array,
    default: () => [],
  },
});

const onChange = () => {
  state.strategy = {
    rollingUpdate: {
      maxSurge: '25%',
      maxUnavailable: '25%',
    },
    type: 'RollingUpdate',
  };
};

onMounted(() => {
  if (props.strategy && !isObjectValueEqual(props.strategy, {})) {
    state.strategy = JSON.parse(JSON.stringify(props.strategy));
    state.set = true;
  }
});

const getAdvanceInfo = async () => {
  state.verified = true;
  const [toleratrions, verified] = await tolerationRef.value.getTolerations();
  if (state.verified && !verified) {
    state.verified = false;
  }

  if (!state.set) {
    return [{}, state.verified, toleratrions];
  }
  await advanceRef.value.validate((valid) => {
    if (state.verified && !valid) {
      state.verified = false;
    }
  });

  if (state.strategy.type === 'Recreate') {
    delete state.strategy.rollingUpdate;
  }

  return [state.strategy, state.verified, toleratrions];
};

defineExpose({
  getAdvanceInfo,
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
.el-form-item {
  margin-bottom: 15px;
}
</style>
