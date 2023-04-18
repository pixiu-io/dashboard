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
    <pixiu-card ref="cardRef" back="true" title="创建 Deployment" height="50px" />
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
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { useDeployment } from '../../../stores/kubernetes/deployment';

import Step1 from './component/step/stepOne.vue';
import Step2 from './component/step/stepTwo.vue';
import Step3 from './component/step/stepThree.vue';

const activeKey = ref(1);
const cardRef = ref(null);
const deploymentStore = useDeployment();
const { proxy } = getCurrentInstance();

const data = reactive({
  cluster: '',
  namespace: '',
  container: [],
  volume: [],
  advanced: {},
});

onMounted(() => {
  data.cluster = proxy.$route.query.cluster;
  data.namespace = proxy.$route.query.namespace;
});

// 页面一下一步,activeKey加一加载下一步
const stepOne = (volumeIn) => {
  activeKey.value = 1;
  Object.assign(data, volumeIn);
};

// 页面二下一步,activeKey加一加载步骤二
const stepTwo = (containerIn) => {
  data.container.push(containerIn);
  activeKey.value = 2;
};

const stepThree = (volumeData) => {
  data.volume.push(volumeData);
  activeKey.value = 3;
};

// 页面一点击取消，调用card组件的goBack方法
const stepOnePre = () => {
  cardRef.value.goBack();
};

// 提交
const submit = (advancedData) => {
  Object.assign(data.advanced, advancedData);

  // TODO 构建deployment的时候没有考虑添加多个容器的情况
  const container = data.container[0];

  // 为了nodeSelector有两个输入框样式美观，这里做一下拼接
  let nodeSelector = {};
  if (container.nodeSelector.name != '') {
    nodeSelector[container.nodeSelector.name] = data.container[0].nodeSelector.value;
  }

  // 遍历volume 拼接k8s volume与volumeMount
  let volumes = [];
  let volumeMounts = [];

  data.volume.forEach((item, index) => {
    switch (item.mountType) {
      case 'emptyDir':
        // TODO 适配emptyDir
        break;
      case 'newpvc':
        // TODO 适配新建pvc
        break;
      case 'persistentVolumeClaim':
        let volume = item.volumeList[0];
        let pvcVolume = {
          name: volume.name,
          persistentVolumeClaim: {
            claimName: volume.pvcName,
          },
        };
        let pvcVolumeMount = {
          mountPath: volume.containerPath,
          name: volume.name,
          subPath: volume.cmSubPath,
        };
        volumeMounts.push(pvcVolumeMount);
        volumes.push(pvcVolume);
        break;
      case 'hostPath':
        let hostPathvolume = item.volumeList[0];
        let hostPathVolume = {
          name: hostPathvolume.name,
          hostPath: {
            path: hostPathvolume.hostPath,
            type: hostPathvolume.hostPathType,
          },
        };
        let hostVolumeMount = {
          mountPath: hostPathvolume.cmContainerPath,
          name: hostPathvolume.name,
          subPath: hostPathvolume.cmSubPath,
        };
        volumeMounts.push(hostVolumeMount);
        volumes.push(hostPathVolume);
        break;
      case 'configMap':
        let configMapvolume = item.volumeList[0];
        let cmVolume = {
          name: configMapvolume.name,
          configMap: {
            defaultMode: configMapvolume.mode,
            name: configMapvolume.configMapName,
            optional: configMapvolume.optional,
          },
        };
        let cmVolumeMount = {
          mountPath: configMapvolume.cmContainerPath,
          name: configMapvolume.name,
          subPath: configMapvolume.cmSubPath,
        };
        volumeMounts.push(cmVolumeMount);
        volumes.push(cmVolume);
        break;
    }
  });

  let deployment = {
    cloud: data.cluster,
    metadata: {
      name: container.name,
      namespace: data.namespace,
    },
    spec: {
      selector: {
        matchLabels: {
          app: container.name,
        },
      },
      replicas: container.replicas,
      template: {
        metadata: {
          labels: {
            app: container.name,
          },
        },
        spec: {
          containers: [
            {
              name: container.name,
              env: container.envList,
              image: container.image,
              volumeMounts: volumeMounts,
            },
          ],
          nodeName: container.nodeName,
          nodeSelector: nodeSelector,
        },
      },
      volumes: volumes,
      strategy: {
        type: container.type,
        rollingUpdate: {
          maxUnavailable: container.maxUnavailable,
          maxSurge: container.maxSurge,
        },
      },
    },
  };

  // 根据不同的健康检查方式配置不同的对象
  switch (container.check) {
    case 'nocheck':
      break;
    case 'httpcheck':
      deployment.spec.template.spec.containers[0].livenessProbe = {
        failureThreshold: container.failureThreshold,
        httpGet: {
          path: container.path,
          port: container.port,
          scheme: 'HTTP',
        },
        initialDelaySeconds: container.initialDelaySeconds,
        periodSeconds: container.periodSeconds,
        successThreshold: container.successThreshold,
        timeoutSeconds: container.timeoutSeconds,
        // TODO 这里存活探针与就绪探针临时使用相同配置
      };
      deployment.spec.template.spec.containers[0].readinessProbe = {
        failureThreshold: container.failureThreshold,
        httpGet: {
          path: container.path,
          port: container.port,
          scheme: 'HTTP',
        },
        initialDelaySeconds: container.initialDelaySeconds,
        periodSeconds: container.periodSeconds,
        successThreshold: container.successThreshold,
        timeoutSeconds: container.timeoutSeconds,
      };
      break;
    case 'tcpcheck':
      deployment.spec.template.spec.containers[0].livenessProbe = {
        failureThreshold: container.failureThreshold,
        tcpSocket: {
          port: container.port,
        },
        initialDelaySeconds: container.initialDelaySeconds,
        periodSeconds: container.periodSeconds,
        successThreshold: container.successThreshold,
        timeoutSeconds: container.timeoutSeconds,
        // TODO 这里存活探针与就绪探针临时使用相同配置
      };
      deployment.spec.template.spec.containers[0].readinessProbe = {
        failureThreshold: container.failureThreshold,
        tcpSocket: {
          port: container.port,
        },
        initialDelaySeconds: container.initialDelaySeconds,
        periodSeconds: container.periodSeconds,
        successThreshold: container.successThreshold,
        timeoutSeconds: container.timeoutSeconds,
      };
      break;
  }

  deploymentStore.create(deployment);
};
</script>

<style scoped="scoped"></style>
