define(function(require, exports, module) {
    'use strict';
    let cookie = require('cookie');
    var lbs = {
    	utility:null,
    	init:function(lbsLoader){
    		let context = this;
    		context.utility = lbsUtility;
            lbsUtility.init(lbsLoader);
            context.bindEvent();
    	},
        bindEvent:function(){
            $('.current-city').on('click',function(){
                window.location.href = 'http://www.diandong.com/city/';
            })
        }
    }
    var mapObj = null;
    //定位脚本
    var lbsUtility = {
    	lbsLoader:null,
        init:function(lbsLoader){
            let context = this;
            context.lbsLoader = lbsLoader;
            mapObj = new AMap.Map('iCenter');
            mapObj.plugin('AMap.Geolocation', function () {
                let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                mapObj.addControl(geolocation);
                geolocation.getCurrentPosition();
                setInterval(function(){
                	geolocation.getCurrentPosition();
                },300000)

                AMap.event.addListener(geolocation, 'complete', context.onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', context.onError);      //返回定位出错信息
            });
        },
        setCookie:function(name,value,domain,expire)
        {
            var second = expire;
            var exp = new Date();
            exp.setTime(exp.getTime() + second*1000);
            document.cookie = name + "="+ encodeURIComponent (value) + ";expires=" + exp.toGMTString()+";path=/;domain="+domain;
        },
        onLocation:function(status,result){
        	if ("complete" == status){
                let context = this;
                //用户设置的Adcode
                let userAdcode = cookie.get('cityId'); 
                let userShowCity = cookie.get('cityName'); 
                //定位出来的城市编号
        		let lbsAdcode = result.addressComponent.adcode.substring(0,4);
                let lbsShowCity = (result.addressComponent.city?result.addressComponent.city:result.addressComponent.province).replace('市','');

                //最终广告呈现的Adcode
                let finalAdcode = userAdcode || lbsAdcode;
                let finalShowCity = userShowCity || lbsShowCity;

                //位置是否有更新
                let posChange = 0;

                //是否有定位变更
                if(cookie.get('lbs_adcode') != finalAdcode){
                    //设置cookie 有效期12小时
                    context.setCookie('lbs_adcode',finalAdcode,'.diandong.com',3600*12);
                    context.setCookie('lbs_adname',finalShowCity,'.diandong.com',3600*12);
                    posChange = 1;
                }
	            //判断是否接入位置通知,并且有无发送过首次定位通知
	            if (typeof(lbs.utility.lbsLoader.onPosition) == "function" && !window.posNotify){
                    window.posNotify = true;
	            	lbs.utility.lbsLoader.onPosition(finalAdcode,finalShowCity);
	            }
                //判断是否接入位置变更通知
	            if (typeof(lbs.utility.lbsLoader.onPositionChange) == "function" && posChange == 1){
	            	lbs.utility.lbsLoader.onPositionChange(finalAdcode,finalShowCity);
	            }
        	}
        },
        onComplete:function(result){
            lbs.utility.onLocation("complete",result);
        },
        onError:function(result){
            //获取用户设置
            var userAdcode_Now = cookie.get('cityId'); 
            var userShowCity_Now = cookie.get('cityName'); 

            if (!userAdcode_Now){
                $.get('http://car.diandong.com/api/get_local?v='+
                    Math.random(), function(rdata){
                        var oldCity = rdata.data.city;
                        var oldCode = rdata.data.code;
                        let finalAdcode = userAdcode_Now || oldCode;
                        let finalShowCity = userShowCity_Now || oldCity;
                        lbs.utility.lbsLoader.onPosition(finalAdcode,finalShowCity);
                    },'jsonp'
                );
            }else{ 
                lbs.utility.lbsLoader.onPosition(userAdcode_Now,userShowCity_Now);
            }
            /*
                info
                错误信息，参考错误信息列表
                message
                造成定位失败结果的一些有用信息message说明
            */
        	console.log('lbs_error',result)
        }
    }
    module.exports = lbs;
});