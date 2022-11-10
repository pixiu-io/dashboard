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
    <pixiu-card ref="cardRef" back="true" title="创建Deployment" height="50px" />
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
            <step1 v-if="activeKey === 1" @next="stepTwo" @pre="stepOnePre" />
            <step2 v-if="activeKey === 2" @next="stepThree" @pre="stepOne" />
            <step3 v-if="activeKey === 3" @next="submit" @pre="stepTwo" />
          </el-card>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import PixiuCard from '@/components/card/index.vue';
import { ref, reactive } from 'vue';
import Step1 from './component/step/stepOne.vue';
import Step2 from './component/step/stepTwo.vue';
import Step3 from './component/step/stepThree.vue';

const activeKey = ref(1);
const cardRef = ref(null);

const data = reactive({
  container: {},
  volume: [],
  advanced: {},
});

// 页面一下一步,activeKey加一加载下一步
const stepOne = (volumeIn) => {
  activeKey.value = 1;
  Object.assign(data, volumeIn);
};

// 页面二下一步,activeKey加一加载步骤二
const stepTwo = (containerIn) => {
  Object.assign(data.container, containerIn);
  activeKey.value = 2;
  console.log('containerData=', data);
};

const stepThree = (volumeData) => {
  data.volume.push(volumeData);
  activeKey.value = 3;
};

// 页面一点击取消，调用card组件的goBack方法
const stepOnePre = () => {
  cardRef.value.goBack();
};

const submit = (advancedData) => {
  Object.assign(data.advanced, advancedData);
  console.log('data', data);
};
</script>
.app-pixiu-content-card { display: flex; justify-content: space-around; }
<style scoped="scoped"></style>
