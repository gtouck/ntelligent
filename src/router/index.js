import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/main',
      name: 'skeleton',
      component: () => import('../views/Skeleton'),
      children: [
        {
          path: '/optimize',
          name: 'optimize',
          component: () => import('../views/Optimize'),
        },
        {
          path: '/efficiency',
          name: 'efficiency',
          component: () => import('../views/Efficiency'),
        },
        {
          path: '/energy',
          name: 'energy',
          component: () => import('../views/Energy'),
        },
        {
          path: '/analysis',
          name: 'analysis',
          component: () => import('../views/Analysis'),
        },
        {
          path: '/statusRemind',
          name: 'statusRemind',
          component: () => import('../views/StatusRemind'),
          meta: {},
        },
      ],
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home'),
      meta: {},
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login'),
      meta: {},
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register'),
      meta: {},
    },
    {
      path: '/',
      redirect: '/login',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    const vuex = sessionStorage.getItem('vuex');
    const userInfo = JSON.parse(vuex)?.userInfo || {};
    if (!userInfo.token) {
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
