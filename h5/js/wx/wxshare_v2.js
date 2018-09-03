
$(function() {
	var shareImg;
shareImg = $('.share-img>img').attr('src');
if (!shareImg) {
	shareImg = $('img').eq(0).attr('src');
}

var summary = "买电动车 上电动邦";
var title = $('title').text() || $(document).attr("title");
var meta = $('meta');
for(i in meta){
    if(typeof meta[i].name!="undefined"&&meta[i].name.toLowerCase()=="description"&&meta[i].content!=''){
        title = $.trim(meta[i].content);
    }
}

var pageUrl = window.location.href;
var isNews = pageUrl.lastIndexOf("news");
var isVideo = pageUrl.lastIndexOf("video");
var isNewsDetail = isNews != -1 && pageUrl.substring(isNews + 5) != '';
var isVideoDetail = isVideo != -1 && pageUrl.substring(isVideo + 6) != '';

if(isNewsDetail){
	summary = $('.article-text').find('p').eq(0).text();
	summary = summary.substr(0,50);
	title = $('.article-title').text();
}

if(isVideoDetail){
	title = $('.player-info-title').text();
}

var shareUrl = window.location.href;
//判断h5、安卓和ios
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
var myUrl = window.location.href,
	agent = GetQueryString('agent'),
	shareUrl = myUrl,
	x = 0;
if (!agent || agent == 'h5') {
	agent = 'h5';

} else {
	shareUrl = myUrl.split('?')[0];
}
if (agent == 'Ios' || agent == 'ios' || agent == 'Android' || agent == 'android') {
	window.location.href = shareUrl + '=' + encodeURIComponent(title);
	$.cookie('ddb_share_url', shareUrl);
	$.cookie('ddb_share_image_url', shareImg);
	$.cookie('ddb_share_title', title);
	$.cookie('ddb_share_content', summary);

	$.cookie('share_title_wx', title);
	$.cookie('share_text_wx', summary);
	$.cookie('share_zone_wx', summary);
	$.cookie('share_text_wb', title + '，' + shareUrl + '电动邦');
	$.cookie('share_copy_text', '【电动邦】' + title + '，' + shareUrl);
	$.cookie('ddb_share_status', 1);
	$.cookie('ddb_title_status', 0);
}
function isBHO() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.indexOf('qq') > 0 || ua.indexOf('weibo') > 0) {
		// 微信内置浏览器
		return true;
	} else {
		return false;
	}

}
var isQQ = isBHO();

function addScript(jsfile, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = jsfile;
	head.appendChild(script);
	script.onload = script.onreadystatechange = function() {
		if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
			script.onload = script.onreadystatechange = null;
			if (callback && typeof(callback) == 'function') {
				callback(); //window[callback]();如果传递字符串过来  调用window['函数名']() 调用方法

			}
		}
	};
}
if (isQQ) {
	addScript('//static.dd-img.com/h5/js/wx/sharemd5.js', function() {
		qqShare();
	});
}

function qqShare() {
	var wxShareData = {};
	//请求data按字典顺序排序，内含callback:wxJssdkShareSign以及url:location.href.split('#')[0]
	var getDataSort = function(data) {
		var sdic = Object.keys(data).sort();
		var newData = '';
		for (var ki in sdic) {
			if (ki == sdic.length - 1) {
				var date = new Date();
				var month = date.getMonth() + 1;
				if (month < 10) {
					month = '0' + month;
				}
				var day = date.getDate();
				if (day < 10) {
					day = '0' + day;
				}
				var hours = date.getHours();
				if (hours < 10) {
					hours = '0' + hours;
				}
				var dateStr = date.getFullYear() + "-" + month + '-' + day + ' ' + hours;
				newData += (sdic[ki] + "=" + data[sdic[ki]] + "diandongbang.com" + dateStr);
			} else {
				newData += (sdic[ki] + "=" + data[sdic[ki]] + "&");
			}
		}
		return newData;
	};
	var obj = {};
	obj.url = location.href.split('#')[0];
	var sign = getDataSort(obj);
	var data = {};
	data.url = obj.url;
	data.sign = md5(sign);
	$.getJSON('//item.diandong.com/globals/weixin/jsticket', data, function(res) {
		if (res.code == 0) {

			title = $.trim(title);
			wx.config({
				debug: false,
				appId: res.data.appId,
				timestamp: res.data.timestamp,
				nonceStr: res.data.nonceStr,
				signature: res.data.signature,
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				]
			});
			wx.ready(function() {
				// 公共方法  
				var shareData = {
					title: title,
					desc: summary,
					link: shareUrl,
					imgUrl: shareImg,
					trigger: function(res) {
						// alert('用户点击发送给朋友');   
					},
					success: function(res) {
						// alert('已分享');    
					},
					cancel: function(res) {},
					fail: function(res) {
						// alert(JSON.stringify(res));
					}
				};
				// 分享给朋友接口   
				wx.onMenuShareAppMessage(shareData);
				// 分享到朋友圈接口    
				wx.onMenuShareTimeline(shareData);
				console.log(shareData);
			});
			// 处理失败验证 
			wx.error(function(res) {
				console.log("error: " + res.errMsg);
			});

		}

	})
}
})
