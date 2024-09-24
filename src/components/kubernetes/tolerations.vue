<template>
  <el-form ref="tolerationRef" :model="state" status-icon require-asterisk-position="right">
    <el-form-item>
      <el-button
        icon="CirclePlusFilled"
        type="primary"
        size="small"
        text
        style="padding-left: 0"
        @click="onHandle"
        >新增</el-button
      >
    </el-form-item>
    <el-table v-show="state.tolerations.length > 0" :data="state.tolerations">
      <el-table-column prop="key" label="标签名" width="120px">
        <template #default="scope">
          <el-form-item
            :prop="'tolerations.' + scope.$index + '.key'"
            :rules="[{ required: true, message: '标签名不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="scope.row.key" size="small" style="width: 80px"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="操作符" width="100">
        <template #default="scope">
          <el-form-item>
            <el-select v-model="scope.row.operator" size="small">
              <el-option label="Equal" value="Equal"></el-option>
              <el-option
                label="Exists"
                value="Exists"
                @click="handlerOperator(val, scope.$index)"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="标签值" width="120px">
        <template #default="scope">
          <el-form-item
            v-if="scope.row.operator !== 'Exists'"
            :prop="'tolerations.' + scope.$index + '.value'"
            :rules="[{ required: true, message: '值不能为空', trigger: 'blur' }]"
          >
            <el-input v-model="scope.row.value" size="small" style="width: 80px" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="效果" width="140px">
        <template #default="scope">
          <el-form-item>
            <el-select v-model="scope.row.effect" size="small" @click="onChange(val, scope.$index)">
              <el-option label="NoExecute" value="NoExecute" />
              <el-option
                label="NoSchedule"
                value="NoSchedule"
                @click="onChange(val, scope.$index)"
              />
              <el-option label="PreferNoSchedule" value="PreferNoSchedule" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column width="120px">
        <template #header>
          <div style="display: flex; align-items: center">
            时间(s)
            <el-tooltip
              class="box-item"
              effect="light"
              content="<div>TolerationSeconds表示容忍度(必须是NoExecute的值，否则该字段将被忽略)容忍污染的时间。</div><div>默认情况下，它没有设置，这意味着永远容忍污染(不驱逐)。0和负值将被系统视为0(立即驱逐)。</div>"
              placement="top"
              raw-content
              ><el-icon size="13px"> <InfoFilled /> </el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-form-item
              v-if="scope.row.effect === 'NoExecute'"
              :prop="'tolerations.' + scope.$index + '.tolerationSeconds'"
              :rules="[{ required: true, message: '值不能为空', trigger: 'blur' }]"
            >
              <el-input-number
                v-model="scope.row.tolerationSeconds"
                size="small"
                :min="-1"
                style="width: 100px"
              />
            </el-form-item>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="60">
        <template #default="scope">
          <el-form-item>
            <el-button
              icon="RemoveFilled"
              type="primary"
              size="small"
              text
              style="margin-left: 10px"
              @click="state.tolerations.splice(scope.$index, 1)"
            ></el-button>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';

const tolerationRef = ref();

const state = reactive({
  verified: false,
  tolerations: [],
});

const props = defineProps({
  tolerations: {
    type: Array,
    default: () => [],
  },
});

const onHandle = () => {
  state.tolerations.push({
    effect: 'NoSchedule',
    key: '',
    operator: 'Equal',
    value: '',
  });
};
const handlerOperator = (val, index) => {
  delete state.tolerations[index].value;
};

const getTolerations = async () => {
  state.verified = true;
  await tolerationRef.value.validate((valid) => {
    if (state.verified && !valid) state.verified = false;
  });
  return [state.tolerations, state.verified];
};

const onChange = (val, index) => {
  if (val === 'NoExecute') {
    state.tolerations[index].tolerationSeconds = 0;
  } else {
    delete state.tolerations[index].tolerationSeconds;
  }
};

defineExpose({
  getTolerations,
});

onMounted(() => {
  if (props.tolerations && props.tolerations.length > 0) {
    state.tolerations = JSON.parse(JSON.stringify(props.tolerations));
  }
});
</script>
<style scoped>
.el-form-item {
  margin-bottom: 13px;
  padding-top: 5px;
}
</style>
