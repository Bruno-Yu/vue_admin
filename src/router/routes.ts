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
      icon: 'Promotion', // 菜單圖標，使用 element-plus icon 全域圖標
    },
  },
  {
    // 登入成功後的 dashboard
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout', //命名路由
    redirect: '/home',
    meta: {
      title: '', // 由於希望在 breadcrumb 用 v-show 判斷是否顯示，不顯示以空字串呈現
      hidden: false,
      icon: '',
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首頁',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      title: '數據大屏',
      hidden: false,
      icon: 'Monitor',
    },
  },
  // 權限管理
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user',
    name: 'Acl',
    meta: {
      title: '權限管理',
      hidden: false,
      icon: 'Unlock',
    },
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用戶管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜單管理',
          hidden: false,
          icon: 'Guide',
        },
      },
    ],
  },
  // 商品管理
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/trademark',
    name: 'Product',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods',
    },
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'Briefcase',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          title: '屬性管理',
          hidden: false,
          icon: 'Collection',
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'SPU',
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'List',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'SKU',
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Management',
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
      icon: 'Remove',
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
      icon: 'Guide',
    },
  },
]
