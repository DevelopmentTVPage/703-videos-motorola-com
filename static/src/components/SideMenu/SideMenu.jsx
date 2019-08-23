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
            isMobile: Common.isMobile,
            overlapped: false,
            sidMenuWrapper: null,
            sideListWrapper: null,
            footer: null
        };

        store.subscribe(this.storeSubscribe.bind(this));
        this.menuScroll = this.menuScroll.bind(this);
        this.handleDebounced = Common.debounce(this.debounced.bind(this), 100, false);
    }

    storeSubscribe() {
        const storeState = store.getState();

        this.setState({
            isMobile: storeState.is_mobile
        });
    }

    componentDidMount() {
        this.setState({
            sidMenuWrapper: $('.side-menu-wrapper'),
            sideListWrapper: $('.side-menu-list-wrapper'),
            footer: $('.footer')
        });
        if (!isVideoPage && !this.state.isMobile)
            this.menuScroll();
    }

    debounced() {
        const {sidMenuWrapper, sideListWrapper, footer} = this.state;
        const d1_offset = sideListWrapper.offset();
        const d1_height = sideListWrapper.outerHeight(true);
        const d1_distance_from_top = d1_offset.top + d1_height;
        const d2_offset = footer.offset();
        if (Common.isOverlapping(sideListWrapper, footer)){
            sidMenuWrapper.animate({
                'margin-top': -Math.abs((d1_distance_from_top - d2_offset.top) - 10)
            });
        }else {
            sidMenuWrapper.animate({'margin-top':0});
        }
    }

    menuScroll() {
        const that = this;
        let lastScrollTop = 0;
        const eventsHandler = () =>{
            const st = $(window).scrollTop();
            that.handleDebounced(st > lastScrollTop);
            lastScrollTop = st;
        };
        $(window).resize(function () {
            eventsHandler();
        });
        $(window).scroll(() => {
            eventsHandler();
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