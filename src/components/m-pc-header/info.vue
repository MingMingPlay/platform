<template>
	<div class="account-info">

		<jkc-breadcrumb :crumbs="crumbs" :goBack="-1"></jkc-breadcrumb>

		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="84px">
			<div class="detail-title">个人信息</div>
			<div class="detail-wrap">
				<el-form-item label="工号：" prop="workNumber">
					<el-input v-model="dialogForm.workNumber"></el-input>
				</el-form-item>
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="昵称：" prop="nickname">
					<el-input v-model="dialogForm.nickname"></el-input>
				</el-form-item>
				<el-form-item label="性别：" prop="gender">
					<el-radio-group v-model="dialogForm.gender">
						<el-radio label="Male">男</el-radio>
						<el-radio label="Female">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="头像：" prop="avatarSid">
					<div class="localPreview" v-if="uploadStatus[0]">
						<img :src="dialogForm[imgNameArr[0].imgPathName]" alt="预览失败" @mouseenter="shadowStatus = true" />
						<div class="imgShadow" v-show="shadowStatus" @mouseleave="shadowStatus = false">
							<i class="el-icon-delete2" @click="handleDelLocalImg(0)"></i>
						</div>
					</div>
					<el-upload :action="imageApi" :headers="headers" :data="{customMessage: '0'}" list-type="picture-card" :show-file-list="false" :on-success="handleSuccess" :before-upload="handleBefore" v-show="!uploadStatus[0]">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="个性签名：" prop="signature">
					<el-input v-model="dialogForm.signature"></el-input>
				</el-form-item>
				<el-form-item label="手机：" prop="mobile" class="is-required">
					<el-input v-model="dialogForm.mobile"></el-input>
				</el-form-item>
				<el-form-item label="邮箱：" prop="email">
					<el-input v-model="dialogForm.email"></el-input>
				</el-form-item>
				<el-form-item label="生日：" prop="birthday">
					<el-date-picker v-model="dialogForm.birthday" type="date" :picker-options="optionalRange" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="区域" class="overflow">
				    <area-select :default-sid="dialogForm.visibleAreaSid" @get-area="handleGetArea"></area-select>
					<!--<el-select v-model="proName" placeholder="省" @change="handleChangePro" clearable>
						<el-option v-for="item in pro" :label="item.name" :value="item.sid"></el-option>
					</el-select>
					<el-select v-model="cityName" placeholder="市" @change="handleChangeCity" clearable>
						<el-option v-for="item in city" :label="item.name" :value="item.sid"></el-option>
					</el-select>
					<el-select v-model="areaName" placeholder="区" @change="handleChangeArea" clearable>
						<el-option v-for="item in area" :label="item.name" :value="item.sid"></el-option>
					</el-select>-->
				</el-form-item>
				<el-form-item label="详细地址：">
					<el-input v-model="dialogForm.address"></el-input>
				</el-form-item>
				<el-form-item label="邀请码：">
					<el-input v-model="dialogForm.invitationCode"></el-input>
				</el-form-item>
				<el-form-item label="推荐人：">
					<el-input v-model="dialogForm.referrer"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('dialogForm')">保存</el-button>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>

<script>
    import AreaSelect from '../common/area-select.vue'
	import { mixin_breadcrumb, mixin_pageForm, mixin_uploadImage, mixin_area } from '../common/jkc-mixin.vue'
	import api from '../../assets/config/m-api.js'
	import { pubObj } from '../../assets/unit/public.js'
	import { cloud_account_info } from '../../assets/staticData/account.js'
	import validator from '../../assets/unit/validator.js'

	export default {
		mixins: [mixin_breadcrumb, mixin_pageForm, mixin_uploadImage, mixin_area],
		components: { AreaSelect },
		data() {
			return {
				api: null,
				imageApi: null,
				uploadStatus: [false], // 上传对象数组
				imgNameArr: [],
//				callback: [pubObj.area_map], // 在首次拿数据时，要执行的回调函数
				dialogForm: {},
				rules: {},
				optionalRange: { // 生日不能大于今天
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				}
			}
		},
		created() {
			this.api = api.user + 'profile/';
			this.crumbs = cloud_account_info.crumbs;
			this.imageApi = api.attachment + 'UserAvatar';
			this.imgNameArr = [{
				imgSidName: 'avatarSid',
				imgPathName: 'avatarPath',
			}];
			this.dialogForm = cloud_account_info.dialogForm;
			this.rules = cloud_account_info.rules;
		},
		beforeMount() {

		},
		methods: {
		    handleGetArea(obj) {
                this.dialogForm.visibleAreaSid = obj.areaSid;
            }
			/*handleBlurPassport() {
				this.dialogForm.idNumber = this.dialogForm.idNumber2
			},
			// 针对证件类型是“护照”，做特殊处理(修改)
			callbackPassport($th) {
				if($th.dialogForm.idType === 'Passport') {
					$th.$set($th.dialogForm, 'idNumber2', $th.dialogForm.idNumber);
					$th.dialogForm.idNumber = ''
				}
			}*/
		},
		destroyed() {
			pubObj.resetForm(0, this.dialogForm, ['gender'])
		}
	}
</script>

<style>
    .account-info .area-select .el-select { width: 32%; float: left; }
    .account-info .area-select .el-select+.el-select { margin-left: 2%; }
	.account-info .el-form-item__content { width: 400px; }
	.account-info .el-select { width: 50%; }
	.account-info .overflow .el-select { width: 32%; float: left; }
	.account-info .el-form-item__content .el-select+.el-select { margin-left: 2%; }
</style>
