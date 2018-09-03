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
            this.swiperBig(adcode);
            this.swiperbtm(adcode);
            this.swiperNewsHeader(adcode);
        },
        swiperHeaderHtml: function(swiperList) {
            var context = this;
             let swiperTmplateM = '';
             // let swiperTmplateS =  '';
             swiperTmplateM += '\
                    <div class="focus-display-item">\
                        <a href="${cl_link}" target="_blank">\
                            <img class="lazyload" src="${cl_img}"  data-src="${cl_img}" alt="${cl_name}"？">\
                            <div class="focus-display-item-title">${cl_name}</div>\
                        </a>\
                    </div>';
            // swiperTmplateS += '\
            //     <div class="pagination-item swiper-pagination-switch swiper-visible-switch swiper-active-switch">\
            //                 <img class="pagination-item-bg lazyload"  src="http://i1.dd-img.com/assets/image/1530671036-e7317aee12c1eb1d-104w-57h.png"  data-src="http://i1.dd-img.com/assets/image/1530671036-e7317aee12c1eb1d-104w-57h.png" alt="">\
            //                 <img class="pagination-item-main lazyload" src="${cl_img}" alt="">\
            //             </div>\
            // ';
            $('.focus-display').html('');
            $('.pagination').html('');
            $.template( "swiperTmplateM", swiperTmplateM);
            $.tmpl('swiperTmplateM',swiperList).appendTo( ".focus-display" );
            // $.template( "swiperTmplateS", swiperTmplateS);
            // $.tmpl('swiperTmplateS',swiperList).appendTo( ".pagination" );


            var indexMainSwiper = new Swiper('.focus-swiper', {
                autoplay: 5000,
                pagination: '.pagination',
                paginationClickable: true,
                // createPagination: false,
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
                    // console.log(swiper.activeIndex)
                } 
            });

            $('.arrow-left').on('click', function(e){
                e.preventDefault()
                indexMainSwiper.swipePrev();
              })
              $('.arrow-right').on('click', function(e){
                e.preventDefault()
                indexMainSwiper.swipeNext()
              })

            $('.arrow-left,.arrow-right').on({
                mouseover:function(){
                  $(this).addClass('current');
                },
                mouseout:function(){
                 $(this).removeClass('current');
                } 
             });
            //存储mainSwiper 以便修改使用
            window.indexMainSwiper = indexMainSwiper;
  
        },
        swiperNewsHtml: function(swiperList) {
             let swiperTmplate = '';
             swiperTmplate += '\
                <div class="news-swiper-slide">\
                    <a href="${cl_link}" target="_blank">\
                        <img class="lazyload" src="${cl_img}"  data-src="${cl_img}" alt="${cl_name}">\
                        <div class="news-box-beatyCar-box-big-shade-top">${cl_name}</div>\
                    </a>\
                 </div>';
                $(".news-swiper-wrapper" ).html('');
                $.template("swiperTmplate", swiperTmplate);
                $.tmpl('swiperTmplate',swiperList).appendTo(".news-swiper-wrapper");
                if(swiperList.length == 1){
                    $('.news-left').hide();
                    $('.news-right').hide(); 
                    return;
                }
                var myActiveSwiper = new Swiper('.news-swiper-container',{
                    autoplay: 3000,
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
        swiperBigHtml: function(swiperList) {
            let swiperTmplate = '';
              swiperTmplate += '\
                <div class="focus-swiper-slide">\
                    <div class="news-box-beatyCar-box clearfix">\
                        <div class="news-box-beatyCar-box-big fn-left">\
                            <a href="${$data[0].url}" target="_blank">\
                                <img class="lazyload  news-box-beatyCar-box-big-pic" src="${$data[0].thumb}"  data-src="${$data[0].thumb}" alt="${$data[0].title}">\
                                <div class="news-box-beatyCar-box-big-shade">\
                                    <div class="news-box-beatyCar-box-big-shade-box">\
                                        <img src="//static.dd-img.com/img/camera-line.png" alt="" />\
                                        <p>${$data[0].pic_type}</p>\
                                        <h5>${$data[0].title}</h5>\
                                    </div>\
                                </div>\
                            </a>\
                        </div>\
                        <div class="news-box-beatyCar-box-little fn-right">\
                            <div class="eatyCar-box-little-item">\
                                <a  href="${$data[1].url}"" target="_blank">\
                                    <img class="lazyload eatyCar-box-little-item-pic" src="${$data[1].thumb}"  data-src="${$data[1].thumb}" alt="${$data[1].title}">\
                                    <div class="news-box-beatyCar-box-little-shade">\
                                        <div class="news-box-beatyCar-box-little-shade-box">\
                                            <img src="//static.dd-img.com/img/camera-line.png" alt="" />\
                                            <p>${$data[1].pic_type}</p>\
                                            <h5>${$data[1].title}</h5>\
                                        </div>\
                                    </div>\
                                </a>\
                            </div>\
                            <div class="eatyCar-box-little-item">\
                                <a  href="${$data[2].url}"" target="_blank">\
                                    <img class="lazyload eatyCar-box-little-item-pic" src="${$data[2].thumb}"  data-src="${$data[2].thumb}" alt="${$data[2].title}">\
                                    <div class="news-box-beatyCar-box-little-shade">\
                                        <div class="news-box-beatyCar-box-little-shade-box">\
                                            <img src="//static.dd-img.com/img/camera-line.png" alt="" />\
                                            <p>${$data[2].pic_type}</p>\
                                            <h5>${$data[2].title}</h5>\
                                        </div>\
                                    </div>\
                                </a>\
                            </div>\
                        </div>\
                    </div>\
                </div>';     
           $(".focus-swiper-wrapper" ).html('');
            $.template("swiperTmplate", swiperTmplate);
            $.tmpl('swiperTmplate',swiperList).appendTo(".focus-swiper-wrapper" );
            var myImgSwiper = new Swiper('.focus-swiper-container',{
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'focus-swiper-wrapper',
                slideClass: 'focus-swiper-slide',
                lazyLoading : true,
                observer:true,
                observeParents:true
              })
              $('.arrow-left').on('click', function(e){
                e.preventDefault()
                myImgSwiper.swipePrev()
              })
              $('.arrow-right').on('click', function(e){
                e.preventDefault()
                myImgSwiper.swipeNext()
              })
        },
        swiperActiveHtml: function(swiperList) {
            var context = this;
            let swiperTmplateM = '',swiperTmplateS ='';
            swiperTmplateM += '\
                 <div class="timer-activity-pic-item">\
                       <a href="${url}" target="_blank">\
                            <img class="lazyload" src="${img}"  data-src="${img}" alt="${name}">\
                        </a>\
                 </div>';
             swiperTmplateS += '\
                <div class="timer-activity-tab-item" data-endtime="${end_time}">\
                    <img class="lazyload" src="${img}"  data-src="${img}" alt="${name}">\
                </div>';
            $(".timer-activity-pic").html('');
            $('.timer-activity-tab-box').html('');
            $.template("swiperTmplateM", swiperTmplateM);
            $.tmpl('swiperTmplateM',swiperList).appendTo(".timer-activity-pic");
            $.template("swiperTmplateS", swiperTmplateS);
            $.tmpl('swiperTmplateS',swiperList).appendTo(".timer-activity-tab-box");

                endtimeLoad = $('.timer-activity-tab-item').eq(0).data('endtime');
                obj = {
                timer:'.timer-activity-tab-timer-num>p',
                //结束时间
                // endTime: '2018-7-20 00:00:00',
                endTime: endtimeLoad
            };

            $('.timer-activity-tab-box').on('mouseover','.timer-activity-tab-item',function() {
                clearInterval(context.interval);
                var endTime = $(this).data('endtime')
                var index =  $(this).index();
                context.countDown(endTime);
               $('.timer-activity-pic-item').addClass('fn-hide');
               $('.timer-activity-pic-item').eq(index).removeClass('fn-hide');
            });            
        },
        swiperUserHtml: function(swiperList) {
             let swiperTmplate = '';
             swiperTmplate += '\
                 <div class="active-swiper-slide">\
                    <a href="${url}"  target="_blank">\
                        <img class="lazyload" src="${img}"  data-src="${img}" alt="${name}">\
                    </a>\
                </div>';
            $(".active-swiper-wrapper").html('');
            $.template("swiperTmplate", swiperTmplate);
            $.tmpl('swiperTmplate',swiperList).appendTo(".active-swiper-wrapper" );
            var myActiveSwiper = new Swiper('.active-swiper-container',{
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'active-swiper-wrapper',
                slideClass: 'active-swiper-slide',
                observer:true,
                observeParents:true
              })
              $('.active-left').on('click', function(e){
                e.preventDefault()
                myActiveSwiper.swipePrev()
              })
              $('.active-right').on('click', function(e){
                e.preventDefault()
                myActiveSwiper.swipeNext()
              })
        },
        countDown: function(timestamp) {
            var self = this;
            var getDay = $(obj.timer).eq(0);
            var getHour = $(obj.timer).eq(1);
            var getMin = $(obj.timer).eq(2);
            var countDownTime;

            function blockTime() {
                var nowTime = new Date();
                var nowSec = Math.floor(nowTime.getTime()/1000);
                // 获取时间戳
                var t = timestamp - nowSec;

                // console.log(Math.floor(nowTime.getTime()/1000))
                // console.log(timestamp);
                if (t <= 0) {
                    countDownTime = '00';
                    $(obj.timer).html(countDownTime)
                    clearInterval(self.interval);
                    return;
                }
                var day = Math.floor(t / 60 / 60 / 24);
                var hour = Math.floor(t / 60 / 60 % 24);
                var min = Math.floor(t / 60 % 60);
                if (day < 10) day = "0" + day;
                if (hour < 10) hour = "0" + hour;
                if (min < 10) min = "0" + min;
                getDay.html(day);
                getHour.html(hour);
                getMin.html(min);
            }

            this.interval = setInterval(function() {
                blockTime();
            }, 1000);
            blockTime();
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
        swiperBig: function(adcode) {
            var that = this;
            that.swiperAjax(adcode,api.swiperBig,function(res){
                if(res.code == 200) {
                    // console.log(res)
                    let swiperList = res.data.list;
                     let swiperListSlice = new Array();
                    swiperList.forEach(function(el,i) {
                        if(el.length >= 3){
                            let arr =  el.slice(0,3);
                            swiperListSlice.push(arr);
                        }else{
                           swiperListSlice = swiperList;
                        }
                     
                    })
                    that.swiperBigHtml(swiperListSlice);
                }
            })
        },
        swiperbtm: function(adcode) {
            var that = this;
            that.swiperAjax(adcode,api.swiperbtm,function(res){
                if(res.code == 200) {
                    let swiperList = res.data.activity_list.slice(0,3);
                    let swiperBtmList = res.data.user_activity_list
                    that.swiperActiveHtml(swiperList)
                    that.swiperUserHtml(swiperBtmList)
                }
            })
        },
        swiperNewsHeader: function(adcode) {
             var that = this;
             that.swiperAjax(adcode,api.swiperNewsHeader,function(res){
                if(res.code == 200) {
                    let swiperList = res.data.focus_list;
                    if(res.data.focus_list.length >= 2) {
                        swiperList = res.data.focus_list.slice(0,2);
                    }
                    that.swiperNewsHtml(swiperList);
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

                        /*
                        <!-- 文章模板 -->
                        <div class="news-box-item fn-left" name='ad_pos_${ad_position_id}'>
                              <div class="news-box-item-pic">
                                <a href="${ad_src_url}" target="_blank" rel='nofollow'>
                                  <img class="" src="//${ad_src}" >
                                </a>
                              </div>
                              <div class="news-box-item-title">
                                <a href="${ad_src_url}" target="_blank" rel='nofollow'>${ad_title}</a>
                              </div>
                              <div class="news-box-item-info clearfix">
                                <div class="news-box-item-info-ad">广告</div>
                              </div>
                        </div>

                        <!-- 首页热门车系 品牌 ad_position_id: 69 70 -->
                        <div  class="fn-left" name='ad_pos_${ad_position_id}'>
                            <a class="car-img-item" href="${ad_src_url}" target="_blank" rel='nofollow' >
                                <div class="car-img-item-pic-bg">
                                    <img class="car-img-item-pic  lazyload " src='//static.dd-img.com/img/placeholderbase.png' data-src="//${ad_src}" >
                                </div>
                                <p>${ad_title}</p>
                            </a>
                        </div>
                        <!-- 本地资讯 ad_position_id: 75 -->
                        <div class="address-pic" name='ad_pos_${ad_position_id}'>
                                <a href="${ad_src_url}" target="_blank" rel='nofollow'>
                                    <img class="lazyload" src="//static.dd-img.com/img/placeholderbase.png" data-src="//${ad_src}">
                                    <div class="address-pic-title">${ad_title}</div>
                                </a>
                        </div>
                        <!-- 本地资讯 ad_position_id: 76 77 -->
                        <div class="address-list" name="ad_pos_${ad_position_id}">
                                <div class="address-list-item">
                                    <a href="${ad_src_url}" target="_blank" rel='nofollow'>${ad_title}</a>
                                </div>
                        </div>
                         */
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