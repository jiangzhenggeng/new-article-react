import './style.scss'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

import {
	createId,
	editorReady,
	editorBindScrollFun,
	editorBindToolBarTips,
	editorRefresh,
	editorAddEventListener,
	bindKeyMap
} from './createTools'

class CreateEditor extends Component {

	constructor(props) {
		super(props)
		this.editorId = createId()
		this.state = {
			fullScreen: props.full_screen
		}
	}

	componentWillMount() {

	}

	render() {
		return (
			<div className="editor__wrap" ref="editor__wrap">
				<div className="editor__inner" style={{width: this.props.width}}>
					<textarea name="name" id={this.editorId} style={{height: this.props.height, width: this.props.width}}/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		var react = this
		react.editor = UE.getEditor(react.editorId, {
			onready: function () {
				editorReady(react, this)
				//绑定toolbar提示文字
				editorBindToolBarTips(react, this)
				//添加快捷键
				bindKeyMap(react, this)
			}
		})
		react.editor.fullScreen = this.state.fullScreen
		react.editor.key = this.editorNumberKey()
		react.editor.$emitEvent = (eventType, params) => {
			this.props.triggerClickEvent(eventType, params)
			if (eventType === 'full_screen') {
				var fullScreen = !this.state.fullScreen
				react.editor.fullScreen = fullScreen
				this.setState({
					fullScreen
				}, () => {
					editorRefresh(react, react.editor)
				})
			}
		}

		//绑定滚动事件
		$(window).on('scroll.editor', function () {
			editorBindScrollFun(react, react.editor)
		})

		//编辑器绑定事件
		editorAddEventListener(react, react.editor)

	}

	componentWillUnmount() {
		$(window).off('scroll.editor')
		if (this['ToolBarWrap']) {
			this['ToolBarWrap'].off('mouseenter.editor')
			this['ToolBarWrap'].off('mouseleave.editor')
		}
	}

	editorNumberKey() {
		window.__ueditorNumber__ = (window.__ueditorNumber__ || 0) + 1
		return 'editor-index-' + window.__ueditorNumber__
	}

	setContent(content) {
		this.editor.setContent(content || '')
	}

}

CreateEditor.propTypes = {
	name: PropTypes.string.isRequired,
	content: PropTypes.string,
	height: PropTypes.number,
	width: PropTypes.number,
	full_screen: PropTypes.bool,
	triggerClickEvent: PropTypes.func.isRequired,
	editorReady: PropTypes.func
}
CreateEditor.defaultProps = {
	content: '',
	height: $(window).height() - 60,
	width: 850,
	full_screen: false,
	editorReady: function () {
	}
}

export default CreateEditor



