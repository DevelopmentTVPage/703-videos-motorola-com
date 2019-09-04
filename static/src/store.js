import {createStore} from 'redux';
import * as actionType from "./actions";

const reducer = (state, action) => {
    switch (action.type) {
        case actionType.VIDEO_COUNT:
            return {...state, event: actionType.VIDEO_COUNT,video_count:action.video_count};
            break;
        case actionType.FILTER_CLICK:
            return {...state, event: actionType.FILTER_CLICK,filter_click:action.filter_click};
            break;
        case actionType.IS_MOBILE:
            return {...state, event: actionType.IS_MOBILE, is_mobile:action.is_mobile};
            break;
        case actionType.MENU_CLICK:
            return {...state, event: actionType.MENU_CLICK, menu_click:action.menu_click};
            break;
        case actionType.VIDEO:
            return {...state, event: actionType.VIDEO, video: action.video};
            break;
        case actionType.LOAD_MORE_VIDEOS:
            return {...state, event: actionType.LOAD_MORE_VIDEOS, load_more_videos: action.load_more_videos};
            break;
        case actionType.VIDEO_EVENT:
            return {...state, event: actionType.VIDEO_EVENT, video_event: action.video_event};
            break;
        default:
            return state;
            break;
    }
};

export default createStore(reducer, {
    video: [],
    video_event: "initial",
    event: '',
    load_more_videos: [],
    is_mobile: false,
    filter_click:'',
    menu_click:false
});