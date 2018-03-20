<template>
  <div class='page-profile'>
    <we-header title='个人中心'></we-header>
    <p class='tip1'>{{account.firstName}}</p>
    <p class='tip1'>{{account.interest}}</p>
    <p class='tip1'>{{account.email}}</p>
    <p class='btn' @click = 'goHome'>首页</p>
  </div>
</template>

<script>
  import WeHeader from '~component/layouts/header.vue';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
      };
    },
    computed: {
      // 使用对象展开运算符将 getters 混入 computed 对象中
      ...mapGetters({
        account: 'profile/account',
      }),
    },
    methods: {
      goHome() {
        this.$router.push('/');
      },
    },
    components: {
      WeHeader,
    },
    mounted() {
    },
  };
</script>
<style lang="less" scoped>
.page-profile {
  .tip1 {
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>

