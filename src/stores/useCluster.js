import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, reactive, toRaw, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import {
  createPlan,
  updatePlan,
  getPlanResources,
  getPlanSupportOS,
} from '@/services/plan/planService';
import { deepMerge, parseNetwork } from '@/utils/utils';
import _ from 'lodash';
// import { router } from '@/router';

const useClusterStore = defineStore('cluster', () => {
  const active = ref(0);
  const labelPosition = ref('left');
  const planId = ref(undefined);
  const showDialog = ref(false);
  const configFormRef = ref(null);
  const nodeFormRef = ref(null);
  const loading = ref(false);
  const selectIndex = ref(undefined);

  watch(planId, async (newPlanId) => {
    if (newPlanId !== undefined) {
      // const loading = ElLoading.service({
      //   lock: true,
      //   text: '数据加载中...',
      // });
      loading.value = true;
      const [result, err] = await getPlanResources(newPlanId);
      if (err) {
        return;
      }
      deepMerge(configInfo, result);
      // 拆分 pod_network 和 service_network
      if (configInfo.config.network.pod_network) {
        const podNetwork = parseNetwork(configInfo.config.network.pod_network);
        configInfo.podNetwork = {
          a_cidr: podNetwork.a_cidr,
          b_cidr: podNetwork.b_cidr,
          c_cidr: podNetwork.c_cidr,
          d_cidr: podNetwork.d_cidr,
          pod_mask: podNetwork.mask,
        };
      }
      if (configInfo.config.network.service_network) {
        const serviceNetwork = parseNetwork(configInfo.config.network.service_network);
        configInfo.serviceNetwork = {
          a_cidr: serviceNetwork.a_cidr,
          b_cidr: serviceNetwork.b_cidr,
          c_cidr: serviceNetwork.c_cidr,
          d_cidr: serviceNetwork.d_cidr,
          service_mask: serviceNetwork.mask,
        };
      }
      if (configInfo.config.os_image) {
        // 通过os_image去options.osNewOptions里面获取key
        const os_system = findKeyByValue(options.osNewOptions, configInfo.config.os_image);
        if (os_system !== null) {
          configInfo.config.os_system = os_system;
        } else {
          // 如果出现不存在的情况就将当前的数据设置为默认值centos和centos7
          configInfo.config.os_system = 'centos';
          configInfo.config.os_image = 'centos7';
        }
      }

      setTimeout(() => {
        loading.value = false;
      }, 500);
    }
  });

  const deleteDialog = reactive({
    close: false,
    index: 0,
    objectName: '',
    deleteName: '',
    aliasName: '',
  });
  const configInfo = reactive({
    name: '',
    description: '',
    resource_version: 0,
    config: {
      region: '无锡',
      os_system: 'centos',
      os_image: 'centos7',
      kubernetes: {
        enable_public_ip: false,
        api_server: '',
        api_port: '',
        kubernetes_version: '1.23.6',
        enable_ha: false,
      },
      network: {
        network_interface: 'eth0',
        cni: 'flannel',
        pod_network: '',
        service_network: '',
        kube_proxy: 'iptables',
      },
      runtime: {
        runtime: 'docker',
      },
      component: {
        haproxy: {
          enable: false,
          keepalived_virtual_router_id: '',
        },
      },
    },

    // k8s service 的选项
    serviceNetwork: {
      a_cidr: '10',
      b_cidr: '254',
      c_cidr: '0',
      d_cidr: '0',
      service_mask: '16',
    },
    // k8s pod 网络的选项
    podNetwork: {
      a_cidr: '172',
      b_cidr: '30',
      c_cidr: '0',
      d_cidr: '0',
      pod_mask: '16',
    },

    // 安装组件
    install_components: [],
    nodes: [],
  });
  const initNodeInfo = {
    name: '',
    role: ['master'],
    // cri: 'docker',
    ip: '',
    auth: {
      type: 'password',
      key: {
        data: '',
      },
      password: {
        user: 'root',
        password: '',
      },
    },
  };
  let nodeInfo = reactive(_.cloneDeep(initNodeInfo));
  const options = reactive({
    kubernetesVersionOptions: [
      {
        value: '1.23.6',
        label: '1.23.6',
      },
      {
        value: '1.24.6',
        label: '1.24.6',
      },
    ],
    osOptions: [
      {
        value: 'centos7',
        label: 'centos7',
      },
      {
        value: 'ubuntu20.04',
        label: 'ubuntu20.04',
      },
      {
        value: 'ubuntu22.04',
        label: 'ubuntu22.04',
      },
    ],
    osList: [],
    osNewOptions: {},
    regionOptions: [
      {
        value: '无锡',
        label: '无锡',
      },
      {
        value: '宿迁',
        label: '宿迁',
      },
      {
        value: '杭州',
        label: '杭州',
      },
      {
        value: '泗阳',
        label: '泗阳',
      },
    ],
    podCidrOptions: [
      {
        value: '192',
        label: '192',
      },
      {
        value: '172',
        label: '172',
      },
    ],
    serviceCidrOptions: [
      {
        value: '10',
        label: '10',
      },
    ],
    podMaskOptions: [
      {
        value: '16',
        label: '16',
      },
      {
        value: '24',
        label: '24',
      },
    ],
    serviceMaskOptions: [
      {
        value: '16',
        label: '16',
      },
      {
        value: '24',
        label: '24',
      },
    ],
    availableComponents: ['Prometheus', 'NginxIngress'],
  });
  const vaildateBCidr = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('不能为空'));
    }
    if (!Number.isInteger(Number(value))) {
      callback(new Error('请输入数字'));
    } else {
      if (Number(value) >= 0 && Number(value) < 255) {
        callback();
      } else {
        callback(new Error('数字的范围在0~255之间'));
      }
    }
  };
  const vaildateIPAddr = (rule, value, callback) => {
    if (!value) {
      callback(new Error('ip地址不能为空'));
    } else {
      if (
        !value.match(
          /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
        )
      ) {
        callback(new Error('ip输入格式有误'));
      } else {
        callback();
      }
    }
  };

  const vaildatePass = (rule, value, callback) => {
    if (nodeInfo.auth.type === 'key' && rule.field === 'auth.key.data') {
      if (!value) {
        callback(new Error('密钥不能为空'));
      }
    }
    if (nodeInfo.auth.type === 'password' && rule.field === 'auth.password.password') {
      if (!value) {
        callback(new Error('密码不能为空'));
      }
    }
    callback();
  };

  // TODO: 名称以及IP的重复性校验
  const rules = reactive({
    name: [{ required: true, message: '请输入集群名称', trigger: 'blur' }],
    'config.region': [{ required: true, message: '请选择所在地域', trigger: 'change' }],
    'config.os_image': [{ required: true, message: '请选择操作系统', trigger: 'change' }],
    'config.network.network_interface': [
      { required: true, message: '请设置容器网口', trigger: 'blur' },
    ],
    'serviceNetwork.b_cidr': [
      {
        validator: vaildateBCidr,
        trigger: 'blur',
      },
    ],
    'podNetwork.b_cidr': [
      {
        validator: vaildateBCidr,
        trigger: 'blur',
      },
    ],
    'config.network.cni': [{ required: true, message: '请选择容器网络插件', trigger: 'change' }],
    'config.runtime.runtime': [{ required: true, message: '请选择容器运行时', trigger: 'change' }],
    'config.kubernetes.kubernetes_version': [
      { required: true, message: '请选择Kubernetes版本', trigger: 'change' },
    ],
  });
  const nodeRules = reactive({
    name: [{ required: true, message: '设置节点名称', trigger: 'blur' }],
    ip: [{ required: true, validator: vaildateIPAddr, trigger: 'blur' }],
    'auth.password.password': [{ required: true, validator: vaildatePass, trigger: 'blur' }],
    'auth.key.data': [{ required: true, validator: vaildatePass, trigger: 'blur' }],
  });

  const findKeyByValue = (obj, value) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].includes(value)) {
          return key;
        }
      }
    }
    return null; // 如果没有找到，返回null
  };

  const getOptionsForOS = async () => {
    const [result, err] = await getPlanSupportOS();
    if (err) {
      ElMessage({
        type: 'error',
        message: `获取支持系统列表失败`,
      });
      return;
    }
    options.osNewOptions = result;
    options.osList = Object.keys(result);
  };

  const selectOS = (item) => {
    if (item !== configInfo.config.os_system) {
      configInfo.config.os_system = item;
      configInfo.config.os_image = options.osNewOptions[item][0];
    }
  };

  const selectOSVersion = (item) => {
    if (item !== configInfo.config.os_image) {
      configInfo.config.os_image = item;
    }
  };

  const handleCreateDialog = () => {
    showDialog.value = true;
  };

  const handleEditDialog = (index) => {
    showDialog.value = true;
    Object.assign(nodeInfo, reactive(_.cloneDeep(configInfo.nodes[index])));
    selectIndex.value = index;
  };

  const clearFormdata = (formRef) => {
    if (formRef.value) {
      formRef.value.resetFields();
      formRef.value.clearValidate();
    }
  };

  const initNodeForm = () => {
    Object.assign(nodeInfo, reactive(_.cloneDeep(initNodeInfo)));
    selectIndex.value = undefined;
  };

  const clearFormData = (done) => {
    clearFormdata(nodeFormRef);
    done();
  };

  const cancel = () => {
    deleteDialog.close = false;
    // 延迟 1 秒重置数据，否则页面上会显的很怪
    setTimeout(() => {
      deleteDialog.deleteName = '';
      deleteDialog.aliasName = '';
      deleteDialog.index = 0;
    }, 100);
  };

  const confirmDelete = () => {
    configInfo.nodes.splice(deleteDialog.index, 1);
    ElMessage({
      type: 'success',
      message: `节点(${deleteDialog.aliasName}) 删除成功`,
    });

    cancel();
  };

  const confirm = async () => {
    await nodeFormRef.value.validate((valid, fields) => {
      if (valid) {
        const {
          name,
          ip,
          cri,
          role,
          auth: {
            type,
            password: { password, user },
            key: { data },
          },
        } = nodeInfo;
        const nodeData = {
          name,
          ip,
          cri,
          role,
        };
        if (type === 'password') {
          nodeData.auth = {
            type,
            password: { password, user },
            key: { data: '' },
          };
        } else {
          nodeData.auth = {
            type,
            password: { password: '', user: 'root' },
            key: { data },
          };
        }
        if (selectIndex.value === undefined) {
          // 新增节点
          configInfo.nodes.push(nodeData);
          ElMessage({
            type: 'success',
            message: `节点(${name}) 创建成功`,
          });
        } else {
          // 更新节点
          configInfo.nodes[selectIndex.value] = nodeData;
          ElMessage({
            type: 'success',
            message: `节点(${name}) 修改成功`,
          });
        }

        clearFormdata(nodeFormRef);
        initNodeForm();
        showDialog.value = false;
      }
    });
  };

  const cancelNodeCreate = () => {
    clearFormdata(nodeFormRef);
    initNodeForm();
    showDialog.value = false;
  };

  const resetViewData = () => {
    configFormRef.value.resetFields();
    configInfo.nodes = [];
    planId.value = undefined;
  };

  const handleDeleteDialog = (scope) => {
    deleteDialog.close = true;
    deleteDialog.index = scope.$index;
    deleteDialog.deleteName = scope.row.id;
    deleteDialog.aliasName = scope.row.name;
  };

  const createOrEditPlan = () => {
    return new Promise((resolve, reject) => {
      configFormRef.value.validate(async (valid, fields) => {
        if (valid) {
          try {
            if (configInfo.nodes.length <= 0) {
              throw new Error('至少创建一个节点');
            }
            const { serviceNetwork, podNetwork } = configInfo;
            const commitData = { ...toRaw(configInfo) };
            const pod_network = `${podNetwork.a_cidr}.${podNetwork.b_cidr}.${podNetwork.c_cidr}.${podNetwork.d_cidr}/${podNetwork.pod_mask}`;
            const service_network = `${serviceNetwork.a_cidr}.${serviceNetwork.b_cidr}.${serviceNetwork.c_cidr}.${serviceNetwork.d_cidr}/${serviceNetwork.service_mask}`;
            commitData.config.network.pod_network = pod_network;
            commitData.config.network.service_network = service_network;
            delete commitData.podNetwork;
            delete commitData.serviceNetwork;

            let result, err;
            if (planId.value === undefined) {
              // 新建
              [result, err] = await createPlan(commitData);
              if (err) {
                throw err;
                return;
              }
              ElMessage({
                type: 'success',
                message: `计划(${commitData.name}) 创建成功`,
              });
            } else {
              // 更新
              [result, err] = await updatePlan(planId.value, commitData);
              if (err) {
                throw err;
                return;
              }
              ElMessage({
                type: 'success',
                message: `计划(${commitData.name}) 更新成功`,
              });
            }
            clearFormdata(configFormRef);
            configInfo.nodes = [];
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };

  return {
    active,
    showDialog,
    planId,
    labelPosition,
    loading,
    configFormRef,
    nodeFormRef,
    deleteDialog,
    configInfo,
    nodeInfo,
    rules,
    nodeRules,
    options,
    handleCreateDialog,
    handleEditDialog,
    clearFormData,
    confirm,
    cancelNodeCreate,
    handleDeleteDialog,
    confirmDelete,
    cancel,
    createOrEditPlan,
    resetViewData,
    getOptionsForOS,
    selectOS,
    selectOSVersion,
  };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClusterStore, import.meta.hot));
}

export default useClusterStore;
