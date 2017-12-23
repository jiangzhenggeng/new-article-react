<style lang="less">
  @min-height: 150px;
  @max-height: 390px;
  .line2,
  .line1 {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .line1 {
    -webkit-line-clamp: 1;
  }

  .blue {
    color: #369ad1;
  }

  .load-async-data-box {
    min-height: @min-height;
    max-height: @max-height;
    overflow: hidden;
    overflow-y: scroll;
    margin: 20px 0 0 0;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    .loading__data-wrap {
      padding-right: 15px;

      .loading__item {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        margin-bottom: 10px;
        border-bottom: 1px #e2e2e2 dashed;
        padding-bottom: 10px;
      }
      .loading__left {
        width: 80px;
        height: 80px;
        box-sizing: border-box;
        border: 1px solid #f1f1f1;
        img {
          width: 100%;
        }
      }
      .loading__right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 15px;
      }
      .title {
        color: #333;
        font-size: 14px;
        font-weight: 500;
      }
      .desc {
        color: #a0a0a0;
        font-size: 14px;
      }
    }
  }

  .search-input-wrap {
    transition: all 0.3s;
    &.hidden {
      transform: translateY(-60px);
      position: absolute;
      width: 100%;
      ~ .load-async-data-box {
        margin: 0;
        min-height: @min-height + 60;
        max-height: @max-height + 60;
      }
    }
  }
</style>


<template>
  <div class="">
    <div class="search-input-wrap" :class="hidden?'hidden':''">
      <search-input @search="search"/>
    </div>
    <div class="load-async-data-box" ref="load-async-data-box">
      <load-async-data
        url="/admin/coupon/InterfaceGetCouponPackageList"
        :extData="extData"
        :resultCallback="resultCallback"
        ref="load-data-limit"
      >
        <template slot="slot-data-box" slot-scope="props">
          <ul class="loading__data-wrap">
            <li v-for="item in props.data" :key="item.id">
              <div class="loading__item">
                <div class="loading__left">
                  <img :src="`http://s1.jiguo.com/${item.cover}/230x230`"/>
                </div>
                <div class="loading__right">
                  <div class="title line2" v-html="item.name"></div>
                  <div class="desc line1" v-html="item.detail"></div>
                  <div class="query">
                    <a class="look blue" :href="`/admin/coupon/CouponPackageedit/id/${item.id}.html`" target="_blank">查看</a>
                    <a href="javascript:;" @click="insertCard($event,item)" class="insert blue mgl10">插入</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </load-async-data>
    </div>
  </div>
</template>
<script>
	import $ from 'jquery'
	import SearchInput from './search-input'
	import LoadAsyncData from './load-async-data'

	export default {
		data() {
			return {
				keyword: '',
				hidden: false
			}
		},
		computed: {
			extData() {
				return {
					keyword: this.keyword,
					size: 10
				}
			}
		},
		watch: {
			keyword() {

			}
		},
		components: {
			SearchInput,
			LoadAsyncData,
		},
		mounted() {
			var _this = this
			var lastScrollTop = 0
			$(this.$refs['load-async-data-box']).on('scroll', function () {

				if ($(this).scrollTop() >= 60 && $(this).scrollTop() > lastScrollTop) {
					_this.hidden = true
				} else {
					_this.hidden = false
				}
				lastScrollTop = $(this).scrollTop()
			})
		},
		methods: {
			resultCallback(replayData) {
				return replayData
			},
			search(keyWord) {
				this.keyword = keyWord
				this.searchIng()
			},
			searchIng() {
				if (this.$refs['load-data-limit']) {
					this.$refs['load-data-limit'].refresh()
					this.$nextTick(() => {
						this.$refs['load-data-limit'].getItemData()
					})
				}
			},
			insertCard(e, item) {

				var pId = 'random_id_' + Math.random().toString().replace('.', '');
				var unique = 'coupon_unique_id_' + pId
				var cid = item.id

				var iframe = document.createElement('iframe'),
					btnStyle = 'box-shadow:1px 0px 1px 0 #E6E6E6,1px 1px 2px 0 rgba(0,0,0,0.1);display:block;width:100%;height:165px;max-width:675px !important;overflow:hidden;border:0;margin:auto;padding:0;';

				iframe.setAttribute('data-coupon-unique', unique);
				iframe.setAttribute('data-coupon-cid', cid);
				iframe.setAttribute('src', 'http://m.jiguo.com/mb/coupon/info?id=' + cid);

				iframe.style.cssText = btnStyle;
				var _this = this
				this.$emit('insert:html', '<p style="text-align: center">' + iframe.outerHTML + '</p>', function (editor) {
					if ($('iframe[data-coupon-cid=' + cid + '][data-coupon-unique][src]', editor.document).length > 0) {
						_this.$notify.error({
							title: '错误',
							message: '不允许插入相同券包'
						});
						return false;
					}
					// $(e.currentTarget).closest('li').fadeOut(160)
					_this.$emit('close')
					return true
				})
			}
		}
	}
</script>