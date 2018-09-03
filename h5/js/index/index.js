define(function(require, exports, module) {
    'use strict';
    require('swiper');
    require('tmplate');
    var open = require('open');
    var user = require('user');
    var Interval = require('interval');
    let lbs = require('lbs');
    let push = require('push');
    let api = require('api');
    var pager = {
        page:'1',
        pageSize:'20',
        nomore:0,
        loading:0,
    }
    var index = {
        elements: {
        	navTabBtn: $('.filter-tab-button'),
            navTabCnt: $('.filter-tab-content'),
        },
        init:function(){
            //LBS模块初始化
            lbs.init(lbsLoader.init());
            this.bindEvent();
            // this.mainSwiper();
            this.moreContent();
        },
        bindEvent:function(){
        	this.allTab(this.elements.navTabBtn,this.elements.navTabCnt);
        },


        allTab:function(btn,ctn){
        	var context = this;
			btn.on('click', function() {
                var index = btn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    btn.removeClass('current');
                    btn.eq(index).addClass('current');
                    ctn.addClass('fn-hide');
                    ctn.eq(index).removeClass('fn-hide');
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
            //jquery.tmpl.js模板渲染数据
            let moreArticleTmplate = '';
            moreArticleTmplate += 
            '{{if img_type == "top_title_big_img"}}'+
                '<div class="section-news-item">'+
                    '{{if modelid == 1}}'+
                        '<a href="'+ api.mainUrl +'/news/${contentid}.html' +'">'+
                    '{{else}}'+
                        '<a href="'+ api.mainUrl +'/video/${contentid}.html' +'">'+
                    '{{/if}}'+
                        '<h1>${title}</h1>'+
                        '<div class="section-news-item-big">'+
                            '<img src="${$item.getImgUrl()}" alt="${title}">'+
                            '{{if modelid == 4}}'+
                            '<div></div>'+
                            '{{/if}}'+
                        '</div>'+
                        '<div class="section-news-item-content-info clearfix">'+
                            '<div class="section-news-item-content-info-mess fn-left">'+
                                '{{if thirdparty_name}}'+
                                '<span>${thirdparty_name}</span>'+
                                '{{/if}}'+
                                '<span>${$item.getTimer()}</span>'+
                            '</div>'+
                            '<div class="section-news-item-content-info-reading fn-right">${read_num}</div>'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '{{else}}'+
                '<div class="section-news-item">'+
                    '{{if modelid == 1}}'+
                        '<a href="'+ api.mainUrl +'/news/${contentid}.html' +'" class="clearfix">'+
                    '{{else}}'+
                        '<a href="'+ api.mainUrl +'/video/${contentid}.html' +'" class="clearfix">'+
                    '{{/if}}'+
                        '<div class="section-news-item-content fn-left">'+
                            '<div class="section-news-item-content-title">${title}</div>'+
                            '<div class="section-news-item-content-info clearfix">'+
                                '<div class="section-news-item-content-info-mess fn-left">'+
                                    '{{if thirdparty_name}}'+
                                    '<span>${thirdparty_name}</span>'+
                                    '{{/if}}'+
                                    '<span>${$item.getTimer()}</span>'+
                                '</div>'+
                                '<div class="section-news-item-content-info-reading fn-right">${read_num}</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="section-news-item-pic fn-right">'+
                            '<img src="${$item.getImgUrl()}" alt="${title}">'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '{{/if}}';

            

            $.template( "moreArticleTmplate", moreArticleTmplate);
            $.tmpl('moreArticleTmplate',articlelist,{
                api:api,
                getImgUrl:function(){
                    return this.api.getImgDomain(this.data.img_link);
                },
                getTimer:function(){
                    var dateline = Interval.getDateDiff(this.data.published, true);
                    return dateline
                },
            }).appendTo(".section-news");
        },

        moreContent:function(){
            var context = this;
            var isbool = true
            $(window).on('scroll', function() {
                if (($(this).scrollTop() + $(window).height()) >= ($(document).height() - 100) && isbool == true) {
                    isbool = false;
                //保证数据并不是正在加载
                    if(pager.loading == 0){
                        //数据正在加载
                        pager.loading = 1;
                        //加载下一页数据
                        context.getMoreArticle(pager.page,pager.pageSize,
                                function(data){
                                    if(data.code == 200){
                                         isbool = true;
                                        let articlelist = data['data']['list'];
          
                                        context.moreFollow(articlelist);
                                        //测试最后一页
                                        //data['data']['total_page'] = 2
                                        if(pager.page == data['data']['total_page']){
                                            // $('.examine-nomore').show();
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
                 }

            });

        },
        mainSwiper:function(){
        	var focusSwiper = new Swiper('.focus-container', {
	            pagination: '.pagination',
	            loop: true,
	            grabCursor: true,
	            autoplay: 5000,
	            autoplayDisableOnInteraction: false,
	            wrapperClass: 'focus-wrapper',
	            slideClass: 'focus-slide'
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
            // lbsLoader.onLoadResource(adcode,adname);

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
    module.exports = index;
});