export default {
    install(Vue, options){
        // 金额加人民币符号
        Vue.filter('currency', function(value) {
            if(!value) {
                return '';
            } else {
                return '￥' + value;
            }
        });
        // 金额加千分位符号
        Vue.filter('currencyKb', function(num) {
            if (num) {
                num = num.toString().replace(/\$|\,/g,'');
                if(isNaN(num))
                    num = "0";
                let sign = (num == (num = Math.abs(num)));
                num = Math.floor(num*100+0.50000000001);
                let cents = num%100;
                num = Math.floor(num/100).toString();
                if(cents<10)
                    cents = "0" + cents;
                for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
                    num = num.substring(0,num.length-(4*i+3))+','+
                        num.substring(num.length-(4*i+3));
                return (((sign)?'':'-') + num + '.' + cents);
            }
        });
        // 处理图片src为空（jkc）
        Vue.filter('pathIsNull', function(val, i, _this) {
            if(val) return val;
            else _this.$set(_this.uploadStatus, i, false);
        });
        // 根据需求，展示不同大小的图片（jkc）
        Vue.filter('imageSize', function(val, size) {
            if(val) {
                val = val.replace(/-w(50|100|220|1080)$/, '-w' + size);
                return val;
            } else {
                return '../src/assets/img/upload.png';
            }
        });
        // 分页（jkc）
        Vue.filter('newIndex', function(val, index = 1, size = 10) {
            return(val + 1) + (index - 1) * size;
        });
        // 表格序号（倒序）
        Vue.filter('descIndex', function(val, index = 1, size = 10, total) {
            return total - (val + (index - 1) * size);
        });
        Vue.filter('isWebP', function(value) {
            function checkWebp() {
                try{
                    return(document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
                }catch(err) {
                    return false;
                }
            }
            if(!value){
                return '';
            }else if(checkWebp()){
                return value + 'p';
            }else {
                return value;
            }
        })
    }
};
