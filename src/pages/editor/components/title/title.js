import React, {Component} from 'react';
import dialog from './toast/dialog';

class Title extends Component {

	constructor(props) {
		super(props);
		var title = window.__BLOG_DATA__.title || '';
		this.state = {
			title: title,
			fontNumber: title.length,
			line: 1
		};

	}

	validation(_val,scroll) {
		if (_val && !this.state.title) {
			dialog.toast('请填写标题');
			if (scroll!='not' && this.content__title) {
				$('html,body').animate({
					scrollTop: $(this.content__title).offset().top - 70
				});
			}
			return false;
		}
		return {
			title: this.state.title || ''
		};
	}

	chkstrlen(str) {
		var strlen = 0;
		var len = 0;
		for (var i = 0; i < str.length; i++) {
			// if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
			// 	strlen++;
			// else
			// 	strlen += 0.5;
			// if( Math.ceil(strlen)<30 ){
			// 	len++;
			// }
		}
		return str.length;
	}

	render() {
		return (
			<div className="content__title" ref={o => this.content__title = o}>
				<div className="content__title-box">
		  <textarea
				className={"content__title-textarea line" + this.state.line}
				onChange={e => {
					var text = e.target.value;
					var fontNumber = this.chkstrlen(text);

					if (fontNumber > 30) {
						text = text.substr(0, 30);
					}
					$(this.testLen).html(text);
					var textLen = $(this.testLen).width();
					this.setState({
						title: text,
						fontNumber: fontNumber > 30 ? 30 : fontNumber,
						length: textLen
					});
					if (textLen > this.state.textareaLen) {
						this.setState({
							line: 2
						});
					}
					this.timer && clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						this.props.parent.autoSave();
					}, 500);
				}}
				value={this.state.title}
				placeholder="文章标题"
				style={{color: '#333', fontSize: 32}}
				name="title"
				autoComplete="off"
				ref={o => this.textarea = o}
			/>
					<div ref={o => this.testLen = o} style={{position: 'fixed', left: -999999, fontSize: '32px'}}></div>
				</div>
				<div style={{color: '#CCC', fontSize: 12}}>
					<span>测评文章的标题需包含测评对象的品牌型号等信息</span>
					<span className="ml10">{this.state.fontNumber} / 30 字</span>
				</div>
			</div>
		);
	}

	componentDidMount() {
		$(this.testLen).html(this.state.title);
		var textLen = $(this.testLen).width();

		var state = {
			length: textLen,
			textareaLen: $(this.textarea).width(),
		};

		if (textLen > state.textareaLen) {
			state.line = 2;
		}
		this.setState(state);

	}
}

export default Title;








