import {
    createRouter,
    createWebHashHistory
} from "vue-router"

const routes = [{ // 登陆界面
        path: '/',
        name: 'login',
        component: () => import( /*webpackChunkName:'Login'*/ '@/page/login/login.vue')
    },
    { // 布局项
        path: '/index',
        name: 'index',
        meta: {
            title: '概览'
        },
        component: () => import( /*webpackChunkName:'Index'*/ '@/page/home/index.vue'),
        children: [{ // 首页
                path: '/index',
                name: 'index',
                meta: {
                    title: '概览'
                },
                component: () => import( /*webpackChunkName:'Home'*/ '@/page/home/home.vue'),
            },
            {
                path: '/container',
                name: 'container',
                meta: {
                    title: '容器服务'
                },
                component: () => import( /*webpackChunkName:'User'*/ '@/page/container/container.vue'),
            },
            {
                path: '/cicd',
                name: 'cicd',
                meta: {
                    title: 'cicd'
                },
                component: () => import( /*webpackChunkName:'User'*/ '@/page/cicd/cicd.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: 'user'
                },
                component: () => import( /*webpackChunkName:'User'*/ '@/page/user/user.vue'),
            },
            {
                path: '/role',
                name: 'role',
                meta: {
                    title: 'user'
                },
                component: () => import( /*webpackChunkName:'Role'*/ '@/page/user/role.vue'),
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        next()
    } else {
        const token = window.sessionStorage.getItem('token')
        if (!token) {
            next('/')
        } else {
            next()
        }
    }
})

export default router