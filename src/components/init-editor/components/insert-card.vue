<style lang="less">
  @import "./bottom-btn";

  .insert-card {
    &.model__wrap .model__body {
      padding-top: 0;
    }

    .el-form-item__content {
      display: flex;
      min-height: 40px;
      align-items: center;
    }

    .el-tabs__active-bar,
    .el-tabs__nav-wrap::after {
      height: 1px;
    }

    .el-tabs__item {
      font-weight: normal;
    }
  }

</style>


<template>
  <transition name="window__modal">
    <dialog-base
      v-show="inner_visibile"
      @close="close"
      title="插入卡片"
      class="insert-card"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="产品库" name="second">
          <insert-card-product
            @insert:html="insertCard"
            @close="close"
          />
        </el-tab-pane>
        <el-tab-pane label="优惠券" name="third">
          <insert-card-coupons
            @insert:html="insertCard"
            @close="close"
          />
        </el-tab-pane>
        <el-tab-pane label="临时卡片" name="fourth">
          <insert-card-link
            @insert:html="insertCard"
            @close="close"
            ref="insert-card-link"
          />
        </el-tab-pane>
      </el-tabs>
    </dialog-base>
  </transition>
</template>
<script>
	import mixins from './mixins'
	import InsertCardProduct from './cardComponents/insert-card-product'
	import InsertCardCoupons from './cardComponents/insert-card-coupons'
	import InsertCardLink from './cardComponents/insert-card-link'
	import busEvent from './cardComponents/busEvent'

	export default {
		mixins: [mixins],
		data() {
			return {
				activeName: 'second'
			};
		},
		components: {
			InsertCardProduct,
			InsertCardCoupons,
			InsertCardLink
		},
		created() {
			busEvent.$on('change:tabbar', (name) => {
				this.activeName = name
				this.$emit('update:visibile', true)
			})
		},
		methods: {
			insertCard(html, callBack) {
				this.$emit('insert:html', html, callBack)
			},
      init(){
				this.$refs['insert-card-link'].init()
      }
		}
	}
</script>