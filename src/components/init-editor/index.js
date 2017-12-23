import './style.less'
import React, {Component} from 'react';
import CreateEditor from '../create-editor/index'
import InertVideo from './insert-video/insert-video'
// import InertImage from './components/insert-image.vue'
// import InertCard from './components/insert-card.vue'
// import InertLink from './components/insert-link.vue'

class InitEditorIndex extends Component {
	constructor(props) {
		super(props)

		this.state = {
			InsertVideoVisibile: false,
			InsertImageVisibile: false,
			InsertCardVisibile: false,
			InsertLinkVisibile: false,
			toolbars: window.UEDITOR_CONFIG.toolbars
		}

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
						? <InertVideo
							insertHtml={this.InsertHtml}
							visibile={this.state.InsertVideoVisibile}
						/>
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
		switch (eventType) {
			case 'insert_video': {
				this.setState({
					InsertVideoVisibile: true
				})
				break
			}
			case 'insert_image': {
				this.setState({
					InsertImageVisibile: true
				})
				break
			}
			case 'insert_card': {
				this.setState({
					InsertCardVisibile: true
				})
				//this.$refs['inert-card'].init()
				break
			}
			case 'new_link': {
				this.setState({
					InsertVideoVisibile: true
				})
				break
			}
		}
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
		;(toolbars || this.state.toolbars).forEach((item) => {
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
	name: React.PropTypes.string.isRequired,
	content: React.PropTypes.string,
	publicKey: React.PropTypes.string
}
InitEditorIndex.defaultProps = {
	content: '',
	publicKey: 'id' + String(Math.random()).replace('.', '')
}

export default InitEditorIndex