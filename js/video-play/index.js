define(function(require, exports, module) {
    'use strict';
    var comment = require('comment');
    require('swiper');
    require('lazyload');
    require('tmplate');
    let lbs = require('lbs');
    let push = require('push');
    let api = require('api');
    // var Footer = require('footer');
    // var footer = new Footer();
    // var App = require('../public');
    // var app = new App();
    var news;
    news = {
        elements: {
        },
        init: function() {
            subsidyUtility.init();
            //LBS模块初始化
            lbs.init(lbsLoader.init());
            comment.init();
            // this.initSwipers()
            this.bindEvent();
            $('body').click(function(){
                $('.address-city').addClass('fn-hide');
            })
        },
        bindEvent: function() {
            var context = this;
        },
    };
    var endtimeLoad = $('.timer-activity-tab-item').eq(0).data('endtime');
    var obj = {
        timer:'.timer-activity-tab-timer-num>p',
        //结束时间
        // endTime: '2018-7-20 00:00:00',
        endTime: endtimeLoad,
    };
    var pager = {
        page:'1',
        pageSize:'16',
        nomore:0,
        loading:0,
    }
    var subsidyUtility = {
        elements: {
            videoItem: $('.news-video-item'),
            videoItemTitle: $('.news-video-item-title'),
        },
        init: function() {
            this.bindEvent();
            this.originalVideo();
            this.share();
        },
        share:function(){
            var shareMobileUrl = $('.video-play-main-share').data('urlmobile');
            var shareUrl = window.location.href;
            var shareTitle = $('.video-play-main-title span').text();
          
            $(".shareWb").on("click",function(){
                $(this).socialShare('sinaWeibo',{
                    url:shareUrl,
                    title:shareTitle
                });
            });
            $(".shareWx").on("click",function(){
                $(this).socialShare('weixinShare',{
                    url:shareMobileUrl,
                    title:shareTitle
                });
            });
        },
        originalVideo:function(){
            var context = this;
            this.elements.videoItem.on('mouseenter', function() {
                var index = context.elements.videoItem.index(this);
                if ($(this).find('.news-video-item-title').hasClass('current')) {
                    return;
                } else {
                    context.elements.videoItemTitle.removeClass('current');
                    context.elements.videoItemTitle.eq(index).addClass('current');

                }
            });
            this.elements.videoItem.on('mouseleave', function() {
                context.elements.videoItemTitle.removeClass('current');
            });
        },
        stamp: function(day) {
            var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
            return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
        },
        bindEvent: function() {
            var context = this;
            $('.user-panel-name').on('click',function(){
                window.location.href = 'http://passport.diandong.com/ark/baseinfo';
            });
            $('.user-panel-avatar').on('click',function(){
                window.location.href = 'http://passport.diandong.com/ark/baseinfo';
            });
            
            $('.newnav-logo ').on('click',function(){
                window.location.href = '://www.diandong.com/index.html';
            });
        },

    };
    //Lbs接入对象
    var lbsLoader = {
        init:function(){
            return this;
        },
        //拿到位置信息的回调
        onPosition:function(adcode,adname){
            //doing something for pos get
            lbsLoader.onLoadResource(adcode,adname)
             push.showAd(adcode);
             push.swiperAd(adcode);
        },
        onPositionChange:function(adcode,adname){
             push.showAd(adcode);
             push.swiperAd(adcode);
        },
        onLoadResource:function(adcode,adname){
            //设置顶部定位展示
            $('.current-city > a').html(adname);
        }
    };

    module.exports = news;

})