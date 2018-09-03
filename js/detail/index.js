define(function(require, exports, module) {
    'use strict';

    var comment = require('comment');
    require('tmplate');
    require('lazyload');
    let lbs = require('lbs');
    let push = require('push');
    let api = require('api');
    var news;
    var pager = {
        page:'2',
        pageSize:'12',
        nomore:0,
        loading:0,
    }
    news = {

        elements: {
         	moveBtn: $('.examine-more')
        },


        init: function() {
           var that = this;
           that.moreContent();
            //LBSģ���ʼ��
            lbs.init(lbsLoader.init());
           comment.init();
           this.elements.moveBtn.hide();
           this.fixedFooter();
           this.share();
        },
        share:function(){
            var shareMobileUrl = $('.video-play-main-share').data('urlmobile');
            var shareUrl = window.location.href;
            var shareTitle = $('.detail-left-header>h1').text();
          
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
        getMoreArticle:function(pageIndex,pageSize,callback){
            //1/20
            $.ajax({
                url: api.uriGetMoreArticle+"/"+pageIndex+"/"+pageSize,
                type: 'GET',
                dataType: "json",
                success: function(data) {

                    callback(data)
                }
            });
        },
        moreFollow:function(articlelist){

            //jquery.tmpl.jsģ����Ⱦ����
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
            }).appendTo( ".article-box" );
  
        },
        moreContent:function(){
            var context = this;
            var isbool = true
            $(window).on('scroll', function() {
            	if (($(this).scrollTop() + $(window).height()) >= ($(document).height() - 100) && isbool == true) {
                    isbool = false;
                //��֤���ݲ��������ڼ���
	                if(pager.loading == 0){
	                    //�������ڼ���
	                    pager.loading = 1;
	                    //������һҳ����
	                    context.getMoreArticle(pager.page,pager.pageSize,
	                            function(data){
	                                if(data.code == 200){
	                                	 isbool = true;
	                                    let articlelist = data['data']['list'];
	      
	                                    context.moreFollow(articlelist);
	                                    //�������һҳ
	                                    //data['data']['total_page'] = 2
	                                    if(pager.page == data['data']['total_page']){
	                                        $('.examine-more').hide();
	                                        $('.examine-nomore').show();
	                                        //ȫ������
	                                        pager.nomore = 1;

	                                    }else{
	                                        //����ҳ���α�
	                                        pager.page++;
	                                    }
	                                }
	                                //���ݼ������
	                                pager.loading = 0;
	                            }
	                    );
	                }
	             }

            });
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
    var lbsLoader = {
        init:function(){
            return this;
        },
        //�õ�λ����Ϣ�Ļص�
        onPosition:function(adcode,adname){
            //doing something for pos get
            lbsLoader.onLoadResource(adcode,adname)
             push.showAd(adcode);
        },
        onPositionChange:function(adcode,adname){
             push.showAd(adcode);
        },
        onLoadResource:function(adcode,adname){
            //���ö�����λչʾ
            $('.current-city > a').html(adname);
        }
    };
   

    module.exports = news;

})