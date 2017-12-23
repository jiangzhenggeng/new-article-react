import React, {Component} from 'react';

class HasChange extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: false
		};

	}

	render() {
		if (!window.__BLOG_DATA__.describe) {
			return null;
		}

		return (
			<div
				className="change__wrap"
				ref={o => this.box = o}
				onMouseEnter={this.onMouseEnter.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
			>
				<div className="change__left">
					<img src={require('./uicomponent/icon/gantanhao.svg')}/>
					<div className="change__left-title">修改建议</div>
				</div>
				<div ref={o=>this.change__body=o} className={"change__body " + (this.state.show ? 'show' : '')}>
					<div className="change__body-inner">
						<div className="change__body-title">修改建议</div>
						<div className="change__body-desc">{(window.__BLOG_DATA__.describe||'').replace('\n','<br>')}</div>
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		if (!this.box) return;
		var box = $(this.box);
		var content__left = $('.content__left');
		var offset = content__left.offset();
		box.css({
			left: offset.left - box.width(),
			top: 120
		});
	}

	onMouseEnter() {
		$(this.change__body).fadeIn(()=>{
			this.setState({
				show: true
			});
		});
		this.timer && clearTimeout(this.timer);
	}

	onMouseLeave() {
		this.timer = setTimeout(() => {
			$(this.change__body).fadeOut(()=>{
				this.setState({
					show: false
				});
			})
		}, 1000);
	}

}

export default HasChange;








