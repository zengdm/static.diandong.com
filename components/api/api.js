define(function(require, exports, module) {
    'use strict';
    var domain = '//openapi.diandong.com';
    var addomain = '//openad.dd-img.com';
    let imgDomainArr = ['i2.dd-img.com','i1.dd-img.com','i3.dd-img.com','i4.dd-img.com']
    //let imgDomainArr = ['i2.dd-img.com']
    var api = {
    	domain:domain,
    	addomain:addomain,
        uriGetMoreArticle : domain+'/index/articleList',
        uriGetMoreVideo : domain+'/video/videoList',
        // 轮播接口
        swiperAd: domain + '/index/getFocusAdInfo',
		// 头部轮播
		swiperHeader: domain + '/index/focusAdData',
        swiperNewsHeader: domain + '/news/focusAdData',
		 // 高清大图轮播
		swiperBig: domain + '/index/hdPicData',
		// 活动轮播及底部轮播
    	swiperbtm: domain + '/index/focusActivityData',
    	getImgDomain:function(imgUrl){
                var index = Math.floor((Math.random()*imgDomainArr.length)); 
                imgUrl = imgUrl.replace(/i[0-9]+.dd-img.com/i,imgDomainArr[index]);
                return imgUrl;
            }
       	}
    module.exports = api;
});