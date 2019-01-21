<template>
    <el-form class="promotional-rule" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入活动名称" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="beginTime" class="is-required">
            <el-date-picker 
                v-model="ruleForm.activityTime" 
                type="datetimerange" 
                placeholder="请选择活动时间" 
                :picker-options="pickerOptions"
                @change="handleActivityTime">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <component :is="activeRule"></component>
        </el-form-item>
        <el-form-item label="限购次数" prop="maxNum">
            <el-select v-model="ruleForm.maxNum" placeholder="请选择限购次数" clearable disabled>
                <el-option label="不限制" :value="0"></el-option>
                <!--<el-option v-for="num in 5" :key="num" :label="num" :value="num"></el-option>-->
            </el-select>
        </el-form-item>
        <div style="text-align: center; margin: 20px 0 10px;">
            <el-button type="primary" @click="handleNextStep">下一步</el-button>
            <el-button type="default" @click="$router.go(-1)">取消</el-button>
        </div>
    </el-form>    
</template>

<script>
    import FirstRule from '../child/first-rule.vue'          // 满减
    import SecondRule from '../child/second-rule.vue'        // 满X件X元
    
    import Emitter from '../mixin/emitter.js'
    
    export default {
        componentName: 'ruleForm',
        
        provide() {
            return {
                root: this
            }
        },
        
        components: { FirstRule, SecondRule },
        
        mixins: [Emitter],
        
        data() {
            const rules = {
                name: [{
                    required: true,
                    message: '请输入活动名称',
                    trigger: 'blur'
                }],
                beginTime: [{
                    required: true,
                    message: '请选择活动时间',
                    trigger: 'blur'
                }],
                maxNum: [{
                    type: 'number',
                    required: true,
                    message: '请选择限购次数',
                    trigger: 'blur'
                }]
            };
            return {
                ruleForm: {                       // 表单
                    shopId: null,
                    type: null,
                    beginTime: null,
                    endTime: null,
                    state: null,
                    maxNum: 0,
                    rules: [],
                    merchandises: [],
                    activityTime: [],
                },                                
                rules: rules,                     // 验证
                activeRule: '',                   // 动态规则组件
                pickerOptions: {                  // 控制禁止选择的时间
                    disabledDate: this.setDisabledDate,
                }
            }
        },
        
        computed: {
            pageform() {
                let parent = this.$parent;
                if(parent) {
                    return parent;
                }
            }
        },
        
        methods: {
            setDisabledDate(date) {
                // 只能选择今天之后的时间
                return ((new Date()).getTime() - 24*60*60*1000) > (new Date(date)).getTime();
            },
            handleActivityTime(datetime) {
                const index = datetime.indexOf(' - ');
                this.ruleForm.beginTime = datetime.slice(0, index);
                this.ruleForm.endTime = datetime.slice(index + 3);
            },
            // 开始验证
            handleNextStep() {
            	this.$refs.ruleForm.validate((valid) => {
                    if(valid) {
                    	this.broadcast('childForm', 'handleValidate');
                    } else {
                        return false;
                    }
                });
            },
            // 验证成功
            childValidateSuccess() {
                this.pageform.pageForm = this.ruleForm;
                this.pageform.activeStep++;
                this.pageform.activeView = 'SelectProduct';
            }
        },
        
        created() {
            this.ruleForm.shopId = this.$root.shopInfo.sid;
            this.ruleForm.type = this.$route.query.type;
        },
        
        mounted() {
            const type = this.$route.query.type;
            if(type == 1) {
                this.activeRule = 'FirstRule';
            } else if(type == 2) {
                this.activeRule = 'SecondRule';
            }
        }
    }
</script>

<style scoped>
    .promotional-rule>.el-form-item { width: 800px; margin: auto; margin-bottom: 22px; }
</style>