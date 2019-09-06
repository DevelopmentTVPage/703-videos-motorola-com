import store from "../store";
import * as actionType from "../actions";

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    iOS = (/iPad|iPhone|iPod|iPhone Simulator|iPad Simulator/.test(navigator.userAgent) && !window.MSStream),
    canHandleAutoplay = function(){
        var canAutoplay = true;
        var isSafari = /Safari/i.test(navigator.userAgent);
        if(isSafari){
            var isVersion11 = /version\/11./i.test(navigator.userAgent);
            if(isVersion11)
                canAutoplay = false;
        }
        return canAutoplay;
    },
    isset = function(o,p){
        var val = o;
        if (p) val = o[p];
        return 'undefined' !== typeof val;
    },
    isEmpty = function(obj) {
        for(var key in obj) { if (obj.hasOwnProperty(key)) return false;}
        return true;
    },
    compact = function(o){
        if (!o && "object" !== typeof o) return;
        for (var k in o) {
            if (!o[k]) {
                delete o[k];
            }
        }
        return o;
    };


//The player singleton. We basically create an instance from the tvpage
//player and expose most utilities, helping to encapsualte what is required for a few players to co-exist.
function Player(el, options, startWith) {
    if (!el || !isset(options) || !isset(options.data) || options.data.length <= 0) return;

    this.options = options;
    this.instance = null;
    this.el = 'string' === typeof el ? document.getElementById(el) : el;
    this.isFullScreen = false;
    this.initialResize = true;
    this.autoplay = isset(options.autoplay) ? Number(options.autoplay) : false;
    this.autonext = isset(options.autonext) ? Number(options.autonext) : false;
    this.version = isset(options.player_version) ? options.player_version : null;
    this.removeControls = isset(options.remove_controls) ? options.remove_controls : null;
    this.techOrder = isset(options.tech_order) ? options.tech_order : null;
    this.analytics = isset(options.analytics) ? options.analytics : null;
    this.apiBaseUrl = isset(options.api_base_url) ? options.api_base_url : null;
    this.mediaProviders = isset(options.media_providers) ? options.media_providers : null;
    this.preload = isset(options.preload) ? options.preload : null;
    this.poster = isset(options.poster) ? options.poster : null;
    this.overlay = isset(options.overlay) ? options.overlay : null;
    this.playbutton = compact({
        height: isset(options.play_button_height) ? options.play_button_height : null,
        width: isset(options.play_button_width) ? options.play_button_width : null,
        backgroundColor: isset(options.play_button_background_color) ? options.play_button_background_color : null,
        borderRadius: isset(options.play_button_border_radius) ? options.play_button_border_radius : null,
        borderWidth: isset(options.play_button_border_width) ? options.play_button_border_width : null,
        borderColor: isset(options.play_button_border_color) ? options.play_button_border_color : null,
        borderStyle: isset(options.play_button_border_style) ? options.play_button_border_style : null,
        iconColor: isset(options.play_button_icon_color) ? options.play_button_icon_color : null
    });
    this.floater = compact({
        controlbarColor: isset(options.control_bar_color) ? options.control_bar_color : null,
        iconColor: isset(options.icon_color) ? options.icon_color : null,
        removeControls: isset(options.remove_controls) ? options.remove_controls : null
    });
    this.seekBar = compact({
        progressColor: isset(options.progress_color) ? options.progress_color : null
    });
    this.controls = compact({
        active: true,
        seekBar: this.seekBar,
        floater: this.floater,
        playbutton: this.playbutton,
        overlayColor: isset(options.overlay_color) ? options.overlay_color : null,
        overlayOpacity: isset(options.overlay_opacity) ? options.overlay_opacity : null
    });

    var advertisingOptions = isset(options.advertising) && "object" === typeof options.advertising && !isEmpty(options.advertising) ? options.advertising : {};
    this.advertising = compact({
        enabled: isset(advertisingOptions.enabled) ? advertisingOptions.enabled : false,
        adServerUrl: isset(advertisingOptions.adServerUrl) ? advertisingOptions.adServerUrl : null,
        adTimeout: isset(advertisingOptions.adTimeout) ? advertisingOptions.adTimeout : "2000",
        maxAds: isset(advertisingOptions.maxAds) ? advertisingOptions.maxAds : "100",
        adInterval: isset(advertisingOptions.adInterval) ? String(advertisingOptions.adInterval) : "0"
    });

    this.onNext = isset(options.onNext) && "function" === typeof options.onNext ? options.onNext : null;
    this.playerStateChange = isset(options.playerStateChange) && "function" === typeof options.playerStateChange ? options.playerStateChange : null;
    this.onPlayerReady = isset(options.onPlayerReady) && "function" === typeof options.onPlayerReady ? options.onPlayerReady : null;
    this.onFullscreenChange = isset(options.onFullscreenChange) && "function" === typeof options.onFullscreenChange ? options.onFullscreenChange : null;

    //Context reference for Methods.
    var that = this;

    this.getOption = function (name) {
        if (this.options.hasOwnProperty(name))
            return this.options.hasOwnProperty(name);
        return null;
    };

    this.createAsset = function(obj){
        if (!obj || "object" !== typeof obj || isEmpty(obj) || !isset(obj,'asset')) return;

        var asset = obj.asset;
        asset.assetId = obj.id;
        asset.assetTitle = obj.title;
        asset.loginId = obj.loginId;
        asset.entityType = obj.entityType;

        if (isset(obj,'events') && obj.events.length) {
            asset.analyticsLogUrl = obj.analytics;
            asset.analyticsObj = obj.events[1].data;
        } else {
            var channelId = isset(obj,'parentId') ? obj.parentId : ( isset(options,'channel') ? options.channel.id : 0 );
            if (!channelId && (options.channelId || options.channelid)) {
                channelId = options.channelId || options.channelid;
            }

            asset.analyticsObj = {
                pg: TVSite.channelId,
                vd: obj.id,
                li: obj.loginId
            };
        }

        if (!asset.sources) asset.sources = [{ file: asset.videoId }];
        asset.type = asset.type || 'youtube';

        return asset;
    };

    this.assets = (function(data){
        var assets = [];
        for (var i = 0; i < data.length; i++) {
            var video = data[i];
            if (isEmpty(video)) break;
            assets.push(that.createAsset(video));
        }
        return assets;
    }(options.data));

    this.pause = function(){
        this.instance.pause();
    };

    this.mute = function(){
        this.instance.mute();
    };

    this.play = function(asset,ongoing,initial,immediate){
        var assetId = null;
        if (asset && 'string' === typeof asset || 'number' === typeof asset) {
            assetId = asset;
        }

        var a = asset;
        if (assetId){
            for (var i = 0; i < this.assets.length; i++) {
                if (assetId == this.assets[i].assetId) {
                    a = this.assets[i];
                }
            }
        }

        var willCue = false;
        if (ongoing) {
            if (isMobile || (isset(this.autonext) && !this.autonext)) {
                willCue = true;
            }
        } else {
            if (isMobile || (isset(this.autoplay) && !this.autoplay) || !canHandleAutoplay()) {
                willCue = true;
            }
        }

        if (!initial) {
            this.current = this.getCurrentIndex(a.assetId);
        }

        if (willCue) {
            this.instance.cueVideo(a);
            if (that.assets[that.current].entityType === "7" && !initial)
                that.instance.photoPlayer.onPauseButtonClick();
        } else {
            this.instance.loadVideo(a);
        }
    };

    this.addData = function(data){
        if (!data || !data.length) return;
        var newAssets = [];
        for (var i = 0; i < data.length; i++) {
            newAssets.push(this.createAsset(data[i]));
        }

        this.assets = this.assets.concat(newAssets);
    };

    this.getCurrentIndex = function(id){
        var current = 0;
        for (var i = 0; i < this.assets.length; i++) {
            if (this.assets[i].assetId === (id || '') ) {
                current = i;
            }
        }
        return current;
    };

    this.handleFullscreen = function(){
        if (!isset(window,'BigScreen'))
            return;

        BigScreen.onchange = function(){
            that.isFullScreen = !that.isFullScreen;

            that.resize();

            if (that.onFullscreenChange)
                that.onFullscreenChange();
        };
    };

    this.resize = function(){
        if (!that.instance || that.isFullScreen) return;

        var width, height;

        if (arguments.length && arguments[0] && arguments[1]) {
            width = arguments[0];
            height = arguments[1];
        } else {
            var parentEl = that.el.parentNode;
            width = parentEl.clientWidth;
            height = parentEl.clientHeight;
        }

        that.instance.resize(width, height);

        if (this.onResize)
            this.onResize(that.initialResize, [width, height]);

        that.initialResize = false;
    };

    this.onReady = function(e, pl){
        that.instance = pl;
        that.resize();
        that.handleFullscreen();

        that.current = that.getCurrentIndex(startWith);
        var assetToPlay = that.assets[that.current];

        that.play(assetToPlay,null,true);

        if (that.onPlayerReady){
            that.onPlayerReady(assetToPlay);
        }

        window.removeEventListener('message', that.resize, false);
        window.addEventListener('message', that.resize, false);
    };
    this.loadSelected = function(video){
        var next = video;
        that.play(that.createAsset(next), true);

    }
    this.onStateChange = function(e){
        if('tvp:media:videoended' === e && that.autonext){
            store.dispatch({
                type: actionType.VIDEO_EVENT,
                video_event : e
            });
        }else if ('tvp:media:videoended' === e){
            that.current++;
            if (!that.assets[that.current]) {
                that.current = 0;
            }

            that.play(that.assets[that.current], true);
        }

        if ('tvp:media:videoplaying' === e && that.onNext){
            that.onNext(that.assets[that.current]);
        }

        if ('tvp:media:videoplaying' === e) {
            var existing = that.el.querySelector('.tvp-overlay');
            if (existing) {
                existing.parentNode.removeChild(existing);
            }
        }
    };

    var checks = 0;
    (function libsReady() {
        setTimeout(function() {
            if ( !isset(window,'TVPage') && (++checks < 200) ) {
                libsReady();
            } else {
                var playerOptions = {
                    techOrder: that.techOrder,
                    mediaProviders: that.mediaProviders,
                    apiBaseUrl: that.apiBaseUrl,
                    analytics : {
                        tvpa:true
                    },
                    swf: 'http://cdnjs.tvpage.com/tvplayer/tvp-3.0.0.swf',
                    onStateChange: that.onStateChange,
                    divId: that.el.id,
                    controls: that.controls,
                    advertising:that.advertising,
                    preload: that.preload,
                    version : "3.1.6"
                };

                for (var o in that.options) {
                    if ( !playerOptions.hasOwnProperty(o)) {
                        playerOptions[o] = that.options[o];
                    }
                }

                that.TVPlayer = new TVPage.player(playerOptions);
                that.onReady(that,that.TVPlayer);
            }
        },150);
    })();

}
export default Player;
