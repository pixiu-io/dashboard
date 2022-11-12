<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="挂载方式">
      <el-select v-model="form.mountType" placeholder="请选择挂载方式" @change="addVolume">
        <el-option label="添加临时卷" value="emptyDir" />
        <el-option label="添加新的pvc" value="newpvc" />
        <el-option label="使用现有pvc" value="persistentVolumeClaim" />
        <el-option label="映射主机目录" value="hostPath" />
        <el-option label="配置映射卷" value="configMap" />
      </el-select>
    </el-form-item>
    <div v-for="(item, index) in form.volumeList" :key="index">
      <el-card style="background-color: #f2f2f2">
        <el-row gutter="24">
          <el-col :span="10">
            <el-input v-model="item.name" placeholder="请输入卷名" style="width: 80%"></el-input>
          </el-col>
          <el-col :span="10"> 挂载方式：{{ item.mountType }} </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="deleteVolume(item)">删除卷</el-button></el-col
          >
        </el-row>

        <!-- configmap -->
        <div v-if="item.mountType == 'configMap'">
          <el-row gutter="24">
            <el-col :span="12">
              <el-input
                v-model.number="item.mode"
                placeholder="默认模式"
                style="width: 80%"
              ></el-input
            ></el-col>
            <el-col :span="12">
              <el-radio-group v-model="item.optional" class="ml-4">
                <el-radio label="true" size="large">是</el-radio>
                <el-radio label="false" size="large">否</el-radio>
              </el-radio-group></el-col
            >
          </el-row>

          <el-row gutter="24">
            <el-col :span="24">
              <el-select v-model="item.configMapName" placeholder="选择配置文件">
                <el-option
                  v-for="(configMap, index2) in testConfigMaps"
                  :key="index2"
                  :label="configMap"
                  :value="configMap"
                />
              </el-select>
            </el-col>
          </el-row>

          <el-row gutter="24">
            <el-col :span="12">
              <el-input
                v-model="item.containerPath"
                placeholder="容器路径"
                style="width: 80%"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.cmSubPath" placeholder="子路径" style="width: 80%"></el-input>
            </el-col>
          </el-row>
        </div>

        <!-- hostpath -->
        <div v-if="item.mountType === 'hostPath'">
          <el-row gutter="24">
            <el-col :span="12">
              <el-input v-model="item.hostPath" placeholder="主机路径"></el-input>
            </el-col>
            <el-col :span="12">
              <el-select v-model="item.hostPathType">
                <el-option label="不检查目标路径" value="" />
                <el-option label="目录: 不存在就创建" value="DirectoryOrCreate" />
                <el-option label="文件: 不存在就创建" value="FileOrCreate" />
                <el-option label="现有目录" value="Directory" />
                <el-option label="现有文件" value="File" />
                <el-option label="现有Socket文件" value="Socket" />
                <el-option label="现有charactar设备" value="CharDevice" />
                <el-option label="现有Block 设备" value="BlockDevice" />
              </el-select>
            </el-col>
          </el-row>
          <el-row gutter="24">
            <el-col :span="12">
              <el-input
                v-model="item.containerPath"
                placeholder="容器路径"
                style="width: 80%"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.cmSubPath" placeholder="子路径" style="width: 80%"></el-input>
            </el-col>
          </el-row>
        </div>

        <!-- pvc -->
        <div v-if="item.mountType === 'persistentVolumeClaim'">
          <el-col>
            <!-- 测试数据，需要删除 -->
            <el-select v-model="item.pvcName" placeholder="请选择pvc">
              <el-option
                v-for="(pvc, pvcIndex) in testPvcs"
                :key="pvcIndex"
                :label="pvc"
                :value="pvc"
              />
            </el-select>
          </el-col>

          <el-row gutter="24">
            <el-col :span="12">
              <el-input
                v-model="item.containerPath"
                placeholder="容器路径"
                style="width: 80%"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.cmSubPath" placeholder="子路径" style="width: 80%"></el-input>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <div style="display: flex; justify-content: center">
      <el-space size="{8}">
        <div>
          <el-button @click="pre">上一步</el-button>
        </div>
        <div>
          <el-button type="primary" @click="onSubmit">下一步</el-button>
        </div>
      </el-space>
    </div>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue';

// 测试数据，后面需要从接口获取configmap列表

const testConfigMaps = ['test-mysql-conf', 'test-application', 'test-es-config'];

const testPvcs = ['test-mysql-data', 'test-es-data', 'tast-kafka-data'];

const form = reactive({
  mountType: '',
  volumeList: [],
});

const addVolume = () => {
  if (form.volumeList.length == 0) {
    form.volumeList = [
      {
        name: 'volume',
        configMapName: '',
        mountType: form.mountType,
        containerPath: '',
        cmSubPath: '',
        path: '',
        mode: 644,
        optional: false,

        hostPath: '',
        hostPathType: '',

        pvcName: '',
      },
    ];
  } else {
    form.volumeList.push({
      name: '',
      mountType: form.mountType,
      path: '',
      mode: 644,
      configMapName: '',
      containerPath: '',
      cmSubPath: '',
      optional: false,

      hostPath: '',
      hostPathType: '',

      pvcName: '',
    });
  }
};

const deleteVolume = (item) => {
  const index = form.volumeList.indexOf(item);
  if (index !== -1) {
    form.volumeList.splice(index, 1);
  }
};

// 定义取消、下一步的emit，通过父组件调用
const emit = defineEmits(['next', 'pre']);
const pre = () => emit('pre');
const onSubmit = () => {
  emit('next', form);
};
</script>
