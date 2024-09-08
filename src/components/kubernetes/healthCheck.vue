<template>
  <div>
    <el-form-item>
      <template #label>
        <el-tooltip effect="light" :content="describe" placement="top-start" raw-content>
          {{ title }}
        </el-tooltip>
      </template>
      <el-checkbox v-model="state.set" label="开启" size="small" />
      <el-button
        v-if="state.show"
        v-show="state.set"
        type="info"
        text
        :icon="CaretTop"
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
        :icon="CaretBottom"
        size="small"
        style="margin-left: 30px"
        @click="state.show = !state.show"
        >展开</el-button
      >
    </el-form-item>
    <el-tabs v-if="state.set" v-show="state.show" v-model="activeName" style="margin-left: 100px">
      <el-tab-pane label="Http模式" name="httpGet">
        <el-form v-show="state.probe.httpGet" :model="state.probe.httpGet" label-width="130px">
          <el-form-item label="请求方式" prop="scheme">
            <el-select v-model="state.probe.httpGet.scheme">
              <el-option
                v-for="item in schemeType"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="state.probe.httpGet.path" size="default" style="width: 200px" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input
              v-model.number="state.probe.httpGet.port"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="Http头">
            <el-button
              :icon="CirclePlusFilled"
              type="primary"
              size="small"
              text
              style="padding-left: 0"
              @click="state.probe.httpGet.httpHeaders.push({ name: '', value: '' })"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item v-for="(item, index) in state.probe.httpGet.httpHeaders" :key="index">
            <template #label> </template>
            <el-input v-model="item.name" placeholder="key" size="small" style="width: 100px" />
            <el-input
              v-model="item.value"
              placeholder="value"
              size="small"
              style="width: 100px; margin-left: 5px"
            />
            <el-button
              :icon="RemoveFilled"
              type="primary"
              size="small"
              text
              @click="state.probe.httpGet?.httpHeaders.splice(index, 1)"
            ></el-button>
          </el-form-item>

          <el-form-item label="延迟探测时间(s)">
            <el-input-number
              v-model="state.probe.initialDelaySeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="执行探测频率(s)">
            <el-input-number
              v-model="state.probe.periodSeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="超时时间(s)">
            <el-input-number
              v-model="state.probe.timeoutSeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="健康阀值(s)">
            <el-input-number
              v-model="state.probe.successThreshold"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="不健康阀值(s)">
            <el-input-number
              v-model="state.probe.failureThreshold"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="TCP模式" name="tcpSocket">
        <el-form v-show="state.probe.tcpSocket" :model="state.probe.tcpSocket" label-width="120px">
          <el-form-item label="请求地址">
            <el-input
              v-model="state.probe.tcpSocket.host"
              placeholder="一般不填写，默认为空"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="state.probe.tcpSocket.port" size="default" style="width: 200px" />
          </el-form-item>
          <el-form-item label="延迟探测时间(s)">
            <el-input-number
              v-model="state.probe.initialDelaySeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="执行探测频率(s)">
            <el-input-number
              v-model="state.probe.periodSeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="超时时间(s)">
            <el-input-number
              v-model="state.probe.timeoutSeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="健康阀值(s)">
            <el-input-number
              v-model="state.probe.successThreshold"
              size="default"
              style="width: 200px"
              disabled
            />
          </el-form-item>
          <el-form-item label="不健康阀值(s)">
            <el-input-number
              v-model="state.probe.failureThreshold"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Exec模式" name="exec">
        <el-form v-show="state.probe.exec" :model="state.probe.exec" label-width="120px">
          <el-form-item label="命令">
            <el-input v-model="state.probe.exec.command" size="default" style="width: 200px" />
          </el-form-item>
          <el-form-item label="延迟探测时间(s)">
            <el-input-number
              v-model="state.probe.initialDelaySeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="执行探测频率(s)">
            <el-input-number
              v-model="state.probe.periodSeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="超时时间(s)">
            <el-input-number
              v-model="state.probe.timeoutSeconds"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="健康阀值(s)">
            <el-input-number
              v-model="state.probe.successThreshold"
              size="default"
              style="width: 200px"
              disabled
            />
          </el-form-item>
          <el-form-item label="不健康阀值(s)">
            <el-input-number
              v-model="state.probe.failureThreshold"
              size="default"
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CaretBottom, CaretTop } from '@element-plus/icons-vue';
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue';
import { isObjectValueEqual } from '@/utils/utils';

const state = reactive({
  loadFromParent: false,
  set: false,
  show: true,
  probe: {
    httpGet: {
      httpHeaders: [],
      scheme: 'HTTP',
      port: 80,
      path: '',
    },
    tcpSocket: {
      host: '',
      port: 80,
    },
    exec: {
      command: [],
    },
    successThreshold: 1,
    initialDelaySeconds: 3,
    periodSeconds: 10,
    timeoutSeconds: 1,
    failureThreshold: 3,
  },
});
const activeName = ref('httpGet');
const props = defineProps({
  checkData: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: () => '健康检查',
  },
  describe: {
    type: String,
    default: () => '用于检查容器检查情况',
  },
});

onMounted(() => {
  if (props.checkData) {
    state.set = true;
    const dataCopy = JSON.parse(JSON.stringify(props.checkData));
    if (dataCopy.httpGet && !isObjectValueEqual(dataCopy.httpGet, state.probe.httpGet)) {
      state.probe.httpGet = dataCopy.httpGet;
    } else if (
      dataCopy.tcpSocket &&
      !isObjectValueEqual(dataCopy.tcpSocket, state.probe.tcpSocket)
    ) {
      state.probe.tcpSocket = dataCopy.tcpSocket;
    } else if (dataCopy.exec && !isObjectValueEqual(dataCopy.exec, state.probe.exec)) {
      state.probe.exec = dataCopy.exec;
    }
    if (dataCopy.failureThreshold != state.probe.failureThreshold) {
      state.probe.failureThreshold = dataCopy.failureThreshold;
    }
    if (dataCopy.initialDelaySeconds != state.probe.initialDelaySeconds) {
      state.probe.initialDelaySeconds = dataCopy.initialDelaySeconds;
    }
    if (dataCopy.periodSeconds != state.probe.periodSeconds) {
      state.probe.periodSeconds = dataCopy.periodSeconds;
    }
    if (dataCopy.successThreshold != state.probe.successThreshold) {
      state.probe.successThreshold = dataCopy.successThreshold;
    }
    if (dataCopy.timeoutSeconds != state.probe.timeoutSeconds) {
      state.probe.timeoutSeconds = dataCopy.timeoutSeconds;
    }
  }
});

const returnHealthCheck = () => {
  const copyData = JSON.parse(JSON.stringify(state));
  switch (activeName.value) {
    case 'httpGet': {
      delete copyData.probe.tcpSocket;
      delete copyData.probe.exec;
      break;
    }
    case 'tcpSocket': {
      delete copyData.probe.httpGet;
      delete copyData.probe.exec;
      break;
    }
    case 'exec': {
      delete copyData.probe.httpGet;
      delete copyData.probe.tcpSocket;
      break;
    }
  }
  return { set: state.set, probe: copyData.probe };
};

defineExpose({
  returnHealthCheck,
});

const schemeType = [
  {
    label: 'HTTP',
    value: 'HTTP',
  },
  {
    label: 'HTTPS',
    value: 'HTTPS',
  },
];
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
