define(function(require, exports, module) {

    'use strict';

    var cookie = require('cookie');

    var user = {
        id: '',
        name: '',
        nickname: '',
        avatar: '',
        init: function() {
            this.getUserInfo();
        },
        getUserInfo: function() {
            var userName = cookie.get('ark_rememberusername') || '';
            var userAvatar = cookie.get('ark_headimg') || '';
            var nickname = cookie.get('ark_nickname') || '';
            var userId = cookie.get('ark_userid') || '';

            this.save(userId, userName, nickname, userAvatar);
        },
        save: function(id, name, nickname, avatar) {
            this.id = id;
            this.name = name;
            this.nickname = nickname;
            this.avatar = avatar;
        }
    };

    user.init();

    module.exports = user;
});
