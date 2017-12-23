UE.plugins['my_style'] = function () {

  var me = this
  me.commands['title_h3'] = {
    execCommand: function () {
      var me = this

      if (me.queryCommandState('title_h3') == 1) {
        var range = me.selection.getRange()
        var path = this.selection.getStartElementPath()
        for (var i = 0; i < path.length; i++) {
          if (path[i].tagName == 'H3') {
            var p = me.document.createElement('p')
            var textNode
            if (path[i].innerText) {
              textNode = me.document.createTextNode(path[i].innerText)
            } else {
              textNode = path[i].firstChild
            }
            p.appendChild(textNode)
            path[i].parentNode.replaceChild(p, path[i])
            range.setStart(textNode, range.startOffset)
              .setEnd(textNode, range.endOffset).collapse(true).select(true)
            break
          }
        }
      } else {
        me.execCommand('Paragraph', 'h3', {
          'class': 'title_h3'
        })
      }
    },
    queryCommandState: function () {
      var pN = domUtils.filterNodeList(this.selection.getStartElementPath(), 'h3')
      return pN ? 1 : 0
    }
  }

  var commands = [{
    name: 'insertorderedlist2',
    dist: 'insertorderedlist'
  }, {
    name: 'insertunorderedlist2',
    dist: 'insertunorderedlist'
  }
  ]
  for (var i = 0; i < commands.length; i++) {
    var item = commands[i]
    var cmd = item.dist;
    (function (cmd, item) {
      me.commands[item.name] = {
        execCommand: function () {
          var value = this.queryCommandValue(cmd) || undefined
          this.execCommand(cmd, value)
        },
        queryCommandState: function () {
          return this.queryCommandState(cmd)
        }
      }
    })(cmd, item)
  }

  me.commands['remote_catch'] = {
    execCommand: function () {
      var me = this
      if (me.queryCommandState('remote_catch') == 1) {
        me.fireEvent('catchRemoteImage')
      }
    },
    queryCommandState: function () {
      return 1
    }
  }

  var commandsDialog = ['insert_card', 'insert_video', 'insert_image', 'full_screen']
  for (var i = 0; i < commandsDialog.length; i++) {
    (function (command) {
      me.commands[command] = {
        execCommand: function () {
          var me = this, flage = 'flage-' + command
          me[flage] = !me[flage]
          if (command === 'full_screen') {
            me.$emitEvent(command, me[flage])
          } else if (me.queryCommandState(command) == 1) {
            me.$emitEvent(command, me[flage])
          }
        },
        queryCommandState: function () {
          if (command === 'full_screen') {
            return me.fullScreen ? 1 : 0
          }
          return 1
        }
      }
    })(commandsDialog[i])
  }

  me.commands['new_link'] = {
    execCommand: function () {
      var me = this
      var state = me.queryCommandState('new_link')

      var range = me.selection.getRange()
      var rangeLink = domUtils.findParentByTagName(range.getCommonAncestor(), 'a', true)
      //已经有链接
      //目标：去除链接
      if (state == 1) {
        var newEle = me.document.createTextNode(rangeLink.textContent)
        rangeLink.parentElement.replaceChild(newEle, rangeLink)
      }
      //弹窗设置链接
      else if (state == 0) {
        me.$emitEvent('new_link', range)
      }
      //不可设置链接
      else if (state == -1) {

      }
    },
    queryCommandState: function () {

      var editor = this
      var range = editor.selection.getRange()
      var rangeCommon = range.getCommonAncestor()
      var rangeLink = domUtils.findParentByTagName(rangeCommon, 'a', true)
      if (rangeLink) {
        if (!range.collapsed) {
          return 0
        }
        return 1
      }
      if (range.collapsed) {
        // 这里有个bug先不解决
        // if(
        //   range.startContainer == range.endContainer &&
        //   range.startContainer.nextSibling &&
					// range.startContainer.nextSibling.tagName == 'A'
        // ){
					// return 1
        // }
        return -1
      }

      var fragment = range.cloneContents()
      var node = document.createElement("div")
      node.appendChild(fragment)
      //包含有图片
      if (node.getElementsByTagName('img').length) {
        return -1
      }
      return 0
    }
  }

}

