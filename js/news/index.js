define(function(require, exports, module) {
    'use strict';
    require('swiper');
    require('tmplate');

    let lbs = require('lbs');
    let push = require('push');
    let api = require('api');
    var news;
    
    news = {

        elements: {

        },


        init: function() {
            subsidyUtility.init();
            //LBS模块初始化
            lbs.init(lbsLoader.init());
            this.bindEvent();
        },

        bindEvent: function() {
            var context = this;
        },
    };

    var pager ={
        page:'1',
        pageSize:'18',
        nomore:0,
        loading:0,
    };
    
    var subsidyUtility = {
        asign: {
            navAsign: 0
        },
        elements: {
            utilityTabBtn: $('.news-video-title-more.news a'),
            utilityTabCnt: $('.news .address-list'),
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
            cityName: $('.news-video-title-more a'),
            activityTabBtn: $('.timer-activity-tab-item'),
            activityTabCnt: $('.timer-activity-pic-item'),
            goTop: $('.suspension-top'),
            swiperPage: $('.swiper-pagination-switch'),


            navTabBtn: $('.news-header a'),
            navTabCnt: $('.news-intro'),

            channelTabBtn: $('#news-channel-nav a'),
            channelTabCnt: $('.news-channel-box'),

            linkTabBtn: $('.link .news-channel-nav a'),
            linkTabCnt: $('.news-channel-box-link'),

            moveBtn: $('.examine-more'),
            scrollWraper: $('.follow'),

        },
        init: function() {
            this.bindEvent();
            //大导航
            this.classifyNav();
            this.originalVideo();
            this.carRecommend();
            this.showCar();
            // this.newsSwiper();
            this.moreContent();
            //专区频道
            this.specialChannel();
            //友情链接
            this.myLinks();
            this.elements.moveBtn.hide();
            this.fixedFooter();
        },
        fixedFooter:function(){
            setTimeout(function(){
                var footerOffset = $('.footer').offset().top - ($(window).height()-$(".footer").outerHeight(true));
                
                $(window).on('scroll',function(){
                    // console.log($(document).scrollTop());
                    if($(document).scrollTop() >= footerOffset){
                        $('.footer').addClass('footer-fixed');
                    }else{
                        $('.footer').removeClass('footer-fixed');
                    }
                })
           },1000)
   
        },
        getMoreArticle: function(pageIndex,pageSize,pageAttr,noVideo,token,callback){
            var that = this;
            $.ajax({
                url: api.uriGetMoreArticle+"/"+ pageIndex + "/" + pageSize + '/' + pageAttr + '?noVideo=' + noVideo + "&article_ids=" + token,
                type: 'GET',
                success: function(data) {
                    callback(data);
                }
            })
        },
        classifyNav:function(){
            var context = this;
            if(!$('.follow-item-'+ context.asign.navAsign).data('page')){
                $('.follow-item-'+ context.asign.navAsign).data('page',1)
                 pager.page =  $('.follow-item-'+ context.asign.navAsign).data('page')
            }else{
                pager.page =  $('.follow-item-'+ context.asign.navAsign).data('page')
            }
            this.elements.navTabBtn.on('click', function() {
                var index = context.elements.navTabBtn.index(this);
                context.asign.navAsign = $(this).data('id');
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    if(!$('.follow-item-'+ context.asign.navAsign).data('page')){
                        $('.follow-item-'+ context.asign.navAsign).data('page',1)
                    }else{
                        pager.page =  $('.follow-item-'+ context.asign.navAsign).data('page')
                    }
                    context.elements.navTabBtn.removeClass('current');
                    context.elements.navTabBtn.eq(index).addClass('current');
                    context.elements.navTabCnt.addClass('fn-hide');
                    context.elements.navTabCnt.eq(index).removeClass('fn-hide');

                }

            });
        },
        moreFollow:function(articlelist,cateid){
            //jquery.tmpl.js模板渲染数据
            let moreArticleTmplate = '';
            moreArticleTmplate += 
            '<div class="news-box-item fn-left">'+
                '<div class="news-box-item-icon ${tag}">'+
                '   <span>${tag_name}</span>'+
                ' </div>'+
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
            $.template( "moreArticleTmplate", moreArticleTmplate );
            $.tmpl('moreArticleTmplate',articlelist,{
                api:api,
                getImgUrl:function(){
                    return this.api.getImgDomain(this.data.img_link);
                }
            }).appendTo('.follow-item-' + cateid);
  
        },
        moreContent: function() {
                var context = this;
                var isbool = true;
                var noVideo;
                $(window).on('scroll', function() {
                    if (($(this).scrollTop() + $(window).height()) >= ($(document).height() - 400) && isbool == true) {
                        isbool = false;
                        if( context.asign.navAsign == 0){
                            noVideo = 1;
                        }else{
                            noVideo ='';
                        }
                        pager.page = parseInt($('.follow-item-' + context.asign.navAsign).data('page'))
                        
                        let findex = $('a[data-id='+context.asign.navAsign+']').index();
                        let token = global_page_data.article_unique_token[''+findex];
                        var moreFollow = '';
                        if (pager.loading == 0) {
                            pager.loading = 1;
                            //加载下一页数据
                            context.getMoreArticle(pager.page, pager.pageSize, context.asign.navAsign,noVideo,token,
                                function(data) {
                                    isbool = true;
                                    // console.log(data)
                                    var data = JSON.parse(data);
                                    if (data.code == 200) {
                                        let articlelist = data['data']['list'];
                                        context.moreFollow(articlelist, context.asign.navAsign);
                                        if (pager.page == data['data']['total_page']) {
                                            // $(self).next().show();
                                            $('.examine-nomore').show()
                                            //全部数据
                                            pager.nomore = 1;
                                        } else {
                                            //设置页数游标
                                            pager.page++;
                                            $('.follow-item-' + context.asign.navAsign).data('page', pager.page)
                                        }
                                    }
                                    //数据加载完毕
                                    pager.loading = 0;
                                }

                            );
                        }
                    }
                })
        },


        newsSwiper:function(){
            var myActiveSwiper = new Swiper('.news-swiper-container',{
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'news-swiper-wrapper',
                slideClass: 'news-swiper-slide',
              })
              $('.news-left').on('click', function(e){
                e.preventDefault()
                myActiveSwiper.swipePrev()
              })
              $('.news-right').on('click', function(e){
                e.preventDefault()
                myActiveSwiper.swipeNext()
              })
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
            this.elements.utilityTabBtn.on('click', function() {

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


                    context.elements.recommendItem.eq(8*index).addClass('pic');
                    context.elements.recommendItemImg.eq(8*index).removeClass('fn-hide');
                    context.elements.recommendItemP.eq(8*index).addClass('fn-hide');
                    context.elements.recommendItemEnd.eq(8*index).removeClass('fn-hide');


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

        specialChannel:function(){
            var context = this;
            this.elements.channelTabBtn.on('click', function() {

                var index = context.elements.channelTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.channelTabBtn.removeClass('current');
                    context.elements.channelTabBtn.eq(index).addClass('current');
                    context.elements.channelTabCnt.addClass('fn-hide');
                    context.elements.channelTabCnt.eq(index).removeClass('fn-hide');

                }

            });
        },

        myLinks:function(){
            var context = this;
            this.elements.linkTabBtn.on('click', function() {

                var index = context.elements.linkTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.linkTabBtn.removeClass('current');
                    context.elements.linkTabBtn.eq(index).addClass('current');
                    context.elements.linkTabCnt.addClass('fn-hide');
                    context.elements.linkTabCnt.eq(index).removeClass('fn-hide');

                }

            });
        },



   


    };
    var lbsLoader = {
        init:function(){
            return this;
        },
        //拿到位置信息的回调
        onPosition:function(adcode,adname){
            //doing something for pos get
            lbsLoader.onLoadResource(adcode,adname)
             push.showAd(adcode);
             push.swiperAd(adcode)
        },
        onPositionChange:function(adcode,adname){
             push.showAd(adcode);
             push.swiperAd(adcode)
        },
        onLoadResource:function(adcode,adname){
            //设置顶部定位展示
            $('.current-city > a').html(adname);
        }
    };
   

    module.exports = news;

})