<template>
	<el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="100px">
		<el-form-item label="标题" prop="title">
			<el-input v-model="dialogForm.title"></el-input>
		</el-form-item>
		<el-form-item label="图片" prop="imageSid">
			<image-upload
                v-if="dialog.dialogVisible"
                v-model="dialogForm.imageSid"
                action-type="Banner"
                :action-path="dialogForm.imagePath">
            </image-upload>
            <!--<div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸1000*160</div>-->
		</el-form-item>
		<el-form-item label="渠道" prop="channelSid">
            <el-select v-model="dialogForm.channelSid" placeholder="请选择">
                <el-option v-for="(item,index) in channels" :key="index" :label="item.name" :value="item.sid"></el-option>
            </el-select>
        </el-form-item>
		<el-form-item label="类型" prop="type">
			<el-radio-group v-model="dialogForm.type">
				<el-radio label="OutLine">外部链接</el-radio>
				<el-radio label="Shop">内链商铺</el-radio>
				<el-radio label="Prodcut">内链商品</el-radio>
				<el-radio label="Other">其它</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="链接" prop="url" v-if="dialogForm.type == 'OutLine'">
			<el-input placeholder="如：http://www.baidu.com/" v-model="dialogForm.url"></el-input>
		</el-form-item>
		<el-form-item label="店铺名称" v-else-if="dialogForm.type == 'Shop'" prop="businessName">
		    <el-input placeholder="店铺名称" v-model="dialogForm.businessName" class="width-sixty" disabled></el-input>
            <el-button type="text" @click="stepToSelectShop">关联店铺</el-button>
		</el-form-item>
		<el-form-item label="商品名称" v-else-if="dialogForm.type == 'Prodcut'" prop="goodsName">
			<el-input placeholder="商品名称" v-model="dialogForm.goodsName" class="width-sixty" disabled></el-input>
			<el-button type="text" @click="stepToSelectGood">关联商品</el-button>
		</el-form-item>
        <el-form-item label="在APP显示" prop="display">
            <el-radio-group v-model="dialogForm.display">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <!--chuchuang-->
        <el-form-item label="广告排序" prop="rank">
            <el-slider
                v-model="dialogForm.rank"
                :max="99"
                :show-tooltip="false"
                show-input>
            </el-slider>
            <div style="font-size: 12px;">数字越大排序越靠前</div>
        </el-form-item>
		<el-form-item label="有效期" prop="datetimerange">
            <el-date-picker
                v-model="dialogForm.datetimerange"
                type="datetimerange"
                placeholder="横幅时效"
                :picker-options="pickerOptions"
                @change="handleDatetimerange">
            </el-date-picker>
        </el-form-item>

	</el-form>
</template>

<script>
    // 组件
	/*import TreeInput from '../../common/jkc-treeInput.vue'*/
	import ImageUpload from '../../common/image-upload.vue'
	// 混合
	import Emitter from './mixin/emitter.js'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'
	import validator from '../../../assets/unit/validator.js'

	export default {
	    componentName: 'singleBannerForm',

	    components: { ImageUpload },

	    mixins: [Emitter],

	    inject: ['dialog'],

		data() {
		    const rules = {
                channelSid: [{
                    required: true,
                    message: '请选择渠道来源'
                }],
                title: [{
                    required: true,
                    message: '请填写图片名称'
                }, {
                    max: 50,
                    message: '最多不超过50个字符'
                }, {
                    validator: validator.validName,
                    message: '请输入中文或英文字符'
                }],
                type: [{
                    required: true,
                    message: '请选择链接类型'
                }],
                display: [{
                    required: true,
                    message: '请选择是否在APP显示',
                }],
                url: [{
                    required: true,
                    message: '请输入外部链接',
                    tigger: 'blur'
                }],
                // rank: [{
                //     type: 'number',
                //     message: '数字类型',
                //     trigger: 'blur'
                // }, {
                //     required: true,
                //     message: '请选择排序值',
                //     trigger: 'blur'
                // }],
                businessName: [],
                goodsName: []
            };
			return {
				rules: rules,
				channels: [],
				// 控制禁止选择的时间
                pickerOptions: {
                    disabledDate: this.setDisabledDate,
                }
			}
		},

		computed: {
		    dialogForm: {
		        get() {
		            return this.dialog.dialogForm;
		        },
		        set(form) {
		            this.dialog.dialogForm = form;
		        }
		    }
		},

		watch: {
            'dialogForm.type': function(val) {
                switch(val) {
                    case 'OutLine':
                        this.dialogForm.businessSid = null;
                        this.$set(this.rules, 'url', [{
                            required: true,
                            message: '请输入外部链接',
                            tigger: 'blur'
                        }]);
                        this.$set(this.rules, 'businessName', []);
                        this.$set(this.rules, 'goodsName', []);
                        break;
                    case 'Shop':
                        this.dialogForm.url = null;
                        this.$set(this.rules, 'businessName', [{
                            required: true,
                            message: '请选择内链店铺',
                            tigger: 'blur'
                        }]);
                        this.$set(this.rules, 'url', []);
                        this.$set(this.rules, 'goodsName', []);
                        break;
                    case 'Prodcut':
                        this.dialogForm.url = null;
                        this.$set(this.rules, 'goodsName', [{
                            required: true,
                            message: '请选择内链商品',
                            tigger: 'blur'
                        }]);
                        this.$set(this.rules, 'url', []);
                        this.$set(this.rules, 'businessName', []);
                        break;
                    default:
                        this.dialogForm.url = null;
                        this.dialogForm.businessSid = null;
                        this.$set(this.rules, 'businessName', []);
                        this.$set(this.rules, 'goodsName', []);
                        this.$set(this.rules, 'url', []);
                        break;
                }
            }
        },

		methods: {
		    // 重置表单
            handleResetForm() {
                this.$refs.dialogForm.resetFields();
                this.dialogForm.imagePath = null;
            },
		    setDisabledDate(date) {
                // 只能选择今天之后的时间
                return ((new Date()).getTime() - 24*60*60*1000) > (new Date(date)).getTime();
            },
            // 时间范围改变
            handleDatetimerange(date) {
                try {
                    if(date) {
                        const index = date.indexOf(' - ');
                        this.dialogForm.startTime = date.slice(0, index);
                        this.dialogForm.endTime = date.slice(index + 3);
                    } else {
                        this.$set(this.dialogForm, 'datetimerange', null);
                        this.$set(this.dialogForm, 'startTime', null);
                        this.$set(this.dialogForm, 'endTime', null);
                    }
                } catch(e) {
                    console.log(e)
                }
            },
            // 绑定店铺
            stepToSelectShop() {
                // 切换组件
                this.dialog.activeView = 'ShopTable';
            },
            // 绑定商品
            stepToSelectGood() {
                /*if(!this.dialogForm.channelSid || !this.dialogForm.navigationSid) {
                    this.$message.info('请先选择导航和渠道，才能选择商品');
                    return;
                }*/
                // 切换组件
                this.dialog.activeView = 'GoodsTable';
            },
            // 验证表单
            handleValidate() {
                this.$refs.dialogForm.validate((valid) => {
                    if(valid) {
                        this.dispatch('dialog', 'handleSubmitForm');
                    } else {
                        return false;
                    }
                })
            }
        },

		beforeMount() {
			pubObj.httpRequest(this, {
				url: this.$api.channel,
				success(result) {
					this.channels = result.data;
				}
			})
		}
	}
</script>

<style>
	.single-banner-form .width-sixty {
        width: 80%;
        margin-right: 10px;
    }
</style>
