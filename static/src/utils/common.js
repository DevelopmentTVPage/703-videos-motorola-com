class Common {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    createProductStructureData(product) {
        let schema = document.createElement("script");
        let data = [];
        const hasPrice = !!product.price;

        product.price = product.price.replace(/\s/g, '');

        const price = hasPrice ? ((product.price !== "N/A") ? product.price.replace("USD", "") : 0) : 0;

        let schemaStructure = {
            "@context": "http://schema.org/",
            "@type": "Product",
            "name": product.title,
            "image": [
                product.data.imageUrl
            ],
            "description": product.description || "No Description",
            "mpn": product.referenceId || product.mpn,
            "sku": product.referenceId,
            "category": product.data.category,
            "brand": product.data.brand,
            "offers": {
                "@type": "AggregateOffer",
                "price": price,
                "lowPrice": price,
                "highPrice": price,
                "priceCurrency": "USD",
                "url": product.data.linkUrl,
                "availability": price === 0 ? "http://schema.org/OutOfStock" : "http://schema.org/InStock"
            }
        };

        data.push(schemaStructure);
        schema.type = "application/ld+json";
        schema.text = JSON.stringify(data);
        document.querySelector("head").appendChild(schema);
    }

    highlightQuery(text, query) {
        let result = '';
        const index = text.indexOf(query);
        result += text.substring(0, index) + '<span class="suggest-highlight">' + text.substring(index, index + query.length) + '</span>' + text.substring(index + query.length);
        return result;
    }

    isEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    activeCategory(menu) {
        if (!menu) return;

        let category = null;
        for (let i = 0; i < menu.length; i++) {
            if (location.href.indexOf(menu[i].label.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase()) > -1) {
                category = menu[i];
                break;
            }
        }
        return category;
    }

    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    getBGUrl(video) {
        const videoTitle = "titleTextEncoded" in video ? video.titleTextEncoded : video.title.replace(/ /g, "-");
        const formedUrl = TVSite.baseUrl + "buying-guides" + "/" + videoTitle + "/85067981-" + video.id + "/";
        return formedUrl.toLowerCase();
    }

    getVideoUrl(video) {
        const videoTitle = "titleTextEncoded" in video ? video.titleTextEncoded : video.title.replace(/ /g, "-");
        const formedUrl = TVSite.baseUrl + TVSite.channelVideosData.titleTextEncoded + "/" + videoTitle + "/" + TVSite.channelVideosData.id + "-" + video.id + "/";
        return formedUrl.toLowerCase();
    }

    getVideoPageUrl(video) {
        if (this.isEmpty(video)) return;
        let vidData = !this.IsJsonString(video.data) ? video.data : JSON.parse(video.data);
        let videoTitle = (vidData && vidData.hasOwnProperty("titleTextEncoded")) ? vidData.titleTextEncoded : video.titleTextEncoded;
        let formedUrl = TVSite.baseUrl + (video.entityType === 7 ? "p/" : "v/") + videoTitle + "/" + video.id + "/";
        return formedUrl.toLowerCase();
    }

    getDateFromUnix(unixDate) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const d = (new Date(Number(unixDate) * 1000));
        const month = months[d.getMonth()];
        const day = '' + d.getDate() + ',';
        const year = d.getFullYear();
        return [month, day, year].join(' ');
    }

    getVideoTime(secs) {
        const date = new Date(0, 0, 0);

        date.setSeconds(Number(secs));

        const hour = (date.getHours() ? date.getHours() : '');
        const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        return (hour ? hour + ":" : "") + minutes + ':' + seconds;

    }

    rowerize(data, per, offset) {
        if (data) {
            const raw = data.slice(0);
            let rows = [],
                tries = 0,
                times = 5;

            while (raw.length) {
                tries++;
                if (tries === 2 && times !== 0 && offset) {
                    const offsetArr = raw.splice(0, per || 5);
                    let offsetRow = [],
                        offsetTemp = [];
                    for (let i = 0; i < offsetArr.length; i++) {
                        if (i === 0) {
                            offsetRow.push(offsetArr[i]);
                        } else {
                            offsetTemp.push(offsetArr[i])
                        }
                    }
                    offsetRow.push(offsetTemp);
                    rows.push(offsetRow);
                    times--;
                } else {
                    rows.push(raw.splice(0, per || 4));
                }
            }
            return rows;
        }
    }

    linkify(text) {
        if (text) {
            text = text.replace(
                /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
                function(url) {
                    var full_url = url;
                    if (!full_url.match('^https?:\/\/')) {
                        full_url = 'http://' + full_url;
                    }
                    return '<a href="' + full_url + '">' + url + '</a>';
                }
            );
        }
        return text.replace(/\n/g, '<br>\n');
    }

    getById(id) {
        return document.getElementById(id);
    }

    isUndefined(o) {
        return 'undefined' === typeof o;
    }

    isFunction(o) {
        return 'function' === typeof o;
    }

    compact(o) {
        for (let k in o)
            if (o.hasOwnProperty(k) && !o[k])
                delete o[k];

        return o;
    }

    globalPoll(globs, callback) {
        globs = (globs || []).filter(Boolean);
        const that = this;
        const globsLength = globs.length;
        let globsCheck = 0;

        (function poll() {
            setTimeout(function() {
                let ready = true;
                let missing;

                for (let i = 0; i < globsLength; i++) {
                    let glob = globs[i];

                    if (undefined === window[glob]) {
                        ready = false;

                        missing = glob;
                    }
                }

                if (ready) {
                    if (that.isFunction(callback))
                        callback();
                } else if (++globsCheck < 10000) {
                    poll();
                } else {
                    throw new Error("missing global: " + missing);
                }
            }, 10);
        }());
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    isPhoto(asset) {
        if (!asset) return;
        return (asset.hasOwnProperty('entityType') && (asset.entityType === 7 || asset.entityType === "7"));
    }

    getPostedDate(time) {
        if (!time)
            return;

        const templates = {
            prefix: "",
            suffix: " ago",
            seconds: "Just Now",
            minute: "Just Now",
            minutes: "%d minutes",
            hour: "%d hour",
            hours: "%d hours",
            day: "%d day",
            days: "%d days",
            month: "%d month",
            months: "%d months",
            year: "d% year",
            years: "%d years"
        };

        const template = function(t, n) {
            return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
        };

        time = time.toString();
        time = time.replace(/\.\d+/, ""); // remove milliseconds
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        time = new Date(time * 1000 || time);

        const now = new Date();
        const seconds = ((now.getTime() - time) * .001) >> 0;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const years = days / 365;

        return templates.prefix + (
            seconds < 45 && template('seconds', seconds) ||
            seconds < 90 && template('minute', 1) ||
            minutes < 45 && template('minutes', minutes) ||
            minutes < 90 && template('hour', 1) ||
            hours < 24 && template('hours', hours) ||
            hours < 42 && template('day', 1) ||
            days < 30 && template('days', days) ||
            days < 45 && template('month', 1) ||
            days < 365 && template('months', days / 30) ||
            years < 1.5 && template('year', 1) ||
            template('years', years)
        ) + templates.suffix;
    }

    isOverlapping($div1, $div2) {
        // Div 1 data
        const d1_offset = $div1.offset();
        const d1_height = $div1.outerHeight(true);
        const d1_width = $div1.outerWidth(true);
        const d1_distance_from_top = d1_offset.top + d1_height;
        const d1_distance_from_left = d1_offset.left + d1_width;

        // Div 2 data
        const d2_offset = $div2.offset();
        const d2_height = $div2.outerHeight(true);
        const d2_width = $div2.outerWidth(true);
        const d2_distance_from_top = d2_offset.top + d2_height;
        const d2_distance_from_left = d2_offset.left + d2_width;

        const not_colliding = (d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left);

        // Return whether it IS colliding
        return !not_colliding;
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

export default new Common();
