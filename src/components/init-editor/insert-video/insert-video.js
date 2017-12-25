import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DialogBase from '../dialog-base/dialog-base'
import {convertUrlToFlash, convertUrlToIframe} from './filter-tools'

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

	show() {
		this.setState({
			inner_visibile: true
		})
	}

	close() {
		this.setState({
			inner_visibile: false,
		})
	}

	changeVideoUrl(inner_videoUrl) {
		var notSupport = false
		var flashUrl = convertUrlToFlash(inner_videoUrl)
		var iframeUrl = convertUrlToIframe(inner_videoUrl)
		var status = this.state.status
		if (!flashUrl || !iframeUrl) {
			notSupport = true
			status = 'cansel'
			this.setState({notSupport, flashUrl, iframeUrl, status})
			return
		}
		status = 'check'
		this.setState({
			inner_videoUrl,
			status,
			notSupport,
			flashUrl,
			iframeUrl
		})
		setTimeout(() => {
			status = 'ok'
			this.setState({status})
		}, 3000)
	}

	insertVideo() {
		if (this.state.status == 'ok' || this.state.status == 'check') {
			var html = this.refs['video-wrap-box'].innerHTML
			this.props.insertHtml(html)
			this.close()
			this.setState({
				inner_videoUrl: ''
			})
		} else {

		}
	}

	render() {
		if (!this.state.inner_visibile) return null

		let content
		if (!this.state.inner_videoUrl) {
			content = <div><img src={require('../icon/video_cover.svg')}/></div>
		} else if (this.state.notSupport) {
			content = <span className="previewvideo__msg-tps-text">不支持或地址错误</span>
		} else {
			let style = {
				position: 'relative',
				height: this.state.height,
				width: this.state.width,
				overflow: 'hidden'
			}
			content = <div style={style}>
				<div className="previewvideo__msg">
					<span className="previewvideo__msg-tps-text">正在检测中...</span>
				</div>
				<div className={'previewvideo__video ' + (this.state.mousedown ? 'mousedown' : '')}>
					<iframe
						style={{margin: 'auto', display: 'block'}}
						id={this.state.iframeId}
						name={this.state.iframeId}
						src={this.state.iframeUrl}
						width={this.state.width}
						height={this.state.height}
						frameBorder="none"
						ref="edui-faked-video"
					/>
					<div style={{display: 'none'}} ref="video-wrap-box">
						<p style={{textAlign: 'center'}}>
							<embed
								type="application/x-shockwave-flash"
								className="edui-faked-video"
								pluginspage="http://www.macromedia.com/go/getflashplayer"
								src={this.state.flashUrl}
								width={this.state.width}
								height={this.state.height}
								wmode="transparent"
								play="true"
								loop="false"
								menu="false"
								allowscriptaccess="never"
								allowFullScreen="true"
							/>
						</p>
					</div>
				</div>
			</div>
		}

		return (
			<DialogBase
				onMouseDown={() => this.setState({mousedown: true})}
				onMouseUp={_ => this.setState({mousedown: false})}
				title="插入视频"
				close={this.close.bind(this)}
			>
				<div className="video__wrap">
					<div className="video__input-box">
						<input
							onChange={e => this.changeVideoUrl(e.target.value)}
							defaultValue={this.state.inner_videoUrl}
							placeholder="粘贴视频地址并键入回车，目前支持优酷、腾讯视频、搜狐视频的视频链接"
						/>
					</div>
					<div className="video__body">
						<div className="previewvideo__msg">{content}</div>
					</div>
					<div className="video__footer">
						<div className="video__btn video__cansel" onClick={this.close.bind(this)}>取消</div>
						<div
							id="video__btn-check-wrap"
							className={"video__btn video__" + this.state.status}
							onClick={this.insertVideo.bind(this)}
						>
							<span className="video__btn-text">确认</span>
							<img src={require('../icon/rotation_show.svg')}/>
						</div>
					</div>
				</div>
			</DialogBase>
		);
	}

	componentDidMount() {
		this.state.inner_videoUrl &&
		this.changeVideoUrl(this.state.inner_videoUrl)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.videoUrl != this.state.inner_videoUrl) {
			this.changeVideoUrl(nextProps.videoUrl)
		}
	}

}

InsertVideo.propTypes = {
	videoUrl: PropTypes.string,
	insertHtml: PropTypes.func.isRequired
}
InsertVideo.defaultProps = {
	videoUrl: ''
}
export default InsertVideo






