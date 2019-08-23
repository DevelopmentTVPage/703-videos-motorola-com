import React, {Component} from "react";
import "./Filters.scss";
import store from "../../store";
import * as actionType from "../../actions";

export default class Filters extends Component {
    constructor(props) {
        super(props);
        store.subscribe(this.subscribeStore.bind(this));
        this.state = {
            lastElement: null,
            videoCount:null
        };
    }

    subscribeStore(){
        const storeState = store.getState()
        if (storeState.event === actionType.VIDEO_COUNT) {
            this.setState({
                videoCount:storeState.video_count
            });
        }
    }

    bindClick(e) {
        if (!e) return;

        this.setState({
            lastElement: e.currentTarget
        });

        store.dispatch({
            type: actionType.FILTER_CLICK,
            filter_click: e.currentTarget.className
        });

        let {lastElement} = this.state;
        if(lastElement){
            lastElement.classList.toggle('active')
        }else{
            document.getElementsByClassName('grid-filters-recent')[0].classList.remove('active');
        }

        e.currentTarget.classList.toggle('active');

    }

    render() {
        const {videoCount} = this.state;
        return (
            <div className="grid-filters col-md-12">
                <div onClick={this.bindClick.bind(this)} className="grid-filters-recent active">Recent Videos ({videoCount})</div>
                <div onClick={this.bindClick.bind(this)} className="grid-filters-popular">Popular Videos ({videoCount})</div>
                <div onClick={this.bindClick.bind(this)} className="grid-filters-all">All Videos ({videoCount})</div>
            </div>
        );
    }
}