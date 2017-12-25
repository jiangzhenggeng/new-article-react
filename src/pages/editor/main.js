import 'core-js/es6/map'
import 'core-js/es6/set'
import 'raf/polyfill'

import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './app'

ReactDom.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>,
	document.getElementById('app')
);






