define(function(require, exports, module) {
    'use strict';
    require('tmplate');
    require('tongji');
    var api = require('api');
    var cookie = require('cookie');
    var endtimeLoad;
    var obj;
    var push = {
    	init:function(){
    		let context = this;
    	},
        swiperAd: function(adcode) {
            this.swiperHeader(adcode);
        },
        swiperHeaderHtml: function(swiperList) {
            var context = this;
            let swiperTmplateM = '';
            swiperTmplateM += '<div class="focus-slide" >'+
                                '<a href="${cl_link}"><img src="${cl_img}" alt="${cl_name}"></a>'+
                            '</div>';
            $('.focus-wrapper').html('');
            $('.pagination').html('');
            $.template( "swiperTmplateM", swiperTmplateM);
            $.tmpl('swiperTmplateM',swiperList).appendTo( ".focus-wrapper" );


            var indexMainSwiper = new Swiper('.focus-container', {
                pagination: '.pagination',
                loop: true,
                grabCursor: true,
                autoplay: 5000,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'focus-wrapper',
                slideClass: 'focus-slide'
            });
            //存储mainSwiper 以便修改使用
            window.indexMainSwiper = indexMainSwiper;
  
        },
        swiperAjax: function(adcode,url,callback) {
            $.ajax({
                url: url+ '?cityId=' + adcode,
                type: 'GET',
                dataType: "json",
                success: function(data) {
                    callback(data)
                }
            });
        },
        swiperHeader: function(adcode) {
            var that = this;
            that.swiperAjax(adcode,api.swiperHeader,function(res){
                if(res.code == 200) {
                    let swiperList = res.data.carousel_data;
                    that.swiperHeaderHtml(swiperList);
                }
            })
        },
    	showAd:function(adcode){
            let context = this;
           if(!adcode){
                adcode = '1101';
            }
            let url = api.addomain+'/pc/city_' + adcode + '.js?v=' + Math.random();
            //let url = '//assets.diandong.com/repository/data/pc/city_' + adcode + '.js?v=' + Math.random();
            //加载广告列表
            require.async([url], function(result) {
                if(!result) return false;
                let templates = result.templates;

            	$.each(result.list,function(k,v){
                    if((k == 75 || k == 76 || k == 77) && typeof(global_page_data) != 'undefined' 
                        && typeof(global_page_data.local_article_json) != 'undefined'
                        && typeof(global_page_data.local_article_json.postion_list) != 'undefined' )
                    {
                        $.each(global_page_data.local_article_json.postion_list,function(subk,subv){
                            if(k == 75){
                                subv.article_list[0] = {
                                        "tags": ["广告"],
                                        "title": v.ad_title,
                                        "date": "",
                                        "tag": "",
                                        "category_id": 70,
                                        "img_link": '//'+v.ad_src,
                                        "tag_name": '广告',
                                        "url": v.ad_src_url
                                }
                            }else if (k == 76){
                                subv.article_list[1] = {
                                        "tags": ["广告"],
                                        "title": v.ad_title,
                                        "date": "",
                                        "tag": "",
                                        "category_id": 70,
                                        "img_link": '//'+v.ad_src,
                                        "tag_name": '广告',
                                        "url": v.ad_src_url
                                }
                            }else if (k == 77){
                                subv.article_list[2] = {
                                        "tags": ["广告"],
                                        "title": v.ad_title,
                                        "date": "",
                                        "tag": "",
                                        "category_id": 70,
                                        "img_link": '//'+v.ad_src,
                                        "tag_name": '广告',
                                        "url": v.ad_src_url
                                }
                            }
                        });
                    }
                    let ad_pos_key = 'ad_pos_'+k;
                    let tmp = templates[k];
                    //console.log(ad_pos_key,v);

                    $("body").append("<img src= '"+v.ad_exposure_url+"' style='display:none;' />");
                    if(tmp){
                        $.template( "tmp", tmp.content_v2);
                        $.tmpl('tmp',v).replaceAll('div[name="'+ad_pos_key+'"]');
                    }else{
                        //普通横幅广告，普通层级广告
                        $('div[name='+ad_pos_key+"]> a").attr('target','_blank');
                        $('div[name='+ad_pos_key+"]> a").attr('href',v.ad_src_url);
                        $('div[name='+ad_pos_key+"]> a > img").attr('src','//'+v.ad_src);
                        $('div[name='+ad_pos_key+"]> a > img").attr('data-src','//'+v.ad_src);
                        $('div[name='+ad_pos_key+']').show();
                        $('a[name='+ad_pos_key+"]").attr({'target': '_blank','href': v.ad_src_url});
                        $('a[name='+ad_pos_key+"]> img").attr('src','//'+v.ad_src);
                        $('a[name='+ad_pos_key+"]> img").attr('data-src','//'+v.ad_src);
                        $('a[name='+ad_pos_key+"]").show();
                    }

            	})
            });
    	}
    }
    module.exports = push;
});