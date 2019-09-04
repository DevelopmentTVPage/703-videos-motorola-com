import React, {PureComponent} from "react";
import store from "../../store";
import Playerlib from "../../libs/player";
import Dotdotdot from "react-dotdotdot";
import Common from "../../utils/common";
import scrollToComponent from "react-scroll-to-component";
import * as actionType from "../../actions";
import config from "../../../../config.json";

import ClampLines from '../../libs/react-clamp-lines';

import Api from "../../utils/api_calls";

class Player extends PureComponent {
    constructor(props) {
        super(props);

        if (props.video)
            props.video.date_created = Common.getDateFromUnix(props.video.date_created);

        this.state = {
            video: props.video || null,
            player: null,
            isMobile: window.innerWidth < 992,
            playerClassName: props.playerClassName
        };

        this.callTranscripts = this.callTranscripts.bind(this);
        this.storeSubscribe = this.storeSubscribe.bind(this);
        store.subscribe(this.storeSubscribe);

        if (props.video)
            this.callTranscripts();
    }

    componentWillReceiveProps(props) {
        const that = this;
        this.setState({
            playerClassName: props.playerClassName
        });
        
        setTimeout(() => {
            that.state.player.resize();
        }, 150);
    }

    storeSubscribe() {
        const storeState = store.getState();
        this.setState({
            isMobile: storeState.is_mobile
        });
        if (storeState.event === actionType.VIDEO) {
            scrollToComponent(this.refs.tvpageplayer, {
                offset: -200,
                align: 'top'
            });

            this.callTranscripts();
            this.setState({
                video: storeState.video
            });
            this.state.player.loadSelected(storeState.video);
        }
    }

    initPlayer() {
        return new Playerlib('tvpageplayer', {
            play_button_border_radius: '50%',
            play_button_border_width: '3px',
            play_button_border_color: '#fff',
            play_button_border_style: 'solid',
            play_button_background_color: 'transparent',
            play_button_icon_color: '#fff',
            api_base_url: TVSite.apiUrl,
            player_version: "3.1.6",
            data: [this.state.video],
            sharing:config.params.hub.sharing,
            analytics: true,
            overlay: true,
            autoplay: false,
            autonext:true,
            loginId: TVSite.loginId
        });
    }

    callTranscripts() {
        const {video} = this.state;
        let videoId = (video && video.hasOwnProperty('id')) ? video.id : "";
        Api.videoTranscript(videoId).done(function(res) {
            if (!res) return;
            let transcript = res.transcripts;
            if (transcript !== "") {
                video.transcripts = transcript;
            }
        });

    }

    componentDidMount() {
        let player = this.initPlayer();
        const that = this;
        this.setState({player: player});
        setTimeout(() => {
            that.state.player.resize();
        }, 100);
    }

    componentWillUnmount() {
        store.unsubscribe(this.storeSubscribe);
    }

    createMarkup(text){
        return {__html: text};
    }

    render() {
        const {video, isMobile, playerClassName} = this.state;

        return (
            <div className={playerClassName} ref="tvpageplayer">
                <div className="tvp-player-products-container">
                    <div id="player-container" className="container player-container">
                        <div className="row">
                            {isMobile &&
                            <h1 className="tvp-player-video-title col-md-12">
                                Now Playing
                                <Dotdotdot clamp={2}>
                                    {video && <span className="tvp-player-video-title-text">{video.title}</span>}
                                </Dotdotdot>
                            </h1>
                            }

                            <div id="tvpageplayer-container" className="col-md-12">
                                <div className="TVPagePlayer-wrapper">
                                    <div id="tvpageplayer" className="tvp-player">
                                    </div>
                                </div>
                            </div>
                            {(video && !isMobile) &&
                            <div className="tvp-player-metadata col-md-12">
                                <div className="col-md-12">
                                        <span className="tvp-video-item-meta-author">
                                            {video.asset.author || "Motorola"}
                                        </span>
                                    <span>|</span>
                                    <span className="tvp-video-item-meta-date">
                                            {Common.getPostedDate(video.date_created)}
                                        </span>
                                </div>
                                <div id="tvp-video-description"
                                     className="tvp-video-description col-md-12"
                                     dangerouslySetInnerHTML={this.createMarkup(Common.linkify(video.description || ""))}>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;