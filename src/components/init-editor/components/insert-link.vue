<style lang="less">
  @import "./bottom-btn";

  .link__wrap {
    font-size: 14px;
    margin: 10px 0;

    .link__cell {
      display: flex;
      align-items: center;
      margin: 20px;
    }
    .link__cell-input {
      flex: 1;
      position: relative;
    }
    .error-tips {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5px;
      font-size: 12px;
      color: red;
    }
    .input {
      border: none;
      height: 34px;
      display: block;
      width: 100%;
      border-radius: 5px;
      padding: 0 10px;
      outline: none;
      box-shadow: 0 0 0 1px #ccc;
      &:focus {
        box-shadow: 0 0 0 1px #F66039;
      }
    }
  }
</style>

<template>
  <transition name="window__modal">
    <dialog-base
      v-show="inner_visibile"
      @close="close"
      title="超链接"
      :width="400"
    >
      <div class="link__wrap">
        <div class="link__cell">
          <div class="link__sub-title">链接：</div>
          <div class="link__cell-input">
            <input class="input" type="text" v-model="link"/>
            <div v-if="link && !urlSuccess" class="error-tips">http://或https://开头</div>
          </div>
        </div>
        <div class="link__cell" v-show="false">
          <div class="link__sub-title">描述：</div>
          <div class="link__cell-input">
            <input class="input" type="text" v-model="description"/>
          </div>
        </div>
      </div>

      <div class="dialog__bottom-wrap" slot="bottom">
        <div class="dialog__bottom gary" @click="close">关闭</div>
        <div class="dialog__bottom" :class="urlSuccess?'red':'gary'" @click="insertLink">插入链接</div>
      </div>
    </dialog-base>
  </transition>
</template>
<script>
  import mixins from './mixins'

  export default {
    mixins: [mixins],
    data() {
      return {
        description: '',
        link: 'http://',
        urlSuccess: false
      }
    },
    watch: {
      inner_visibile(newVal) {
        if (newVal && this.$parent.editor) {
          var me = this.$parent.editor
          var range = me.selection.getRange()
          var rangeCommon = range.getCommonAncestor()
          var rangeLink = domUtils.findParentByTagName(rangeCommon, 'a', true)
          if (rangeLink) {
            range.setStartBefore(rangeLink)
            range.setEndAfter(rangeLink)
            this.link = rangeLink.getAttribute('href')
            this.description = rangeLink.getAttribute('title')
          }
          var range = me.selection.getRange()

          var fragment = range.cloneContents()
          var node = document.createElement("div")
          node.appendChild(fragment)
          this.description = node.innerText
          this.range = range
          this.editor = me
        }
      },
      link(newVal) {
        this.urlSuccess = /^https?:\/\/.+/i.test(newVal)
      }
    },
    methods: {
      insertLink() {
        if (!this.urlSuccess) {
          return
        }
        if (!this.range || !this.editor) {
          return
        }

        var fragment = this.range.extractContents()
        var node = this.range.document.createElement("div")
        var tempFrag = this.range.document.createDocumentFragment()
        node.appendChild(fragment)
        var a = node.getElementsByTagName('a')
        for (var i = a.length - 1; i >= 0; i--) {
          while (a[i].firstChild) {
            tempFrag.appendChild(a[i].firstChild)
          }
          a[i].parentElement.replaceChild(tempFrag, a[i])
        }

        var A = this.range.document.createElement('a')
        A.setAttribute('href', this.link)
        A.setAttribute('title', this.description)
        while (node.firstChild) {
          A.appendChild(node.firstChild)
        }
        this.range.insertNode(A)
        this.close()
      }
    }
  }
</script>