define(function(require, exports, module) {
    'use strict';
    require('tmplate');
    var user = require('user');
    var Interval = require('interval');
    let api = require('api');
    let cookie = require('cookie');
    require('tongji');
    var loginToken = cookie.get('ark_remembertoken');
    var pager = {
        page:'2',
        pageSize:'10',
        nomore:0,
        loading:0,
        questionId:'',
    }
    var askDetail = {
        elements: {
        },
        init:function(){
            this.bindEvent();
            this.moreContent();
        },
        bindEvent:function(){
            var location = window.location.href;
            pager.questionId = location.replace(/(.*\/)*([^.]+).html/ig,"$2");
        },

        getMoreArticle:function(questionId,pageIndex,pageSize,loginToken,callback){
            if (typeof(loginToken) == "undefined"){
                loginToken = ""
            }else{
                loginToken = "?loginToken="+loginToken
            }
            $.ajax({
                url: api.uriGetMoreQuestion+"/"+questionId+"/"+pageIndex+"/"+pageSize+loginToken,
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
                '<div class="comment-item">'+
                '<div class="comment-item-pic">'+
                    '{{if avatar == ""}}'+
                    '<img src="//i1.dd-img.com/assets/image/1517466287-bb81d5d98c3824fd-512w-509h.png" alt="">'+
                    '{{/if}}'+
                    '<img src="${avatar}" alt="">'+
                '</div>'+
                '<div class="comment-item-info">'+
                    '<h3>${author}</h3>'+
                    '<p>${content}</p>'+
                    '{{if img.length > 0}}'+
                    '<div class="comment-item-info-img">'+
                        '{{each(i,imgItem) img}}'+
                        '<div class="comment-item-info-img-box">'+
                            '<img src="${imgItem}" alt="">'+
                        '</div>'+
                        '{{/each}}'+
                   '</div>'+
                   '{{/if}}'+
                   '{{if reply.length > 0}}'+
                    '<div class="comment-item-info-reply">'+
                       '{{each(i,replys) reply}}'+
                       '<div class="comment-item-info-reply-item">'+
                           '{{if replys.reply_author == ""}}'+
                           '<span>${replys.author}</span>：${replys.content}'+
                           '{{else}}'+
                            '<span>${replys.author}</span>回复<span>${replys.reply_author}</span>：${replys.content}'+
                           '{{/if}}'+
                        '</div>'+
                        '{{/each}}'+
                    '</div>'+
                    '{{/if}}'+
                    '<div class="comment-item-info-author">'+
                        '<div class="comment-item-info-author-timer">${$item.getTimer()}</div>'+
                        '<div class="comment-item-info-author-praise">'+
                            '{{if is_agree}}'+
                            '<img class="have-praise" src="//static.dd-img.com/h5/img/detail/like-item-red.png" alt="">'+
                            '{{else}}'+
                            '<img class="not-praise" src="//static.dd-img.com/h5/img/detail/like-item-gray.png" alt="">'+
                            '{{/if}}'+
                            '{{if supports > 0}}'+
                            '<span>${supports}</span>'+
                            '{{/if}}'+
                        '</div>'+
                        '<div class="comment-item-info-author-discuss">'+
                           ' <a href="javascript:;"></a>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
            
            

            $.template( "moreArticleTmplate", moreArticleTmplate);
            $.tmpl('moreArticleTmplate',articlelist,{
                api:api,
                getTimer:function(){
                    var dateline = Interval.getDateDiff(this.data.showTime, true);
                    return dateline
                },
            }).appendTo(".all-answer");
        },

        moreContent:function(){
            var context = this;
            var isbool = true;
            var itemLength = $('.all-answer .comment-item').length;
            $(window).on('scroll', function() {
                if (($(this).scrollTop() + $(window).height()) >= ($(document).height() - 100) && isbool == true && itemLength == 10) {
                    isbool = false;
                //保证数据并不是正在加载
                    if(pager.loading == 0){
                        //数据正在加载
                        pager.loading = 1;
                        //加载下一页数据
                        context.getMoreArticle(pager.questionId,pager.page,pager.pageSize,loginToken,
                                function(data){
                                    if(data.code == 200){
                                         isbool = true;
                                        let articlelist = data['data']['reply'];
                                        context.moreFollow(articlelist);
                                        //测试最后一页
                                        //data['data']['total_page'] = 2
                                        if(pager.page == data['data']['total_page'] || data['data']['total_page'] == 1){
                                            // $('.examine-nomore').show();
                                            //全部数据
                                            pager.nomore = 1;
                                            isbool = false;

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
       
    }
    module.exports = askDetail;
});