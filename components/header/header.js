define(function(require, exports, module) {
	var cookie = require('cookie');
	var user = require('user')
	var tip = require('tip');
	// user.id = '1'
	var header = {
		elements: {
			// 导航切换
			newnavList: '.newnav-list',
			// 登录
			newnavLogin: '.newnav-login>a',
			loginBefore: '.newnav-login',
			loginAfter: '.user-panel',
			userAvatar: '.user-panel-avatar',
			userName: '.user-panel-name',
			userExit: '.user-panel-exit',
			// 搜索
			searchInput:'.search-wrapper .search-input',
			searchBtn: '.search-wrapper .search-submit-btn',
			// 地图
			addressCity: $('.address .news-video-title-more'),
            cityBox: $('.address-city'),
            cityItem: $('.address-city-box-item'),
            currentCity: $('.current-city'),
            cityHolder: $('#city-holder')

		},
		init: function() {
			var that = this;
			that.search();	
			that.login();
			that.navSwitch();
		},
		login: function() {
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
			$(context.elements.newnavLogin).on('click',function(i){
				let index = $(this).index();
				let arr = ['http://passport.diandong.com/ark/login','http://passport.diandong.com/ark/register/'];
				let href = window.location.href
				let jupm = arr[index] + '?redirect=' + href
				$(this).attr('href',jupm)
			})
		},
		navSwitch: function() {
			var context = this;
			var headAsign = $('#header').attr('pagetype');
			$(context.elements.newnavList).find('a').eq(0).addClass('current');
            if(headAsign) {
                if(headAsign == 'news'){
                	$(context.elements.newnavList).find('a').removeClass('current');
                    $(context.elements.newnavList).find('a').eq(1).addClass('current')
                }
                else if(headAsign == 'video') {
                	$(context.elements.newnavList).find('a').removeClass('current');
                    $(context.elements.newnavList).find('a').eq(4).addClass('current')
                }
            }
            /*
			$(context.elements.newnavList).on('click','a',function() {
				if($(this).hasClass('current')){
					$(this).attr('href','javascript:;')
					$(this).attr('target','_self')
					return;
				}
				$('.current').removeClass('current')
				$(this).addClass('current')
			})
			*/
		},
		// 搜索
		search: function() {
			var context = this;
			$(context.elements.searchInput).on('keyup',function(e) {
				if(e.keyCode == 13){
					let inp = $.trim($(this).val());
				if(!inp){
					tip.info('请输入搜索内容')
					return false;
				} 
				window.open('http://search.diandong.com/zonghe/?words=' + inp);
				}
			})
			$(context.elements.searchBtn).on('click',function() {
				let inp = $.trim($(context.elements.searchInput).val());
				if(!inp){
			  		tip.info('请输入搜索内容')
			  		return false;
			 	}
				$(this).attr('href','http://search.diandong.com/zonghe/?words=' + inp)
				
			})
		},
		currentCityClick:function() {
			var context = this;
			context.elements.currentCity.on('click',function() {
				$(this).find('a').attr('href','http://www.diandong.com/city/');
				// sessionStorage.setItem('cityName',cookie.get('cityName')
		
			})
		}
	};
	module.exports = header;

})
