<template>
  <div class='page-login'>
    <we-header title='登录'></we-header>
    <p class='btn' @click = 'login'>登录</p>
  </div>
</template>

<script>
  /* ============
   * Login Index Page
   * ============
   *
   * Page where the user can login.
   */
  import { mapActions } from 'vuex';
  import WeHeader from '~component/layouts/header.vue';

  export default {
    data() {
      return {
      };
    },
    components: {
      WeHeader,
    },
    methods: {
      ...mapActions({
        login: 'auth/login', // 映射 this.login() 为 this.$store.dispatch('auth/login')
      }),
    },
  };
</script>
