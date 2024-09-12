<template>
  <div>
    <el-form ref="labelRef" :model="data" label-width="100px" status-icon>
      <el-form-item :label="name" style="margin-top: 10px">
        <el-button link type="primary" class="app-action-btn" @click="addLabel">新增</el-button>
      </el-form-item>
      <div style="margin-top: -15px"></div>
      <el-form-item v-for="(item, index) in data.labels" :key="index" class="labels-item-style">
        <el-form-item :prop="'labels[' + index + '].key'" :rules="labelRules.key">
          <el-input v-model="item.key" placeholder="标签键" style="width: 160px" />
        </el-form-item>

        <div style="margin-right: 10px; margin-left: 10px">=</div>

        <el-form-item
          :prop="'labels[' + index + '].value'"
          :rules="[{ required: true, message: '标签值不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="item.value" placeholder="标签值" style="width: 160px" />
        </el-form-item>

        <div style="float: right; cursor: pointer; margin-left: 10px" @click="deleteLabel(index)">
          <pixiu-icon
            name="icon-shanchu"
            size="14px"
            type="iconfont"
            style="margin-top: 10px; margin-left: 4px"
            color="#909399"
          />
        </div>
      </el-form-item>
    </el-form>
    <div class="app-pixiu-line-describe" style="margin-top: -5px">
      标签键值以字母、数字开头和结尾, 且只能包含字母、数字及分隔符.
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';

const labelRef = ref();
const data = reactive({
  labels: [],
});
const props = defineProps({
  name: {
    type: String,
    default: '标签',
  },
  labels: {
    type: Object,
    default: () => {},
    required: true,
  },
});
// add label
const addLabel = () => {
  data.labels.push({
    key: '',
    value: '',
  });
};
// delete labels
const deleteLabel = (index) => {
  data.labels.splice(index, 1);
};
// convert object type to array type
const convertObjectToArray = (labels) => {
  let result = [];
  for (let key in labels) {
    const newLabel = {
      key: key,
      value: labels[key],
    };
    result.push(newLabel);
  }
  return result;
};
// convert array type to  object type,return labels
const getLabels = () => {
  const labels = {};
  for (const label of data.labels) {
    labels[label.key] = label.value;
  }
  return labels;
};

//校验key，不能重复
const validateKey = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('标签键不能为空'));
  } else {
    let count = 0;
    data.labels.forEach((item) => {
      if (item.key === value) {
        count++;
      }
    });
    if (count > 1) {
      callback(new Error('标签键已存在'));
    } else {
      callback();
    }
  }
};

// 校验value
const validateValue = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入value'));
  } else {
    callback();
  }
};
const labelRules = {
  key: [{ required: true, validator: validateKey, trigger: 'blur' }],
  value: [{ required: true, validator: validateValue, trigger: 'blur' }],
};

defineExpose({
  labelRef,
  getLabels,
});
onMounted(() => {
  if (props.labels && Object.keys(props.labels).length > 0) {
    data.labels = convertObjectToArray(props.labels);
  }
});
</script>

<style scoped></style>
