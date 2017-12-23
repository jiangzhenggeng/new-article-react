
import * as types from '../action/types';

function loading( state = { show: true }, action ) {
  switch (action.type) {
	case types.PAGE_LOADING_QUERY:
	  return { show: action.show }
	default:
	  return state
  }
}


export default loading;