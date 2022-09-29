import { createRouter, createWebHashHistory } from "vue-router";

import Layout from "@/layout/index.vue";
import {
  Home,
  Login,
  Role,
  User,
  Cicd,
  Container,
  Kubernetes,
  Deployment,
  Node,
  InsertCluster,
  CreateCluster,
  NotFound,
} from "@/page";
const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    // 布局项
    path: "/",
    meta: {
      title: "概览",
    },
    component: Layout,
    children: [
      {
        // 首页
        path: "index",
        name: "Index",
        meta: {
          title: "概览",
        },
        component: Home,
      },
      {
        path: "container",
        name: "Container",
        meta: {
          title: "容器服务",
        },
        component: Container,
      },
      {
        path: "insertCluster",
        name: "InsertCluster",
        meta: {
          title: "导入集群",
        },
        component: InsertCluster,
      },
      {
        path: "createCluster",
        name: "CreateCluster",
        meta: {
          title: "创建集群",
        },
        component: CreateCluster,
      },
      {
        path: "kubernetes",
        name: "Kubernetes",
        meta: {
          title: "kubernetes",
        },
        component: Kubernetes,
        children: [
          {
            path: "nodes",
            name: "Node",
            meta: {
              title: "node",
            },
            component: Node,
          },
          {
            path: "deployments",
            name: "Deployment",
            meta: {
              title: "deployment",
            },
            component: Deployment,
          },
        ],
      },

      {
        path: "cicd",
        name: "Cicd",
        meta: {
          title: "DevOps",
        },
        component: Cicd,
      },
      {
        path: "user",
        name: "User",
        meta: {
          title: "用户",
        },
        component: User,
      },
      {
        path: "role",
        name: "Role",
        meta: {
          title: "权限",
        },
        component: Role,
      },
    ],
  },
  {
    // 登陆界面
    path: "/login",
    name: "Login",
    component: Login,
  },
  { path: "/:pathMatch(.*)", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");
  if (!token && to.fullPath !== "/login") {
    return { name: "Login" };
  }
  if (token && to.fullPath === "/login") {
    return { name: "Index" };
  }
});

export default router;
