import React, {Component} from "react";
import {render} from "react-dom";
import "../../sass/components/_document.scss";
import FeaturedVideo from "../components/FeaturedVideo/FeaturedVideo";
import OffsetGrid from "../components/OffsetGrid/OffsetGrid";
import Filters from "../components/Filters/Filters";
import SideMenu from "../components/SideMenu/SideMenu";
import Common from "../utils/common";
import config from "../../../config.json";

import store from "../store";
import * as actionType from "../actions";
import Footer from "../components/Footer/Footer";

class Channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCategory: Common.activeCategory(config.menu),
            openMenu:false
        };
        this.resizeHandler = this.resizeHandler.bind(this);
        store.subscribe(this.storeSubscribe.bind(this));
    }

    storeSubscribe() {
        const storeState = store.getState();

        if (storeState.event === actionType.MENU_CLICK) {
            this.setState({
                openMenu: storeState.menu_click
            });
        }else if(storeState.event === actionType.IS_MOBILE){
            if(!storeState.is_mobile){
                this.setState({
                    openMenu: false
                });
            }
        }
    }

    resizeHandler() {
        store.dispatch({
            type: actionType.IS_MOBILE,
            is_mobile: window.innerWidth <= 992
        });
    }

    componentWillMount() {
        this.resizeHandler();
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeHandler);
        store.unsubscribe(this.storeSubscribe);
    }

    render() {
        let {activeCategory, openMenu} = this.state;
        return (
            <div className="document-body channel">
                <div className="container-fluid">
                    <div className="row">
                        <div className="clearfix main-content-container">
                            <div className="z-index-2 col-md-3 padding-0 side-menu">
                                <SideMenu active={activeCategory}/>
                            </div>
                            <div className="col-md-9 display-full padding-0 content">
                                <div className="current-category">
                                    <p>Category</p>
                                    {activeCategory &&
                                    <div>{activeCategory.label}</div>
                                    }
                                </div>
                                <FeaturedVideo videoId={activeCategory.id}/>
                                <Filters/>
                                <OffsetGrid channelId={activeCategory.id}/>
                            </div>
                        </div>
                        <div className="z-index-2 padding-0 col-md-12 footer-container">
                            <Footer/>
                        </div>
                    </div>
                </div>
                <div className={"side-menu-overlay " + (openMenu ? "open-menu" : "")}></div>
            </div>
        );
    }
}

render(<Channel/>, document.getElementById("app-container"));