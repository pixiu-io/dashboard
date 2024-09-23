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
      <el-table-column prop="key" label="标签名">
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
              <el-option label="Exists" value="Exists"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="标签值">
        <template #default="scope">
          <el-form-item
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
            <el-select v-model="scope.row.effect" size="small">
              <el-option label="NoExecute" value="NoExecute" />
              <el-option label="NoSchedule" value="NoSchedule" />
              <el-option label="PreferNoSchedule" value="PreferNoSchedule" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="时间(s)" width="120px">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-form-item
              v-if="scope.row.effect === 'NoSchedule'"
              :prop="'tolerations.' + scope.$index + '.tolerationSeconds'"
              :rules="[{ required: true, message: '值不能为空', trigger: 'blur' }]"
            >
              <el-input-number
                v-model="scope.row.tolerationSeconds"
                size="small"
                :min="0"
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
import { reactive, ref } from 'vue';

const tolerationRef = ref();

const state = reactive({
  verified: false,
  tolerations: [
    {
      effect: 'NoExecute',
      key: '',
      operator: 'Equal',
      tolerationSeconds: 0,
      value: '',
    },
  ],
});

const onHandle = () => {
  state.tolerations.push({
    effect: 'NoExecute',
    key: '',
    operator: 'Equal',
    tolerationSeconds: 0,
    value: '',
  });
};
</script>
<style scoped>
.el-form-item {
  margin-bottom: 13px;
  padding-top: 5px;
}
</style>
