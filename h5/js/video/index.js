define(function(require, exports, module) {
    'use strict';
    require('tmplate');
    let api = require('api');
    var Interval = require('interval');
    var open = require('open');
    var pager = {
        page:'1',
        pageSize:'20',
        nomore:0,
        loading:0,
    }
    var video = {
        elements: {
        },
        init:function(){
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
            '<div class="section-news-item">'+
                '<a href="'+ api.mainUrl +'/video/${contentid}.html' +'">'+
                    '<h1>${title}</h1>'+
                    '<div class="section-news-item-big">'+
                        '<img src="${$item.getImgUrl()}" alt="${title}">'+
                        '<div></div>'+
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
            '</div>';

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

       
    }
    module.exports = video;
});