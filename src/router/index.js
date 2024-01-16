import { createRouter, createWebHashHistory } from 'vue-router';

import Layout from '@/layout/index.vue';
import {
  Home,
  Login,
  Role,
  User,
  Menu,
  Cicd,
  Container,
  Kubernetes,
  Deployment,
  DeploymentCreate,
  DeploymentDetail,
  Release,
  Terminal,
  Monitor,
  Node,
  InsertCluster,
  CreateCluster,
  NotFound,
  Operator,
  Service,
  Ingress,
  ConfigMap,
  CreateConfigMap,
  EditConfigMap,
  Secret,
  CreateSecret,
  EditSecret,
  StatefulSet,
  StorageClass,
  Info,
  Pod,
  PodDetail,
  Namespace,
  CreateNamespace,
  NamespaceDetail,
} from '@/page';

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    // 布局项
    path: '/',
    meta: {
      title: '概览',
    },
    component: Layout,
    children: [
      {
        // 首页
        path: 'index',
        name: 'Index',
        meta: {
          title: '概览',
        },
        component: Home,
      },
      {
        path: 'container',
        name: 'Container',
        meta: {
          title: '容器服务',
        },
        component: Container,
      },
      {
        path: 'insertCluster',
        name: 'InsertCluster',
        meta: {
          title: '导入集群',
        },
        component: InsertCluster,
      },
      {
        path: 'createCluster',
        name: 'CreateCluster',
        meta: {
          title: '创建集群',
        },
        component: CreateCluster,
      },
      {
        path: 'kubernetes',
        name: 'Kubernetes',
        meta: {
          title: 'kubernetes',
        },
        component: Kubernetes,
        children: [
          {
            path: 'info',
            name: 'Info',
            meta: {
              title: 'info',
            },
            component: Info,
          },
          {
            path: 'nodes',
            name: 'Node',
            meta: {
              title: 'node',
            },
            component: Node,
          },
          {
            path: 'namespaces',
            name: 'Namespace',
            meta: {
              title: 'namespace',
            },
            component: Namespace,
          },
          {
            path: 'createNamespace',
            name: 'CreateNamespace',
            meta: {
              title: 'createNamespace',
            },
            component: CreateNamespace,
          },
          {
            path: 'namespaceDetail',
            name: 'NamespaceDetail',
            meta: {
              title: 'namespaceDetail',
            },
            component: NamespaceDetail,
          },
          {
            path: 'deployments',
            name: 'Deployment',
            meta: {
              title: 'deployment',
            },
            component: Deployment,
          },
          {
            path: 'statefulsets',
            name: 'statefulset',
            meta: {
              title: 'statefulset',
            },
            component: StatefulSet,
          },
          {
            path: 'release',
            name: 'Release',
            meta: {
              title: 'release',
            },
            component: Release,
          },
          {
            path: 'pods',
            name: 'Pod',
            meta: {
              title: 'pod',
            },
            component: Pod,
          },
          {
            path: 'pods/detail',
            name: 'PodDetail',
            meta: {
              title: 'PodDetail',
            },
            component: PodDetail,
          },
          {
            path: 'deployment_create',
            name: 'DeploymentCreate',
            meta: {
              title: 'DeploymentCreate',
            },
            component: DeploymentCreate,
          },
          {
            path: 'deployments/detail',
            name: 'DeploymentDetail',
            meta: {
              title: 'DeploymentDetail',
              // noPadding: true,
            },
            component: DeploymentDetail,
          },
          {
            path: 'operator',
            name: 'Operator',
            meta: {
              title: 'operator',
            },
            component: Operator,
          },
          {
            path: 'terminal',
            name: 'Terminal',
            meta: {
              title: 'terminal',
            },
            component: Terminal,
          },
          {
            path: 'monitor',
            name: 'Monitor',
            meta: {
              title: 'monitor',
            },
            component: Monitor,
          },
          {
            path: 'services',
            name: 'Service',
            meta: {
              title: 'service',
            },
            component: Service,
          },
          {
            path: 'ingress',
            name: 'Ingress',
            meta: {
              title: 'ingress',
            },
            component: Ingress,
          },
          {
            path: 'configmaps',
            name: 'ConfigMap',
            meta: {
              title: 'configmap',
            },
            component: ConfigMap,
          },
          {
            path: 'configmaps/createConfigMap',
            name: 'createConfigMap',
            meta: {
              title: 'createConfigMap',
            },
            component: CreateConfigMap,
          },
          {
            path: 'configmaps/editConfigMap',
            name: 'editConfigMap',
            meta: {
              title: 'editConfigMap',
            },
            component: EditConfigMap,
          },
          {
            path: 'secrets',
            name: 'Secret',
            meta: {
              title: 'secret',
            },
            component: Secret,
          },
          {
            path: 'secrets/editSecret',
            name: 'editSecret',
            meta: {
              title: 'editSecret',
            },
            component: EditSecret,
          },
          {
            path: 'secrets/createSecret',
            name: 'createSecret',
            meta: {
              title: 'createSecret',
            },
            component: CreateSecret,
          },
          {
            path: 'storageclass',
            name: 'StorageClass',
            meta: {
              title: 'storageclass',
            },
            component: StorageClass,
          },
        ],
      },
      {
        path: 'cicd',
        name: 'Cicd',
        meta: {
          title: 'DevOps',
        },
        component: Cicd,
      },
      {
        path: 'user',
        name: 'User',
        meta: {
          title: '用户',
        },
        component: User,
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '角色',
        },
        component: Role,
      },
      {
        path: 'menu',
        name: 'Menu',
        meta: {
          title: '权限',
        },
        component: Menu,
      },
    ],
  },
  {
    // 登陆界面
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/podshell',
    name: 'PodShell',
    component: Terminal,
  },
  { path: '/:pathMatch(.*)', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  if (!token && to.fullPath !== '/login') {
    return { name: 'Login' };
  }
  if (token && to.fullPath === '/login') {
    return { name: 'Index' };
  }
});

const setupRouter = (app) => {
  app.use(router);
};

export { setupRouter, router };
