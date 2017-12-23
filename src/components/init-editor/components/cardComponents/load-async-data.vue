<style lang="scss" scoped>
  @function px2rem($number) {
    @return $number / ($number * 0 + 1) / 2 * 1px;
  }

  .cp {
    cursor: pointer;
    user-select: none;
  }

  .spinner {
    height: px2rem(80);
    text-align: center;
    font-size: px2rem(20);
    padding: px2rem(16) 0;
  }

  .spinner > div {
    background-color: #e8e8e8;
    height: 100%;
    width: px2rem(6);
    display: inline-block;
    animation: stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    animation-delay: -1.0s;
  }

  .spinner .rect4 {
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    animation-delay: -0.8s;
  }

  @keyframes stretchdelay {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1.0);
    }
  }

  .no-data {
    /*background-color: #f2f2f2;*/
  }

  .loading-more-flage {
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    > * {
      flex: 1;
      height: 100%;
    }
  }
</style>


<template>
  <div class="load__main-wrap">
    <div class="clear">
      <slot name="slot-data-box" :data="item_data"></slot>
      <div ref="loading-more-flage"></div>
    </div>
    <template v-if="loading">
      <slot name="slot-loading-status" :status="loading">
        <div v-if="loading" class="main loading-more bg-white">
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
        </div>
      </slot>
    </template>
    <template v-else-if="nodata">
      <slot name="slot-nodata-status" :status="nodata">
        <div class="main first-no-data bg-white pdt15 pdb15">
          <div class="nodata-center tc">
            <div>暂时没有数据</div>
          </div>
        </div>
      </slot>
    </template>
    <template v-else-if="nomore">
      <slot name="slot-nomore-status" :status="nomore">
        <div class="main no-data bg-white pdt15 pdb15 tc">
          <div>没有更多啦~</div>
        </div>
      </slot>
    </template>
    <template v-else-if="error">
      <div @click="getItemData">
        <slot name="slot-load-more-status">
          <div class="main no-more bg-white pdt15 pdb15 tc cp">
            <div>{{error||'加载失败~'}}</div>
          </div>
        </slot>
      </div>
    </template>
    <template v-else>
      <div @click="getItemData">
        <slot name="slot-load-more-status">
          <div class="main no-more bg-white pdt15 pdb15 tc cp">
            <div>点击加载更多~</div>
          </div>
        </slot>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script>

	import jQuery from 'jquery'
	import tools from '../../../../tools'

	export default {
		props: {
			cache: {
				type: Boolean,
				default: process.env.NODE_ENV == 'production' ? true : false
			},
			cacheKey: {
				type: String,
				default: window.location.href
			},
			url: {
				type: String,
				required: true
			},
			size: {
				type: Number,
				default: 10
			},
			fixload: {
				type: Number,
				default: 100
			},
			limit: {
				type: [String, Number],
				default: ''
			},
			extData: {
				type: Object,
				default: function () {
					return {
						sys: 'mb'
					}
				}
			},
			resultCallback: {
				type: Function,
				default: function (replayData) {
					return replayData
				}
			},
			firstLoad: {
				type: Boolean,
				default: true
			},
			scrollTrigger: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				new_limit: this.limit,
				item_data: [],

				loading: false,
				nodata: false,
				nomore: false,
				error: '',

				timer: null,
				jqueryLoader: null,
				_cacheKey_: window.location.href,
				_cacheData_: ''
			}
		},
		components: {},
		mounted() {
			this._cacheKey_ = this._cacheKey_ || window.location.href
			this.scrollDom = this.$parent.$refs['load-async-data-box'] || window
			this.$nextTick(() => {
				this._mounted()
			})
		},
		methods: {
			_mounted() {

				let cache_data = tools.sessionStorage.get(this._cacheKey_)
				if (!this.cache || !cache_data) {
					tools.sessionStorage.delete(this._cacheKey_)
					this.firstLoad && this.getItemData()
				} else {
					this._cacheData_ = cache_data

					this.new_limit = cache_data.limit || this.new_limit
					this.item_data = cache_data.data || this.item_data
					this.loading = cache_data.loading || this.loading
					this.nodata = cache_data.nodata || this.nodata
					this.nomore = cache_data.nomore || this.nomore
				}

				let throttleDeFn = tools.throttle(() => {
					this.getItemData()
				}, 260)

				if (this.scrollTrigger) {
					jQuery(this.scrollDom).off('scroll.home').on('scroll.home', () => {
						throttleDeFn()
					})
				}
			},
			getItemData() {
				//没有更多数据
				if (this.nomore) return

				//正在加载中
				if (this.loading) return
				//没有更多数据
				if (this.nomore) return

				var loadMoreObj = jQuery(this.$refs['loading-more-flage'] || null)

				var gh = jQuery(window).height() + loadMoreObj.height() + this.fixload
				if (
					this.scrollTrigger &&
					loadMoreObj.length &&
					gh + jQuery(window).scrollTop() < loadMoreObj.offset().top
				) {
					return
				}
				this.loading = true
				var l_timer = setTimeout(() => {
					this.loading = false
					this.jqueryLoader && this.jqueryLoader.abort()
				}, 10000)

				this.error = ''
				this.jqueryLoader = jQuery.get(this.url, jQuery.extend(true, this.extData, {
					limit: this.new_limit,
					size: this.size
				}), replayDate => {
					replayDate = this.resultCallback(replayDate)

					this.loading = false
					clearTimeout(l_timer)

					if (replayDate.resultCode == 0) {

						replayDate.result = replayDate.result || []
						//没有数据
						if (!this.item_data.length && !replayDate.result.length) {
							this.nodata = true
						}
						if (replayDate.result.length < this.size) {
							this.nomore = true
						}

						this.new_limit = replayDate.limit
						this.item_data = this.item_data.concat(replayDate.result)
						if (!this.cache) {
							//缓存数据
							this._cacheData_ = {
								limit: this.new_limit,
								data: this.item_data,
								loading: this.loading,
								nodata: this.nodata,
								nomore: this.nomore,
							}
							tools.sessionStorage.set(this._cacheKey_, this._cacheData_)
						}
						if (!this.nomore && !this.nodata) {
							if (this.scrollTrigger && gh + jQuery(window).scrollTop() < loadMoreObj.offset().top) {
								this.getItemData()
							}
						}

					} else {

					}
				}, 'json').fail((xhr) => {
					this.error = '加载失败'
					xhr.abort()
				}).always(() => {
					this.loading = false
				})
			},
			refresh() {
				this.jqueryLoader.abort()
				tools.sessionStorage.delete(this._cacheKey_)
				this.timer && clearTimeout(this.timer)
				this.new_limit = ''
				this.item_data = []
				this.nomore = false
				this.loading = false
				this.nodata = false
				this._cacheData_ = ''
				this.item_data = []
			}
		},
		beforeDestroy() {
			jQuery(this.scrollDom).off('scroll.home')
		}
	}
</script>
