<template>
  <div>
    <el-form-item label="环境变量" style="margin-bottom: 0">
      <el-button
        icon="CirclePlusFilled"
        type="primary"
        size="small"
        text
        @click="state.env.push({ type: 'custom', name: '', value: '', otherValue: '' })"
        >新增</el-button
      >
    </el-form-item>

    <el-table
      v-show="state.env.length !== 0"
      ref="envRef"
      :data="state.env"
      style="font-size: 13px; margin-left: 100px"
      :cell-style="{ padding: '10px' }"
      :header-cell-style="{ padding: '5px' }"
    >
      <el-table-column label="类型" width="130">
        <template #default="scope">
          <el-select v-model="scope.row.type" size="small">
            <el-option
              v-for="item in envType"
              :key="item.type"
              :label="item.type"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="变量名称" width="180">
        <template #default="scope">
          <el-input v-model="scope.row.name" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="变量/变量引用" width="350">
        <template #default="scope">
          <el-input v-model="scope.row.value" size="small" style="width: 120px" />
          <el-input
            v-if="scope.row.type !== 'custom'"
            v-model="scope.row.otherValue"
            size="small"
            style="width: 120px"
          />
          <el-button
            icon="RemoveFilled"
            type="primary"
            size="small"
            text
            style="margin-left: 10px"
            @click="state.env.splice(scope.$index, 1)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';

const state = reactive({
  env: [
    {
      name: '',
      value: '',
      otherValue: '',
      type: '',
    },
  ],
});

const props = defineProps({
  env: {
    type: Array,
    required: true,
  },
});

const buildEnv = () => {
  const envData = [];
  const envTup = state.env;
  for (let i = 0; i < envTup.length; i++) {
    const item = envTup[i];
    const envVar = {
      name: item.name,
      value: item.type === 'custom' ? item.value : undefined,
      valueFrom:
        item.type !== 'custom'
          ? {
              fieldRef: item.type === 'fieldRef' ? { fieldPath: item.otherValue } : undefined,
              resourceFieldRef:
                item.type === 'resourceFieldRef'
                  ? { containerName: item.value, resource: item.otherValue }
                  : undefined,
              configMapKeyRef:
                item.type === 'configMapKeyRef'
                  ? { name: item.value, key: item.otherValue }
                  : undefined,
              secretKeyRef:
                item.type === 'secretKeyRef'
                  ? { name: item.value, key: item.otherValue }
                  : undefined,
            }
          : undefined,
    };
    envData.push(envVar);
  }
  return envData;
};

const parseEnv = (envs) => {
  state.env = envs.map((env) => {
    const { name, value, valueFrom } = env;
    let type = 'custom';
    let otherValue = '';
    if (valueFrom) {
      const { fieldRef, secretKeyRef, configMapKeyRef, resourceFieldRef } = valueFrom;
      if (fieldRef) {
        type = 'fieldRef';
        otherValue = fieldRef.fieldPath || '';
      } else if (secretKeyRef) {
        type = 'secretKeyRef';
        otherValue = secretKeyRef.key || '';
      } else if (configMapKeyRef) {
        type = 'configMapKeyRef';
        otherValue = configMapKeyRef.key || '';
      } else if (resourceFieldRef) {
        type = 'resourceFieldRef';
        otherValue = resourceFieldRef.resource || '';
      }
    }
    return { name, value: value || '', type, otherValue };
  });
};
onMounted(() => {
  if (props.env) {
    parseEnv(props.env);
  }
});
const getEnvs = () => {
  return buildEnv();
};

defineExpose({
  getEnvs,
});

const envType = [
  {
    type: '配置项',
    value: 'configMapKeyRef',
  },
  {
    type: '资源引用',
    value: 'fieldRef',
  },
  {
    type: '资源引用2',
    value: 'resourceFieldRef',
  },
  {
    type: '加密字典',
    value: 'secretKeyRef',
  },
  {
    type: '自定义',
    value: 'custom',
  },
];
</script>

<style scoped></style>
