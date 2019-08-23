import React, {Component} from "react";
import GridItem from "./GridItem";
import "./Grid.scss";
import "../OffsetGrid/OffsetGrid.scss";
import store from "../../store";
import * as actionType from "../../actions";

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: null
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
        }
    }


    render() {
        let {videos} = this.state;
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
