import React, {Component} from "react";
import "./FeaturedVideo.scss";
import Common from "../../utils/common";
import ClampLines from '../../libs/react-clamp-lines';
import Api from "../../utils/api_calls";

export default class FeaturedVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            video: null
        };
    }

    componentWillMount() {
        const that = this,
            {videoId} = this.props;

        Api.videos(videoId, 0, null, 1).then((res) => {
            if (res && res.length)
                that.setState({
                    video: res
                });
        });
    }

    render() {
        let {video} = this.state;
        let isPhoto;
        let thumbnailUrl;

        if  (video) {
            const videoData = JSON.parse(video[0].data);
            const thumbsArr = videoData.asset.thumbnails;
            isPhoto = Common.isPhoto(video[0]);
            thumbnailUrl = isPhoto ? thumbsArr[0].url : videoData.asset.thumbnailUrl;
        }

        return (<div className="featured-video-container container-fluid">
            <div className="row">
                <div className="col-sm-12" style={{padding: '0'}}>
                    {video && <div className="featured-video-banner-image" style={{backgroundImage: `url(${thumbnailUrl})`}}>
                        <div className="featured-video-banner-image-meta">
                            <div className="featured-video-banner-image-meta-title">{video[0].title}</div>
                            {!isPhoto &&
                                <span className="featured-video-banner-image-meta-duration">
                                    {Common.getVideoTime(video[0].duration)}
                                </span>
                            }
                            <span className="featured-video-banner-image-meta-author">
                                {video[0].asset.author}
                            </span>
                            <span className="featured-video-banner-image-meta-date">
                                {Common.getPostedDate(video[0].date_created)}
                            </span>
                            <ClampLines
                                id="featured-video-banner-image-meta-description"
                                text={Common.linkify(video[0].description || "")}
                                lines={2}
                                className="featured-video-banner-image-meta-description"
                                buttons={false}/>
                            <a className="featured-video-banner-image-meta-watch-btn"
                               href={Common.getVideoPageUrl(video[0])}>
                                <div>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                             width="15" height="15"
                                             viewBox="0 0 192 192"
                                             style={{fill:"#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}><path d="M0,192v-192h192v192z" fill="none"></path><g fill="#ffffff"><g id="surface1"><path d="M38.4,20.16v151.665l128.91,-75.825z"></path></g></g></g></svg>
                                    </span>
                                    Watch {isPhoto ? "Photo" : "Video"}
                                </div>
                            </a>
                        </div>
                    </div>}
                </div>
            </div>
        </div>);
    }
}