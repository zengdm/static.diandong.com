define(function(require, exports, module) {
    'use strict';
    require('tmplate');
    var open = require('open');
    let api = require('api');
    var pager = {
        page:'1',
        pageSize:'20',
        nomore:0,
        loading:0,
    }
    var nowData = Math.ceil(new Date().getTime()/1000);
    var active = {
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
                url: api.uriGetMoreActive+"/"+pageIndex+"/"+pageSize+"?act_ids="+global_page_data.article_unique_token,
                type: 'GET',
                dataType: "json",
                success: function(data) {

                    callback(data)
                }
            });
        },
         moreFollow:function(articlelist){
            console.log(nowData);
            //jquery.tmpl.js模板渲染数据
            let moreArticleTmplate = '';
            moreArticleTmplate += 
            '<div class="section-item">'+
                    '<a href="${url}">'+
                    '<div class="section-item-pic">'+
                        '<img src="${$item.getImgUrl()}">'+
                    '</div>'+
                    '{{if left_days>0}}'+
                        '{{if end_stamp>'+ nowData +' && '+ nowData +'>start_stamp}}'+
                            '<div class="section-item-timer remain">还剩${left_days}天</div>'+
                        '{{else}}'+  
                            '<div class="section-item-timer proceed">未开始</div>'+
                         '{{/if}}'+
                    '{{else}}'+
                        '<div class="section-item-timer">已结束</div>'+
                    '{{/if}}'+
                '</a>'+
            '</div>';


            $.template( "moreArticleTmplate", moreArticleTmplate);
            $.tmpl('moreArticleTmplate',articlelist,{
                api:api,
                getImgUrl:function(){
                    return this.api.getImgDomain(this.data.img);
                }
            }).appendTo(".section");
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
    module.exports = active;
});