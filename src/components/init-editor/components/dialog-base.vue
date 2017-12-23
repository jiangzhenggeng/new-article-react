<style lang="less" scoped>
  @model__header-height: 40px;
  .model__wrap {
    z-index: 12;
    position: fixed;
    left: 50%;
    top: 60px;

    .model__table {
      position: relative;
      display: table;
      color: #fff;
    }
    .model__td {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .model__inner {
      text-align: left;
      display: inline-block;
      position: relative;
      z-index: 1;
    }
    .model__content {
      background: #fff;
      height: auto;
      border-radius: 3px;
      box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.5), 0 0 0px 1px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .model__header {
      height: @model__header-height;
      position: relative;
      line-height: @model__header-height;
      font-size: 16px;
      box-sizing: border-box;
      padding: 0 15px;
      cursor: move;
      user-select: none;

      &:after {
        position: absolute;
        width: 100%;
        content: '';
        display: block;
        bottom: 0;
        left: 0;
        height: 1px;
        background: rgba(0, 0, 0, 0.2);
      }
    }
    .model__close {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      transition: transform .2s;
      width: @model__header-height;
      text-align: center;
      overflow: hidden;
      cursor: pointer;
      transform: scale(1);
      &:hover {
        transform: scale(1.3);
        color: #fe5143;
      }
    }
    .model__body {
      padding: 15px;
    }

  }
</style>

<template>
  <div class="model__wrap" ref="model__wrap">
    <div class="model__table">
      <div class="model__td">
        <div class="model__inner">
          <div class="model__content" :style="`width:${width}px`">
            <div class="model__header" @mousedown="mousedown($event)">
              <div class="model__title">{{ title }}</div>
              <div class="model__close" @click="close">×</div>
            </div>
            <div class="model__body">
              <slot></slot>
            </div>
            <div class="model__footer">
              <slot name="bottom"></slot>
            </div>
          </div>
        </div>
        <div class="model__mask" @click="close"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    props: {
      title: {
        type: String,
        default: '我是标题'
      },
      width: {
        type: Number,
        default: 660
      }
    },
    mounted() {
      var _this = this
      _this.windowW = $(window).width()
      _this.windowH = $(window).height()
      $(document).on('mousemove.dialogbase', function (e) {
        _this.mousemove(e)
      }).on('mouseup.dialogbase', function (e) {
        _this.mouseup(e)
      })

      $(this.$refs['model__wrap']).css({
        left: _this.windowW / 2 - $(this.$refs['model__wrap']).width() / 2
      })

    },
    beforeDestroy() {
      $(document).off('mouseup.dialogbase').off('mousemove.dialogbase')
    },
    methods: {
      close() {
        this.$emit('close')
      },
      mousedown(e) {
        this.$emit('mousedown')
        this.MousedownFlage = true
        var offset = $(this.$refs['model__wrap']).offset()
        this.posX = e.clientX - parseInt(offset.left) + $(window).scrollLeft()
        this.posY = e.clientY - parseInt(offset.top) + $(window).scrollTop()
      },
      mousemove(e) {
        if (this.MousedownFlage) {
          this.$emit('mousemove')
          var left = e.clientX - this.posX
          var top = e.clientY - this.posY
          $(this.$refs['model__wrap']).css({
            left: left <= 0 ? 0 : (left >= this.windowW - 100 ? this.windowW - 100 : left),
            top: top <= 0 ? 0 : (top >= this.windowH - 100 ? this.windowH - 100 : top)
          })
        }
      },
      mouseup(e) {
        this.mousemove(e)
        this.MousedownFlage = false
        this.$emit('mouseup')
      }
    }
  }
</script>