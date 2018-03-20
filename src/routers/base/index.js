const PageError = r => require.ensure([], () => r(require('@/pages/base/error.vue')), 'error');
const Page404 = r => require.ensure([], () => r(require('@/pages/base/404.vue')), '404');

const arr = [
  {
    path: '/404',
    name: '404',
    component: Page404,
    // If the user needs to be authenticated to view this page
    meta: {
      auth: false,
    },
  },
  {
    path: '/error',
    name: 'error',
    component: PageError,
    // If the user needs to be authenticated to view this page
    meta: {
      auth: false,
    },
  },
];

export default arr;
