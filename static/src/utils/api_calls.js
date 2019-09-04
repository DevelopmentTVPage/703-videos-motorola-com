import $ from 'jquery';

class Request {
    constructor() {
        this.Data = {
            "X-login-id": TVSite.loginId,
        }
    }

    addProperty(property, value) {
        const shouldAdd = this.isValid(property) && this.isValid(value) ? true : false;
        if (shouldAdd) {
            this.Data[property] = value;
        }
    }

    isValid(toEvaluate) {
        let isValid = true;
        if ('undefined' === typeof toEvaluate)
            isValid = false;
        else if ('string' === typeof toEvaluate && !toEvaluate.length)
            isValid = false;
        else if (toEvaluate === null)
            isValid = false;
        return isValid;
    }
}

export class Api {
    commonRequest(url, page, query, qty) {
        let requestData = {
            p: (page == null || page == undefined) ? 0 : page,
            n: qty,
            s: (query == null || query == undefined) ? undefined : query,
            "X-login-id": TVSite.loginId,
            status: "approved"
        };

        if (TVSite.filter)
            requestData[TVSite.filter.filter] = TVSite.filter.value;

        return $.ajax({
            url: url,
            cache: false,
            dataType: "jsonp",
            data: requestData
        });
    }

    commonClean(url, requestData) {
        return $.ajax({
            url: url,
            cache: false,
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            data: requestData
        });
    }

    suggestKeywords(page, query) {
        const url = TVSite.apiUrl + 'videos/search/suggest?';
        const request = new Request();
        request.addProperty("p", page);
        request.addProperty("s", query);
        return this.commonClean(url, request.Data);
    }

    suggestResults(page, query,number) {
        const url = TVSite.apiUrl + "videos/search/suggest/results";
        const request = new Request();
        request.addProperty("p", page);
        request.addProperty("s", query);
        request.addProperty("n", number|| 20);
        request.addProperty("status", "approved");
        return this.commonClean(url, request.Data);
    }

    filters() {
        return $.ajax({
            url: TVSite.apiUrl + 'codebook/display/video',
            dataType: 'jsonp',
            data: {
                'X-login-id': TVSite.loginId,
                channelId: TVSite.channelId || undefined
            }
        });
    }

    products(videoId) {
        const url = TVSite.apiUrl + "videos/" + videoId + "/products";
        return this.commonRequest(url, null, null);
    }

    videoInfo(videoId) {
        const url = TVSite.apiUrl + "videos/" + videoId + "/channels";
        return this.commonRequest(url, null, null)
    }

    videoTranscript(videoId) {
        const url = TVSite.apiUrl + "videos/" + videoId + "/transcript";
        return this.commonRequest(url, null, null)
    }

    channelInfo(channelId) {
        const url = TVSite.apiUrl + "channels/" + channelId;
        return this.commonRequest(url, null, null)
    }

    videos(channelId, page, query, qty) {
        let url = TVSite.apiUrl + "channels/" + channelId + "/videos";
        if (channelId !== undefined && channelId !== null)
            url = TVSite.apiUrl + "channels/" + channelId + "/videos";
        const request = new Request();
        request.addProperty("p", page);
        request.addProperty("n", qty);
        if (TVSite.isVideoPage) {
            request.addProperty("s", query);
        }

        request.addProperty("status", "approved");

        return this.commonClean(url, request.Data);
    }

}

export default new Api();
