define(function(require, exports, module) {

    'use strict';

    var App = function() {
        this.init();
    };

    App.prototype = {
        elements: {
            tabBtn: $('.panel-tab-btn'),
            tabCon: $('.user-panel-tabcon')
        },
        init: function() {
            this.bindEvent();
        },
        bindEvent: function() {
            var context = this;

            // 切换
            this.elements.tabBtn.on('click', function() {
                var index = context.elements.tabBtn.index(this);

                context.elements.tabBtn.removeClass('current').eq(index).addClass('current');
                context.elements.tabCon.addClass('fn-hide').eq(index).removeClass('fn-hide');
            });

            // focus 高亮
            $('.user-holder .user-input').on('focus', function(e) {
                var self = $(e.currentTarget);
                var parent = self.parents('.user-holder');

                parent.addClass('focus');
            }).on('blur', function(e) {
                var self = $(e.currentTarget);
                var parent = self.parents('.user-holder');

                parent.removeClass('focus');
            });

            $('.user-input').on('focus', function() {
                var parent = $(this).parents('.user-holder');
                var tip = parent.parents().siblings('.user-tip');

                tip.addClass('fn-hide');
            });
        }
    };

    module.exports = App;
});
