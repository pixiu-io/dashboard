import Cluster from './container/cluster/cluster.vue';
import InsertCluster from './container/cluster/insertCluster.vue';
import CreateCluster from './container/cluster/createCluster.vue';
import Kubernetes from './container/kubernetes.vue';
import Operator from './container/operator.vue';
import Deployment from './container/deployment/deployment.vue';
import CreateDeployment from './container/deployment/createDeployment.vue';
import EditDeployment from './container/deployment/editDeployment.vue';
import DeploymentDetail from './container/deployment/details.vue';
import StatefulSet from './container/statefulset/statefulset.vue';
import CreateStatefulSet from './container/statefulset/createStatefulSet.vue';
import EditStatefulSet from './container/statefulset/editStatefulSet.vue';
import StatefulSetDetail from './container/statefulset/details.vue';
import Release from './container/release/release.vue';
import Terminal from './container/terminal.vue';
import Monitor from './container/monitor.vue';
import Node from './container/node/node.vue';
import NodeDetail from './container/node/nodeDetail.vue';
import Info from './container/info/info.vue';
import Home from './home/home.vue';
import Login from './login/login.vue';
import Setting from './setting/setting.vue';
import User from './user/user.vue';
import UserDetail from './user/userDetail.vue';
import RegisterUser from './user/registerUser.vue';
import Menu from './user/menu.vue';
import Role from './user/role.vue';
import Service from './container/service/service.vue';
import ServiceDetail from './container/service/serviceDetail.vue';
import CreateService from './container/service/createService.vue';
import EditService from './container/service/editService.vue';
import ConfigMap from './container/configmap/configmap.vue';
import CreateConfigMap from './container/configmap/createConfigMap.vue';
import EditConfigMap from './container/configmap/editConfigMap.vue';
import Secret from './container/secret/secret.vue';
import CreateSecret from './container/secret/createSecret.vue';
import EditSecret from './container/secret/editSecret.vue';
import SecretDetail from './container/secret/secretDetail.vue';
import Ingress from './container/ingress/ingress.vue';
import CreateIngress from './container/ingress/createIngress.vue';
import EditIngress from './container/ingress/editIngress.vue';
import Pod from './container/pod/pod.vue';
import PodDetail from './container/pod/podDetail.vue';
import CreatePod from './container/pod/createPod.vue';
import StorageClass from './container/storageclass/storageclass.vue';
import CreateStorageClass from './container/storageclass/createStorageclass.vue';
import EditStorageClass from './container/storageclass/editStorageclass.vue';
import Namespace from './container/namespace/namespace.vue';
import CreateNamespace from './container/namespace/createNamespace.vue';
import NamespaceDetail from './container/namespace/namespaceDetail.vue';
import NotFound from './notFound/notFound.vue';
import Job from './container/job/job.vue';
import CreateJob from './container/job/createJob.vue';
import EditJob from './container/job/editJob.vue';
import CronJob from './container/cronjob/cronJob.vue';
import CreateCronJob from './container/cronjob/createCronJob.vue';
import EditCronJob from './container/cronjob/editCronJob.vue';
import Task from './container/cicd/task.vue';
import TaskRun from './container/cicd/taskrun.vue';
import Pipeline from './container/cicd/pipeline.vue';
import PipelineRun from './container/cicd/pipelinerun.vue';
import CreateTask from './container/cicd/createtask.vue';
import CreateTaskRun from './container/cicd/createtaskrun.vue';
import Plan from './plan/plan.vue';
import PlanDetail from './plan/planDetail.vue';
import PlanCreate from './plan/planCreate.vue';
import Event from './container/event/event.vue';
import CRD from './container/crd/crd.vue';
import Audit from './audit/audit.vue';
import Daemonset from './container/daemonset/daemonset.vue';
import DaemonsetDetail from './container/daemonset/details.vue';
export {
  Home,
  Login,
  Role,
  Menu,
  Setting,
  User,
  UserDetail,
  RegisterUser,
  Kubernetes,
  Deployment,
  CreateDeployment,
  EditDeployment,
  DeploymentDetail,
  // Daemonset
  Daemonset,
  DaemonsetDetail,
  Release,
  Node,
  NodeDetail,
  Terminal,
  Monitor,
  Cluster,
  InsertCluster,
  CreateCluster,
  Operator,
  Service,
  ServiceDetail,
  CreateService,
  EditService,
  StatefulSet,
  CreateStatefulSet,
  EditStatefulSet,
  StatefulSetDetail,
  ConfigMap,
  CreateConfigMap,
  EditConfigMap,
  Secret,
  CreateSecret,
  EditSecret,
  SecretDetail,
  Ingress,
  CreateIngress,
  EditIngress,
  Pod,
  PodDetail,
  CreatePod,
  StorageClass,
  CreateStorageClass,
  EditStorageClass,
  Info,
  Namespace,
  CreateNamespace,
  NamespaceDetail,
  NotFound,
  Job,
  CreateJob,
  EditJob,
  CronJob,
  CreateCronJob,
  EditCronJob,
  Task,
  TaskRun,
  Pipeline,
  PipelineRun,
  CreateTask,
  CreateTaskRun,
  Plan,
  PlanDetail,
  PlanCreate,
  Event,
  CRD,
  Audit,
};
