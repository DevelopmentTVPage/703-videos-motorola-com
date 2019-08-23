import { createStore } from 'redux';
import * as actionType from "./actions";

const reducer = (state, action) => {
	switch(action.type){
		case actionType.VIDEO:
			return {...state, event: actionType.VIDEO, video: action.video};
		break;
		case actionType.VIDEO_EVENT:
			return {...state, event: actionType.VIDEO_EVENT, video_event: action.video_event};
		break;
		case actionType.FILTERED:
			return {...state, event: actionType.FILTERED};
		break;
		case actionType.SCROLL:
			return {...state, event: actionType.SCROLL};
		break;
		case actionType.CURRENT_VIDEO:
			return {...state, event: actionType.CURRENT_VIDEO};
		break;
		case actionType.CLOSE_MODAL:
			return {...state, event: actionType.CLOSE_MODAL};
		break;
		default:
			return state;
		break;
	}
};

export default createStore(reducer,{ video:[], video_event: "initial", event: '' });