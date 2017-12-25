import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

class DialogBase extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	close() {
		this.props.close()
	}

	onMouseDown(e) {
		this.props.onMouseDown(e)
		this.MousedownFlage = true
		var offset = $(this.refs['model__wrap']).offset()
		this.posX = e.clientX - parseInt(offset.left) + $(window).scrollLeft()
		this.posY = e.clientY - parseInt(offset.top) + $(window).scrollTop()
	}

	onMouseMove(e) {
		if (this.MousedownFlage) {
			this.props.onMouseMove(e)
			var left = e.clientX - this.posX
			var top = e.clientY - this.posY
			$(this.refs['model__wrap']).css({
				left: left <= 0 ? 0 : (left >= this.windowW - 100 ? this.windowW - 100 : left),
				top: top <= 0 ? 0 : (top >= this.windowH - 100 ? this.windowH - 100 : top)
			})
		}
	}

	onMouseUp(e) {
		this.onMouseMove(e)
		this.MousedownFlage = false
		this.props.onMouseUp(e)
	}

	render() {
		return (
			<div
				className={"model__wrap " + (this.props.animate ? 'window__modal-enter-active' : '') + ' ' + this.props.className}
				style={{...this.props.style}}
				ref="model__wrap"
			>
				<div className="model__table">
					<div className="model__td">
						<div className="model__inner">
							<div className="model__content" style={{width: this.props.width}}>
								<div className="model__header" onMouseDown={this.onMouseDown.bind(this)}>
									<div className="model__title">{this.props.title}</div>
									<div className="model__close" onClick={this.close.bind(this)}>×</div>
								</div>
								<div className="model__body">
									{this.props.children}
								</div>
								<div className="model__footer">
									{this.props.bottom ? this.props.bottom : ''}
								</div>
							</div>
						</div>
						<div className="model__mask" onClick={this.close.bind(this)}></div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		var react = this
		react.windowW = $(window).width()
		react.windowH = $(window).height()
		$(document).on('mousemove.dialogbase', function (e) {
			react.onMouseMove(e)
		}).on('mouseup.dialogbase', function (e) {
			react.onMouseUp(e)
		})

		$(this.refs['model__wrap']).css({
			left: react.windowW / 2 - $(react.refs['model__wrap']).width() / 2
		})

	}

	componentWillUnmount() {
		$(document).off('mouseup.dialogbase').off('mousemove.dialogbase')
	}

}

DialogBase.propTypes = {
	title: PropTypes.string,
	width: PropTypes.number,
	childMouseDown: PropTypes.func,
	childMouseUp: PropTypes.func,
	childMouseMove: PropTypes.func,
	close: PropTypes.func,
	animate: PropTypes.bool
}
var loop = function () {
}
DialogBase.defaultProps = {
	title: '我是标题',
	width: 660,
	onMouseDown: loop,
	onMouseUp: loop,
	onMouseMove: loop,
	close: loop,
	animate: true
}
export default DialogBase



