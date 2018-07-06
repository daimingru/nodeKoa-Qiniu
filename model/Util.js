/**
 *
 * @Exm Model
 * Util模块
 * @Dmr
 * @DateTime  Mon Jul 04 2018 16:48:06 GMT+0800 (中国标准时间)
 * @Param
 *
 */

    /**
     *
     * 格式化日期
     * 时间戳转化为对应格式时间
     * @Dmr
     * @DateTime  Mon Jul 04 2018 16:33:02 GMT+0800 (中国标准时间)
     * @Param
     *
     *      fmt   格式
     * @example
     *      new Date(1530760367021).newdataFormat("yyyy-MM-dd h:m:s");
     * @Return true or false
     *
     */

    Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;

    }
