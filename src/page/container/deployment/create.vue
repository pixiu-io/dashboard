<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: #f3f4f7;
    "
  >
    <pixiu-card back="true" title="创建Deployment" height="50px" />
    <div class="app-pixiu-content-card">
      <el-steps
        finish-status="success"
        simple
        align-center
        style="margin-top: 15px; margin-left: -70px"
      >
        <el-step title="容器信息" @click="stepOne" />
        <el-step title="存储配置" @click="stepTwo" />
        <el-step title="高级选项" @click="stepThree" />
      </el-steps>
      <el-main>
        <div class="app-pixiu-content-card">
          <el-card style="width: 97%">
            <step1 v-if="activeKey === 1" @next="stepTwo" />
            <step2 v-if="activeKey === 2" />
            <step3 v-if="activeKey === 3" />
          </el-card>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import PixiuCard from '@/components/card/index.vue';
import { ref } from 'vue';
import Step1 from './component/step/stepOne.vue';
import Step2 from './component/step/stepTwo.vue';
import Step3 from './component/step/stepThree.vue';

const activeKey = ref(1);

const stepOne = () => (activeKey.value = 1);

const stepTwo = () => (activeKey.value = 2);

const stepThree = () => (activeKey.value = 3);
</script>
.app-pixiu-content-card { display: flex; justify-content: space-around; }
<style scoped="scoped"></style>
