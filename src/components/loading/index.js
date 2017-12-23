


import './_loading.less';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import loadingImg from '../../style/images/page_loading.svg';

class Loading extends Component {
	render() {
		return this.props.show !== false ? (
			<div className="page-loading">
				<img className="page-loading-img" src={loadingImg}/>
			</div>
		) : <div/>;
	}
}

const ConnectLoading = connect(state => {
	return {
		show: state.pageloading.show
	}
})(Loading);

export default ConnectLoading;