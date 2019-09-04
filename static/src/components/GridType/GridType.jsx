import React, {Component} from "react";
import "./GridType.scss";
import Common from "../../utils/common";
import Interactive from "react-interactive";
import LazyImg from 'react-lazyload-image';
import Dotdotdot from "react-dotdotdot";

// import store from "../../store";
// import * as actionType from "../../actions";

export default class GridType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: null
        };
        // store.subscribe(this.storeSubscribe.bind(this));
    }

    componentWillMount() {
        this.setState({
            videos: this.props.videos
        });
    }

    static handleClick(e) {
        if (!e) return;
        const itemUrl = e.currentTarget.getAttribute('data-item-url');
        const win = window.open(itemUrl, '_self');
        win.focus();
    }

    render() {
        let {videos} = this.state;

        return (<div className="row">{
            videos.map((el, index) => {
                return (<div className="clearfix" key={index}>{
                    el.map((item, rowIndex) => {
                        item.url = Common.getVideoPageUrl(item);
                        return (<div key={rowIndex} onClick={this.constructor.handleClick.bind(this)}
                                     data-item-url={item.url}
                                     className="grid-type-video-item col-md-4">
                                <div className="grid-type-video-item-wrapper">
                                    <Interactive as="a" normal={{className: "grid-type-normal"}}
                                                 hover={{className: "grid-type-hovered"}}
                                                 touchActive={{className: "grid-type-hovered"}} href={item.url}>
                                        <div className="grid-type-video-item-thumbnail">
                                            <LazyImg src={item.asset.thumbnailUrl} alt={item.title}/>
                                            <span className="grid-type-video-item-meta-duration">
                                                    {Common.getVideoTime(item.duration)}
                                            </span>
                                        </div>
                                    </Interactive>
                                    <div className="grid-type-video-item-meta-wrapper">
                                        <h2 className="grid-type-video-item-title">
                                            <Dotdotdot clamp={2}>
                                                {item.title}
                                            </Dotdotdot>
                                        </h2>
                                        <span className="grid-type-video-item-meta-author">
                                            {item.asset.author || "Motorola"}
                                        </span>

                                        <span className="grid-type-video-item-meta-date">
                                            {Common.getPostedDate(item.date_created)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }</div>)
            })
        }
        </div>);
    }
}