import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CreateEditor from '../create-editor'

import InertVideo from './insert-video/insert-video'
import InertImage from './insert-image/insert-image'
import InertCard from './insert-card/insert-card'
import InertLink from './insert-link/insert-link'

class InitEditorIndex extends Component {
	constructor(props) {
		super(props)

		this.toolbars = window.UEDITOR_CONFIG.toolbars
		this.editorReady = this.editorReady.bind(this)
		this.triggerClickEvent = this.triggerClickEvent.bind(this)
		this.InsertHtml = this.InsertHtml.bind(this)

	}

	render() {
		return (
			<div className="editor__wrap">
				<CreateEditor
					editorReady={this.editorReady}
					content={this.props.content}
					name={this.props.name}
					triggerClickEvent={this.triggerClickEvent}
				/>
				{
					this.filtersToolbars('insert_video')
						? <InertVideo ref="insert_video" parent={this} insertHtml={this.InsertHtml.bind(this)}/>
						: null
				}
				{
					this.filtersToolbars('insert_image')
						? <InertImage ref="insert_image" parent={this} insertHtml={this.InsertHtml.bind(this)}/>
						: null
				}
				{
					this.filtersToolbars('insert_card')
						? <InertCard ref="insert_card" parent={this} insertHtml={this.InsertHtml.bind(this)}/>
						: null
				}
				{
					this.filtersToolbars('new_link')
						? <InertLink ref="new_link" parent={this} insertHtml={this.InsertHtml.bind(this)}/>
						: null
				}
			</div>
		);
	}

	editorReady(editor) {
		this.editor = window[this.props.publicKey] = editor
		//获取产品卡片数量，并在页面上显示相应信息
		this.editor.addListener("contentChange", function () {

		})
	}

	triggerClickEvent(eventType) {
		this.refs[eventType] && this.refs[eventType].show &&
		this.refs[eventType].show()
	}

	InsertHtml(html, callBack) {
		if (typeof callBack == 'function') {
			if (callBack(this.editor)) {
				this.editor.execCommand('inserthtml', html)
			}
		} else {
			this.editor.execCommand('inserthtml', html)
		}
	}

	filtersToolbars(tool, toolbars) {
		var result = false
		;(toolbars || this.toolbars).forEach((item) => {
			if (item instanceof Array) {
				result = this.filtersToolbars(tool, item)
			} else if (item == tool) {
				result = true
			}
		})
		return result
	}
}

InitEditorIndex.propTypes = {
	name: PropTypes.string.isRequired,
	content: PropTypes.string,
	publicKey: PropTypes.string
}
InitEditorIndex.defaultProps = {
	content: '',
	publicKey: 'id' + String(Math.random()).replace('.', '')
}

export default InitEditorIndex