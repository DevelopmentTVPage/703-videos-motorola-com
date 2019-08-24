import React, {Component} from "react";
import {render} from "react-dom";
import "../../sass/components/_document.scss";
import Grid from "../components/Grid/Grid";
import GridType from "../components/GridType/GridType";
import config from "../../../config.json";
import Dotdotdot from "react-dotdotdot";
import Player from "../components/Player/Player";
import "../components/Player/Player.scss";
import Products from "../components/Products/Products";
import SideMenu from "../components/SideMenu/SideMenu";
import Socials from "../components/Socials/Socials";
import Api from "../utils/api_calls";
import Common from "../utils/common";
import ClampLines from '../libs/react-clamp-lines';

import store from "../store";
import * as actionType from "../actions";
import scrollToComponent from "react-scroll-to-component";

const {video} = TVSite.channelVideosData;
const {products} = TVSiteFilter;

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: null,
            page: 0,
            query: null,
            skuVideos: null,
            typeVideos: null,
            hasProducts: true,
            isMobile: Common.isMobile,
            lastPage: false,
            loading: false,
            openMenu: false,
            currentVideo:video
        };
        this.loadProducts = this.loadProducts.bind(this);
        this.loadSkuVideos = this.loadSkuVideos.bind(this);
        this.loadTypeVideos = this.loadTypeVideos.bind(this);
        this.resizeHandler = this.resizeHandler.bind(this);
        this.storeSubscribe = this.storeSubscribe.bind(this);
        store.subscribe(this.storeSubscribe);
    }

    storeSubscribe() {
        const storeState = store.getState();

        if (storeState.event === actionType.MENU_CLICK) {
            this.setState({
                openMenu: storeState.menu_click
            });
        } else if (storeState.event === actionType.IS_MOBILE) {
            if (!storeState.is_mobile) {
                this.setState({
                    openMenu: false
                });
            }
        }else if (storeState.event === actionType.VIDEO) {
            this.setState({
                currentVideo: storeState.video
            });
            this.loadProducts(storeState.video.id);
        }
    }

    resizeHandler() {
        this.setState({isMobile: window.innerWidth < 992});
        store.dispatch({
            type: actionType.IS_MOBILE,
            is_mobile: window.innerWidth < 992
        });
    }

    componentWillMount() {
        this.resizeHandler();
        this.loadSkuVideos(211985845);
        this.loadTypeVideos(211985846);
        this.loadProducts(video.id);
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeHandler);
        store.unsubscribe(this.storeSubscribe);
    }

    loadProducts(videoId) {
        const that = this;

        that.setState({
            loading: true
        });

        Api.products(videoId).done(function(data) {
            let newState = {};
            if (!data.length) {
                newState = {
                    loading: false,
                    hasProducts: false,
                    products: []
                };
            }
            else {
                newState = {
                    loading: false,
                    query: data[0].brand,
                    products: data,
                    hasProducts: true,
                    lastPage: data.length <= 16
                };
            }
            that.setState(newState);
        });
    }

    loadSkuVideos(id) {
        const that = this;
        let {page} = this.state, query = null;

        if (TVSiteFilter && TVSiteFilter.referenceId !== undefined) {
            query = TVSiteFilter.referenceId;
        }
        else {
            query =  TVSiteFilter.defaultFilter;
            id = 211985850;
        }

        Api.videos(id, page, query, 8).done((data) => {
            if (data && data.length) {
                that.setState({
                    skuVideos: data
                });
            }
        });
    }

    loadTypeVideos(id) {
        const that = this;
        let {page} = this.state,
            query = TVSiteFilter.tvp_category !== undefined && TVSiteFilter.tvp_category.length ? TVSiteFilter.tvp_category.join() : TVSiteFilter.defaultFilter;
        
        Api.videos(id, page++, query, 8).done((data) => {
            if (data && data.length) {
                that.setState({
                    typeVideos: data
                });
            }
        });
    }

    loadMore() {
        const that = this, {mostRecent} = config.params;

        let {loading, page, query} = this.state;

        if (loading)
            return;

        that.setState({
            loading: true
        });

        Api.videos(mostRecent, ++page, query, 8).done((data) => {
            store.dispatch({
                type: actionType.LOAD_MORE_VIDEOS,
                load_more_videos: Common.rowerize(data, null, false)
            });
            that.setState({
                loading: false,
                page: page++,
                lastPage: data.length < 8
            });
        });
    }

    render() {
        let {products,currentVideo, loading, hasProducts, isMobile, skuVideos, lastPage, openMenu, typeVideos} = this.state;
        let playerClass = hasProducts ? "col-md-8" : "col-md-12";
        return (
            <div className="document-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 padding-0 z-index-2 side-menu video">
                            <SideMenu compact/>
                            {(currentVideo && !isMobile) &&
                            <h1 className="tvp-player-video-title col-xs-12 col-md-12">
                                Now Playing
                                <Dotdotdot clamp={2}>
                                    {currentVideo && <span className="tvp-player-video-title-text">{currentVideo.title}</span>}
                                </Dotdotdot>
                            </h1>
                            }
                        </div>
                        <div className="col-md-12 site-content" style={{top: "55px"}}>
                            <div className="container color-gradient">
                                <div className={"row " + (hasProducts ? "products" : "no-products")}>
                                    {video &&
                                    <Player playerClassName={playerClass} video={video}/>
                                    }
                                    {(currentVideo && isMobile) &&
                                    <div className="tvp-player-metadata col-md-12">
                                        <div className="col-md-12">
                                            <span className="tvp-video-item-meta-author">
                                                {currentVideo.asset.author || "Motorola"}
                                            </span>
                                            <span>|</span>
                                            <span className="tvp-video-item-meta-date">
                                                {Common.getPostedDate(currentVideo.date_created)}
                                            </span>
                                        </div>
                                        <ClampLines className="tvp-video-description col-md-12"
                                                    lines={2}
                                                    ellipsis="..."
                                                    buttons={false}
                                                    id="tvp-video-description"
                                                    text={Common.linkify(currentVideo.description || '')}/>
                                    </div>
                                    }
                                    {(hasProducts && (products && products.length)) ?
                                        <Products products={products}/> : null
                                    }
                                    {(!loading && currentVideo) &&
                                    <Socials hasProducts={hasProducts} video={currentVideo}/>
                                    }
                                    {typeVideos &&
                                    <div className="col-md-12 grid-videos padding-20">
                                        {(products && products.length) ?
                                            <span>{products[0].title} videos ({typeVideos.length})</span> :
                                            null
                                        }
                                        {
                                            <GridType videos={Common.rowerize(typeVideos, 3, false)}/>
                                        }
                                    </div>
                                    }
                                    {skuVideos &&
                                    <div className="col-md-12 grid-videos padding-20">
                                        <span>Related Videos</span>
                                        {
                                            <Grid videos={skuVideos} currentVideo={parseInt(video.id)}/>
                                        }
                                    </div>
                                    }
                                    <div className="col-md-12">
                                        {!lastPage &&
                                        <button disabled={lastPage}
                                                className={(!lastPage ? "enabled" : "disabled") + " tvp-loadMore-btn"}
                                                onClick={this.loadMore.bind(this)}>{loading ? "Loading..." : "View More"}</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"side-menu-overlay " + (openMenu ? "open-menu" : "")}></div>
            </div>
        );
    }
}

render(<Video/>, document.getElementById("app-container"));