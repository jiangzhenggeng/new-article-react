import './style.less'
import React, {Component} from 'react'

class InsertVideo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inner_videoUrl: this.props.videoUrl,
			notSupport: false,
			status: 'cansel',
			flashUrl: '',
			iframeUrl: '',
			window: window,
			width: 640,
			height: 350,
			iframeId: String('id' + Math.random()).replace('.', ''),
			mousedown: false
		}
	}

	render() {

	}

}

InsertVideo.propTypes = {
	videoUrl: React.PropTypes.string
}
InsertVideo.defaultProps = {
	videoUrl: ''
}
export default InsertVideo






