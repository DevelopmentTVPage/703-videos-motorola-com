import React, {Component} from "react";
import "./OffsetGrid.scss";
import config from "../../../../config.json";
import Api from "../../utils/api_calls";
import Common from "../../utils/common";
import Grid from '../Grid/Grid';
import GridItem from '../Grid/GridItem';
import store from "../../store";
import * as actionType from "../../actions";

export default class OffsetGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: null,
            loadMoreVideos: null,
            page: 0,
            loading: false,
            hasVideos: false,
            lastPage: false
        };
        store.subscribe(this.subscribeStore.bind(this));
    }

    subscribeStore() {
        const that = this,
            storeState = store.getState();

        if (storeState.event === actionType.FILTER_CLICK) {
            const {mostRecent, mostPopular, allContent} = config.params;
            let id = allContent;

            if (storeState.filter_click.indexOf("grid-filters-popular") !== -1) {
                id = mostPopular;
            } else if (storeState.filter_click.indexOf("grid-filters-recent") !== -1) {
                id = mostRecent;
            }

            this.setState({
                videos: null,
                loadMoreVideos: null,
                page: 0,
                loading: false,
                hasVideos: false,
                lastPage: false
            });

            Api.videos(id, this.page, null, 17).then((res) => {
                if (res && res.length) {
                    that.setState({
                        videos: res,
                        hasVideos: true,
                        lastPage: res.length < 17
                    });
                } else {
                    that.setState({
                        hasVideos: false,
                        lastPage: true
                    });
                }
            });
        }
    }

    componentWillMount() {
        const that = this,
            {channelId} = this.props;
        Api.videos(channelId, this.page, null, 17).then((res) => {
            if (res && res.length) {
                that.setState({
                    videos: res,
                    hasVideos: true,
                    lastPage: res.length < 17
                });
                store.dispatch({
                    type: actionType.VIDEO_COUNT,
                    video_count: res.length
                });
            } else {
                that.setState({
                    hasVideos: false,
                    lastPage: true
                });
            }
        });
    }

    loadMore() {
        const that = this;

        let {loading, page} = this.state;

        const {mostRecent} = config.params;

        if (loading)
            return;

        that.setState({
            loading: true
        });

        Api.videos(mostRecent, ++page, null, 16).done((data) => {
            let newState = {};
            if (!data.length)
                newState = {
                    loading: false,
                    hasVideos: page !== 0,
                    lastPage: true
                };
            else {
                data.forEach((item) => {
                    item.date_created = Common.getDateFromUnix(item.date_created);
                });
                newState = {
                    loadMoreVideos: data,
                    loading: false,
                    hasVideos: true,
                    lastPage: data.length <= 16
                };
            }
            that.setState(newState);
            console.log(that.state);
        });
    }

    mapGrid(row, index) {
        return (
            <div key={index} className={(index === 1 ? "offset" : "") + " row"}>
                <div className="clearfix">{
                    (index === 1) ?
                        row.map((rowEl, rowIndex) => {
                            if (rowIndex === 0) {
                                return (
                                    <GridItem offset key={rowIndex} itemClassName="col-md-6 offset-item" item={rowEl}/>)
                            } else {
                                return (<div key={rowIndex} className="row col-md-6">
                                    <div>{
                                        row[1].map((nestedEl, nestedIndex) => {
                                            return (
                                                <GridItem itemClassName="col-md-6" key={nestedIndex} item={nestedEl}/>)
                                        })
                                    }</div>
                                </div>)
                            }
                        })
                        :
                        row.map((rowEl, rowIndex) => {
                            return (<GridItem key={rowIndex} itemClassName="col-md-3" item={rowEl}/>)
                        })
                }</div>
            </div>
        )
    }

    render() {
        const {videos, loading, hasVideos, loadMoreVideos, lastPage} = this.state;
        let rowerizedVids = null;
        if (videos) {
            rowerizedVids = Common.rowerize(videos, null, true);
        }
        return (<div className="offset-grid-container container-fluid padding-30">
            {rowerizedVids ?
                rowerizedVids.map(this.mapGrid.bind(this))
                :
                <h3 className="text-center col-md-12">LOADING...</h3>
            }
            {loadMoreVideos && <Grid videos={loadMoreVideos}/>}
            {(hasVideos && !lastPage) &&
            <button disabled={lastPage} className={(!lastPage ? "enabled" : "disabled") + " tvp-loadMore-btn"}
                    onClick={this.loadMore.bind(this)}>{loading ? "Loading..." : "View More"}</button>
            }
        </div>);
    }
}