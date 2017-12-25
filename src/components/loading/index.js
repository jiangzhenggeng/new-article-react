import './_loading.less';

import React, {Component} from 'react';
import loadingImg from './page_loading.svg';

class Loading extends Component {
	render() {
		return
		this.props.show !== false
			? <div className="page-loading">
				<img className="page-loading-img" src={loadingImg}/>
			</div>
			: null
	}
}

export default Loading;