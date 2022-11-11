<template>
  <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules">
    <el-form-item label="名称:" prop="name">
      <el-col :span="10"> <el-input v-model="form.name" placeholder="无状态控制器名称" /></el-col>
      <el-col :span="2" class="text-center">
        <span></span>
      </el-col>
      副本数: &ensp;
      <el-col :span="5">
        <el-input-number v-model="form.replicas" m in="0" />
      </el-col>
    </el-form-item>
    <el-form-item label="镜像:" prop="image">
      <el-col :span="10"> <el-input v-model="form.image" placeholder="请输入镜像名称" /></el-col>
    </el-form-item>
    <el-collapse>
      <el-collapse-item name="env" title="环境变量">
        <div v-for="(item, index) in form.envList" :key="index">
          <el-row>
            <el-col :span="6">
              <el-form-item label="name" :prop="'envList.' + index + '.name'">
                <el-input v-model="item.name" placeholder="key" class="el-select_box"
              /></el-form-item>
            </el-col>
            =
            <el-col :span="6">
              <el-form-item label="value" :prop="'envList.' + index + '.value'">
                <el-input v-model="item.value" placeholder="value" class="el-select_box"
              /></el-form-item>
            </el-col>

            <el-col :span="6" align="center">
              <el-button @click="deleEnv(item)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-button @click="addEnv">添加</el-button>
          <el-button @click="resetEnv">清空</el-button>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="主机调度" name="host">
        <el-radio-group v-model="radioStats">
          <el-radio label="nodeName" size="large">指定主机运行</el-radio>
          <el-radio label="nodeSelector" size="large">标签选择器</el-radio>
        </el-radio-group>
        <el-card
          v-if="radioStats === 'nodeName'"
          style="width: 100%; height: 70px; background-color: #f2f2f2"
        >
          <el-form-item label="选择主机">
            <el-select v-model="form.nodeName" placeholder="请选择运行主机">
              <el-option
                v-for="(item, index) in TestNode"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-card>
        <el-card
          v-if="radioStats === 'nodeSelector'"
          style="width: 100%; height: 70px; background-color: #f2f2f2"
        >
          <el-row>
            <el-space spacer="=">
              <el-col>
                <el-form-item label="name">
                  <el-input v-model="form.nodeSelector.name" /> </el-form-item
              ></el-col>
              <el-col>
                <el-form-item label="value">
                  <el-input v-model="form.nodeSelector.value" /> </el-form-item
              ></el-col>
            </el-space>
          </el-row>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="健康检查" name="check">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-radio-group v-model="form.check" class="ml-4">
              <div style="display: flex; flex-direction: column">
                <el-radio label="nocheck" size="large">无</el-radio>
                <el-radio label="tcpcheck" size="large">TCP 端口检查</el-radio>
                <el-radio label="httpcheck" size="large">HTTP 请求状态检查(2xx 或 3xx)</el-radio>
              </div>
            </el-radio-group>
          </el-col>
        </el-row>

        <div v-if="form.check !== 'nocheck'">
          <el-row v-if="form.check === 'httpcheck'" :gutter="24">
            <el-col :span="24">
              <el-card style="width: 85%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="请求路径">
                  <el-input v-model="form.path" min="0">
                    <template #prepend>GET</template>
                    <template #append>HTTP/1.1</template>
                  </el-input>
                </el-form-item></el-card
              ></el-col
            >
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-card style="width: 70%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="容器端口">
                  <el-input v-model="form.port" min="0"> </el-input>
                </el-form-item> </el-card
            ></el-col>
            <el-col :span="12">
              <el-card style="width: 70%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="初始化时间">
                  <el-input-number v-model="form.initialDelaySeconds" min="0">
                    <template #append>秒</template>
                  </el-input-number>
                </el-form-item>
              </el-card></el-col
            >
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-card style="width: 70%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="检查间隔">
                  <el-input-number v-model="form.periodSeconds" min="0">
                    <template #append>秒</template>
                  </el-input-number>
                </el-form-item>
              </el-card></el-col
            >
            <el-col :span="12">
              <el-card style="width: 70%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="检查超时">
                  <el-input-number v-model="form.timeoutSeconds" min="0">
                    <template #append>秒</template>
                  </el-input-number>
                </el-form-item>
              </el-card></el-col
            >
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-card style="width: 70%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="健康阈值">
                  <el-input-number v-model="form.successThreshold" min="0">
                    <template #append>秒</template>
                  </el-input-number>
                </el-form-item>
              </el-card></el-col
            >
            <el-col :span="12">
              <el-card style="width: 70%; height: 70px; background-color: #f2f2f2">
                <el-form-item label="不健康阈值">
                  <el-input-number v-model="form.failureThreshold" min="0">
                    <template #append>秒</template>
                  </el-input-number>
                </el-form-item>
              </el-card></el-col
            >
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="缩放/升级策略" name="scale">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-radio-group v-model="form.type" class="ml-4">
              <div style="display: flex; flex-direction: column">
                <el-radio label="RollingUpdate" size="large"
                  >滚动: 先停止旧 Pod,再启动新 Pod。</el-radio
                >
                <el-radio label="startFirst" size="large"
                  >滚动: 先启动新 Pod,再停止旧 Pod。</el-radio
                >
                <el-radio label="Recreate" size="large">删除所有 Pod,然后重新开始。</el-radio>
                <el-radio label="scaleCustom" size="large">自定义</el-radio>
              </div>
            </el-radio-group>
          </el-col>
          <el-col v-if="form.type === 'scaleCustom'" :span="8">
            <el-card style="width: 90%; height: 70px; background-color: #f2f2f2">
              <el-form-item label="最大可用">
                <el-input v-model="form.maxUnavailable" min="0">
                  <template #append>个POD</template>
                </el-input>
              </el-form-item>
            </el-card>
          </el-col>
          <el-col v-if="form.type === 'scaleCustom'" :span="8">
            <el-card style="width: 90%; height: 70px; background-color: #f2f2f2">
              <el-form-item label="最大不可用">
                <el-input v-model="form.maxSurge" min="0">
                  <template #append>个POD</template>
                </el-input>
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>
  <div>
    <div style="display: flex; justify-content: center">
      <el-space size="{8}">
        <div>
          <el-button @click="pre">取消</el-button>
        </div>
        <div>
          <el-button type="primary" @click="onSubmit">下一步</el-button>
        </div>
      </el-space>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// do not use same name with ref
const form = reactive({
  name: '',
  replicas: 1,
  image: '',
  env: '',
  envList: [],
  nodeName: '',
  nodeSelector: {
    name: '',
    value: '',
  },
  check: 'nocheck',
  // 缩放/升级策略
  type: 'RollingUpdate',
  maxUnavailable: '25%',
  maxSurge: '25%',
  // 健康检查相关
  path: '',
  port: 0,
  initialDelaySeconds: 10,
  timeoutSeconds: 2,
  periodSeconds: 2,
  successThreshold: 2,
  failureThreshold: 3,
});

// 测试数据，后面改成通过接口获取节点列表，需要删除
const TestNode = ['test-k8s-node1', 'test-k8s-node2', 'test-k8s-node3'];

const radioStats = ref();

const addEnv = () => {
  if (form.envList.length == 0) {
    form.envList = [
      {
        name: '',
        value: '',
      },
    ];
  } else {
    form.envList.push({
      key: '',
      value: '',
    });
  }
};

const deleEnv = (item) => {
  const index = form.envList.indexOf(item);
  if (index !== -1) {
    form.envList.splice(index, 1);
  }
};

const resetEnv = () => {
  form.envList = [];
};

// 数据检验规则
const formRef = ref(null);
const formRules = {
  name: [{ required: true, message: '请输入Deployment名称', trigger: 'blur' }],
  image: [{ required: true, message: '请输入镜像版本', trigger: 'blur' }],
};

// 定义取消、下一步的emit，通过父组件调用
const emit = defineEmits(['next', 'pre']);
const pre = () => emit('pre');
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.type === 'startFirst') {
        // 先启动新pod，后停止旧pod
        form.maxUnavailable = 0;
        form.maxSurge = 100;
      }
      emit('next', form);
    }
  });
};
</script>

<style>
.app-pixiu-describe {
  margin-left: 140px;
  font-size: 12px;
  color: #888888;
}
</style>
