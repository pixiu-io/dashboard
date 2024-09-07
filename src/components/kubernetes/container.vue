<template>
  <div>
    <div style="width: 80%; margin-top: 20px">
      <el-form :model="state.container">
        <el-form-item
          :prop="name"
          :rules="[{ required: true, message: '容器名不能为空', trigger: 'blur' }]"
          >容器名称
          <el-input
            v-model="state.container.name"
            class="deploy-pixiu-incard"
            style="margin-left: 30px"
          />
        </el-form-item>

        <el-form-item
          style="margin-top: 10px"
          prop="image"
          :rules="[{ required: true, message: '镜像不能为空', trigger: 'blur' }]"
          >镜像
          <el-input
            v-model="state.container.image"
            style="margin-left: 58px"
            class="deploy-pixiu-incard"
          />
        </el-form-item>

        <el-col style="margin-top: 10px" class="deploy-pixiu-column"
          >拉取策略
          <el-radio-group v-model="state.container.imagePullPolicy" style="margin-left: 30px">
            <el-radio-button label="IfNotPresent" value="IfNotPresent" />
            <el-radio-button label="Always" value="Always" />
            <el-radio-button label="Never" value="Never" />
          </el-radio-group>
          <div class="container-line-describe">设置镜像拉取策略，默认使用 IfNotPresent 策略</div>
        </el-col>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';

const state = reactive({
  container: {},
});

const props = defineProps({
  container: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  state.container = JSON.parse(JSON.stringify(props.container));
});
</script>

<style scoped></style>
