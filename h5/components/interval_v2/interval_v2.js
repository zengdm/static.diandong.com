define(function(require, exports, module) {

    var Interval = {

        getDateDiff: function(time, isTimestamp) {
            //解决ios端无法识别 - 格式的日期问题
            var iosTime = time.replace(/-/g, '/');
            var dateTimeStamp = isTimestamp ? getDateTimeStamp(iosTime) : time;
            var zeroTime = new Date(new Date().toLocaleDateString()).getTime()/1000;
            var yesterdayZeroTime = zeroTime - 86400;
            

            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var now = new Date().getTime();

            var diffValue = now - dateTimeStamp;
            var result = '';

            if (diffValue < 0) {
                return;
            }

            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            var nowDay = new Date().getDate();
            var intoDay = new Date(iosTime).getDate();
            
            var nowTime = dateTimeStamp/1000;
            
    
            if(minC <= 2){
                result = "刚刚";
            }else if(minC <= 60){
                result = '' + parseInt(minC) + "分钟前";
            }else if(hourC > 1 && nowTime > zeroTime){
                result = '' + parseInt(hourC) + "小时前";
            }else if(yesterdayZeroTime < nowTime && nowTime < zeroTime){
                result = "昨天";
            }else{
                result = time.substring(5,10);
            }
            
            return result;
        }
    };

    function getDateTimeStamp(dateStr) {
        return Date.parse(dateStr);
    }

    module.exports = Interval;

});