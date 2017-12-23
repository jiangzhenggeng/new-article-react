import React, {Component} from 'react';
import {connect} from 'react-redux';
import InitEditorIndex from '../../components/init-editor/index.js'

class App extends Component {
	render() {
		return (
			<div className="page">
				<InitEditorIndex
					name="article[message]"
					public-key="ueditorContentBox"
					content={'哈哈哈'}
				/>
			</div>
		);
	}
}

const ConnectApp = connect()(App);

export default ConnectApp;





