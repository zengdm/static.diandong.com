/*** set spider tag ***/
var ua = navigator.userAgent.toLowerCase();
var spider = ua.indexOf('spider')>=0?1:0;

document.write('<div class="statistics-code" style="display:none;">');
/*** baidu code start ***/
var _hmt = _hmt || [];
_hmt.push(['_setUserTag', '1990', spider]);
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?62ef90385ce203604aa0360102389278";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

// ad show count
/*
setTimeout(function(){
    var ad = document.getElementsByClassName("ad");
    if (len = ad.length) {
        for (var i=0; i<len; i++) {
            if (id=ad[i].attributes.id.value) {
                _hmt.push(['_setVisitTag', '3642', id]);
            }
        }
    }
}, 3000);
*/

/*** cnzz code start ***/
/*
var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1259482712'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1259482712' type='text/javascript'%3E%3C/script%3E"));
*/

/*** auto push start ***/

(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();


/*** google code start ***/
/*
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-64246892-1', 'auto');
  ga('send', 'pageview');
*/
document.write('</div>');

/*** 艾瑞监测代码 ***/
(function (G,D,s,c,p) {
	c={//监测配置
		UA:"UA-diandong-000001", //客户项目编号,由系统生成
		NO_FLS:0, 
		WITH_REF:1, 
		URL:'http://assets.diandong.com/web/js/friend/iwt-min.js'//iwt.js的URL位置，请客户自行托管JS文件，只需修改此值
	};
	G._iwt?G._iwt.track(c,p):(G._iwtTQ=G._iwtTQ || []).push([c,p]),!G._iwtLoading && lo();
	function lo(t) {
		G._iwtLoading=1;s=D.createElement("script");s.src=c.URL;
		t=D.getElementsByTagName("script");t=t[t.length-1];
		t.parentNode.insertBefore(s,t);
	}
})(this,document);

