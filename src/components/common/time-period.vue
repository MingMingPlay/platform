<template>
    <div class="time-period">
        <div class="picker">
            <el-date-picker
                @change="pickerSelect"
                v-model="pickerTime"
                type="daterange"
                placeholder="选择日期范围">
            </el-date-picker>
        </div>
        <div class="quick" v-if="showQuick != false">
            <el-button type="text" :class="{active: isActive == 'today'}" @click="selectTime('today')">今天</el-button>
            <el-button type="text" :class="{active: isActive == 'threeDay'}" @click="selectTime('threeDay')">近三天</el-button>
            <el-button type="text" :class="{active: isActive == 'month'}" @click="selectTime('month')">近一月</el-button>
            <el-button type="text" :class="{active: isActive == 'threeMonth'}" @click="selectTime('threeMonth')">近三月</el-button>
            <el-button type="text" :class="{active: isActive == 'sixMonth'}" @click="selectTime('sixMonth')">近半年</el-button>
            <el-button type="text" :class="{active: isActive == 'year'}" @click="selectTime('year')">近一年</el-button>
        </div>
    </div>
</template>
<script>
    // 三个参数，show-quick，default，change-value
    // show-quick   布尔值，默认不传显示快捷按钮，传false隐藏快捷按钮
    // default   默认时间，具体看快捷按钮的参数，如threeDay
    // change-value   用于改变组件内的时间
    // 一个方法 emit-time，两个回调参数(start, end)
    export default {
        props: ['showQuick', 'default', 'changeValue'],
        data() {
            return {
                isActive: '',
                pickerTime: [],
                timeData: {
                    today: {
                        start: '',
                        end: '',
                    },
                    threeDay: {
                        start: '',
                        end: '',
                    },
                    month: {
                        start: '',
                        end: '',
                    },
                    threeMonth: {
                        start: '',
                        end: '',
                    },
                    sixMonth: {
                        start: '',
                        end: '',
                    },
                    year: {
                        start: '',
                        end: '',
                    },
                }
            }
        },
        created(){
            for (let key in this.timeData){
                this.getTime(key);
            }
            if(this.default && this.showQuick != false){
                this.isActive = this.default;
                this.pickerTime = [this.timeData[this.default].start, this.timeData[this.default].end];
                this.$emit('emit-time', this.timeData[this.default].start, this.timeData[this.default].end);
            }
        },
        watch: {
            changeValue(newVal, oldVal){
                if(!newVal){
                    this.pickerTime = '';
                }
            }
        },
        methods: {
            pickerSelect(date){
                if(date){
                    for (let key in this.timeData){
                        if(date.split(' - ')[0] === this.timeData[key].start && date.split(' - ')[1] === this.timeData[key].end){
                            this.isActive = key;
                            break;
                        }else {
                            this.isActive = '';
                        }
                    }
                    this.$emit('emit-time', date.split(' - ')[0], date.split(' - ')[1]);
                }else {
                    this.$emit('emit-time', '');
                    this.isActive = '';
                }
            },
            getTime(type){
                let cTime = new Date();
                let start = '';
                let end = this.format(cTime);
                if(type === 'today'){
                    start = this.format(cTime);
                }else if(type === 'threeDay'){
                    let timeStamp = new Date(cTime.getTime() - 86400000*2);
                    start = this.format(timeStamp);
                }else if(type === 'month'){
                    start = this.formatYear(1);
                }else if(type === 'threeMonth'){
                    start = this.formatYear(3);
                }else if(type === 'sixMonth'){
                    start = this.formatYear(6);
                }else if(type === 'year'){
                    start = this.formatYear(12);
                }
                this.timeData[type].start = start;
                this.timeData[type].end = end;
            },
            selectTime(type){
                if(this.isActive === type){
                    return false;
                }else {
                    this.isActive = type;
                }
                this.pickerTime = [new Date(this.timeData[type].start), new Date(this.timeData[type].end)];
            },
            format(date){
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                if(month < 10){
                    month = `0${month}`;
                }
                if(day < 10){
                    day = `0${day}`;
                }
                return `${year}-${month}-${day}`;
            },
            formatMonth(y, m, d){       // 用于验证年份，是否该往上减一年
                let date = new Date(`${y}-${m}-${d}`);
                if(date.getDate() != d){
                    d = d - 1;
                    return this.formatMonth(y, m, d);
                }else {
                    return `${y}-${m}-${d}`;
                }
            },
            formatYear(n){       // 用于验证月份的后面几天，如29，30，31
                let cTime = new Date();
                let y = cTime.getFullYear();
                let m = cTime.getMonth() - n + 1;
                let d = cTime.getDate();
                if(m < 1){
                    m = 12 - Math.abs(m);
                    y = y - 1;
                }
                if(m < 10){
                    m = `0${m}`;
                }
                if(d < 10){
                    d = `0${d}`;
                }
                return this.formatMonth(y, m, d);
            },
        }
    }
</script>
<style>
    .time-period{
        display: inline-block;
    }
    .time-period .picker{
        display: inline-block;
        margin-right: 20px;
    }
    .time-period .quick{
        display: inline-block;
    }
    .time-period .el-button--text{
        color: #8391a5;
        padding: 6px;
        margin-left: 0;
    }
    .time-period .el-button--text:hover{
        color: #48576a;
    }
    .time-period .el-button--text.active{
        background: #20a0ff;
        color: #fff;
    }
</style>
