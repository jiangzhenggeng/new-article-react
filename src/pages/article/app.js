
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Editor from '../../components/editor';
import Loading from '../../components/loading/index';

class App extends Component {

	render() {
		return (
			<div className="page">
				<Loading/>
				<Editor/>
			</div>
		);
	}
}

const ConnectApp = connect()(App);

export default ConnectApp;





