import React, {Component} from "react";
import Common from "../../utils/common";
import Interactive from "react-interactive";
import LazyImg from 'react-lazyload-image';
import Dotdotdot from "react-dotdotdot";

export default class GridItem extends Component {
    constructor(props) {
        super(props);
    }

    static handleClick(e) {
        if (!e) return;
        const itemUrl = e.currentTarget.getAttribute('data-item-url');
        const win = window.open(itemUrl, '_self');
        win.focus();
    }

    render() {
        let {itemClassName, item, offset} = this.props;
        const parsedData = JSON.parse(item.data);
        const isPhoto = Common.isPhoto(item);
        item.titleTextEncoded = item.titleTextEncoded ? item.titleTextEncoded : parsedData.titleTextEncoded;
        item.asset = item.asset ? item.asset : parsedData.asset;
        item.duration = item.duration ? item.duration : parsedData.duration;
        item.url = Common.getVideoPageUrl(item);

        const vidData = !Common.isJson(item.data) ? item.data : JSON.parse(item.data),
            thumbsArr = vidData.asset.thumbnails,
            thumbnailUrl = offset ? thumbsArr[Object.keys(thumbsArr)[Object.keys(thumbsArr).length - 1]] : vidData.asset.thumbnailUrl;

        return (<div onClick={this.constructor.handleClick.bind(this)} data-item-url={item.url}
                     className={itemClassName + " tvp-video-item"}>
                <div className="tvp-video-item-wrapper">
                    <Interactive as="a" normal={{className: "tvp-normal"}} hover={{className: "tvp-hovered"}}
                                 touchActive={{className: "tvp-hovered"}} href={item.url}>
                        <div className="tvp-video-item-thumbnail">
                            <LazyImg src={thumbnailUrl} alt={item.title}/>
                            {offset && <div className="tvp-video-item-image-overlay"></div>}
                            {offset ?
                                <div className="tvp-video-item-meta-wrapper">
                                    <h2 className="tvp-video-item-title">
                                        <Dotdotdot clamp={2}>
                                            {item.title}
                                        </Dotdotdot>
                                    </h2>
                                    <div className="tvp-video-item-description">
                                        <Dotdotdot clamp={2}>
                                            {item.description}
                                        </Dotdotdot>
                                    </div>
                                    <div className="tvp-video-item-offset-info">
                                        {!isPhoto &&
                                        <span className="tvp-video-item-meta-duration-offset">
                                            {Common.getVideoTime(item.duration)}
                                        </span>
                                        }
                                            <span className="tvp-video-item-meta-author">
                                            {item.author || "Motorola"}
                                        </span>
                                            <span className="tvp-video-item-meta-date">
                                            {Common.getPostedDate(item.date_created)}
                                        </span>
                                    </div>
                                    <div className="play-icon">
                                        <div></div>
                                    </div>
                                </div>
                                :
                                <span style={{display:(!isPhoto?"block":"none")}} className="tvp-video-item-meta-duration">
                                    {!isPhoto && Common.getVideoTime(item.duration)}
                                </span>
                            }
                        </div>
                    </Interactive>
                    {!offset &&
                    <div className="tvp-video-item-meta-wrapper">
                        <h2 className="tvp-video-item-title">
                            <Dotdotdot clamp={2}>
                                {item.title}
                            </Dotdotdot>
                        </h2>
                        <span className="tvp-video-item-meta-author">
                            {item.author || "Motorola"}
                        </span>
                        <span className="tvp-video-item-meta-date">
                            {Common.getPostedDate(item.date_created)}
                        </span>
                    </div>
                    }
                </div>
            </div>
        );
    }
}
