<template>
  <div>
    <el-form-item label="端口设置" style="margin-bottom: 0">
      <el-button
        icon="CirclePlusFilled"
        type="primary"
        size="small"
        text
        :rule="rules"
        style="padding-left: 0"
        @click="pushPort"
        >新增</el-button
      >
    </el-form-item>
    <el-form
      ref="portRef"
      inline
      :rules="rules"
      :model="state"
      status-icon
      style="margin-left: 100px"
    >
      <div v-for="(item, index) in state.ports" :key="index">
        <el-form-item label="名称" :prop="'ports[' + index + '].name'" :rules="rules.name">
          <el-input v-model="item.name" size="small" style="width: 120px" />
        </el-form-item>
        <el-form-item
          label="容器端口"
          :prop="'ports[' + index + '].containerPort'"
          :rules="rules.containerPort"
        >
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
            @click="state.ports.splice(index, 1)"
          ></el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import jsPlumb from 'jsplumb';

const uuid = jsPlumb.jsPlumbUtil.uuid;
const portRef = ref();
const state = reactive({
  ports: [],
  verified: true,
});

const props = defineProps({
  ports: {
    type: Array,
    required: true,
  },
});

const validateName = (rule, value, callback) => {
  if (value === '') {
    callback();
  } else {
    let count = 0;
    state.ports.forEach((item) => {
      if (item.name === value) {
        count++;
      }
    });
    if (count > 1) {
      callback(new Error('名称不能重复'));
    } else {
      callback();
    }
  }
};
const validatePort = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入端口号'));
  } else {
    let count = 0;
    state.ports.forEach((item) => {
      if (item.containerPort === value) {
        count++;
      }
    });
    if (count > 1) {
      callback(new Error('端口不能重复'));
    } else {
      callback();
    }
  }
};
const rules = {
  name: [{ trigger: 'blur', validator: validateName }],
  containerPort: [{ required: true, trigger: 'blur', validator: validatePort }],
};
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

const getPorts = async () => {
  state.verified = true;
  await portRef.value.validate((valid) => {
    if (state.verified && !valid) state.verified = false;
  });
  state.ports.forEach((item) => {
    if (item.name === '') {
      delete item.name;
    }
  });
  return [state.ports, state.verified];
};

defineExpose({
  getPorts,
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
