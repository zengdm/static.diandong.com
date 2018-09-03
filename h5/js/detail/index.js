define(function(require, exports, module) {
    'use strict';
    var user = require('user');
    var tip = require('tip');
    var cookie = require('cookie');
    var Interval = require('interval');
    let api = require('api');
    require('tmplate');
    var open = require('open');
    var obj = {
        wordNum: 100,
        articleNum: 5000,
        replyFlag: true,
        page: 1,
        tipComment: '评论成功！',
        tipPraise: '点赞成功！',
        tipPraised: '您已经点过赞啦!',
        tipMsg: '请输入内容！',
        tipLogin: '请先登录哦',
        selfRpely: false,
        repeat: 1,
        repeatReply: 1
    }
    var pager = {
        page:'1',
        pageSize:'20',
        nomore:0,
        loading:0,
    }

    var Comment,
        replyList,
        replyid,
        replyidAdd,
        replyName,
        fhN;

    var ARICTLE_PRAISE = api.itemUrl + '/es/feed/agree';
    var GETPOINTS = api.itemUrl + '/es/getPoints';
    var LIKE_COMMENT = api.itemUrl + '/es/comment/supports';
    var CLICK_UPDATE = api.itemUrl + '/cms/article/click-update';
    var detail = {
        args: {
            sourceid: 0,
            platid: 0,
            container: '.comment'
        },
        elements: {
        },
        init:function(args){
            if($('.correlation').length > 0){
                this.moreContent();
            }
            // this.bindEvent();
            if (args && typeof(args.sourceid) != 'undefined' && typeof(args.platid) != 'undefined') {
                console.log('已传参---',args);
                // 已传参, 赋值
                this.args = args;
            } else {
                // 未传参,通过地址获取
                this.parseInit();
            }
            // 根据参数加载评论，否则不加载
            if (this.args.sourceid > 0 && this.args.platid > 0 && this.args.container && $(this.args.container).length) {
              
                this.bindEvent();
            }

            this.praiseNum();
            this.moreText();

             $.ajax({
                url: CLICK_UPDATE,
                data: {
                    sourceid: this.args.sourceid,
                    platid: this.args.platid
                },
                type: 'GET',
                success: function(res) {}
            });
        },
        //获取文章的点赞数
        praiseNum:function(){
            var that = this;
            $.ajax({
                url: GETPOINTS,
                data: {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                },
                type: 'get',
                success: function(res) {
                    if (res.code == 0) {
                        $('.add-comment-footer-praise>span').text(res.data.points.parise)
                    } 
                },
            })

        },

         // 对pc或移动页面通过地址获取contentid，适用于资讯详情页和视频详情页
        parseInit: function() {
            var location = window.location.href;
            var locationId = location.replace(/(.*\/)*([^.]+).html/ig,"$2");
            // console.log(locationId);
            this.args.sourceid = locationId;
            this.args.platid = 5;
        },
        bindEvent:function(){
            var that = this;
            user.getUserInfo();
            var cookieSource = 'rep' + user.id + that.args.sourceid;
            if (cookie.get(cookieSource)) {
                $('.add-comment-footer-praise').find('.not-praise').addClass('fn-hide');
                $('.add-comment-footer-praise').find('.have-praise').removeClass('fn-hide');
                $('.add-comment-footer-praise').find('span').addClass('comment-praise-v2');
            }

            $('.comment-item').each(function(idx, ele) {
                var index = idx;
                var cookieRep = 'rep' + user.id + that.args.sourceid + $(ele).data('replyid');
                if (cookie.get(cookieRep)) {
                    $('.comment-item').eq(index).find('.not-praise').addClass('fn-hide');
                    $('.comment-item').eq(index).find('.have-praise').removeClass('fn-hide');
                    $('.comment-item').eq(index).find('span').addClass('comment-praise-v2'); 
                }

            });

             // 评论点赞
            $('.comment').on('click', '.comment-item-info-author-praise', function() {
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                var replyids = $(self).parents('.comment-item').data('replyid');
                console.log(replyids)
                if (replyids == 'undefined') {
                    replyid = replyidAdd
                } else {
                    replyid = replyids;
                }
                if ($(self).find('.not-praise').hasClass('fn-hide')) {
                    tip.info(obj.tipPraised);
                    return false;
                }
                cookie.set('rep' + user.id + that.args.sourceid + replyid, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });

                $.ajax({
                    url: LIKE_COMMENT,
                    data: {
                        sourceid: that.args.sourceid,
                        platid: that.args.platid,
                        authorid: user.id,
                        replyid: replyid
                    },
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            console.log($(self));
                            $(self).find('.not-praise').addClass('fn-hide');
                            $(self).find('.have-praise').removeClass('fn-hide');
                            $(self).find('span').addClass('comment-praise-v2');
                            var praiseNum = parseInt($(self).find('span').html());
                            $(self).find('span').html(praiseNum + 1)
                            tip.success(obj.tipPraise);
                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled")
                        $(self).css("pointer-events", "auto");
                    }
                })

            });
              // 文章点赞
            $('.add-comment-footer').on('click','.add-comment-footer-praise', function(e) {
                var self = this;
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                };
                cookie.set('rep' + user.id + that.args.sourceid, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                e.stopPropagation();
                $.ajax({
                    url: ARICTLE_PRAISE,
                    data: {
                        // authorid: '121110',
                        uid: user.id,
                        // uid: '121110',
                        sourceid: that.args.sourceid,
                        platid: that.args.platid,
                        ftype: 'praise'
                    },
                    type: 'get',
                    success: function(res) {
                        if (res.code == 0) {
                            $(self).find('.not-praise').addClass('fn-hide');
                            $(self).find('.have-praise').removeClass('fn-hide');
                            $(self).find('span').addClass('comment-praise-v2');
                            var praiseNum = parseInt($(self).find('span').html());
                            $(self).find('span').html(praiseNum + 1)
                            tip.success(obj.tipPraise);

                        } else {
                            tip.info(obj.tipPraised);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled")
                        $(self).css("pointer-events", "auto");
                    }
                })

            })
            

        },
        moreText:function(){

            var context = this;
            var maxHeight = $(window).height() * 1.5;
            if($('.article-text').height() > maxHeight){
                $('.article-more').removeClass('fn-hide');
                $('.article-text').height(maxHeight);
            }
            $('.article-more').on('click',function(){
                $('.article-more').addClass('fn-hide');
                $('.article-text').height('auto');
                $('.article').css('padding-bottom','0.64rem');
            })
        },

        getMoreArticle: function(pageIndex,pageSize,pageAttr,callback){
            var that = this;
            $.ajax({
                url: api.uriGetMoreArticle+"/"+ pageIndex + "/" + pageSize + '/' + pageAttr,
                type: 'GET',
                success: function(data) {
                    callback(data);
                }
            })
        },
        moreFollow:function(articlelist){
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
            }).appendTo('.correlation');
  
        },
        moreContent: function() {
            var context = this;
            var isbool = true;
            $(window).on('scroll', function() {
                if (($(this).scrollTop() + $(window).height()) >= ($(document).height() - 100) && isbool == true) {

                    isbool = false;
                  
                    var moreFollow = '';
                    if (pager.loading == 0) {
                        pager.loading = 1;
                        //加载下一页数据
                        context.getMoreArticle(pager.page, pager.pageSize,'0',
                            function(data) {
                                isbool = true;
                                // console.log(data)
                                var data = JSON.parse(data);
                                if (data.code == 200) {
                                    let articlelist = data['data']['list'];
                                    context.moreFollow(articlelist);
                                    if (pager.page == data['data']['total_page']) {
                                        // $(self).next().show();
                                        // $('.examine-nomore').show()
                                        //全部数据
                                        pager.nomore = 1;
                                    } else {
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
            })
        },

       
    }
    module.exports = detail;
});