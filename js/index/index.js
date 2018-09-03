define(function(require, exports, module) {
    'use strict';
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
            utilityTabBtn: $('.car-nav a'),
            utilityTabCnt: $('.car-text'),
            videoItem: $('.news-video-item'),
            videoItemTitle: $('.news-video-item-title'),
            recommendTabBtn: $('.recommend-nav-item'),
            recommendTabCnt: $('.recommend-tab'),
            recommendItem: $('.recommend-tab-item'),
            recommendItemImg: $('.recommend-tab-item-car img'),
            recommendItemP: $('.recommend-tab-item-car p'),
            recommendItemEnd: $('.recommend-tab-item-endurance-car'),
            addressCity: $('.address .news-video-title-more'),
            cityBox: $('.address-city'),
            cityItem: $('.address-city-box-item'),
            cityName: $('.address .news-video-title-more a'),
            activityTabBtn: $('.timer-activity-tab-item'),
            activityTabCnt: $('.timer-activity-pic-item'),
            goTop: $('.suspension-top'),
            swiperPage: $('.swiper-pagination-switch'),

            footerTabBtn: $('.footer-link-layout-title span'),
            footerTabCnt: $('.footer-link-layout-website'),
            moveBtn: $('.examine-more'),
            scrollWraper: $('.follow'),


        },
        init: function() {
            this.bindEvent();
            this.originalVideo();
            this.carRecommend();
            this.showCar();
            this.cityClick();
            this.suspensionBox();
            this.imgTab();
            this.countDown(obj.endTime);
            this.moreContent();
            this.footerLink();

        },

        //底部
        footerLink:function(){
            var context = this;

            this.elements.footerTabBtn.on('click', function() {

                var index = context.elements.footerTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.footerTabBtn.removeClass('current');
                    context.elements.footerTabBtn.eq(index).addClass('current');
                    context.elements.footerTabCnt.addClass('fn-hide');
                    context.elements.footerTabCnt.eq(index).removeClass('fn-hide');
                }

            });

        },
        getMoreArticle:function(pageIndex,pageSize,callback){
            //1/20
            $.ajax({
                url: api.uriGetMoreArticle+"/"+pageIndex+"/"+pageSize+"?article_ids="+global_page_data.article_unique_token,
                type: 'GET',
                dataType: "json",
                success: function(data) {

                    callback(data)
                }
            });
        },
        moreFollow:function(articlelist){
            let context = this;

            //jquery.tmpl.js模板渲染数据
            let moreArticleTmplate = '';
            moreArticleTmplate += 
            '<div class="news-box-item fn-left">'+
                '{{if modelid==4}}'+
                '<img class="news-box-item-display" src="//i1.dd-img.com/assets/image/1532576037-651cb25e67cfb5a5-60w-60h.png">'+
                '{{else modelid==1}}'+
                '<div class="news-box-item-icon ${tag}">'+
                '   <span>${tag_name}</span>'+
                ' </div>'+
                '{{/if}}'+
                '<div class="news-box-item-pic">'+
                    '<a href="${url}" target="_blank" >'+
                        '<img src="${$item.getImgUrl()}" alt="${title}"/>'+
                    '</a>'+
                '</div>'+
                '<div class="news-box-item-title">'+
                    '<a href="${url}" target="_blank">${title}</a>'+
                '</div>'+
                '<div class="news-box-item-info clearfix">'+
                    '<div class="news-box-item-info-mess fn-left">'+
                        '<a href="//search.diandong.com/zonghe/?words=${tags[0]}" target="blank">${tags[0]}</a> {{if (tags[1]) }}<span>|</span><a href="//search.diandong.com/zonghe/?words=${tags[1]}" target="blank">${tags[1]}</a>{{/if}}'+
                    '</div>'+
                    '<div class="news-box-item-info-date fn-right">'+
                        '${date}'+
                    '</div>'+
                '</div>'+
            '</div>';
            $.template( "moreArticleTmplate", moreArticleTmplate);
            $.tmpl('moreArticleTmplate',articlelist,{
                api:api,
                getImgUrl:function(){
                    return this.api.getImgDomain(this.data.img_link);
                }
            }).appendTo( ".follow-item" );
  
        },
        moreContent:function(){
            var context = this;
            this.elements.moveBtn.click(function () {
                //保证数据并不是正在加载
                if(pager.loading == 0){
                    //数据正在加载
                    pager.loading = 1;
                    //加载下一页数据
                    context.getMoreArticle(pager.page,pager.pageSize,
                            function(data){

                                if(data.code == 200){
                                    let articlelist = data['data']['list'];
      
                                    context.moreFollow(articlelist);
                                    //测试最后一页
                                    //data['data']['total_page'] = 2
                                    if(pager.page == data['data']['total_page']){
                                        $('.examine-more').hide();
                                        $('.examine-nomore').show();
                                        //全部数据
                                        pager.nomore = 1;
                                    }else{
                                        //设置页数游标
                                        pager.page++;
                                    }
                                }
                                //数据加载完毕
                                pager.loading = 0;
                            }
                    );
                }

            });
        },


        stamp: function(day) {
            var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
            return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
        },

        countDown: function(timestamp) {
            var self = this;
            var getDay = $(obj.timer).eq(0);
            var getHour = $(obj.timer).eq(1);
            var getMin = $(obj.timer).eq(2);
            var countDownTime;

            function blockTime() {
                var nowTime = new Date();
                var nowSec = Math.floor(nowTime.getTime()/1000);
                // 获取时间戳
                var t = timestamp - nowSec;

                // console.log(Math.floor(nowTime.getTime()/1000))
                // console.log(timestamp);
                if (t <= 0) {
                    countDownTime = '00';
                    $(obj.timer).html(countDownTime)
                    clearInterval(self.interval);
                    return;
                }
                var day = Math.floor(t / 60 / 60 / 24);
                var hour = Math.floor(t / 60 / 60 % 24);
                var min = Math.floor(t / 60 % 60);
                if (day < 10) day = "0" + day;
                if (hour < 10) hour = "0" + hour;
                if (min < 10) min = "0" + min;
                getDay.html(day);
                getHour.html(hour);
                getMin.html(min);
            }

            this.interval = setInterval(function() {
                blockTime();
            }, 1000);
            blockTime();
        },

        bindEvent: function() {

            var context = this;
            //userNamePanel:$('.user-panel-name'),
            //userAvatarPanel:$('.user-panel-avatar'),

            $('.user-panel-name').on('click',function(){
                window.location.href = 'http://passport.diandong.com/ark/baseinfo';
            });
            $('.user-panel-avatar').on('click',function(){
                window.location.href = 'http://passport.diandong.com/ark/baseinfo';
            });
            
            $('.newnav-logo ').on('click',function(){
                window.location.href = '://www.diandong.com/index.html';
            });


            this.elements.utilityTabBtn.on('mouseenter', function() {

                var index = context.elements.utilityTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.utilityTabBtn.removeClass('current');
                    context.elements.utilityTabBtn.eq(index).addClass('current');
                    context.elements.utilityTabCnt.addClass('fn-hide');
                    context.elements.utilityTabCnt.eq(index).removeClass('fn-hide');
                }

            });

            this.elements.goTop.click(function (){
                $('html,body').animate({scrollTop: 0},'slow');
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

        carRecommend:function(){
           var context = this;

            this.elements.recommendTabBtn.on('mouseenter', function() {

                var index = context.elements.recommendTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.recommendTabBtn.removeClass('current');
                    context.elements.recommendTabBtn.eq(index).addClass('current');
                    context.elements.recommendTabCnt.addClass('fn-hide');
                    context.elements.recommendTabCnt.eq(index).removeClass('fn-hide');

                    
                    context.elements.recommendItem.removeClass('pic');
                    context.elements.recommendItemImg.addClass('fn-hide');
                    context.elements.recommendItemP.removeClass('fn-hide');
                    context.elements.recommendItemEnd.addClass('fn-hide');


                    context.elements.recommendItem.eq(9*index).addClass('pic');
                    context.elements.recommendItemImg.eq(9*index).removeClass('fn-hide');
                    context.elements.recommendItemP.eq(9*index).addClass('fn-hide');
                    context.elements.recommendItemEnd.eq(9*index).removeClass('fn-hide');


                }

            });
        },

        showCar:function(){
            var context = this;
            // console.log(recommendItem);

                this.elements.recommendItem.on('mouseenter', function() {

                    var index = context.elements.recommendItem.index(this);
                    if ($(this).hasClass('pic')) {
                        return;
                    } else {
                        context.elements.recommendItem.removeClass('pic');
                        context.elements.recommendItemImg.addClass('fn-hide');
                        context.elements.recommendItemP.removeClass('fn-hide');
                        context.elements.recommendItemEnd.addClass('fn-hide');


                        context.elements.recommendItem.eq(index).addClass('pic');
                        context.elements.recommendItemImg.eq(index).removeClass('fn-hide');
                        context.elements.recommendItemP.eq(index).addClass('fn-hide');
                        context.elements.recommendItemEnd.eq(index).removeClass('fn-hide');
                    }

            });
        },
        cityClick:function(){
            var context = this;

            this.elements.addressCity.on('click', function(event) {
                context.elements.cityBox.removeClass('fn-hide');
                event.stopPropagation();
            });
            this.elements.cityItem.on('click', function() {
                var cityName = $(this).data('cityname')
                context.elements.cityName.text(cityName);
                var cityData = $(this).data('city');
                let local_article = global_page_data.local_article_json.postion_list[cityData];
                let local_article_tmplate ='\
                    <div class="local-news-place" id="local_article">\
                        {{each(i,article) article_list}} \
                            {{if i==0}}\
                            <div class="address-pic"> \
                               <a href="${ article.url }" target="_blank"> \
                                    <img class="" src="${ article.img_link }"  /> \
                                    <div class="address-pic-title">${ article.title }</div> \
                                </a> \
                             </div> \
                             {{else}}\
                            <div class="address-list">\
                                <div class="address-list-item">\
                                    <a href="${article.url}" target="_blank">${ article.title }</a>\
                                </div>\
                            </div>\
                             {{/if}}\
                        {{/each}} \
                    </div>\
                ';

                $.template( "local_article_tmplate", local_article_tmplate);
                $.tmpl('local_article_tmplate',local_article).replaceAll('#local_article');
                //console.log(local_article);
                context.elements.cityBox.addClass('fn-hide');
            });

        },

        suspensionBox:function(){
            $('.suspension-box').on({
                mouseover:function(){
                    $(this).css({"color":"#fff","background":"#5c84f0"});
                    $(this).find('.suspension-main').addClass('fn-hide');
                    $(this).find('.suspension-fllow').removeClass('fn-hide');

                    if($(this).hasClass('suspension-code')){
                        $('.code-pic').removeClass('fn-hide');
                        $('.suspension').css('z-index','999');
                    }
                } ,
                mouseout:function(){
                    $(this).css({"color":"#999","background":"#fff"});
                    $(this).find('.suspension-main').removeClass('fn-hide');
                    $(this).find('.suspension-fllow').addClass('fn-hide');
                    if($(this).hasClass('suspension-code')){
                        $('.code-pic').addClass('fn-hide');
                       $('.suspension').css('z-index','1');
                    }
                } 
             });

            $('.code-pic').on({
                mouseover:function(){
                  $(this).removeClass('fn-hide');
                } ,
                mouseout:function(){
                   $(this).addClass('fn-hide');
                } 
             });

            $('.suspension-calculator').on('click',function(){
                window.open("http://car.diandong.com/counter/fullcounter/");
            })
            $('.suspension-search').on('click',function(){
                window.open("http://www.diandong.com/yaohao/");
            })

        },


        // scrollSwiper: function () {
        //     var context = this;
        //     var page = 1;//当前页
        //     var num = 4; //每页显示条数
        //     var height = 305; //每列高度
        //     var size = 4; //每列个数
        //     var _num = size * num; //一次显示数量
        //     var _height = size * height;
        //     var _top = this.elements.scrollWraper[0].offsetTop; //容器距离顶部高度
        //     this.elements.scrollWraper.addClass("fn-hide");
        //     context.elements.scrollWraper.find(".news-box-item.fn-left:gt(" + (_num * page - 1) + ")").addClass("fn-hide");
        //     $(window).scroll(function () {
        //         if ($(this).scrollTop() >= (page - 1) * _height + _top) { //滚动距离超过当前显示条数时，
        //             page++;
        //             context.elements.scrollWraper.find(".news-box-item.fn-left:lt(" + _num * page + ")").removeClass("fn-hide");
        //         }
        //     })
        // },

        imgTab:function(){
            var context = this;
            // var objs =[{endTime:obj.endTime},
            //      {endTime:'2018-7-26 09:12:30'},
            //      {endTime:'2018-7-19 07:39:00'}];
            $('.timer-activity-tab-box').on('mouseover','.timer-activity-tab-item',function() {
                clearInterval(context.interval);
                // console.log($(this))
                var endTime = $(this).data('endtime')
                var index =  context.elements.activityTabBtn.index(this);
                // console.log(endTime);
                context.countDown(endTime);
                context.elements.activityTabCnt.addClass('fn-hide');
                context.elements.activityTabCnt.eq(index).removeClass('fn-hide');
            });
        }
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
            //本地资讯选中地区
            if ($('div.address-city-box-item[data-city='+adcode+']').length > 0){
                $('div.address-city-box-item[data-city='+adcode+']').click();
            }

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