define(function(require, exports, module) {
    'use strict';
    require('swiper');
    require('lazyload');
    require('tmplate');
    let lbs = require('lbs');
    let push = require('push');
    let api = require('api');


    var video;
    video = {
        elements: {
        },
        init: function() {
            subsidyUtility.init();
            //LBS模块初始化
            lbs.init(lbsLoader.init());
            this.initSwipers()
            this.bindEvent();

        },
        initSwipers:function(){
            //subsidyUtility.scrollSwiper();
            subsidyUtility.initSwiper();
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
    var obj = {
        timer:'.timer-activity-tab-timer-num>p',
        //结束时间
        endTime: '2018-7-17 00:00:00',
    };
    var pager = {
        page:'2',
        pageSize:'12',
        nomore:0,
        loading:0,
    }
  	var subsidyUtility = {
        elements: {

            moveBtn: $('.examine-more'),
            swiperPage: $('.swiper-pagination-switch'),

        },
        init: function() {
            this.bindEvent();
            this.moreContent();
        },
        bindEvent:function(){

        },
        getMoreArticle:function(pageIndex,pageSize,callback){
            //1/20
            $.ajax({
                url: api.uriGetMoreVideo+"/"+pageIndex+"/"+pageSize+"?article_ids="+global_page_data.article_unique_token,
                type: 'GET',
                dataType: "json",
                success: function(data) {
                    callback(data)
                }
            });
        },
        moreFollow:function(articlelist){
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
                        '<a href="//search.diandong.com/zonghe/?words=${tags[0]}"  target="_blank">${tags[0]}</a>{{if (tags[1]) }}<span>|</span>${tags[1]} {{/if}}'+
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
            }).appendTo(".follow-item" );
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

        initSwiper: function() {
           var context = this;
           var indexVideoSwiper = new Swiper('.focus-swiper', {
                // autoplay: 3000,
                pagination: '.pagination',
                paginationClickable: true,
                createPagination: false,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'focus-display',
                slideClass: 'focus-display-item',
                observer:true,
                observeParents:true,
                onSlideChangeEnd: function(swiper){ 
                    $(".focus-display-item img").each(function(k,v){
                        $(this).attr('src',$(this).attr('data-src'))
                    })
                    //console.log(swiper.activeIndex)
                } 
            });

            this.elements.swiperPage.on('mouseenter', function() {
                var index = context.elements.swiperPage.index(this);
                indexVideoSwiper.swipeTo(index,500)
            });


            $('.focus-swiper,.pagination').on({
                mouseover:function(){
                    $('.pagination').removeClass('fn-hide');
                } ,
                mouseout:function(){
                     $('.pagination').addClass('fn-hide');
                } 
             });
            //存储mainSwiper 以便修改使用
            window.indexVideoSwiper = indexVideoSwiper;
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
             push.showAd(adcode);
        },
        onPositionChange:function(adcode,adname){
             push.showAd(adcode);
        },
        onLoadResource:function(adcode,adname){
            //设置顶部定位展示
            $('.current-city > a').html(adname);

        }
    };

    module.exports = video;

})