import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

class InsertImageBody extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inner_visibile: this.props.visible
		}
	}

	render() {
		if (!this.state.inner_visibile) return null

		return (
			<div>图片上传</div>
		);
	}

}

InsertImageBody.propTypes = {
	visible: PropTypes.bool.isRequired
}
InsertImageBody.defaultProps = {}
export default InsertImageBody






