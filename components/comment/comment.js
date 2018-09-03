define(function(require, exports, module) {
    'use strict';
    var commentForm = '<div class="comment-form"></div>';
    var commentFormCover = '<div class="box-bg"><div class="comment-form-cover"><a href="http://passport.diandong.com/ark/login/?redirect=${redirect}"><p>要登录才能评论呦！现在<span>登录</span></p></a></div></div>';
    var comFormContent = '<div class="comment-form-content"></div>';
    var articleCommentForm = '<form action="" class="comment-form-box fn-hide"><div class="comment-form-textarea"><textarea placeholder="我也来说两句..." name="name" class="comment-content-textarea"></textarea></div><div class="comment-form-footer"><p class="comment-form-wordnum fn-left"><span>0</span>/5000</p><a href="javascript:;" class="comment-submit-btn j-submit-comment fn-right">发表评论</a></div></form>';
    var commentMore = '<div class="comment-more"><a href="javascript:;"  class="comment-more-btn">查看更多评论</a><a class="comment-more-icon fn-right">写评论</a></div><div class="comment-none fn-hide">已经全部看完啦</div> <div class="comment-empty fn-hide"></div>';
    var totalNumSpan = '<span></span>';
    var headerFri = "<header class='article-comment-header friend'><h3>邦友评论</h3></header>"
    $('.article-comment-header h3').append(totalNumSpan);
    $('.article-comment-header').wrap(comFormContent);
    $('.article-comment-header').after(articleCommentForm);
    $('.comment-form-content').after(commentFormCover);
    $('.comment-holder').append(headerFri);
    $('.comment-holder').append(commentMore);

    // require('./comment.css');
    require('../comment/comment.css')
    var user = require('user');
    var tip = require('tip');
    var cookie = require('cookie');
    // user.id = 121106;
    // user.avatar = 'http://i2.dd-img.com/assets/image/1525764782-eec34b1f80e68382-512w-512h.png'
    // user.nickname = 'fuyali';
    // console.log(user)
    var obj = {
        wordNum: 100,
        articleNum: 5000,
        replyFlag: true,
        page: 1,
        tipComment: '评论成功！',
        tipPraise: '点赞成功！',
        tipPraised: '您已经点过赞啦!',
        tipMsg: '请输入内容！',
        tipLogin: '请先登录哦',
        selfRpely: false,
        repeat: 1,
        repeatReply: 1
    }
    var Comment,
        replyList,
        replyid,
        replyidAdd,
        replyName,
        fhN;

    var GET_COMMENT_LIST = 'http://item.diandong.com/es/comment';
    var POST_COMMENT = 'http://item.diandong.com/es/comment/add';
    var LIKE_COMMENT = 'http://item.diandong.com/es/comment/supports';
    var ARICTLE_PRAISE = 'http://item.diandong.com/es/feed/agree';
    var CLICK_UPDATE = 'http://item.diandong.com/cms/article/click-update';

    



    // 后添加的

    if (user.id) {
        $('.comment-form-box').removeClass('fn-hide');
        $('.comment-form-cover').addClass('fn-hide');
    }
    var article = {
        args: {
            sourceid: 0,
            platid: 0,
            container: '.comment-holder'
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
            this.ddwxQRcode();
            // this.clickEvent();
            if (args && typeof(args.sourceid) != 'undefined' && typeof(args.platid) != 'undefined') {
                // 已传参, 赋值
                this.args = args;
            } else {
                // 未传参,通过地址获取
                this.parseInit();
            }
            // 根据参数加载评论，否则不加载
            if (this.args.sourceid > 0 && this.args.platid > 0 && this.args.container && $(this.args.container).length) {
                // console.log('comment args', this.args);
                this.bindEvent();
                this.getComment(obj.page);
            }
        },
        clickEvent: function() {
            var context = this;
            // console.log(context)
            this.elements.tabBtn.on('click', function(e) {
                var self = $(e.currentTarget);
                var index = context.elements.tabBtn.index(this);

                if (self.hasClass('current')) {
                    return;
                } else {
                    context.elements.tabBtn.removeClass('current');
                    self.addClass('current');

                    context.elements.tabCon.addClass('fn-hide');
                    context.elements.tabCon.eq(index).removeClass('fn-hide');
                }
            });

            this.elements.rankTabBtn.on('click', function(e) {
                var self = $(e.currentTarget);
                var index = context.elements.rankTabBtn.index(this);

                if (self.hasClass('current')) {
                    return;
                } else {
                    context.elements.rankTabBtn.removeClass('current');
                    self.addClass('current');

                    context.elements.rankTabCon.addClass('fn-hide');
                    context.elements.rankTabCon.eq(index).removeClass('fn-hide');
                }
            });

            this.elements.hotTabBtn.on('click', function(e) {
                var self = $(e.currentTarget);
                var index = context.elements.hotTabBtn.index(this);

                if (self.hasClass('current')) {
                    return;
                } else {
                    context.elements.hotTabBtn.removeClass('current');
                    self.addClass('current');

                    context.elements.hotTabCon.addClass('fn-hide');
                    context.elements.hotTabCon.eq(index).removeClass('fn-hide');
                }
            });

            $('.card-popup').on('mouseenter', function(e) {
                $('.card-popup').addClass('on');
                $('.card-popup-content').removeClass('fn-hide');
            }).on('mouseleave', function() {
                $('.card-popup').removeClass('on');
                $('.card-popup-content').addClass('fn-hide');
            });

            // $('.card-popup-content').on('mouseenter', function() {
            //     $('.card-popup').addClass('on');
            //     $('.card-popup-content').removeClass('fn-hide');
            // }).on('mouseleave', function() {
            //     $('.card-popup').removeClass('on');
            //     $('.card-popup-content').addClass('fn-hide');
            // });

            $('.share-item-weibo').on('click', function() {
                context.recordShare(options.articleId, 'weibo');
                $('.jiathis_button_tsina').trigger('click');
            });
            $('.share-item-qzone').on('click', function() {
                context.recordShare(options.articleId, 'qzone');
                $('.jiathis_button_qzone').trigger('click');
            });
            $('.share-item-wechat').on('click', function() {
                context.recordShare(options.articleId, 'wechat');
                $('.jiathis_button_weixin').trigger('click');
            });
        },
        ddwxQRcode: function() {
            var ddwxQRcodehtml = '<div class="ddwxQRcode">' +
                '<div class="ddwxQRcodegif">' +
                '<img src="http://i1.dd-img.com/assets/image/1527735560-35793006ea84e5a4-60w-100h.gif">' +
                '</div>' +
                '<div class="ddwxQRcodetxt">' +
                '更多新能源汽车资讯<em></em>' +
                '</div>' +
                '<div class="ddwxQRcodeimg">' +
                '<img src="http://i1.dd-img.com/assets/image/1527673418-6c206659e68ebb70-90w-100h.png"/>' +
                '</div>' +
                '</div>';
            $('.footer-g').before(ddwxQRcodehtml)
        },

        // 对pc或移动页面通过地址获取contentid，适用于资讯详情页和视频详情页
        parseInit: function() {
            var host = window.location.host;
            var paths = window.location.pathname.split('/');
            var len = paths.length;
            var filename = paths[len - 1];
            var end = filename.indexOf('.');
            this.args.sourceid = filename.slice(0, end);
            // this.args.sourceid = 88708;
            this.args.platid = 5;
        },
        getComment: function(page) {
            var that = this;
            $.ajax({
                url: CLICK_UPDATE,
                data: {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid
                },
                type: 'GET',
                success: function(res) {}
            });
            $.ajax({
                url: GET_COMMENT_LIST,
                data: {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                    page: page
                },
                type: 'GET',
                success: function(res) {
                    if (res.code == 0) {
                        $('.article-comment-header').find('span').html('(' + res.data.total + ')');
                        var topComTotal = $('.article-info-share');
                        if (topComTotal.length) {
                            topComTotal.find('span').html(res.data.total);
                        }
                        var playerComTotal = $('.player-box #comments');
                        if (playerComTotal.length) {
                            playerComTotal.html(res.data.total);
                        }
                        var data = res.data.reply;
                        if (!data.length && page == 1) {
                            $('.comment-none').addClass('fn-hide');
                            $('.comment-more-btn').addClass('fn-hide');
                            $('.comment-more-icon').addClass('fn-hide');
                            $('.comment-empty').removeClass('fn-hide');
                        } else if (data.length < 10) {
                            $('.comment-none').addClass('fn-hide');
                            $('.comment-more-btn').addClass('fn-hide');
                        } else if (!data.length && page > 1) {
                            $('.comment-none').addClass('fn-hide');
                            $('.comment-more-btn').addClass('fn-hide');
                            $('.comment-none').removeClass('fn-hide');
                        }
                        $('.detail-article-praise>p').html(res.data.points.parise);
                        data.forEach(function(ele, i) {
                            // console.log(ele)
                            var opt = {
                                'commentCon': ele.content,
                                'avatar': ele.avatar,
                                'author': ele.author,
                                'showTime': ele.showTime,
                                'replyid': ele.replyid,
                                'supports': ele.supports
                            };
                            var getComment = that.commentHtml(opt);
                            $('.comment-more').before(getComment);
                            if (ele.reply) {
                                ele.reply.forEach(function(eles, idx) {
                                    var index = i;
                                    if (!eles.reply_author) {
                                        eles.reply_author = '：';
                                    } else {
                                        eles.reply_author = '回复 ' + eles.reply_author + ' : '
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
                                    var index = i;
                                    if (page != 1) index = (page - 1) * 10 + i;
                                    var cyl = $('.comment-reply-list').eq(index);
                                    cyl.find('.reply-list-more').before(replyComment);
                                    if (ele.reply.length > 4) {
                                        var replyListCon = cyl.find('.comment-quote');
                                        var sliceReply = replyListCon.slice(4);
                                        sliceReply.addClass('fn-hide')
                                        cyl.find('.reply-list-more').removeClass('fn-hide');
                                        cyl.on('click', '.reply-list-more', function() {
                                            replyListCon.removeClass('fn-hide');
                                            $(this).addClass('fn-hide')
                                        })
                                    }

                                });

                            }

                        })
                        $('.comment-list-content').each(function(idx, ele) {
                            var index = idx;
                            var cookieRep = 'rep' + user.id + that.args.sourceid + $(ele).data('replyid');
                            if (cookie.get(cookieRep)) {
                                $('.comment-list-content').eq(index).find('.comment-like-btn i').addClass('comment-praise-v2')
                                $('.comment-list-content').eq(index).find('.comment-like-btn span').addClass('comment-praise-v2')
                            }

                        });
                        var cookieSource = 'rep' + user.id + that.args.sourceid;
                        if (cookie.get(cookieSource)) {
                            $('.detail-article-praise').css('background','#f84d4d')
                            $('.detail-article-praise>i').addClass('comment-praise-v2');
                            $('.adetail-article-praise>p').addClass('comment-praise-v2');
                        }
                    }

                }
            });
        },
        commentHtml: function(opt) {
            var commentHtml = '<div class="comment-list-content" data-replyid="' + opt.replyid + '"><div class="comment-item"><header class="comment-item-header"><div class="comment-user fn-left clearfix"><div class="comment-user-avatar fn-left"><img src="' + opt.avatar + '" alt=""></div><div class="comment-user-info fn-left"><div class="comment-item-user">' + opt.author + '</div><div class="comment-item-time">' + opt.showTime + '</div></div></div><a href="javascript:;" class="comment-like-btn fn-right"><i class="icon">&#xe649;</i><span>' + opt.supports + '</span></a><a href="javascript:;" class="comment-reply-btn j-reply-comment fn-right" >回复</a></header><div class="comment-item-content"><p class="comment-item-con">' + opt.commentCon + '</p><div class="comment-reply-list"><div class="reply-list-more fn-hide">查看全部回复></div></div></div></div></div>';
            return commentHtml;
        },
        replyHtml: function(opt) {
            var replyComment = '<p class="comment-quote" data-authorid="' + opt.authorid + '" data-replyidcom="' + opt.replyid + '"><span class="reply-list-name">' + opt.author + '</span> <span class="reply-list-replyname">' + opt.reply_author + '</span>' + opt.replyCon + ' <span class="reply-list-btn comment-reply-btn">回复</span></p>';
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
            that.word('.comment-form-content','.comment-content-textarea',obj.articleNum,'.comment-form-wordnum>span');
            // 点击评论
            $('.comment-submit-btn').on('click', function() {
                obj.repeat += 1;
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                var commentCon = $.trim($('.comment-content-textarea').val())
                if (!commentCon) {
                    tip.info(obj.tipMsg);
                    return;
                };
                $('.comment-empty').addClass('fn-hide');
                $('.comment-more-icon').removeClass('fn-hide');
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
                            $('.comment-form-wordnum>span').html(0)
                            var totalComNum = $('.article-comment-header').find('span').html();
                            totalComNum = parseInt(totalComNum.substring(1, totalComNum.length - 1));
                            totalComNum += 1;
                            opt.replyid = res.data.replyid;
                            var commentAppend = that.commentHtml(opt);
                            // $('.comment-holder').prepend(commentAppend);
                            $('.friend').after(commentAppend);
                            $('.comment-content-textarea').val('');
                            $('.article-comment-header').find('span').html('(' + totalComNum + ')');
                            $('.article-info-share').find('span').html(totalComNum);
                            $('.player-box #comments').html(totalComNum);
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
                        $(self).removeAttr("disabled");
                        $(self).css("pointer-events", "auto");
                    }
                })

            });

            //点击回复
            $('.comment-holder').on('click', '.comment-reply-btn', function(e) {
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var replyListCon = $(this).parents('.comment-list-content');
                that.word('.comment-list-content', '.comment-reply-textarea', obj.wordNum,'.reply-word');
                e.stopPropagation();
                $(".reply-form").addClass('fn-hide');
                $(document).click(function() {
                    $(".reply-form").addClass('fn-hide');
                })
                $(".comment-holder").on('click', '.reply-form', function(ev) {
                    $(this).removeClass('fn-hide');
                    ev.stopPropagation();
                })

                if ($(this).hasClass('j-reply-comment')) {
                    // 一级回复
                    obj.replyFlag = true;
                    replyid = replyListCon.data('replyid');
                    if (replyid == 'undefined') {
                        replyid = replyidAdd;
                    }

                    replyName = replyListCon.find('.comment-item-user').html();
                } else {
                    obj.selfRpely = false;
                    var userAgentId = $(this).parent().data('authorid');
                    var userMyId = user.id;

                    obj.replyFlag = false;
                    replyid = $(this).parent().data('replyidcom');
                    if (!replyid) {
                        replyid = replyidAdd;
                    }
                    replyName = $(this).parent().find('.reply-list-name').html();
                    if (userMyId == userAgentId) {
                        obj.selfRpely = true;
                        replyName = '';
                    }
                }
                var replyTextarea = '<form action="" class="clearfix reply-form"><textarea name="reply-textarea" placeholder="发表回复内容..." class="comment-reply-textarea fn-left"></textarea><span class="reply-word"></span><span class="fn-left reply-submit">发表</span></form>';

                replyList = replyListCon.find('.comment-reply-list');
                var replyListForm = replyListCon.find('.comment-item-content');
                var replyFormHide = replyListForm.find('.reply-form');
                if (!replyFormHide.length) {
                    replyListForm.append(replyTextarea);
                }
                replyListCon.find('.reply-form').removeClass('fn-hide');
                replyName = replyName.split(":")[0];
                fhN = '回复 ' + replyName + ':';
                replyListCon.find('.reply-word').html(obj.wordNum);
                $('.comment-reply-textarea').val(fhN);


            });
            // 点击发表
            $('.comment-holder').on('click', '.reply-submit', function(e) {
                var self = this;
                obj.repeatReply += 1;
                var textarea = $(this).parent().find('.comment-reply-textarea');
                var repVal = $.trim(textarea.val());
                var replyFormKong = repVal.split(':')[0];

                var replyFormIsKong = repVal.substr(replyFormKong.length + 1);
                var authorNames;
                if (!replyFormIsKong) {
                    tip.info(obj.tipMsg);
                    return;
                }
                $(".reply-form").addClass('fn-hide');
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
                $('.reply-form').addClass('fn-hide');
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
                            var replyMore = $(self).parents('.comment-list-content')
                            replyMore.find('.reply-list-more').addClass('fn-hide');
                            replyMore.find('.comment-quote').removeClass('fn-hide');
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
            $('.comment-holder').on('click', '.comment-like-btn', function() {
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                var replyids = $(self).parents('.comment-list-content').data('replyid');
                if (replyids == 'undefined') {
                    replyid = replyidAdd
                } else {
                    replyid = replyids;
                }
                if ($(self).find('i').hasClass('comment-praise-v2')) {
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
                            $(self).find('i').addClass('comment-praise-v2');
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
            // 文章点赞
            $('.detail-article-praise').on('click', function() {
                var self = this;
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                };
                cookie.set('rep' + user.id + that.args.sourceid, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });
                $.ajax({
                    url: ARICTLE_PRAISE,
                    data: {
                        uid: user.id,
                        sourceid: that.args.sourceid,
                        platid: that.args.platid,
                        ftype: 'praise'
                    },
                    type: 'get',
                    success: function(res) {
                        if (res.code == 0) {
                            $(self).css('background','#f84d4d');
                            $(self).find('i').addClass('comment-praise-v2');
                            $(self).find('p').addClass('comment-praise-v2');
                            var praiseNum = parseInt($(self).find('p').html());
                            $(self).find('p').html(praiseNum + 1)
                            tip.success(obj.tipPraise);

                        } else {
                            tip.info(obj.tipPraised);
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

            })

            // 写评论
            $('.comment-more').on('click', '.comment-more-icon', function() {
                user.getUserInfo();
                if (!user.id) {
                    tip.info(obj.tipLogin);
                    return false;
                }
                $('.comment-content-textarea').focus();
            });

            // 点击查看更多
            $('.comment-more-btn').on('click', function() {
                obj.page++;
                that.getComment(obj.page);
            })

        }

    }

    module.exports = article;

})