const Login = r => require.ensure([], () => r(require('@/pages/auth/login.vue')), 'auth');
const arr = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    // If the user needs to be authenticated to view this page
    meta: {
      guest: true,
    },
  },
];
export default arr;
