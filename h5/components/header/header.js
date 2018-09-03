define(function(require, exports, module) {
    'use strict';
    var cookie = require('cookie');
    var user = require('user');
    var tip = require('tip');
    require('tongji');
    var header = {
        elements: {
            menuBtn:$('.head-menu'),
            headMore:$('.head-more'),
            bodyShade:$('.body-shade'),
            moreClose:$('.head-more-box-close,.body-shade'),
            appClose:$('.shade-close'),
            appShade:$('.shade'),
            // 登录
            newnavLogin: '.head-more-box-user-info>a',
            loginBefore: '.head-more-box-user-info',
            loginAfter: '.head-more-box-user-name',
            userAvatar: '.head-more-box-user-img',
            userName: '.head-more-box-user-name>a',
            // 搜索
            searchInput:'.header-content-search input',
            searchDetail:'.head-search input',
        },
    	init:function(){
            this.bindEvent();
            this.toggleShade();
            this.loginDetail();
            this.loginMain();
            this.inputSearch();  
    	},
        bindEvent:function(){
            $('.section-qg').removeClass('fn-hide');
            
        },
        // 搜索
        inputSearch: function() {
            var context = this;
            $(context.elements.searchInput).focus(function(){
                $(this).css({'padding-left':'1.2rem','background-position':'0.43rem center'})
            });
            $(context.elements.searchInput).blur(function(){
                $(this).css({'padding-left':'2.8rem','background-position':'1.96rem center'})
            });
            $(context.elements.searchDetail).focus(function(){
                $('.head-search').css({'width':'7rem'})
                $(this).css({'width':'7rem'})
                // $(this).attr("placeholder","搜车型 资讯 视频");
            });
             $(context.elements.searchDetail).blur(function(){
                $('.head-search').css({'width':'2.56rem'})
                $(this).css({'width':'2.56rem'})
                  $(this).css({'padding-left':'1.2rem','background-position':'0.43rem center'})
            });
            $(context.elements.searchInput).on('keyup',function(e) {
                if(e.keyCode == 13){
                    let inp = $.trim($(this).val());
                if(!inp){
                    tip.info('请输入搜索内容')
                    return false;
                } 
                window.location.href='http://search.diandong.com/zonghe/?words=' + inp;
                }
            })
        },
        toggleShade:function(){
            var context = this;

            this.elements.menuBtn.on('click', function() {
                context.elements.headMore.removeClass('fn-hide');
                context.elements.bodyShade.removeClass('fn-hide');
            });
            this.elements.moreClose.on('click', function() {
                context.elements.headMore.addClass('fn-hide');
                context.elements.bodyShade.addClass('fn-hide');
            });
            this.elements.appClose.on('click', function() {
                context.elements.appShade.addClass('fn-hide');
            });

        },
        loginDetail: function() {
            var context = this;
            // 用户登录
            if(user.id){
                $(context.elements.loginAfter).removeClass('fn-hide');
                let userName = cookie.get('ark_rememberusername');
                let userAvatar = cookie.get('ark_headimg');
                $(context.elements.userName).html(userName);
                $(context.elements.userAvatar).find('img').attr('src',userAvatar);
            }else{
                $(context.elements.loginBefore).removeClass('fn-hide');
            }
            $(context.elements.userExit).on('click',function() {
                cookie.set('ark_rememberusername','', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                cookie.set('ark_headimg','', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                cookie.set('ark_userid','', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                cookie.set('ark_nickname','', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                user.getUserInfo()
                $(context.elements.loginAfter).addClass('fn-hide');
                $(context.elements.loginBefore).removeClass('fn-hide');
            })
            // $(context.elements.newnavLogin).on('click',function(i){
            //     let index = $(this).index();
            //     let arr = ['http://passport.diandong.com/ark/login','http://passport.diandong.com/ark/register/'];
            //     let href = window.location.href
            //     let jupm = arr[index] + '?redirect=' + href
            //     $(this).attr('href',jupm)
            // })
        },
        loginMain:function(){
            user.getUserInfo();
            if (user.id) {
               $('.header-content-user').attr('href','javascript:;');
               $('.header-content-user img').attr('src',user.avatar);
            }
        },
      
        
       
        
       
       
    }
    module.exports = header;
});