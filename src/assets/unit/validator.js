import { pubObj } from '../unit/public.js'
import Vue from 'vue'

export default {
    // 数字区间（方法）
    validRange(max, min = 1) {
        return(rule, value, callback) => {
            var val = parseInt(value);
            if(max < val || val < min) {
                callback(new Error(rule.message));
            } else {
                callback();
            }
        }
    },
    // 数字区间（方法）
    range_number(min, max) {
        return(rule, value, callback) => {
            var val = parseInt(value);
            if(max < val || val < min) {
                callback(new Error('排序值只能在0-254之间，越大越靠前'));
            } else {
                callback();
            }
        }
    },
    // 验证手机
    validCellphone: (rule, value, callback) => {
        if(!/^(1[3|4|5|7|8|9][0-9]\d{8})?$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 验证座机
    validLandline: (rule, value, callback) => {
        if(!/^((\d{3}-?)?\d{7,8})?$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 验证用户qq号
    validUserQQ: (rule, value, callback) => {
        if(!/^([1-9][0-9]{4,})?$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 只能输入英文
    validNameEn: (rule, value, callback) => {
        if(!/^[a-zA-Z\s]*$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    validEnAndNum: (rule, value, callback) => {
        if(!/^[A-z0-9]+$/.test(value)) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 只能输入英文和汉字
    validName: (rule, value, callback) => {
        if(!/^[a-zA-Z\u4E00-\u9FA5]*$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 只能输入数字(正整数)
    validNumber: (rule, value, callback) => {
        if(!/^[0-9]*$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 数字输入不能等于0
    validNotZero: (rule, value, callback) => {
        const num1 = parseInt(value.slice(0,1));
        const num2 = parseInt(value);
        if(num1 === 0 || num2 === 0) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 只能输入数字(浮点型)
    validFloating(suffix) {
        // 字符串转正则
        let patt = null;
        if(suffix) patt = eval(`/^\\d+\\.\\d{${suffix}}$/`);
        else patt = /^\d+(\.\d+)?$/;
        return (rule, value, callback) => {
            if(!patt.test(value || "")) {
                callback(new Error(rule.message));
            } else {
                callback();
            }
        }
    },
    // 可以输入中英文+数字
    validChar: (rule, value, callback) => {
        if(!/^[a-zA-Z0-9\u4E00-\u9FA5\s\_\(\)\（\）\、\.]*$/.test(value || "")) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 身份证号验证（属性）
    validIDcard: (rule, value, callback) => {
        if(!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value)) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 验证输入是否重复
    valid_isRepeat(_this, type) {
        const errorMsg = (type === 'mobile' ? '手机号已存在' : type === 'login' ? '登录账号已占用' : '工号已存在')
        return(rule, value, callback) => {
            if(value !== '') {
                pubObj.httpRequest(_this, {
                    url: _this.$api.check + type + '/' + value,
                    success(result) {
                        !result.data ? callback() : callback(new Error(errorMsg))
                    }
                })
            } else {
                callback()
            }
        }
    },
    // 校验用户输入的是否是英文字符
    valid_isChar: (rule, value, callback) => {
        if(value === '') {
            callback()
        } else if(/[\u4E00-\u9FA5 | 0-9]/.test(value)) {
            callback(new Error('请输入英文字符，不包含中文字符、数字和特殊符号'));
        } else {
            callback()
        }
    },
    // 只能输入中文
    valid_isChinese: (rule, value, callback) => {
        if(!(/^[\u4E00-\u9FA5]{1,4}$/.test(value))) {
            callback(new Error('品类名称必须为汉字，最多不超过四个'));
        } else {
            callback()
        }
    },
    // 字符长度验证，英文字符算半个，有message和length两个参数要传
    validStringLength(rule, value, callback) {
        function strlen(str) {
            let len = 0;
            for(let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                //单字节加1
                if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                } else {
                    len += 2;
                }
            }
            return len;
        }
        if(strlen(value) / 2 > rule.length) {
            return callback(new Error(rule.message));
        } else {
            callback();
        }
    },
    // 仅仅检验手机号格式
    validMobile: (rule, value, callback) => {
        if(value && !/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(value)) {
            callback(new Error('请输入正确的手机号'));
        } else {
            callback();
        }
    },
    // 验证金额格式
    validMoney: (rule, value, callback) => {
        if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
            callback(new Error('请输入正确的金额'));
        }else {
            callback();
        }
    },
    // 费率输入格式
    rate_number(min, max) {
        return(rule, value, callback) => {
            var val = parseFloat(value);
            if(max < val || val < min) {
                callback(new Error('请输入0.01到100的数字'));
            } else {
                callback();
            }
        }
    },
    // 日期选择-当前日期不能选择
    chooseDate: (rule, arr, callback) => {
        let startTime = new Date(arr[0]).getTime();
        let endTime = new Date(arr[1]).getTime();
        if(startTime === endTime){
            callback(new Error('开始日期和结束日期不能选择相同'));
        }else {
            callback();
        }
    },
    //橱窗副标题有值则验证长度: length 2~10
    validateValueLength(rule, value, callback){
        if(value){
            if(value.length < 2 || value.length >10){
                callback(new Error('副标题2-10个字符'));
            }else{
                callback();
            }
        }else{
            callback();
        }
    }
}
