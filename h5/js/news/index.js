define(function(require, exports, module) {
    'use strict';
    require('swiper');
    require('tmplate');
    var user = require('user');
    var Interval = require('interval');
    let api = require('api');
    var open = require('open');
     var pager ={
        page:'1',
        pageSize:'20',
        nomore:0,
        loading:0,
    };
    var news = {
        asign: {
            navAsign: 0
        },
        elements: {
        	navTabBtn: $('.section-news-nav ul li a'),
            navTabCnt: $('.section-news-lump'),
        },
        init:function(){
            this.bindEvent();
            if($('.focus-wrapper').children().size() > 1){
                this.mainSwiper();
            }
            this.moreContent();
            this.allTab();
        },
        bindEvent:function(){
        },
        allTab:function(){
        	var context = this;
            if(!$('.section-news-more-'+ context.asign.navAsign).data('page')){
                $('.section-news-more-'+ context.asign.navAsign).data('page',1)
                 pager.page =  $('.section-news-more-'+ context.asign.navAsign).data('page')
            }else{
                pager.page =  $('.section-news-more-'+ context.asign.navAsign).data('page')
            }
		    this.elements.navTabBtn.on('click', function() {

                var index = context.elements.navTabBtn.index(this);
                context.asign.navAsign = $(this).data('id');
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    if(!$('.section-news-more-'+ context.asign.navAsign).data('page')){
                        $('.section-news-more-'+ context.asign.navAsign).data('page',1)
                    }else{
                        pager.page =  $('.section-news-more-'+ context.asign.navAsign).data('page')
                    }
                    context.elements.navTabBtn.removeClass('current');
                    context.elements.navTabBtn.eq(index).addClass('current');
                    context.elements.navTabCnt.addClass('fn-hide');
                    context.elements.navTabCnt.eq(index).removeClass('fn-hide');
                }

            });
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
        moreFollow:function(articlelist,cateid){
            //jquery.tmpl.js模板渲染数据
            let moreArticleTmplate = '';
            moreArticleTmplate += 
           '{{if img_type == "top_title_big_img"}}'+
                '<div class="section-news-item">'+
                    '<a href="'+ api.mainUrl +'/news/${contentid}.html' +'">'+
                        '<h1>${title}</h1>'+
                        '<div class="section-news-item-big">'+
                            '<img src="${$item.getImgUrl()}" alt="${title}">'+
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
                     '<a  href="'+ api.mainUrl +'/news/${contentid}.html' +'" class="clearfix">'+
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
            $.template( "moreArticleTmplate", moreArticleTmplate );
            $.tmpl('moreArticleTmplate',articlelist,{
                api:api,
                getImgUrl:function(){
                    return this.api.getImgDomain(this.data.img_link);
                },
                getTimer:function(){
                    var dateline = Interval.getDateDiff(this.data.published, true);
                    return dateline
                },
            }).appendTo('.section-news-more-' + cateid);
  
        },
        moreContent: function() {
                var context = this;
                var isbool = true;
                var noVideo;
                $(window).on('scroll', function() {
                    if (($(this).scrollTop() + $(window).height()) >= ($(document).height() - 100) && isbool == true) {
                        isbool = false;
                        if( context.asign.navAsign == 0){
                            noVideo = 1;
                        }else{
                            noVideo ='';
                        }
                        pager.page = parseInt($('.section-news-more-' + context.asign.navAsign).data('page'))
                        
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
                                            // $('.examine-nomore').show()
                                            //全部数据
                                            pager.nomore = 1;
                                        } else {
                                            //设置页数游标
                                            pager.page++;
                                            $('.section-news-more-' + context.asign.navAsign).data('page', pager.page)
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
        }

       
    }
    module.exports = news;
});