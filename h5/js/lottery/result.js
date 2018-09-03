define(function(require, exports, module) {
    'use strict';
    require('tongji');
    var open = require('open');
    var header = require('header');
    header.init();
  
    var lottery = {
        elements: {
        },
        init:function(){
            this.bindEvent();
        },
        bindEvent:function(){
            var context = this;
            var app = context.getUrlQueryString('fromApp');
           
            if(app){
                $('.app-hide').addClass('fn-hide');
            }else{
              $('.app-hide').removeClass('fn-hide');
            }
            wx.miniProgram.getEnv(function(res) {
                // alert(res.miniprogram);
                // res.miniprogram;
                $('.app-hide').addClass('fn-hide');
            })
            var info = JSON.parse(localStorage.getItem('lottery'));
            if(info.isSuccess){
                var year = info.date.substring(4,0);
                var month = info.date.substr(5);
                var nameBefore = info.name.substring(6,0);
                var nameAfter = info.name.substring(11);
              $('.success').removeClass('fn-hide');
              $('.success-table-intro-city').text(info.city);
              $('.success-table-intro-date').text(year+'年'+month+'月');
              $('.success-table-intro-code').text(nameBefore+'***'+nameAfter);
            }else{
                $('.failure').removeClass('fn-hide');
            }

        },

        getUrlQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },

      

    }
    module.exports = lottery;
});