import React, {Component} from "react";
import "./MenuList.scss";
import config from "../../../../config.json";
import Common from "../../utils/common";
import store from "../../store";
import * as actionType from "../../actions";

export default class MenuList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openMenu: false,
            show: Common.isMobile
        };

        this.resizeHandler = this.resizeHandler.bind(this);
    }

    mapMenu(element, index) {
        let {active} = this.props;
        const url = TVSite.baseUrl + "c/" + element.label.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase() + "/" + element.id;
        return (
            <li className={"side-menu-list-item " + (active && element.id == active.id ? "active" : " ")} key={index}
                data-channel-id={element.id}>
                <a href={url}>
                    {element.label}
                </a>
            </li>);
    }

    resizeHandler() {
        this.setState({show: window.innerWidth < 992});
    }

    componentWillMount() {
        this.resizeHandler();
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeHandler);
    }

    bindCategoryClick() {
        let {show} = this.state;
        if (!show) return;
        let currentState = this.state.openMenu;
        this.setState({
            openMenu: !currentState
        });
        store.dispatch({
            type: actionType.MENU_CLICK,
            menu_click: !currentState
        });
    }

    render() {
        const {menu} = config;
        let {openMenu, show} = this.state;
        return (<div className={"side-menu-list-container " + (openMenu ? "open-menu" : "")}>
            <div onClick={this.bindCategoryClick.bind(this)} className="side-menu-headline">
                <div>
                    CATEGORIES
                    <span className={(show ? "show" : "") + (openMenu ? " rotate" : "") + " caret-down"}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="10.931" height="6.88" viewBox="0 0 10.931 6.88">
                        <path d="M6302.967,7720.815l4.758,4.758,4.758-4.758" transform="translate(-6302.26 -7720.107)" fill="none"
                              stroke="#707070" strokeWidth="2"/>
                    </svg>
                </span>
                </div>
            </div>
            <ul className="side-menu-list-wrapper">
                {menu.length && menu.map(this.mapMenu.bind(this))}
            </ul>
        </div>);
    }
}