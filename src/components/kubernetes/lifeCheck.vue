<template>
  <div>
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
    <el-tabs v-if="state.set" v-show="state.show" v-model="activeName">
      <el-tab-pane v-if="state.lifeProbe.httpGet" label="Http模式" name="httpGet">
        <el-form
          v-show="state.lifeProbe.httpGet"
          ref="httpRef"
          :model="state.lifeProbe.httpGet"
          label-width="120px"
          require-asterisk-position="right"
          status-icon
        >
          <el-form-item label="请求方式" prop="scheme">
            <el-select v-model="state.lifeProbe.httpGet.scheme" size="small">
              <el-option
                v-for="item in schemeType"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="state.lifeProbe.httpGet.path" size="small" style="width: 190px" />
          </el-form-item>
          <el-form-item
            label="端口"
            prop="port"
            :rules="[{ required: true, message: '端口不能为空', trigger: 'blur' }]"
          >
            <el-input-number
              v-model.number="state.lifeProbe.httpGet.port"
              :min="80"
              :max="65535"
              size="small"
              style="width: 190px"
            />
          </el-form-item>
          <el-form-item label="Http头">
            <el-button
              :icon="CirclePlusFilled"
              type="primary"
              size="small"
              text
              @click="state.lifeProbe?.httpGet?.httpHeaders?.push({ name: '', value: '' })"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item v-for="(item, index) in state.lifeProbe.httpGet.httpHeaders" :key="index">
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
              @click="state.lifeProbe?.httpGet?.httpHeaders?.splice(index, 1)"
            ></el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="state.lifeProbe.tcpSocket" label="TCP模式" name="tcpSocket">
        <el-form
          v-show="state.lifeProbe.tcpSocket"
          ref="tcpRef"
          :model="state.lifeProbe.tcpSocket"
          label-width="120px"
          require-asterisk-position="right"
          status-icon
        >
          <el-form-item label="请求地址">
            <el-input
              v-model="state.lifeProbe.tcpSocket.host"
              placeholder="一般不填写，默认为空"
              size="small"
              style="width: 190px"
            />
          </el-form-item>
          <el-form-item
            label="端口"
            prop="port"
            :rules="[{ required: true, message: '端口不能为空', trigger: 'blur' }]"
          >
            <el-input-number
              v-model.number="state.lifeProbe.tcpSocket.port"
              size="small"
              :min="80"
              :max="65535"
              style="width: 190px"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Exec模式" name="exec">
        <el-form
          v-show="state.lifeProbe.exec"
          ref="execRef"
          :model="state"
          label-width="120px"
          require-asterisk-position="right"
          status-icon
        >
          <el-form-item
            label="命令"
            prop="command"
            :rules="[{ required: true, message: '值不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="state.command" size="small" style="width: 190px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { isObjectValueEqual } from '@/utils/utils';
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue';
import { CaretBottom, CaretTop } from '@element-plus/icons-vue';
const execRef = ref();
const httpRef = ref();
const tcpRef = ref();

const state = reactive({
  verified: true,
  set: false,
  show: true,
  command: '',
  lifeProbe: {
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
      command: [''],
    },
  },
});
const activeName = ref('httpGet');
const props = defineProps({
  lifeData: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  if (!isObjectValueEqual(props.lifeData, {})) {
    state.set = true;
    const dataCopy = JSON.parse(JSON.stringify(props.lifeData));
    if (dataCopy.httpGet && !isObjectValueEqual(dataCopy.httpGet, state.lifeProbe.httpGet)) {
      state.lifeProbe.httpGet = dataCopy.httpGet;
    } else if (
      dataCopy.tcpSocket &&
      !isObjectValueEqual(dataCopy.tcpSocket, state.lifeProbe.tcpSocket)
    ) {
      state.lifeProbe.tcpSocket = dataCopy.tcpSocket;
    } else if (dataCopy.exec && !isObjectValueEqual(dataCopy.exec, state.lifeProbe.exec)) {
      let str = '';
      dataCopy.exec.command.forEach((item, index) => {
        if (index == dataCopy.exec.command.length - 1) {
          str = str + item;
        } else {
          str = str + item + ',';
        }
      });
      if (str != state.command) state.command = str;
    }
    setTimeout(() => {
      state.loadFromParent = false;
    }, 100);
  }
});
const getLife = async () => {
  state.verified = true;
  const copyData = JSON.parse(JSON.stringify(state));
  if (state.set) {
    switch (activeName.value) {
      case 'httpGet': {
        if (httpRef.value) {
          await httpRef.value.validate((valid) => {
            if (state.verified && !valid) {
              state.verified = false;
            }
          });
        }
        delete copyData.lifeProbe.tcpSocket;
        delete copyData.lifeProbe.exec;
        break;
      }
      case 'tcpSocket': {
        if (tcpRef.value) {
          await tcpRef.value.validate((valid) => {
            if (state.verified && !valid) {
              state.verified = false;
            }
          });
        }
        delete copyData.lifeProbe.httpGet;
        delete copyData.lifeProbe.exec;
        break;
      }
      case 'exec': {
        if (execRef.value) {
          await execRef.value.validate((valid) => {
            if (state.verified && !valid) {
              state.verified = false;
            }
          });
        }
        if (state.command.indexOf(',')) {
          copyData.lifeProbe.exec.command = state.command.split(',');
        } else {
          copyData.lifeProbe.exec.command = state.command;
        }
        delete copyData.lifeProbe.httpGet;
        delete copyData.lifeProbe.tcpSocket;
        break;
      }
    }
  }
  return { set: state.set, lifeProbe: copyData.lifeProbe, verified: state.verified };
};
defineExpose({
  getLife,
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
  margin-bottom: 15px;
}
</style>
