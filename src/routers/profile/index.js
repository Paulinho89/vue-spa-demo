const Profile = r => require.ensure([], () => r(require('@/pages/profile/index.vue')), 'profile');
const arr = [
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    // If the user needs to be authenticated to view this page
    meta: {
      auth: true,
    },
  },
];
// Profile
export default arr;
