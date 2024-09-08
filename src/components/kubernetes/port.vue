<template>
  <div>
    <el-form-item label="端口设置" style="margin-bottom: 0">
      <el-button
        icon="CirclePlusFilled"
        type="primary"
        size="small"
        text
        style="padding-left: 0"
        @click="pushPort"
        >新增</el-button
      >
    </el-form-item>
    <el-form
      v-for="(item, portIndex) in state.ports"
      :key="portIndex"
      inline
      style="margin-left: 100px"
    >
      <el-form-item label="名称">
        <el-input v-model="item.name" size="small" style="width: 120px" />
      </el-form-item>
      <el-form-item label="容器端口">
        <el-input-number v-model="item.containerPort" size="small" :min="1" :max="65535" />
      </el-form-item>
      <el-form-item label="协议">
        <el-select v-model="item.protocol" size="small" style="width: 80px">
          <el-option v-for="p in protocolType" :key="p.type" :label="p.type" :value="p.value" />
        </el-select>
        <el-button
          icon="RemoveFilled"
          type="primary"
          size="small"
          text
          @click="state.ports.splice(portIndex, 1)"
        ></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import jsPlumb from 'jsplumb';

const uuid = jsPlumb.jsPlumbUtil.uuid;
const state = reactive({
  ports: [],
});

const props = defineProps({
  ports: {
    type: Array,
    required: true,
  },
});

const pushPort = () => {
  const name = uuid().toString().split('-')[1];
  const port = {
    name: 'p-' + name,
    containerPort: 80,
    protocol: 'TCP',
  };
  state.ports.push(port);
};

onMounted(() => {
  if (props.ports) {
    state.ports = JSON.parse(JSON.stringify(props.ports));
  }
});

const returnPorts = () => {
  return state.ports;
};

defineExpose({
  returnPorts,
});

const protocolType = [
  {
    type: 'tcp',
    value: 'TCP',
  },
  {
    type: 'udp',
    value: 'UDP',
  },
  {
    type: 'sctp',
    value: 'SCTP',
  },
];
</script>

<style scoped></style>
