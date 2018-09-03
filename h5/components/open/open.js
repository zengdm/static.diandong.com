define(function(require, exports, module) {

    var open = {

     getApp:function(){
      	if(isAndroid_ios()){
	     	// alert('anzhuo')
		    }else{
		     	 // alert('ios')
		    }
        },
    };


 	$('.shade-go a').on('click', function() {
         $(this).attr('href','http://a.app.qq.com/o/simple.jsp?pkgname=com.diandong.android.app&fromcase=40003');
    });
     //判断是否是安卓还是ios
    function isAndroid_ios(){
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return isAndroid==true?true:false;
    }


    module.exports = open;

});