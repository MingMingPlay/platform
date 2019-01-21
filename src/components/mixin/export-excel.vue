<template>
</template>

<script>
    import {IEDownload} from '@/assets/unit/IEDownload.js';
    export default {
        methods: {
            // 获取当前日期
            // 返回本地时间
            // time可以是时间字符串，时间戳（Number），或者不传
            getLocaleTime(time) {
                var date = time ? new Date(time) : new Date(); // 实例化一个日期对象
                var now = date.toLocaleString(); // 获取本地时间字符串
                // 标准化月日
                now = now.replace(/(\/)(\d{1,2})/g, function (match, $1, $2) {
                    if(match.length > 2) {
                        return match;
                    } else {
                        return ($1+'0'+$2);
                    }
                });
                // 替换汉字（上午、下午）
                now = now.replace(/(\u4e0a\u5348|\u4e0b\u5348)(\d+)/, function (match, $1, $2) {
                    if($1 === '上午') {
                        return ($2.length > 1) ? $2 : '0'+$2;
                    } else {
                        return (parseInt($2)+12);
                    }
                });
                return now;
            },
            // 返回日期
            // 参数说明(隐式)：(datetime：日期时间；separator：分隔符(/、-、.、[年月日]))
            getDateStr() {
                var args = arguments;  // 函数参数
                var datetime = null, separator = null;

                if(args.length === 2) {
                    datetime = args[0];
                    separator = args[1];
                } else if(args.length === 1) {
                    args[0].match(/^[^0-9]$/) ? separator = args[0] : datetime = args[0];
                } else ;

                datetime = this.getLocaleTime(datetime);  // 获取待操作时间
                var matchDate = datetime.match(/^[^\s]+/)[0];  // 截取日期部分
                var targetDate = matchDate.replace(/([^0-9])/g, separator || '$1');  // 替换分隔符
                return targetDate;
            },
            // 导出Excel
            handleExportExcel(url, name, callback = () => {}) {
                this.$http({
                    url: url,
                    method: 'GET',
                    params: this.queryObject,
                    responseType: 'blob'
                }).then((res) => {
                    if(res.status === 200) {
                        callback(false);
                        // 当res.body为Blob的时候，code为undefined
                        if(res.body.code === undefined){
                            const currentDate = this.getDateStr('-');
                            const excelName = name + currentDate;
                            const alink = document.createElement('a');
                            if(IEDownload(this,res.data,`${excelName}.xlsx`))return;
                            alink.download = `${excelName}.xlsx`;
                            alink.style.display = 'none';
                            const blob = new Blob([res.data], {
                                type: 'application/x-msdownload;charset=UTF-8'
                            });
                            alink.href = URL.createObjectURL(blob);
                            document.body.appendChild(alink);
                            alink.click();
                            document.body.removeChild(alink);
                        }else {
                            this.$message.warning(res.body.message);
                        }
                    } else {
                        this.$message.warning('获取Excel文件失败');
                    }
                }).catch((err) => {
                    this.$message.error('导出错误！试试导出少量数据或联系管理员');
                    callback(false);
                })
            }
        }
    }
</script>

<style>

</style>
