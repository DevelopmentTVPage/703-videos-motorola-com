import React, {Component} from "react";
import "./SideMenu.scss";
import SearchBar from "../SearchBar/SearchBar";
import MenuList from "../MenuList/MenuList";
import Common from "../../utils/common";
import store from "../../store";
import $ from 'jquery';

const {isVideoPage} = TVSite;

export default class SideMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: Common.isMobile
        };

        store.subscribe(this.storeSubscribe.bind(this));
        this.handleScroll = this.handleScroll.bind(this);
    }

    storeSubscribe() {
        const storeState = store.getState();
        this.setState({
            isMobile: storeState.is_mobile
        });
    }

    componentDidMount() {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!isVideoPage && !this.state.isMobile && isSafari)
            this.handleScroll();
    }

    handleScroll() {
        const sideMenu = $('.side-menu');
        $(window).scroll(() => {
            if (sideMenu) 
                sideMenu.hide().show(0);
        });

    }

    render() {
        const {compact, searchPage, searchTerm} = this.props;
        const {isMobile} = this.state;

        return (<div className={(compact ? "compact" : "") + " side-menu-container"}>
            <div className="side-menu-wrapper">
                <SearchBar searchTerm={searchTerm} searchPage={searchPage}/>
                {(!compact && (isMobile || window.innerWidth > 992)) &&
                <MenuList active={this.props.active}/>
                }
            </div>
        </div>);
    }
}