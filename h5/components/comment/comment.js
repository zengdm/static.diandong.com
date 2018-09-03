define(function(require, exports, module) {
    'use strict';
    var user = require('user');
    var tip = require('tip');
    var cookie = require('cookie');
    var Interval = require('interval');
    let api = require('api');
    require('tongji');
    // user.id = 121106;
    // user.avatar = 'http://i2.dd-img.com/assets/image/1525764782-eec34b1f80e68382-512w-512h.png'
    // user.nickname = 'fuyali';
    // console.log(user)
    var obj = {
        wordNum: 100,
        articleNum: 5000,
        replyFlag: true,
        page: 2,
        pageSize:20,
        tipComment: '评论成功！',
        tipPraise: '点赞成功！',
        tipPraised: '您已经点过赞啦!',
        tipMsg: '请输入内容！',
        tipLogin: '请先登录哦',
        selfRpely: false,
        repeat: 1,
        repeatReply: 1,
    }
    var isbool = true;
    var Comment,
        replyList,
        replyid,
        replyidAdd,
        replyName,
        fhN;
    $('.comment-more').remove();

    var GET_COMMENT_LIST = api.domain + '/comment/list';
    var POST_COMMENT = api.itemUrl + '/es/comment/add';
    var LIKE_COMMENT = api.itemUrl + '/es/comment/supports';
    var ARICTLE_PRAISE = api.itemUrl + '/es/feed/agree';

    // 后添加的

    if (user.id) {
        $('.write-comment-box').removeClass('fn-hide');
        // $('.comment-form-cover').addClass('fn-hide');
    }
    var comment = {
        args: {
            sourceid: 0,
            platid: 0,
            container: '.comment'
        },
        elements: {
            tabBtn: $('.tab-btn'),
            tabCon: $('.news-focus-list-content ul'),
            stupidBox: $('#naughty-box'),
            rankTabBtn: $('.news-sidebar-rank .module-tab-btn a'),
            rankTabCon: $('.news-sidebar-rank ol'),
            hotTabBtn: $('.news-sidebar-hot .module-tab-btn a'),
            hotTabCon: $('.news-sidebar-hot ol'),
        },
        init: function(args) {
            user.getUserInfo();
            if (!user.id) {
                $('.comment-login').removeClass('fn-hide');  
                $('.write-comment').addClass('fn-hide');     
            }
         
            if (args && typeof(args.sourceid) != 'undefined' && typeof(args.platid) != 'undefined') {
                console.log('已传参---',args);
                // 已传参, 赋值
                this.args = args;
            } else {
                // 未传参,通过地址获取
		this.GetURLParam();
            }
            // 根据参数加载评论，否则不加载
            if (this.args.sourceid > 0 && this.args.platid > 0 && this.args.container && $(this.args.container).length) {
              
                this.bindEvent();
                // this.getComment(obj.page);
            }
        },
        GetURLParam:function() {  
              var url = location.href; //获取url中"?"符后的字串  
              // console.log(url);
              var theRequest = new Object();  
              if (url.indexOf("?") != -1) {  
                  var str = url.substring(url.indexOf("?")+1);  
                  var strs = str.split("&");  
                  for(var i = 0; i < strs.length; i ++) {  
                    theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
                  }  
              }  
              this.args.sourceid = theRequest.articleId;
              this.args.platid = 5;
              return theRequest;  
        },
        getComment: function(page) {
            var that = this;
            $.ajax({
                url: GET_COMMENT_LIST+'/'+that.args.sourceid+'/'+page+'/'+obj.pageSize,
                type: 'GET',
                success: function(res) {
                    res = JSON.parse(res);
                    if (res.code == 200) {
                        isbool = true;
                        var data = res.data.reply;
                        if(data.length<obj.pageSize){
                            isbool = false;
                        }
                        data.forEach(function(ele, i) {
                            if(ele.avatar.length == 0){
                                ele.avatar = 'http://i1.dd-img.com/assets/image/1517466287-bb81d5d98c3824fd-512w-509h.png'
                            }
                            var opt = {
                                'commentCon': ele.content,
                                'avatar': ele.avatar,
                                'author': ele.author,
                                'showTime': ele.showTime,
                                'replyid': ele.replyid,
                                'supports': ele.supports,
                            };
                            var getComment = that.commentHtml(opt);
                            // console.log(getComment);
                            $('.comment').append(getComment);
                            if (ele.reply) {
                                ele.reply.forEach(function(eles, idx) {
                                    var index = i;
                                    if (eles.reply_author == '' || eles.author == eles.reply_author) {
                                        eles.reply_author = '';
                                    } else {
                                        eles.reply_author = '<em>回复</em>' + eles.reply_author
                                    };

                                    var opts = {
                                        'author': eles.author,
                                        'authorid': eles.authorid,
                                        'replyCon': eles.content,
                                        'replyName': ele.author,
                                        'reply_author': eles.reply_author,
                                        'replyid': eles.replyid
                                    }
                                    var replyComment = that.replyHtml(opts);
                                    if (page != 1) index = (page - 1) * obj.pageSize + i;
                                    var cyl = $('.comment-item').eq(index).find('.comment-item-info-reply');
                                    cyl.find('.reply-list-more').before(replyComment);
                                });

                            }

                        })
                         $('.comment-item').each(function(idx, ele) {
                            var index = idx;
                            var cookieRep = 'rep' + user.id + that.args.sourceid + $(ele).data('replyid');
                            if (cookie.get(cookieRep)) {
                                $('.comment-item').eq(index).find('.not-praise').addClass('fn-hide');
                                $('.comment-item').eq(index).find('.have-praise').removeClass('fn-hide');
                                $('.comment-item').eq(index).find('span').addClass('comment-praise-v2'); 
                            }

                        });
                    }

                }
            });
        },
        commentHtml: function(opt) {
            var datetime = Interval.getDateDiff(opt.showTime, true);
            var commentHtml = '<div class="comment-item" data-replyid="' + opt.replyid + '">'+
                '<div class="comment-item-pic">'+
                    '<img src="' + opt.avatar + '" alt="">'+
                '</div>'+
                '<div class="comment-item-info">'+
                    '<h3>' + opt.author + '</h3>'+
                    '<p>' + opt.commentCon + '</p>'+

                    '<div class="comment-item-info-reply"><div class="reply-list-more fn-hide">查看全部回复></div>'+
                     
                    '</div>'+

                    '<div class="comment-item-info-author">'+
                        '<div class="comment-item-info-author-timer">' + datetime + '</div>'+
                       ' <div class="comment-item-info-author-praise">'+
                            '<img class="not-praise" src="//test.static.diandong.com/h5/img/detail/like-article-gray.png" alt="">'+
                            '<img class="have-praise fn-hide" src="//test.static.diandong.com/h5/img/detail/like-article-red.png" alt="">'+
                            '<span>' + opt.supports + '</span>'+
                       ' </div>'+
                        '<div class="comment-item-info-author-discuss">'+
                            '<a href="javascript:;"></a>'+
                       ' </div>'+
                    '</div>'+
                '</div>'+
            '</div>'

            return commentHtml;
        },
        replyHtml: function(opts) {
            var replyComment =  '<div class="comment-item-info-reply-item" data-authorid="' + opts.authorid + '" data-replyidcom="' + opts.replyid + '">'+
                         
                            '<span>' + opts.author + '</span><span>' + opts.reply_author + '</span>：' + opts.replyCon +
                        '</div>';
            return replyComment;
        },
        word: function(parent, opt, remain,word) {
            var num = remain;
            $(parent).on('keyup', $(opt), function(e) {
                var val = $.trim($(this).find(opt).val());
                var replyVal;

                // 如果是回复
                if ($(this).find(opt).hasClass('comment-reply-textarea')) {
                    replyVal = val.split(':')[0];
                    val = val.substr(replyVal.length + 1);
                    if (e.keyCode == 8) {
                        if (!val) {
                            $(this).find(opt).val(fhN);
                            tip.info('直接输入内容就可以啦！');
                            return;
                        }
                    }

                };
                if (remain) {
                    remain = num - val.length;
                    if (remain <= 0) remain = 0;
                    $(this).find(word).html(remain)
                }

                if (val.length >= remain) {
                    var keyWord = val.substr(0, remain);
                    if (replyVal) {
                        $(this).find(opt).val(replyVal + ':' + keyWord)
                    } else {
                        $(this).find(opt).val(keyWord);
                    }

                }

            })

        },
        nowTime: function() {
            var myDate = new Date();
            //获取当前年
            var year = myDate.getFullYear();
            //获取当前月
            var month = myDate.getMonth() + 1;
            //获取当前日
            var date = myDate.getDate();
            var h = myDate.getHours(); //获取当前小时数(0-23)
            var m = myDate.getMinutes(); //获取当前分钟数(0-59)
            if (m < 10) m = '0' + m;
            var s = myDate.getSeconds();
            if (s < 10) s = '0' + s;
            var postDate = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
            return postDate;
        },
        bindEvent: function() {
            var that = this;

            $(window).on('scroll',function(){
                if(($(this).scrollTop() + $(window).height()) >= ($(document).height() - 100) && isbool == true){
                    isbool = false;
                    that.getComment(obj.page);
                    obj.page++;
                }
            });

            $('.comment-item').each(function(idx, ele) {
                var index = idx;
                var cookieRep = 'rep' + user.id + that.args.sourceid + $(ele).data('replyid');
                if (cookie.get(cookieRep)) {
                    $('.comment-item').eq(index).find('.not-praise').addClass('fn-hide');
                    $('.comment-item').eq(index).find('.have-praise').removeClass('fn-hide');
                    $('.comment-item').eq(index).find('span').addClass('comment-praise-v2'); 
                }

            });
            $(".write-comment-box-textarea textarea").focus(function(){
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin);
                    $(this).blur();
                    return false;
                }
            });

          
             //点击评论
            $('.write-comment-box-button button').on('click', function() {
                obj.repeat += 1;
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                var commentCon = $.trim($('.write-comment-box-textarea textarea').val())
                if (!commentCon) {
                    tip.info(obj.tipMsg);
                    return;
                };
                $('.comment-empty').addClass('fn-hide');
                // $('.comment-more-icon').removeClass('fn-hide');
                var nowTime = that.nowTime();
                
                var coo1 = 'repeatComment' + obj.repeat + user.id + that.args.sourceid;
                var coo2 = 'repeatComment' + (obj.repeat - 1) + user.id + that.args.sourceid;
                cookie.set(coo1, commentCon, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                var opt = {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                    content: commentCon,
                    commentCon: commentCon,
                    authorid: user.id,
                    author: user.nickname,
                    avatar: user.avatar,
                    showTime: nowTime,
                    supports: 0
                }
                if (cookie.get(coo1) == cookie.get(coo2)) {
                    tip.info('相同内容的评论只能发一次哦')
                    return;
                }
                $.ajax({
                    url: POST_COMMENT,
                    data: opt,
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            opt.replyid = res.data.replyid;
                            $('.write-comment-box-textarea textarea').val('');
                            location.reload();


                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");


                    },
                    complete: function() {
                        $(self).removeAttr("disabled");
                        $(self).css("pointer-events", "auto");
                    }
                })

            });

            //点击回复
            $('.comment').on('click', '.comment-item-info-author-discuss a', function(e) {
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                e.stopPropagation();
                $(document).click(function() {
                    $(".reply-box").addClass('fn-hide');
                })
                $(".reply-box").on('click', function(ev) {
                    $(this).removeClass('fn-hide');
                    ev.stopPropagation();
                })
                $('.reply-box').removeClass('fn-hide');
                var replyListCon = $(this).parents('.comment-item');
                replyid = replyListCon.data('replyid');
                replyName = replyListCon.find('.comment-item-info h3').html();
                $(".reply-box-textarea textarea").attr('placeholder','回复 '+replyName+' :');
                replyList = replyListCon.find('.comment-item-info-reply'); 
            });
          

            // 发表回复
            $('.reply-box').on('click', '.reply-box-button button', function(e) {
                var self = this;
                obj.repeatReply += 1;
                var textarea = $('.reply-box-textarea textarea');
                var replyFormIsKong = $.trim(textarea.val());
               
                var authorNames;
                if (!replyFormIsKong) {
                    tip.info(obj.tipMsg);
                    return;
                }
                $(".reply-box").addClass('fn-hide');
                e.stopPropagation();
                var replyCommentCon = replyFormIsKong;

                var coo1 = 'repeatReply' + obj.repeatReply + user.id + that.args.sourceid;
                var coo2 = 'repeatReply' + (obj.repeatReply - 1) + user.id + that.args.sourceid;
                cookie.set(coo1, replyCommentCon, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                if (cookie.get(coo1) == cookie.get(coo2)) {
                    tip.info('相同内容的评论只能发一次哦')
                    return;
                }
                // 判断是否是一级回复
                if (obj.replyFlag) {
                    fhN = '';
                    authorNames = user.nickname + ' : ';
                } else {
                    authorNames = user.nickname;
                    if (obj.selfRpely) {
                        fhN = '';
                        authorNames = user.nickname + ' : ';
                    }
                }
                var opt = {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                    content: replyCommentCon,
                    replyCon: replyFormIsKong,
                    authorid: user.id,
                    author: authorNames,
                    avatar: user.avatar,
                    replyid: replyid,
                    reply_author: fhN
                }
                $.ajax({
                    url: POST_COMMENT,
                    data: opt,
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            opt.replyid = res.data.replyid;
                            var replyAppend = that.replyHtml(opt);
                            replyList.append(replyAppend);
                            var replyMore = $(self).parents('.comment-item');
                            textarea.val('');
                            tip.success(obj.tipComment);
                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled")
                        $(self).css("pointer-events", "auto");
                    }
                })

            });
            // 评论点赞
            $('.comment').on('click', '.comment-item-info-author-praise', function() {
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                var replyids = $(self).parents('.comment-item').data('replyid');
                if (replyids == 'undefined') {
                    replyid = replyidAdd
                } else {
                    replyid = replyids;
                }
                if ($(self).find('.not-praise').hasClass('fn-hide')) {
                    tip.info(obj.tipPraised);
                    return false;
                }
                cookie.set('rep' + user.id + that.args.sourceid + replyid, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });

                $.ajax({
                    url: LIKE_COMMENT,
                    data: {
                        sourceid: that.args.sourceid,
                        platid: that.args.platid,
                        authorid: user.id,
                        replyid: replyid
                    },
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            console.log($(self));
                            $(self).find('.not-praise').addClass('fn-hide');
                            $(self).find('.have-praise').removeClass('fn-hide');
                            $(self).find('span').addClass('comment-praise-v2');
                            var praiseNum = parseInt($(self).find('span').html());
                            $(self).find('span').html(praiseNum + 1)
                            tip.success(obj.tipPraise);
                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled")
                        $(self).css("pointer-events", "auto");
                    }
                })

            });
        }

    }

    module.exports = comment;

})