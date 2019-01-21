<template>
	<el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="80px">
		<el-form-item label="所属渠道" prop="channelSid">
			<el-select v-model="dialogForm.channelSid" placeholder="请选择">
				<el-option v-for="(item,index) in channels" :key="index" :label="item.name" :value="item.sid"></el-option>
			</el-select>
		</el-form-item>
		<!--<el-form-item label="导航栏目" class="is-required" prop="navigationSid">
			<tree-input :selectData="navigations" :defaultVal="dialogForm.navigationName" label="title" @nodeClick="handleNodeClick"></tree-input>
		</el-form-item>-->
		<el-form-item label="图片名称" prop="title">
			<el-input v-model="dialogForm.title"></el-input>
		</el-form-item>
		<el-form-item label="横幅图片" prop="imageSid">
			<image-upload 
                v-if="dialog.dialogVisible"
                v-model="dialogForm.imageSid"
                action-type="Banner"
                :action-path="dialogForm.imagePath">
            </image-upload>
            <div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸比列75:41</div>
		</el-form-item>
		<el-form-item label="链接类型" prop="type">
			<el-radio-group v-model="dialogForm.type">
				<el-radio label="OutLine">外部链接</el-radio>
				<el-radio label="Shop">内链商铺</el-radio>
				<el-radio label="Prodcut">内链商品</el-radio>
				<el-radio label="Other">其它</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="链接地址" prop="url" v-if="dialogForm.type == 'OutLine'">
			<el-input placeholder="http://www.baidu.com/" v-model="dialogForm.url"></el-input>
		</el-form-item>
		<el-form-item label="店铺名称" v-else-if="dialogForm.type == 'Shop'" prop="businessName">
		    <el-input placeholder="店铺名称" v-model="dialogForm.businessName" class="width-sixty" disabled></el-input>
            <el-button type="text" @click="stepToSelectShop">关联店铺</el-button>
		    <!--<el-select 
                v-model="dialogForm.businessSid" 
                placeholder="请输入店铺名称" 
                clearable 
                filterable 
                remote 
                :remote-method="handleSearchShops">
                <el-option
                    v-for="item in shopList"
                    :label="item.nameFull"
                    :value="item.sid">
                </el-option>
            </el-select>-->
		</el-form-item>
		<el-form-item label="商品名称" v-else-if="dialogForm.type == 'Prodcut'" prop="goodsName">
			<el-input placeholder="商品名称" v-model="dialogForm.goodsName" class="width-sixty" disabled></el-input>
			<el-button type="text" @click="stepToSelectGood">关联商品</el-button>
		</el-form-item>
		<el-form-item label="时间范围" prop="datetimerange">
            <el-date-picker 
                v-model="dialogForm.datetimerange" 
                type="datetimerange" 
                placeholder="横幅时效" 
                :picker-options="pickerOptions"
                @change="handleDatetimerange">
            </el-date-picker>
        </el-form-item>
		<el-form-item label="排序" prop="rank">
			<el-slider 
			    v-model.number="dialogForm.rank" 
			    show-input 
			    :max="99" 
			    :show-tooltip="false">
			</el-slider>
			<div style="font-size: 12px;">数字越大排序越靠前</div>
		</el-form-item>
	</el-form>
</template>

<script>
    // 组件
	import TreeInput from '../../common/jkc-treeInput.vue'
	import ImageUpload from '../../common/image-upload.vue'
	// 混合
	import Emitter from './mixin/emitter.js'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'
	import validator from '../../../assets/unit/validator.js'
	
	export default {
	    componentName: 'bannerForm',
	    
	    components: { TreeInput, ImageUpload },
	    
	    mixins: [Emitter],
	    
	    inject: ['dialog'],
	    
		data() {
		    const rules = {
                navigationSid: [{
                    required: true,
                    message: '请选择导航栏目',
                    tigger: 'blur'
                }],
                channelSid: [{
                    required: true,
                    message: '请选择渠道来源',
                    tigger: 'blur'
                }],
                imageSid: [{
                    required: true,
                    message: '请上传图片',
                    tigger: 'blur'
                }],
                title: [{
                    required: true,
                    message: '请填写图片名称',
                    tigger: 'blur'
                }, {
                    max: 50,
                    message: '最多不超过50个字符'
                }, {
                    validator: validator.validName,
                    message: '请输入中文或英文字符'
                }],
                type: [{
                    required: true,
                    message: '请选择链接类型',
                    tigger: 'blur'
                }],
                rank: [{
                    required: true,
                    message: '请选择横幅排序',
                }, {
                    type: 'number',
                    message: '只能输入数字'
                }, {
                    validator: validator.range_number(0, 99),
                    trigger: 'blur'
                }],
                url: [{
                    required: true,
                    message: '请输入外部链接',
                    tigger: 'blur'
                }],
                businessName: [],
                goodsName: []
            };
			return {
				rules: rules,
				navigations: [],
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
		    },
		    /*dialog() {
		        let parent = this.$parent;
                let parentName = parent.$options.componentName;
                while(parentName !== 'dialog') {
                    parent = parent.$parent;
                    parentName = parent.$options.componentName;
                }
                return parent;
		    }*/
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
		    // 根据用户输入查询店铺
		    /*handleSearchShops(val) {
		        pubObj.httpRequest(this, {
                    url: ['moreShop'],
                    params: { q: val },
                    success(result) {
                        this.shopList = result.data;
                    }
                })
		    },*/
		    // 重置表单
		    handleResetForm() {
		        this.$refs.dialogForm.resetFields();
		        this.dialogForm.navigationName = null;
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
            // 选择导航栏目
            handleNodeClick(sid) {
                this.dialogForm.navigationSid = sid;
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
				url: this.$api.navigation,
				success(result) {
					this.navigations = result.data;
				}
			});
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
	.banner-form .width-sixty {
        width: 80%;
        margin-right: 10px;
    }
</style>
