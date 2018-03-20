<template>
	<div class="page-home">
		<we-header></we-header>
    <div class="box">
      <p class='btn' @click = 'goLogin' v-if='!authenticated'>去登录</p>
      <p class='btn' @click = 'goAccount'>去个人中心</p>
      <p class='btn' @click = 'logout' v-if='authenticated'>退出</p>
    </div>
    <img src="../../images/home/baoliniao.jpg" alt="">
    <div class='home-bg'></div>
	</div>
</template>

<script>
  import WeHeader from '~component/layouts/header.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
      };
    },
    computed: {
      // 使用对象展开运算符将 getters 混入 computed 对象中
      ...mapGetters({
        // 映射 this.auth/authenticated 为 store.getters.auth/authenticated
        authenticated: 'auth/authenticated',
      }),
    },
    methods: {
      ...mapActions({
        logout: 'auth/logout', // 映射 this.logout() 为 this.$store.dispatch('auth/logout')
      }),
      goLogin() {
        this.$router.push('/login');
      },
      goAccount() {
        this.$router.push('/profile');
      },
    },
    components: {
      WeHeader,
    },
    mounted() {
    },
  };
</script>

<style lang='less' scoped>
	@import '~@/styles/var.less';

	.page-home{
    img{
      width: 100%;
    }
    .home-bg{
      width: 100%;
      height: 315px;
      background: url('@{imgPath}/home/hengda.jpg');
      background-size: cover;
    }
  }
</style>
