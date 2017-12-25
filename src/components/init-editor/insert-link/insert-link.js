import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DialogBase from '../dialog-base/dialog-base'

class InsertVideo extends Component {
	constructor(props) {
		super(props)
		this.parent = this.props.parent
		this.state = {
			description: '',
			link: 'http://',
			urlSuccess: false
		}
	}

	show() {
		if (this.parent.editor && this.parent.editor) {
			var me = this.parent.editor
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

			this.setState({
				inner_visibile: true
			})
		}
	}

	close() {
		this.setState({
			inner_visibile: false,
			description: '',
			link: 'http://'
		})
	}

	insertLink() {
		if (!this.state.urlSuccess) {
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

	onChangeLink(e) {
		let value = e.target.value
		this.setState({
			link: value,
			urlSuccess: /^https?:\/\/.+/i.test(value)
		})
	}

	render() {
		if (!this.state.inner_visibile) return null

		return (
			<DialogBase
				title="插入链接"
				close={this.close.bind(this)}
				bottom={
					<div className="dialog__bottom-wrap">
						<div className="dialog__bottom gary" onClick={this.close.bind(this)}>关闭</div>
						<div
							className={"dialog__bottom " + (this.state.urlSuccess ? 'red' : 'gary')}
							onClick={this.insertLink.bind(this)}
						>
							插入链接
						</div>
					</div>
				}
				width={400}
			>
				<div className="link__wrap">
					<div className="link__cell">
						<div className="link__sub-title">链接：</div>
						<div className="link__cell-input">
							<input className="input" type="text" onChange={this.onChangeLink.bind(this)}
										 defaultValue={this.state.link}/>
							{
								this.state.link && !this.state.urlSuccess
									? <div className="error-tips">http://或https://开头</div>
									: null
							}
						</div>
					</div>
					<div className="link__cell" style={{display: 'none'}}>
						<div className="link__sub-title">描述：</div>
						<div className="link__cell-input">
							<input
								className="input"
								onChange={event => this.setState({description: event.target.value})}
								type="text"
								defaultValue={this.state.description}
							/>
						</div>
					</div>
				</div>
			</DialogBase>
		);
	}

}

InsertVideo.propTypes = {
	videoUrl: PropTypes.string,
	parent: PropTypes.object.isRequired,
}
InsertVideo.defaultProps = {
	videoUrl: ''
}
export default InsertVideo






