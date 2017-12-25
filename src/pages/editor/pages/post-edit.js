import React, {Component} from 'react';
import InitEditorIndex from '../../../components/init-editor'

class PagePostEdit extends Component {
	render() {
		return (
			<div className="page">
				<InitEditorIndex
					name="article[message]"
					public-key="ueditorContentBox"
					content={'<p>哈哈哈哈哈<a href="post-edit.js">哈哈哈哈哈哈</a>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</p>'}
				/>
			</div>
		);
	}
}

export default PagePostEdit





