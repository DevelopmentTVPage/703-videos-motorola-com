import React, {Component} from "react";
import GridItem from "./GridItem";
import "./Grid.scss";
import "../OffsetGrid/OffsetGrid.scss";
import store from "../../store";
import * as actionType from "../../actions";
import Common from "../../utils/common";

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: null,
            currentVideo: props.currentVideo
        };
        store.subscribe(this.storeSubscribe.bind(this));
    }

    componentWillMount() {
        this.setState({
            videos: this.props.videos
        });
    }

    storeSubscribe() {
        const storeState = store.getState();
        if (storeState.event === actionType.LOAD_MORE_VIDEOS) {
            let {videos} = this.state;
            this.setState({
                videos: videos.concat(storeState.load_more_videos)
            });

            
        } else if (storeState.event === actionType.VIDEO_EVENT) {
            if (storeState.video_event !== 'tvp:media:videoended') return;
            let index = 0;
            let {videos, currentVideo} = this.state;

            for (let i = 0; i < videos.length; i++) {
                if (videos[i].id === currentVideo) {
                    if (i === (videos.length - 1))
                        index = 0;
                    else
                        index = ++i;
                }
            }
            let video = videos[index];
            /*### CHECK BEHAVIOR OF ROUTER ###*/
            history.pushState(null, null, Common.getVideoPageUrl(video));
            store.dispatch({
                type: actionType.VIDEO,
                video: video
            });
            // this.cleanNowPlaying();
            // if(index<24){
            //     this.checkNowPlaying();
            // }

        } else if (storeState.event === actionType.VIDEO) {
            this.setState({
                currentVideo: storeState.video.id
            });
        }
    }


    render() {
        let {videos} = this.state;
        videos = Common.rowerize(videos, null, false);
        return (<div className="row">{
            videos.map((el, index) => {
                return (<div className="clearfix" key={index}>{
                    el.map((rowEl, rowIndex) => {
                        return (<GridItem key={rowIndex} itemClassName="col-md-3" item={rowEl}/>)
                    })
                }</div>)
            })
        }
        </div>);
    }
}
