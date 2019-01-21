<template>
    <div class="search-fil-wrap one-line">
        <el-form class="search-form" :model="value" :inline="true">
            <el-form-item label="时间">
                <date-picker
                    ref="datePicker"
                    :shortcut="true"
                    :disabledAfter="true"
                    :start="value.startDay"
                    :end="value.endDay"
                    @get-time="getTime"
                ></date-picker>
            </el-form-item>
            <el-form-item label="订单类型" v-if="value.orderType !== undefined">
                <el-select v-model="value.orderType" placeholder="请选择订单类型">
                    <!--<el-option value="Generally" label="普通商品订单"></el-option>-->
                    <el-option value="Special" label="行销商品订单"></el-option>
                    <el-option value="Subscribe" label="征订商品订单"></el-option>
                    <el-option value="Ticket" label="门票订单"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品类型" v-if="value.spuType !== undefined">
                <el-select v-model="value.spuType" placeholder="请选择商品类型">
                    <el-option value="General" label="自营商品"></el-option>
                    <el-option value="Assist" label="行销商品"></el-option>
                </el-select>
            </el-form-item>
            <tp-organ
                v-model="value.organCode"
                :tp-all="true"
                v-if="value.organCode !== undefined">
            </tp-organ>
            <el-form-item label="用户姓名" v-if="value.userName !== undefined">
                <el-input v-model="value.userName" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="招商专员" v-if="value.leaseExecutive !== undefined">
                <el-input v-model="value.leaseExecutive" placeholder="请准确输入招商专员姓名"></el-input>
            </el-form-item>
            <el-button type="primary" @click="resetSearch">重置条件</el-button>
            <el-button type="primary" @click="$emit('handle-search')">搜索</el-button>
        </el-form>
    </div>
</template>
<script>
    import TpOrgan from '../../common/tp-organ.vue'
    import datePicker from '../../common/date-picker.vue'
    import { searchForm } from './page-config.js'
    export default {
        props: {
            value: {
                type: Object,
            },
            type: {
                required: true
            }
        },
        data() {
            return {}
        },
        created(){
            this.initSearchTime();
        },
        components: {
            TpOrgan,
            datePicker,
        },
        methods: {
            initSearchTime(){
                if(!this.value.startDay && !this.value.startDay){
                    let time = new Date();
                    let yesterday = time.setTime(time.getTime() - 3600 * 1000 * 24);
                    let yStr = new Date(yesterday).toLocaleDateString().replace(/\//g, '-');
                    this.value.startDay = this.value.endDay = yStr;
                    this.$emit('input', this.value)
                }
            },
            getTime(start, end){
                this.value.startDay = start;
                this.value.endDay = end;
                this.$emit('input', this.value)
            },
            resetSearch(){
                let current = JSON.parse(JSON.stringify(searchForm[this.type]));
                for(var key in current){
                    this.value[key] = current[key];
                }
                this.initSearchTime();
                this.$refs.datePicker.reset(this.value.startDay, this.value.endDay);
                this.$emit('input', this.value)
            },
        }
    }
</script>
<style>

</style>
