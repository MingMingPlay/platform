<template>
	<el-dialog class="edit-card" title="编辑名片" v-model="dialogVisible" :close-on-click-modal="false">

		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="90px">
			<el-form-item label="用户身份">
		   	<el-input v-model="dialogForm.typeName" disabled></el-input>
		  	</el-form-item>
		  	<el-form-item label="关联商户">
		   	<el-input v-model="dialogForm.relevanceName" disabled></el-input>
		  	</el-form-item>
		   <el-form-item label="称谓" prop="title">
		   	<el-input v-model="dialogForm.title"></el-input>
		   </el-form-item>
		   <el-form-item label="个人形象">
				<div class="localPreview" v-if="uploadStatus[0]">
					<img :src="dialogForm[imgNameArr[0].imgPathName] | pathIsNull(0, this)" @mouseenter="$set(shadowStatus, 0, true)" @error="handleError(0)" />
					<div class="imgShadow" v-show="shadowStatus[0]" @mouseleave="$set(shadowStatus, 0, false)">
						<i class="el-icon-delete2" @click="handleDelLocalImg(0)"></i>
					</div>
				</div>
				<el-upload :action="imageApi" :headers="headers" :data="{customMessage: '0'}" list-type="picture-card" :show-file-list="false" :on-success="handleSuccess" :before-upload="handleBefore" v-show="!uploadStatus[0]">
					<i class="el-icon-plus"></i>
				</el-upload>
				<div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸大于 600px*800px</div>
			</el-form-item>
		   <el-form-item label="荣誉标签" prop="labels">
		   	<div class="honor-label">
		   		<el-input v-model="dialogForm.labels[0]" class="label-width"></el-input>
		   		<el-input v-model="dialogForm.labels[1]" class="label-width"></el-input>
		   	</div>
		   </el-form-item>
		   <el-form-item label="联系电话" prop="phone">
		   	<el-input v-model="dialogForm.phone" :maxlength="11"></el-input>
		   </el-form-item>
			<el-form-item label="微信二维码">
				<div class="localPreview" v-if="uploadStatus[1]">
					<img :src="dialogForm[imgNameArr[1].imgPathName] | pathIsNull(1, this)" @mouseenter="$set(shadowStatus, 1, true)" @error="handleError(1)" />
					<div class="imgShadow" v-show="shadowStatus[1]" @mouseleave="$set(shadowStatus, 1, false)">
						<i class="el-icon-delete2" @click="handleDelLocalImg(1)"></i>
					</div>
				</div>
				<el-upload :action="imageApi" :headers="headers" :data="{customMessage: '1'}" list-type="picture-card" :show-file-list="false" :on-success="handleSuccess" :before-upload="handleBefore" v-show="!uploadStatus[1]">
					<i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>
		</el-form>

		<div slot="footer" class="footer">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleConfirm('dialogForm')">确定</el-button>
		</div>

	</el-dialog>
</template>

<script>
	import { mixin_uploadImage } from '../../common/jkc-mixin.vue'
	import { pubObj } from '../../../assets/unit/public.js'
	import api from '../../../assets/config/c-api.js'
	import validator from '../../../assets/unit/validator.js'
	export default {
		mixins: [mixin_uploadImage],
		props: ['visible', 'sid'],
		data() {
		    // 校验荣誉标签的允许长度
		    var valid_labels = (rule, value, callback) => {
		        console.log(value)
                if(value[0].length > 17 || value[1].length > 17) {
                  callback(new Error('荣誉标签输入长度不能超过17位'));
                } else if(value[0].indexOf('/') > 0 || value[1].indexOf('/') > 0) {
                  callback(new Error('请不要输入"/"，可能导致系统异常'));
                } else {
                  callback();
                }
            };
		    // 需要校验的元素
		    const rules = {
		        title: [{
                    required: true,
                    message: '请填写称谓'
                }, {
                    max: 6,
                    message: '最多不超过6个字符'
                }],
                labels: [{
                    validator: valid_labels,
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入手机号'
                }, {
                    validator: validator.validCellphone,
                    trigger: 'blur'
                }]
		    }
			return {
				dialogForm: {},
				rules: rules,
				uploadStatus: [false, false],
			}
		},
		computed: {
			dialogVisible: {
				get() {
					if(this.visible) this.getData();
					return this.visible;
				},
				set(val) { if(val); else this.$emit('update:visible', false); }
			},
			cardSid() { return this.sid; },
		},
		created() {
			this.dialogForm.labels = ['', ''];
			this.imageApi = api.attachment + 'NameCard';
			this.imgNameArr = [{
					imgSidName: 'imageSid', imgPathName: 'imagePath'
				},{
					imgSidName: 'wxImageSid', imgPathName: 'wxImagePath'
				}];
			this.shadowStatus = [false, false];
		},
		methods: {
		    // 图片加载失败
            handleError(index) {
                this.$set(this.uploadStatus, index, false);
            },
			// 自定义拦截器（处理荣誉标签）
			interceptor(data) {
				let labels = data.labels;
				if(!labels || labels.length === 0) data.labels = ['', ''];
				else if(labels.length === 1) data.labels.push('');
				return data;
			},
			// 获取详情数据
			getData() {
				if(!this.cardSid) return;
				pubObj.httpRequest(this, {
					url: api.card + this.cardSid,
					success(result) {
						this.dialogForm = this.interceptor(result.data);
						console.log(this.dialogForm)
						if(this.uploadStatus) {
							for(let i in this.uploadStatus) {
								this.$set(this.uploadStatus, i, true)
							}
						}
					}
				})
			},
			handleCancel() {
				this.$emit('update:visible', false);
			},
			handleConfirm(formName) {
			    const _this = this;
                _this.$refs[formName].validate((valid) => {
                    if(valid) {
                       pubObj.httpRequest(this, {
                            method: 'PUT',
                            url: api.card + _this.cardSid,
                            body: _this.dialogForm,
                            success(result) {
                                _this.$message.success(result.message);
                                _this.$emit('update:visible', false);
                                _this.$emit('success');
                            }
                        })
                    } else {
                        return false;
                    }
                });
			},
		}
	}
</script>

<style>
	.edit-card .el-dialog { max-height: 780px; }
	.edit-card .el-dialog__body { max-height: 643px; }
	.edit-card .footer { text-align: center; }
	.edit-card .honor-label { overflow: hidden; }
	.edit-card .label-width { width: 40%;float: left; }
	.edit-card .label-width+.label-width { margin-left: 20px; }
	.edit-card .localPreview { position: relative; float: left; overflow: hidden; background-color: #fff; border: 1px solid #c0ccda; border-radius: 6px; box-sizing: border-box; width: 148px; height: 148px; margin: 0 8px 8px 0; display: inline-block; }
	.edit-card .localPreview img { width: 100%;height: 100%; }
	.edit-card .localPreview .imgShadow { position: absolute; top: 0; bottom: 0; left: 0; right: 0; background-color: #000; opacity: 0.5; }
	.edit-card .localPreview .imgShadow i { display: inline-block; color: #fff; font-size: 20px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); cursor: pointer; }
</style>
