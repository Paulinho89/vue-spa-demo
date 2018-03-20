<template>
	<div class="header">
		<p class="title">{{ title }}</p>
	</div>
</template>

<script>
	export default {
	  props: {
	    title: {
	      default: '首页',
	    },
	  },
	  methods: {

	  },
	};
</script>

<style lang='less' scoped>
	.header{
		margin-top: 20px;
		.title{
			font-size: 18px;
			color: blue;
			text-align: center;
		}
	}
</style>
