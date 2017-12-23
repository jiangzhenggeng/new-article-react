
import * as types from './types';

export function page_loading_query( show = true ){
  return {
	type: types.PAGE_LOADING_QUERY,
	show:show
  }
}

