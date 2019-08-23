import React, {Component} from "react";
import {render} from "react-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import FeaturedVideo from "../components/FeaturedVideo/FeaturedVideo";
import Filters from "../components/Filters/Filters";
import OffsetGrid from "../components/OffsetGrid/OffsetGrid";
import "../../sass/components/_document.scss";
import config from "../../../config.json";
import * as actionType from "../actions";
import store from "../store";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openMenu: false
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
        const {homeFeaturedChannelID, mostRecent} = config.params;
        let {openMenu} = this.state;
        return (
            <div className="document-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="z-index-2 col-md-3 padding-0 side-menu">
                            <SideMenu/>
                        </div>
                        <div className="col-md-9 display-full padding-0">
                            <FeaturedVideo videoId={homeFeaturedChannelID}/>
                            <Filters/>
                            <OffsetGrid channelId={mostRecent}/>
                        </div>
                    </div>
                </div>
                <div className={"side-menu-overlay " + (openMenu ? "open-menu":"")}></div>
            </div>
        );
    }
}

render(<Home/>, document.getElementById("app-container"));