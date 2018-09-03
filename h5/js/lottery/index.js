define(function(require, exports, module) {
    'use strict';
    let api = require('api');
    let cookie = require('cookie');
    var open = require('open');
    var tip = require('tip');
    require('tongji');
    var header = require('header');
    header.init();
    var BAIDU_LOTTERY = 'https://sp0.baidu.com/9_Q4sjW91Qh3otqbppnN2DJv/pae/common/api/yaohao';
  
    var lottery = {
        elements: {
            getQuery:$('.query'),
            city:$('#city'),
            nameCode:$('.code')
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
            //点击查询
            this.elements.getQuery.on('click',function(){
               
              var city = $.trim(context.elements.city.val());
              var nameCode = $.trim(context.elements.nameCode.val());
              $.ajax({
                    url: BAIDU_LOTTERY,
                    data: {
                        city: city,
                        name:nameCode,
                        format:'json',
                        resource_id:'4003'
                    },
                    dataType: 'jsonp',
                    jsonp:'cb',
                    type: 'GET',
                    beforeSend: function() {
                        if (nameCode === '') {
                            tip.info('请输入编码');
                            return false;
                        }
                    },
                    success: function(result) {
                       var disp_data = result.data[0].disp_data;
                       var isSuccess = true;
                       if(disp_data.length == 0){
                           isSuccess = false;
                       }else{
                           isSuccess = true;
                           var date = disp_data[0].eid;
                       }
                       var app = context.getUrlQueryString('fromApp');
                       
                        if(app){
                        $('.app-hide').addClass('fn-hide');
                        window.location.href = "//.m.diandong.com/stage/lottery-result.html?fromApp=1";
                        }else{
                          $('.app-hide').removeClass('fn-hide');
                           window.location.href = "//.m.diandong.com/stage/lottery-result.html";
                        }
                      

                       var info = {
                            isSuccess:isSuccess,
                            city:city,
                            name:nameCode,
                            date:date
                        }
                        localStorage.setItem('lottery', JSON.stringify(info));
                       
                    }
                });

            })
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