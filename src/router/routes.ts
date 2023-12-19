// 對外暴露的配置路由 ( 常量路由 )

export const constantRoute = [
  {
    // 登入
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login', //命名路由
  },
  {
    // 登入成功後的 dashboard
    path: '/',
    component: () => import('@/views/home/index.vue'),
    name: 'home', //命名路由
  },
  {
    // 404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404', //命名路由
  },
  {
    // 任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any', //命名路由
  },
]
