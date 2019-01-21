<template>
    <el-date-picker
        v-model="timeOption"
        :clearable="clearable"
        type="daterange"
        placeholder="选择日期范围"
        @change="getTime"
        :picker-options="pickerOptions">
    </el-date-picker>
</template>
<script>
    /**
     * 时间快捷选择组件
     * 所有参数都是非必填，但start和end必须同时传递
     * @param start, end, shortcut, disabledBefore, disabledAfter, disabledToday, clearable
     * 返回开始和结束两个时间字符串
     * @return start, end
     * */
    export default {
        props: {
            start: {
                type: String,
                required: false,
            },
            end: {
                type: String,
                required: false,
            },
            // 是否显示快捷选项
            shortcut: {
                type: Boolean,
                required: false,
                default: false,
            },
            // 禁用今天之前
            disabledBefore: {
                type: Boolean,
                required: false,
                default: false,
            },
            // 禁用今天之后
            disabledAfter: {
                type: Boolean,
                required: false,
                default: false,
            },
            // 在前两个基础上禁用今天
            disabledToday: {
                type: Boolean,
                required: false,
                default: false,
            },
            // 是否显示清楚按钮，默认显示
            clearable: {
                type: Boolean,
                required: false,
                default: true,
            }
        },
        data() {
            return {
                timeOption: [],
                pickerOptions: {},
                shortcuts: [
                    {
                        text: '昨天',
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() - 3600 * 1000 * 24);
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '过去7天',
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() - 3600 * 1000 * 24);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '过去30天',
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() - 3600 * 1000 * 24);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '过去90天',
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() - 3600 * 1000 * 24);
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                ],
            }
        },
        created(){
            if(this.start && this.end){
                this.timeOption = [new Date(this.start), new Date(this.end)]
            }else if(this.start && this.end === undefined){
                return console.error(new Error('If you have "start", you must have an "end"'))
            }else if(this.start === undefined && this.end){
                return console.error(new Error('If you have "end", you must have an "start"'))
            }
            if(this.start === '' || this.end === ''){
                this.timeOption = [];
            }
            if(this.shortcut){
                this.pickerOptions.shortcuts = this.shortcuts;
            }
            // 禁用今天之前
            let beforeFn = (time) => {
                let oneDay = this.disabledToday ? 0 : 3600 * 1000 * 24;
                return time.getTime() < (new Date().getTime() - oneDay);
            };
            // 禁用今天之后
            let afterFn = (time) => {
                let oneDay = this.disabledToday ? 3600 * 1000 * 24 : 0;
                return time.getTime() > (new Date().getTime() - oneDay);
            };
            if(this.disabledBefore){
                this.pickerOptions.disabledDate = beforeFn;
            }else if(this.disabledAfter) {
                this.pickerOptions.disabledDate = afterFn;
            }
        },
        methods: {
            getTime(dateStr){
                let dateArr = dateStr.split(' - ');
                let diff = new Date(dateArr[1]).getTime() - new Date(dateArr[0]).getTime();
                let day90 = 3600 * 1000 * 24 * 89;
                // 差值如果大于90天
                if(diff > day90){
                    this.$message.warning('时间间隔不能大于90天，已为你修改为90天')
                    this.$set(this.timeOption, 1, new Date(new Date(dateArr[0]).getTime() + day90));
                    return false;
                }
                if(dateStr){
                    this.$emit('get-time', dateArr[0], dateArr[1]);
                }else {
                    this.$emit('get-time', '', '');
                }
            },
            reset(start, end){
                this.timeOption = [new Date(start), new Date(end)]
            }
        }
    }
</script>
<style>

</style>
