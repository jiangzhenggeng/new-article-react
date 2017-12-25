import './style.less'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import 'antd/lib/tabs/style/index.less'
import Tabs from 'antd/lib/tabs'

import DialogBase from '../dialog-base/dialog-base'
import InsertCardLink from './insert-card-link'

class InsertCard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeName: 'second'
		}
	}

	show() {
		this.setState({
			inner_visibile: true
		})
	}

	close() {
		this.setState({
			inner_visibile: false
		})
	}

	tabsCallBack(key) {
		if (process.env.NODE_ENV !== 'production') {
			console.log(key)
		}
	}

	insertCard() {

	}

	render() {
		if (!this.state.inner_visibile) return null

		return (
			<DialogBase
				title="插入卡片"
				close={this.close.bind(this)}
				className="insert-card"
			>
				<Tabs
					defaultActiveKey={this.state.activeName}
					onChange={this.tabsCallBack.bind(this)}
				>
					<Tabs.TabPane tab="产品库" key="second">
						产品库
					</Tabs.TabPane>
					<Tabs.TabPane tab="优惠券" key="third">
						优惠券
					</Tabs.TabPane>
					<Tabs.TabPane tab="临时卡片" key="fourth">
						<InsertCardLink
							insertTtml={this.insertCard.bind(this)}
							close={this.close.bind(this)}
						/>
					</Tabs.TabPane>
				</Tabs>
			</DialogBase>
		);
	}

}

InsertCard.propTypes = {
	videoUrl: PropTypes.string
}
InsertCard.defaultProps = {
	videoUrl: ''
}
export default InsertCard






