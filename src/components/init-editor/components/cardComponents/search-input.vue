<style lang="less" scoped>
  .search__warp {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search__input {
      flex: 1;
    }
    .search__btn {
      user-select: none;
      width: 120px;
    }
  }
</style>


<template>
  <div class="search__warp">
    <el-input
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      v-model="keyWord"
      class="search__input"
    />
    <el-button type="primary" class="search__btn mgl10">搜索</el-button>
  </div>
</template>
<script>
	import tools from '../../../../tools'

	export default {
		data() {
			return {
				keyWord: ''
			}
		},
		components: {},
		created() {
			this.emitSearch = tools.debounce((newVal) => {
				this.$emit('search', newVal)
			}, 300)
		},
		watch: {
			keyWord: [
				function (newVal) {
					this.emitSearch(newVal)
				},
				function (newVal) {
				
				},
			]
		}
	}
</script>