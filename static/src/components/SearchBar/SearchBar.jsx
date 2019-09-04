import React, {Component} from "react";
import "./SearchBar.scss";
import Common from "../../utils/common";
import $ from 'jquery';
import store from "../../store";
import * as actionType from "../../actions";

const {isHomePage} = TVSite;

export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: "",
            placeholderVal: "",
            Suggestions: [],
            hasSuggestions: false,
            loadingSuggestions: false,
            pageSuggestions: -1,
            lastPage: false,
            searchOpen: false,
            isMobile:Common.isMobile
        };

        this.delayedCb = Common.debounce(this.handleCb, 180, false);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleClose = this.handleClose.bind(this);
        store.subscribe(this.storeSubscribe.bind(this));
    }

    storeSubscribe() {
        const storeState = store.getState();

        this.setState({
            isMobile: storeState.is_mobile
        });
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.handleClose();
        }
    }

    handleCb(event) {
        const that = this,
            value = event.target.value.split(" ").join("_");

        that.setState({loadingSuggestions: true});

        if ('string' !== typeof value || "undefined" === value || value === "") return that.clearSuggest();

        let promises = [],
            endpoints = [
                TVSite.apiUrl + '/videos/search/suggest?X-login-id=' + TVSite.loginId
            ];

        for (let i = 0; endpoints.length > i; i++) {
            promises.push($.ajax({
                url: endpoints[i],
                dataType: 'jsonp',
                data: {
                    s: value
                }
            }));
        }

        $.when.apply($, promises).then((keys) => {
            if ((!Array.isArray(keys) || !keys.length)) return that.setState({hasSuggestions: false});
            else {
                that.setState({
                    Suggestions: keys.slice(0, 20),
                    hasSuggestions: true
                });
            }
            that.setState({
                loadingResults: false,
                loadingSuggestions: false
            });
        });
    }

    clearSuggest() {
        this.setState({
            inputVal: "",
            placeholderVal: "Search Videos",
            Suggestions: [],
            hasSuggestions: false,
            loadingSuggestions: false,
            pageSuggestions: -1,
            lastPage: false
        });
    }

    handleClose() {
        const element = document.getElementById("side-menu-searchbar-container");
        element && element.classList.remove("open-search");
        document.body.classList.remove("open-search");
        store.dispatch({
            type: actionType.MENU_CLICK,
            menu_click: false
        });
        this.clearSuggest();
        this.setState({
            searchOpen: false,
            placeholderVal: ""
        });
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleSearchClick(e) {
        const that = this;
        if (this.wrapperRef && this.wrapperRef.contains(e.target) && e.currentTarget.className == 'open-search-icon') {
            const parentContainer = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
            parentContainer && parentContainer.classList.add("open-search");
            document.body.classList.add("open-search");
            store.dispatch({
                type: actionType.MENU_CLICK,
                menu_click: true
            });
            setTimeout(() => {
                that.setState({
                    placeholderVal: "Search Videos",
                    searchOpen: true
                });
            }, 250);
        }
    }

    handleChange(e) {
        this.setState({
            inputVal: e.target.value
        });
        e.persist();
        // this.delayedCb(e);
    }

    handleClickEnter(e) {
        const {inputVal} = this.state;
        if (e.key === 'Enter') {
            if (inputVal)
                window.location.href = TVSite.baseUrl + "/search/?s=" + inputVal;
        }
    }

    createMarkup(html) {
        return {__html: html};
    };

    render() {
        let {placeholderVal, inputVal, Suggestions, hasSuggestions, searchOpen} = this.state;
        const {searchPage} = this.props;

        return (<div id="side-menu-searchbar-container" className="clearfix side-menu-searchbar-container">
                <div
                    className={"side-menu-home-icon " + (searchPage ? "search-page" : "") + (isHomePage ? "home-page" : "")}>
                    <a className={isHomePage ? "disabled" : ""} href="/us">
                        {isHomePage ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="20.16" height="20" viewBox="0 0 20.16 20">
                                <g transform="translate(-1741.652 -2050.249)" strokeLinejoin="round" opacity="0.2">
                                    <path
                                        d="M 1760.809326171875 2069.2490234375 L 1755.1708984375 2069.2490234375 L 1755.1708984375 2062.628662109375 L 1755.1708984375 2061.628662109375 L 1754.1708984375 2061.628662109375 L 1749.263671875 2061.628662109375 L 1748.263671875 2061.628662109375 L 1748.263671875 2062.628662109375 L 1748.263671875 2069.2490234375 L 1742.6533203125 2069.2490234375 L 1742.6533203125 2068.810546875 C 1742.6533203125 2065.45458984375 1742.6533203125 2062.09912109375 1742.651977539063 2058.7431640625 C 1745.141723632813 2056.765625 1747.62939453125 2054.788330078125 1750.1171875 2052.81103515625 L 1751.735717773438 2051.524658203125 C 1752.0966796875 2051.811767578125 1752.45703125 2052.098388671875 1752.817260742188 2052.385009765625 L 1754.461669921875 2053.693115234375 C 1756.57763671875 2055.376220703125 1758.693969726563 2057.059814453125 1760.811279296875 2058.741943359375 C 1760.809204101563 2062.013671875 1760.809204101563 2065.3330078125 1760.809326171875 2068.546630859375 L 1760.809326171875 2069.2490234375 Z"
                                        stroke="none"/>
                                    <path
                                        d="M 1751.735473632813 2052.80224609375 L 1750.750244140625 2053.585205078125 C 1748.385131835938 2055.465087890625 1746.020263671875 2057.3447265625 1743.652221679688 2059.225830078125 C 1743.6533203125 2062.2333984375 1743.6533203125 2065.241455078125 1743.6533203125 2068.2490234375 L 1747.263671875 2068.2490234375 L 1747.263671875 2062.628662109375 C 1747.263671875 2061.524169921875 1748.159057617188 2060.628662109375 1749.263671875 2060.628662109375 L 1754.1708984375 2060.628662109375 C 1755.275512695313 2060.628662109375 1756.1708984375 2061.524169921875 1756.1708984375 2062.628662109375 L 1756.1708984375 2068.2490234375 L 1759.809326171875 2068.2490234375 C 1759.809204101563 2065.286376953125 1759.809326171875 2062.238037109375 1759.81103515625 2059.224365234375 C 1757.819702148438 2057.64208984375 1755.829467773438 2056.058837890625 1753.839111328125 2054.4755859375 L 1752.194702148438 2053.16748046875 C 1752.041625976563 2053.045654296875 1751.888549804688 2052.924072265625 1751.735473632813 2052.80224609375 M 1751.73828125 2050.2490234375 C 1752.307373046875 2050.701416015625 1752.87353515625 2051.15185546875 1753.43994140625 2051.6025390625 C 1756.196533203125 2053.795166015625 1758.952880859375 2055.988525390625 1761.711181640625 2058.1796875 C 1761.78369140625 2058.2373046875 1761.8115234375 2058.294677734375 1761.8115234375 2058.3876953125 C 1761.808837890625 2062.297607421875 1761.809326171875 2066.207275390625 1761.809326171875 2070.116943359375 L 1761.809326171875 2070.2490234375 L 1754.1708984375 2070.2490234375 L 1754.1708984375 2062.628662109375 L 1749.263671875 2062.628662109375 L 1749.263671875 2070.2490234375 L 1741.6533203125 2070.2490234375 L 1741.6533203125 2070.143798828125 C 1741.6533203125 2066.21484375 1741.653564453125 2062.285888671875 1741.65185546875 2058.356689453125 C 1741.65185546875 2058.2890625 1741.670654296875 2058.245361328125 1741.724365234375 2058.202880859375 C 1745.039306640625 2055.570068359375 1748.353271484375 2052.935546875 1751.66748046875 2050.301513671875 C 1751.689697265625 2050.283935546875 1751.71337890625 2050.267333984375 1751.73828125 2050.2490234375 Z"
                                        stroke="none"/>
                                </g>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="20.16" height="20" viewBox="0 0 20.16 20">
                                <path
                                    d="M-43.762,2.553l-.985.783-7.1,5.641q0,4.51,0,9.023h3.61V12.38a2,2,0,0,1,2-2h4.907a2,2,0,0,1,2,2V18h3.639c0-2.963,0-6.011,0-9.025l-5.972-4.748L-43.3,2.918l-.459-.365m0-2.553,1.7,1.354q4.135,3.288,8.271,6.577a.234.234,0,0,1,.1.208q0,5.865,0,11.729V20h-7.639V12.38h-4.907V20h-7.61v-.1q0-5.894,0-11.787a.173.173,0,0,1,.073-.154Q-48.8,4-43.83.052Z"
                                    transform="translate(53.846)" fill="#141212"/>
                            </svg>
                        }
                    </a>
                </div>
                <svg className={"side-menu-divider" + (isHomePage ? " home-page" : "")} xmlns="http://www.w3.org/2000/svg" width="1" height="32" viewBox="0 0 1 32">
                    <line y2="32" transform="translate(0.5)" fill="none" stroke="#bfbfbf" strokeWidth="1"/>
                </svg>
                {!searchPage &&
                <div ref={this.setWrapperRef.bind(this)}
                     className={"side-menu-search-icon-container " + (isHomePage ? "home-page" : "")}>
                    <div className="side-menu-search-icon" >
                        <div className="search-box">
                            <div className="open-search-icon" onClick={this.handleSearchClick.bind(this)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.666" height="20"
                                     viewBox="0 0 17.666 20">
                                    <path
                                        d="M2889.224,2064.548l.289.307q1.578,1.669,3.157,3.338a1.187,1.187,0,0,1,.2,1.51,1.17,1.17,0,0,1-1.731.276c-.463-.437-.888-.915-1.325-1.378q-1.233-1.308-2.458-2.622a.177.177,0,0,0-.245-.05,8,8,0,0,1-2.286.7,8.084,8.084,0,0,1-1.906.053,8,8,0,0,1-3.656-1.215,8.2,8.2,0,0,1-2.994-3.272,7.753,7.753,0,0,1-.808-2.6,8.112,8.112,0,0,1,1.873-6.421,7.9,7.9,0,0,1,4.626-2.752,8.219,8.219,0,0,1,9.825,9.047,8.11,8.11,0,0,1-1.6,3.965C2889.9,2063.822,2889.555,2064.168,2889.224,2064.548Zm-5.592-11.938a5.874,5.874,0,1,0,5.88,5.872A5.867,5.867,0,0,0,2883.632,2052.61Z"
                                        transform="translate(-2875.388 -2050.248)" opacity={searchOpen ? "0.2" : "1"}/>
                                </svg>
                            </div>
                            <input onKeyDown={this.handleClickEnter.bind(this)} value={inputVal}
                                   placeholder={placeholderVal} onChange={(e) => {
                                this.handleChange(e)
                            }} type="text"/>
                            <div onClick={this.handleClose.bind(this)} className="close-search-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                    <g transform="translate(-286 -134)">
                                        <circle cx="7" cy="7" r="7" transform="translate(286 134)" fill="#c3c3c3"/>
                                        <line x1="5" y2="5" transform="translate(290.5 138.5)" fill="none" stroke="#fff"
                                              strokeWidth="1"/>
                                        <line x1="5" y2="5" transform="translate(295.5 138.5) rotate(90)" fill="none"
                                              stroke="#fff" strokeWidth="1"/>
                                    </g>
                                </svg>
                            </div>
                            {(inputVal && hasSuggestions) &&
                            <div className="suggestions-list-container">
                                <ul>{
                                    Suggestions.map((el, index) => {
                                        const searchURL = TVSite.baseUrl + "search/?s=";
                                        return (<li key={index}>
                                                <a href={searchURL + encodeURIComponent(el)}
                                                   dangerouslySetInnerHTML={this.createMarkup(Common.highlightQuery(el, inputVal))}>
                                                </a>
                                            </li>
                                        )
                                    })
                                }</ul>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}