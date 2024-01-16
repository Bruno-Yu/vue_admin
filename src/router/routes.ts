// 對外暴露的配置路由 ( 常量路由 )

export const constantRoute = [
  {
    // 登入
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login', //命名路由
    meta: {
      title: '登入', // 菜單需要的標題
      hidden: true, // 隱藏不需要顯示在菜單的路由
    },
  },
  {
    // 登入成功後的 dashboard
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout', //命名路由
    meta: {
      title: 'layout',
      hidden: false,
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首頁',
          hidden: false,
        },
      },
      {
        path: '/test',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '測試',
          hidden: false,
        },
      },
    ],
  },
  {
    // 404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404', //命名路由
    meta: {
      title: '404',
      hidden: true,
    },
  },
  {
    // 任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any', //命名路由
    meta: {
      title: '任意路由',
      hidden: true,
    },
  },
]
