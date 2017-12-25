import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DialogBase from '../dialog-base/dialog-base'
import InsertImageBody from './insert-image-body'


class InsertImage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mode: 1,
			selectedList: []
		}
	}

	show() {
		this.setState({
			inner_visibile: true
		})
	}

	close() {
		this.setState({
			inner_visibile: false
		})
	}

	insertImage(html) {
		this.props.insertHtml(html)
	}

	clickOkInsertImage() {
		var html = this.refs['insert-image-body'].getInsertHtml()
		if (html) {
			this.insertImage(html)
			this.close()
		} else if (this.props.parent.editor) {
			this.props.parent.editor.trigger('showmessage', {
				content: '请选中图片',
				type: 'error',
				timeout: 2000
			});
		}
	}

	render() {
		if (!this.state.inner_visibile) return null

		return (
			<DialogBase
				title="插入多图"
				close={this.close.bind(this)}
				bottom={
					<div className="dialog__bottom-wrap">
						<div className="dialog__insert-type" onClick={() => this.setState({mode: this.state.mode == 1 ? 2 : 1})}>
							{this.state.mode == 1 ? '分段插入' : '连续插入'}
						</div>
						<div className="dialog__bottom gary" onClick={this.close.bind(this)}>关闭</div>
						<div className="dialog__bottom red" onClick={this.clickOkInsertImage.bind(this)}>
							{this.state.selectedList.length ? '插入选中' : '全部插入'}
						</div>
					</div>
				}
			>
				<InsertImageBody
					mode="mode"
					vModel={this.state.selectedList}
					ref="insert-image-body"
					visible={this.state.inner_visibile}
					insertImage={this.insertImage.bind(this)}
				/>
			</DialogBase>
		);
	}

}

InsertImage.propTypes = {
	parent: PropTypes.object.isRequired,
	insertHtml: PropTypes.func.isRequired
}
InsertImage.defaultProps = {}
export default InsertImage






