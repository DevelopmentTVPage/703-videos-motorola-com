import React, {Component} from "react";
import "./Socials.scss";
import Common from "../../utils/common";
import Twitter from "../../ui/twitter";
import Facebook from "../../ui/facebook";
import ShareLink from "../../ui/shareLink";

class Socials extends Component {
    constructor(props) {
        super(props)
    }

    twitter() {
        const {video} = this.props;
        const videoUrl = Common.getVideoPageUrl(video);
        const url = 'https://twitter.com/share?url=' + videoUrl;
        window.open(url, "_new");
    }

    facebook() {
        const {video} = this.props;
        let videoUrl = Common.getVideoPageUrl(video);
        // videoUrl = encodeURIComponent(videoUrl);
        const url = 'https://www.facebook.com/sharer/sharer.php?u=' + videoUrl;
        window.open(url, "_new");
    }

    copyToClipboard() {
        const {video} = this.props;
        let videoUrl = Common.getVideoPageUrl(video);

        const input = document.createElement("textarea");
        input.value = videoUrl;
        //input.className = "tvp-hide";
        input.style.position = 'fixed';
        input.style.top = 0;
        input.style.left = 0;
        input.style.width = '2em';
        input.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        input.style.padding = 0;

        // Clean up any borders.
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        input.style.background = 'transparent';

        document.body.appendChild(input);
        input.focus();
        input.select();
        const successful = document.execCommand('copy');

        if (successful) {
            const tooltipText = document.getElementById("tooltip-text");
            tooltipText.classList.remove("tvp-hide");
            setTimeout(() => {
                tooltipText.classList.add("tvp-hide");
            }, 1500);
        }
        document.body.removeChild(input);
    }

    render() {
        const {hasProducts} = this.props;
        return (
            <div className={(hasProducts ? "col-md-4" : "col-md-12") + " player-socials-container"}>
                <div className="row">
                    <div className="player-socials-wrapper">
                        <span>Share this video</span>
                        <div onClick={() => this.facebook()}
                             className="player-socials-facebook">
                            <Facebook/>
                        </div>
                        <div onClick={() => this.twitter()}
                             className="player-socials-twitter">
                            <Twitter/>
                        </div>
                        <div
                            onClick={() => this.copyToClipboard()}
                            className="player-socials-share share-link">
                            <ShareLink/>
                            <span id="tooltip-text" className="tooltip-text tvp-hide">Copied to clipboard.</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Socials;