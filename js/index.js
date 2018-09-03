define(function(require, exports, module) {
    'use strict';
    require('swiper');
    var Footer = require('footer');
    var footer = new Footer();
    var App = require('./public');
    var app = new App();
    
    var news;
    
    news = {

        elements: {

        },


        init: function() {
            subsidyUtility.init();
            this.bindEvent();
        },

        bindEvent: function() {
            var context = this;
        },
    };

    var obj = {
        timer:'.timer-activity-tab-timer-num>p',
        // 结束时间
        endTime: '2018-7-17 00:00:00',
        page:'1'
    };
    
  	var subsidyUtility = {
        elements: {
            utilityTabBtn: $('.car-nav a'),
            utilityTabCnt: $('.car-text'),
            videoItem: $('.news-video-item'),
            videoItemTitle: $('.news-video-item-title'),
            recommendTabBtn: $('.recommend-nav-item'),
            recommendTabCnt: $('.recommend-tab'),
            recommendItem: $('.recommend-tab-item'),
            recommendItemImg: $('.recommend-tab-item-car img'),
            recommendItemP: $('.recommend-tab-item-car p'),
            recommendItemEnd: $('.recommend-tab-item-endurance-car'),
            addressCity: $('.address .news-video-title-more'),
            cityBox: $('.address-city'),
            cityItem: $('.address-city-box-item'),
            cityName: $('.news-video-title-more a'),
            activityTabBtn: $('.timer-activity-tab-item'),
            activityTabCnt: $('.timer-activity-pic-item'),
            goTop: $('.suspension-top'),
            swiperPage: $('.swiper-pagination-switch'),


            moveBtn: $('.examine-more'),
            scrollWraper: $('.follow'),

        },
        init: function() {
            this.bindEvent();
            this.originalVideo();
            this.carRecommend();
            this.showCar();
            this.cityClick();
            this.suspensionBox();
            // this.scrollSwiper();
            this.imgTab();
            this.initSwiper();
            this.imgSwiper();
            this.activeSwiper();
            this.countDown(this.stamp(obj.endTime));
            this.moreContent();
        },

        moreContent:function(){
            var context = this;
            this.elements.moveBtn.click(function () {
                var moreFollow = '';
                var pageSize = 16;
                console.log(obj.page);
                for(var i = 0;i<pageSize;i++){
                    moreFollow += '<div class="news-box-item fn-left">'+
                            '<img class="news-box-item-icon" src="http://i1.dd-img.com/assets/image/1530605884-b17a388efad48489-73w-64h.png" alt="">'+
                            '<div class="news-box-item-pic">'+
                                '<a href="javascript:;" target="_blank">'+
                                    '<img src="http://i2.dd-img.com/upload/2018/0703/1530579566828.jpg@270w_180h_1e_1c_0o_0l.src" />'+
                                '</a>'+
                            '</div>'+
                            '<div class="news-box-item-title">'+
                                '<a href="javascript:;" target="_blank">电动汽车黑色酒红色会及时还是手机号</a>'+
                            '</div>'+
                            '<div class="news-box-item-info clearfix">'+
                                '<div class="news-box-item-info-mess fn-left">小鹏汽车<span>|</span>自动驾驶</div>'+
                                '<div class="news-box-item-info-date fn-right">06-28</div>'+
                            '</div>'+
                        '</div>';
                } 
                $('.follow-item').append(moreFollow);
                obj.page++;
            });
        },


        stamp: function(day) {
            var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
            return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
        },

        countDown: function(timestamp) {
            var self = this;
            var getDay = $(obj.timer).eq(0);
            var getHour = $(obj.timer).eq(1);
            var getMin = $(obj.timer).eq(2);
            var countDownTime;

            function blockTime() {
                var nowTime = new Date();
                // 获取时间戳
                var t = timestamp - nowTime.getTime();
                if (t <= 0) {
                    countDownTime = '00';
                    $(obj.timer).html(countDownTime)
                    clearInterval(this.interval);
                    return;
                }
                var day = Math.floor(t / 1000 / 60 / 60 / 24);
                var hour = Math.floor(t / 1000 / 60 / 60 % 24);
                var min = Math.floor(t / 1000 / 60 % 60);
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

        activeSwiper:function(){
            var myActiveSwiper = new Swiper('.active-swiper-container',{
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'active-swiper-wrapper',
                slideClass: 'active-swiper-slide',
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

        imgSwiper:function(){
            var myImgSwiper = new Swiper('.focus-swiper-container',{
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'focus-swiper-wrapper',
                slideClass: 'focus-swiper-slide',
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

        initSwiper: function() {
           var context = this;
           var mainSwiper = new Swiper('.focus-swiper', {
                // autoplay: 3000,
                pagination: '.pagination',
                paginationClickable: true,
                createPagination: false,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'focus-display',
                slideClass: 'focus-display-item'
            });

            this.elements.swiperPage.on('mouseenter', function() {
                var index = context.elements.swiperPage.index(this);
                mainSwiper.swipeTo(index,300)
            });


            $('.focus-swiper,.pagination').on({
                mouseover:function(){
                    $('.pagination').removeClass('fn-hide');
                } ,
                mouseout:function(){
                     $('.pagination').addClass('fn-hide');
                } 
             });

           
       },
        bindEvent: function() {

            var context = this;

            this.elements.utilityTabBtn.on('mouseenter', function() {

                var index = context.elements.utilityTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.utilityTabBtn.removeClass('current');
                    context.elements.utilityTabBtn.eq(index).addClass('current');
                    context.elements.utilityTabCnt.addClass('fn-hide');
                    context.elements.utilityTabCnt.eq(index).removeClass('fn-hide');
                }

            });

            this.elements.goTop.click(function (){
                $('html,body').animate({scrollTop: 0},'slow');
            });


        },

        originalVideo:function(){

            var context = this;

            this.elements.videoItem.on('mouseenter', function() {
                var index = context.elements.videoItem.index(this);
                if ($(this).find('.news-video-item-title').hasClass('current')) {
                    return;
                } else {
                    context.elements.videoItemTitle.removeClass('current');
                    context.elements.videoItemTitle.eq(index).addClass('current');

                }

            });
        },

        carRecommend:function(){
           var context = this;

            this.elements.recommendTabBtn.on('mouseenter', function() {

                var index = context.elements.recommendTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.recommendTabBtn.removeClass('current');
                    context.elements.recommendTabBtn.eq(index).addClass('current');
                    context.elements.recommendTabCnt.addClass('fn-hide');
                    context.elements.recommendTabCnt.eq(index).removeClass('fn-hide');

                    
                    context.elements.recommendItem.removeClass('pic');
                    context.elements.recommendItemImg.addClass('fn-hide');
                    context.elements.recommendItemP.removeClass('fn-hide');
                    context.elements.recommendItemEnd.addClass('fn-hide');


                    context.elements.recommendItem.eq(8*index).addClass('pic');
                    context.elements.recommendItemImg.eq(8*index).removeClass('fn-hide');
                    context.elements.recommendItemP.eq(8*index).addClass('fn-hide');
                    context.elements.recommendItemEnd.eq(8*index).removeClass('fn-hide');


                }

            });
        },

        showCar:function(){
            var context = this;
            // console.log(recommendItem);

                this.elements.recommendItem.on('mouseenter', function() {

                    var index = context.elements.recommendItem.index(this);
                    if ($(this).hasClass('pic')) {
                        return;
                    } else {
                        context.elements.recommendItem.removeClass('pic');
                        context.elements.recommendItemImg.addClass('fn-hide');
                        context.elements.recommendItemP.removeClass('fn-hide');
                        context.elements.recommendItemEnd.addClass('fn-hide');


                        context.elements.recommendItem.eq(index).addClass('pic');
                        context.elements.recommendItemImg.eq(index).removeClass('fn-hide');
                        context.elements.recommendItemP.eq(index).addClass('fn-hide');
                        context.elements.recommendItemEnd.eq(index).removeClass('fn-hide');
                    }

            });
        },

        cityClick:function(){
            var context = this;

            this.elements.addressCity.on('click', function() {
                context.elements.cityBox.removeClass('fn-hide');
            });
             this.elements.cityItem.on('click', function() {
                var cityData = $(this).data('city')
                context.elements.cityName.text(cityData);
                context.elements.cityBox.addClass('fn-hide');
            });

        },

        suspensionBox:function(){
            $('.suspension-box').on({
                mouseover:function(){
                    $(this).css({"color":"#fff","background":"#5c84f0"});
                    $(this).find('.suspension-main').addClass('fn-hide');
                    $(this).find('.suspension-fllow').removeClass('fn-hide');
                    if($(this).hasClass('suspension-code')){
                        $('.code-pic').removeClass('fn-hide');
                    }
                } ,
                mouseout:function(){
                    $(this).css({"color":"#999","background":"#fff"});
                    $(this).find('.suspension-main').removeClass('fn-hide');
                    $(this).find('.suspension-fllow').addClass('fn-hide');
                    if($(this).hasClass('suspension-code')){
                        $('.code-pic').addClass('fn-hide');
                    }
                } 
             });

            $('.code-pic').on({
                mouseover:function(){
                  $(this).removeClass('fn-hide');
                } ,
                mouseout:function(){
                   $(this).addClass('fn-hide');
                } 
             });

        },


        // scrollSwiper: function () {
        //     var context = this;
        //     var page = 1;//当前页
        //     var num = 4; //每页显示条数
        //     var height = 305; //每列高度
        //     var size = 4; //每列个数
        //     var _num = size * num; //一次显示数量
        //     var _height = size * height;
        //     var _top = this.elements.scrollWraper[0].offsetTop; //容器距离顶部高度
        //     this.elements.scrollWraper.addClass("fn-hide");
        //     context.elements.scrollWraper.find(".news-box-item.fn-left:gt(" + (_num * page - 1) + ")").addClass("fn-hide");
        //     $(window).scroll(function () {
        //         if ($(this).scrollTop() >= (page - 1) * _height + _top) { //滚动距离超过当前显示条数时，
        //             page++;
        //             context.elements.scrollWraper.find(".news-box-item.fn-left:lt(" + _num * page + ")").removeClass("fn-hide");
        //         }
        //     })
        // },

        imgTab:function(){
            var context = this;
            var objs =[{endTime:obj.endTime},
                 {endTime:'2018-7-26 09:12:30'},
                 {endTime:'2018-7-19 07:39:00'}];
            this.elements.activityTabBtn.on('mouseenter', function() {
                clearInterval(context.interval);
                var index = context.elements.activityTabBtn.index(this);
                context.countDown(context.stamp(objs[index].endTime));
                context.elements.activityTabCnt.addClass('fn-hide');
                context.elements.activityTabCnt.eq(index).removeClass('fn-hide');
            });
        }

    };
   

    module.exports = news;

})