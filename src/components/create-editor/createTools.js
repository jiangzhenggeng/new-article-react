import $ from 'jquery'
import tools from '../../tools'

export function createId() {
	return 'id-' + (new Date().getTime()) + '' + (Math.random() + '').replace('.', '')
}

export function editorAddEventListener(react, editor) {

	editor.addListener("beforepaste", function (type, html) {
		//过滤多余的空标签
		var content = html.html;
		content = content.replace(/<p[^>]*><\/p>/ig, '')
			.replace(/<p[^>]*><br[^>]*\/><\/p>/ig, '')
			.replace(/<p[^>]*><span[^>]*><\/span><\/p>/ig, '')
			.replace(/<p[^>]*><span[^>]*><br[^>]*\/><\/span><\/p>/ig, '')
		html.html = content;
	});

	var checkImageStyleId = createId()
	editor.addListener("afterpaste", function () {
		//检查图片地址合法性
		//如果不合法就加上红色的边框
		if (!$(this.document).find('#' + checkImageStyleId).length) {
			$(this.document).find('head').append('<style id="' + checkImageStyleId + '">.edui-image-not-jiguo-zdm-addr{box-shadow: 0 0 0px 8px red;}</style>');
		}
		$(this.body).find('img[src]').each(function () {
			var src = $(this).attr('src')
			//出去视频图片地址
			if (
				$(this).hasClass('edui-faked-video') ||
				//自己服务器绝对地址
				(src.substr(0, 1) == '/' && src != '//') ||
				//自己服务器相对地址
				(src.substr(0, 8) != 'https://' && src.substr(0, 7) != 'http://')
			) {
				return
			}
			//打上红色边框
			if ($(this).attr('src').indexOf('s1.jiguo.com') === -1) {
				$(this).addClass('edui-image-not-jiguo-zdm-addr');
			}
		});
	});

	var ContentChangeDebounce = tools.debounce(() => {
		editor.sync()
	}, 800)

	editor.addListener("contentChange", function () {
		ContentChangeDebounce()
	})

}

export function editorReady(react, editor) {
	react.props.editorReady(react.editor = editor)
	react.props.content && editor.setContent(react.props.content)
	react['EditorWrap'] = $(react.refs['editor__wrap'])
	react['EditorWrap'].offsetTop = react['EditorWrap'].offset().top
	react['ToolBarWrap'] = react['EditorWrap'].find('.edui-editor-toolbarbox-position:first')
	react['ToolBarBox'] = react['ToolBarWrap'].find('.edui-editor-toolbarbox:first')
	react['ToolBarInner'] = react['ToolBarWrap'].find('.edui-editor-toolbarbox-inner:first')
	editorRefresh(react, editor)
	editorBindScrollFun(react, editor)

	var resizeFn = tools.debounce(() => {
		editorRefresh(react, editor)
	})
	$(window).resize(function () {
		resizeFn()
	})
	react['ToolBarBox'].append('<div class="pullout__fullscreen-tips">ESC可退出全屏编辑模式</div>')
	react['ToolBarFullScreenSattus'] = react['ToolBarBox'].find('.pullout__fullscreen-tips')

	//添加获取内容过滤规则
	addOutputRule(react, editor)
}

export function editorRefresh(react, editor) {
	if (react.state.fullScreen) {
		$('html').addClass('editor-full-screen')
		editor.setHeight($(window).height() - 60)
		react['ToolBarFullScreenSattus'] && setTimeout(() => {
			react['ToolBarFullScreenSattus'].addClass('show')
			setTimeout(() => {
				react['ToolBarFullScreenSattus'].removeClass('show')
			}, 3000)
		}, 1500)
	} else {
		$('html').removeClass('editor-full-screen')
		if (!editorRefresh.first) {
			$(window).scrollTop(react['EditorWrap'].offsetTop)
		}
		editor.setAutoHeight()
		react['ToolBarFullScreenSattus'] &&
		react['ToolBarFullScreenSattus'].removeClass('show')
	}
	delete editorRefresh.first
	editorBindScrollFun(react, editor)
}

editorRefresh.first = true

//浏览器滚动固定导航栏逻辑
export function editorBindScrollFun(react, editor) {
	if (!react['ToolBarBox'] || !react['ToolBarBox'].length) {
		return
	}
	if (react.state.fullScreen) {
		react['EditorWrap'].addClass('full__screen')
		react['ToolBarInner'].css({
			width: react['ToolBarWrap'].width()
		})
		react['ToolBarBox'].css({
			position: 'fixed',
			left: 0,
			top: 0,
			width: '100%'
		})
	} else {
		react['EditorWrap'].removeClass('full__screen')
		var scrollTop = $(window).scrollTop()
		var offset = react['EditorWrap'].offset()
		if (scrollTop >= offset.top) {
			react['ToolBarBox'].css({
				position: 'fixed',
				left: react['ToolBarWrap'].offset().left,
				top: 0,
				width: react['ToolBarInner'].width()
			})
			var posFix = scrollTop - offset.top - react['EditorWrap'].height() + 60
			if (posFix >= 0) {
				react['ToolBarBox'].css({
					top: -(posFix > 60 ? 60 : posFix)
				})
			}
		} else {
			react['ToolBarBox'].removeAttr('style')
		}
	}
}

//hover tool bar text tips
import EditorRoowUp from './icon/editor_roow.svg'
import EditorRoowDown from './icon/editor_roow2.svg'

export function editorBindToolBarTips(react, editor) {
	var EditorToolsTips = $('#' + react.editorId + '-tools-tips')
	var EditorToolsTipsText = EditorToolsTips.find('.editor__tools-tips-text')
	if (EditorToolsTips.length <= 0) {
		$('body').append(`
			<div id="${react.editorId}-tools-tips" class="editor__tools-tips-wrap">
				<div class="editor__tools-tips-text"></div>
				<img class="editor__tools-tips-roow" src="${EditorRoowUp}" />
				<img class="editor__tools-tips-roow editor__tools-tips-roow2" src="${EditorRoowDown}" />
			</div>`
		);
		EditorToolsTips = $('#' + react.editorId + '-tools-tips')
		EditorToolsTipsText = EditorToolsTips.find('.editor__tools-tips-text')
	}

	//hover提示
	react['ToolBarWrap'].on('mouseenter.editor', '.edui-button-body,.edui-arrow', function () {
		var title = $(this).attr('data-title')
		EditorToolsTipsText.html(title);
		var offset = $(this).offset();
		var tips_w = EditorToolsTips.outerWidth()
		var tips_h = EditorToolsTips.outerHeight()
		var scrollTop = $(window).scrollTop()
		EditorToolsTips.hide()
		if (offset.top - 40 <= scrollTop) {
			EditorToolsTips.addClass('editor__tools-arrow-down').css({
				left: offset.left - (tips_w / 2) + 20,
				top: offset.top + tips_h + 18,
			});
		} else {
			EditorToolsTips.removeClass('editor__tools-arrow-down').css({
				left: offset.left - (tips_w / 2) + 20,
				top: offset.top - tips_h - 8,
			});
		}
		EditorToolsTips.stop(true, false).fadeIn(260)

	}).on('mouseleave.editor', '.edui-button-body,.edui-arrow', function () {
		EditorToolsTips.stop(true, false).fadeOut(260)
	});
}

//添加快捷键
export function bindKeyMap(react, editor) {
	editor.addshortcutkey({
		//有序列表
		"insertorderedlist2": "ctrl+shift+55",
		//无序列表
		"insertunorderedlist2": "ctrl+shift+56"
	})
	if (!window.SYATEM.isWindows) {
		editor.addshortcutkey({
			//分隔线
			"horizontal": "ctrl+shift+83"
		})
	}

	//按esc键退出全屏
	$(editor.document).add(window.document).keyup(function (e) {
		if (e.keyCode == 27 && react.state.fullScreen) {
			editor.execCommand('full_screen')
		}
	})
}

export function addOutputRule(react, editor) {

	function rule(root) {
		var tagNameArray = {}
		root.children && root.children.forEach((item) => {
			if (item.children && item.children.length) {
				tagNameArray = {}
				rule(item)
			} else {
				if (!tagNameArray[item.tagName]) {
					tagNameArray[item.tagName] = 0
				}
				tagNameArray[item.tagName] += 1
				if (tagNameArray['img'] > 1) {
					item.attr.multiple = true
				}
			}
		})
	}

	editor.addOutputRule(rule)
}










