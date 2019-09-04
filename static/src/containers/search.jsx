import React, {Component} from "react";
import {render} from "react-dom";
import config from "../../../config.json";

import "../../sass/components/_document.scss";

import SideMenu from "../components/SideMenu/SideMenu";
import Footer from "../components/Footer/Footer";
import Grid from "../components/Grid/Grid";
import Filters from "../components/Filters/Filters";

import Api from "../utils/api_calls";
import Common from "../utils/common";
import store from "../store";
import * as actionType from "../actions";

class Search extends Component {
    constructor() {
        super();
        this.state = {
            relatedVideos: null,
            searchTerm: "",
            page: 0,
            loaded: false,
            loading: false,
            hasVideos: false,
            lastPage: false
        };
        this.loadVideos = this.loadVideos.bind(this);
        store.subscribe(this.subscribeStore.bind(this));
    }

    componentWillMount() {
        let o = {};
        if (window.location && location.hasOwnProperty('search')) {
            const kv = location.search.substr(1).split('&'), params = [];
            for (let i = 0; i < kv.length; i++) {
                params.push(kv[i]);
            }
            for (let j = 0; j < params.length; j++) {
                const param = params[j].split('=');
                o[param[0]] = decodeURIComponent(param[1]);
            }
        }
        if (o.hasOwnProperty("s")) {
            const query = o.s;
            this.setState({
                searchTerm: query
            });
            this.loadVideos(query);
        }
    }

    subscribeStore() {
        const storeState = store.getState();
        if (storeState.event === actionType.FILTER_CLICK) {
            const {mostRecent,mostPopular,allContent} = config.params;
            let id = allContent;

            if (storeState.filter_click.indexOf("grid-filters-popular") !== -1 ) {
                id = mostPopular;
            } else if (storeState.filter_click.indexOf("grid-filters-recent") !== -1 ) {
                id = mostRecent;
            }
            console.log(id);
        }
    }

    loadVideos(query) {
        const that = this;
        let {page} = this.state;
        this.setState({
            loading: true
        });
        Api.suggestResults(page++, query, 8).done((data) => {
            let newState = {};
            if (data && data.result.length) {
                newState = {
                    relatedVideos: data.result
                };
            }
            newState.loaded = true;
            newState.loading = false;
            that.setState(newState);
        });
    }

    handleChange(e) {
        this.setState({
            inputVal: e.target.value
        });
    }

    handleClickEnter(e) {
        const {inputVal} = this.state;
        if (e.key === 'Enter') {
            if (inputVal)
                window.location.href = TVSite.baseUrl + "/search/?s=" + inputVal;
        }
    }

    render() {
        const {relatedVideos, searchTerm, loaded} = this.state;
        return (
            <div className="document-body search-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="clearfix main-content-container">
                            <div className="z-index-2 col-md-3 padding-0 side-menu">
                                <SideMenu />
                            </div>
                            <div className="col-md-9 display-full padding-0 content">
                                {loaded &&
                                <div className="col-md-8 results-for">
                                    {(relatedVideos && relatedVideos.length) ?
                                        <div>
                                            <span>showing results for</span>
                                            <input onKeyDown={this.handleClickEnter.bind(this)} placeholder={"`" + searchTerm + "`"}
                                                   onChange={(e) => {
                                                       this.handleChange(e)
                                                   }} type="text"/>
                                        </div>
                                        :
                                        <div>no results for : {searchTerm}</div>
                                    }
                                </div>
                                }
                                {relatedVideos &&
                                <div className="col-md-12">
                                    {
                                        <Grid videos={Common.rowerize(relatedVideos, null, false)}/>
                                    }
                                </div>
                                }
                            </div>
                        </div>
                        <div className="padding-0 z-index-2 col-md-12 footer-container">
                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

render(<Search/>, document.getElementById("tvp-video-gallery"));