export function unhtmlForUrl(str, reg) {
	return str ? str.replace(reg || /[<">']/g, function (a) {
		return {
			'<': '&lt;',
			'&': '&amp;',
			'"': '&quot;',
			'>': '&gt;',
			'\'': '&#39;'
		}[a]

	}) : ''
}

export function parseUrl(href) {
	if (window && document) {
		var l = document.createElement("a");
		l.href = href;

		return {
			href: href,
			protocol: l.protocol,
			host: l.host,
			hostname: l.hostname,
			port: l.port,
			pathname: l.pathname,
			search: l.search,
			hash: l.hash
		}
	}
	var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
	return match && {
		href: href,
		protocol: match[1],
		host: match[2],
		hostname: match[3],
		port: match[4],
		pathname: match[5],
		search: match[6],
		hash: match[7]
	}
}

export const parseAddrUrl = {
	parse_youku_com(url) {
		return url
			.replace(/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, 'player.youku.com/player.php/sid/$1/v.swf')
	},
	parse_qq_com(url) {
		return url
			.replace(/v\.qq\.com\/cover\/[\w]+\/[\w]+\/([\w]+)\.html/i, 'static.video.qq.com/TPout.swf?vid=$1')
			.replace(/v\.qq\.com\/.+[\?\&]vid=([^&]+).*$/i, 'static.video.qq.com/TPout.swf?vid=$1')
			.replace(/v\.qq\.com\/\w+\/\w+\/[\w]+\/([\w]+)\.html/i, 'imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?vid=$1')
			.replace(/v\.qq\.com\/\w+\/\w+\/([\w]+)\.html/i, 'imgcache.qq.com/tencentvideo_v1/playerv3/TPout.swf?vid=$1')
	},
	parse_sohu_com(url) {
		return url
			.replace(/my\.tv\.sohu\.com\/[\w]+\/([\d]+)\/([\d]+)\.shtml.*$/i, 'tv.sohu.com/upload/static/share/share_play.html#$2_$1_0_9001_0')
			.replace(/share\.vrs\.sohu\.com\/([\w]+)\/v\.swf.*?plid=(\w+).*/i, 'tv.sohu.com/upload/static/share/share_play.html#$1_$2_0_2_1')
	}
}

export function convertUrlToFlash(url) {
	url = String(url).replace(/^\s+|\s+$/g, '')
	if (!/^https?:\/\//i.test(url)) {
		return false
	}

	var parseUrlObj = parseUrl(url)
	var find = false
	var parseed_url = ''
	;[
		'.youku.com',//优酷视频
		'.qq.com',//腾讯视频
		'.sohu.com'//搜狐视频
	].forEach((item) => {
		if (parseUrlObj.hostname.indexOf(item) > -1) {
			parseed_url = parseAddrUrl['parse' + item.replace(/\.(\w)/g, '_$1')](url)
			find = true
		}
	})
	if (!find || !parseed_url) return false

	return parseed_url

}

export function convertUrlToIframe(url) {
	url = convertUrlToFlash(url)
	if (!url) return false

	if (url.match('v.qq.com') || url.match('video.qq.com') || url.match('imgcache.qq.com')) {
		url = 'http://v.qq.com/iframe/player.html?vid=' + getKeyVal(url, 'vid') + '&width=630&height=350&auto=0'
	} else if (url.match('youku.com')) {
		url.match(/http:\/\/player.youku.com\/player.php\/sid\/(.+)\/v.swf/)
		url = 'http://player.youku.com/embed/' + RegExp.$1
	}
	return url
}

export function getKeyVal(src, key) {
	var matchVidArray = src.toString().split('?')[1].toString().split('&'), vid = null
	for (var i2 = 0; i2 < matchVidArray.length; i2++) {
		if (matchVidArray[i2].split('=')[0].toLowerCase() == key) {
			vid = matchVidArray[i2].split('=')[1]
			return vid
		}
	}
	return ''
}
