<template>
	<el-dialog :title="title" v-model="dialogVisible">
		<el-form :model="form" :rules="rules" ref="form" label-width="80px">
			<el-form-item label="原密码" prop="oldPassword">
				<el-input v-model="form.oldPassword" type="password"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="password">
				<el-input v-model="form.password" type="password"></el-input>
			</el-form-item>
			<el-form-item label="重复密码" prop="repassword">
				<el-input v-model="form.repassword" type="password"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitForm('form')">修改</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { submitForm } from './mixin-methods.vue'
	import { pubObj } from '../../assets/unit/public.js'
	import { getThis, change_password } from '../../assets/staticData/common.js'

	export default {
		mixins: [submitForm],
		props: {
			isVisible: {
				type: Boolean,
				default: false
			},
			title: {
				type: String
			}
		},
		data() {
			return {
				dialogVisible: null,
				form: {
					oldPassword: null,
					password: null,
					repassword: null,
				},
				rules: {},
			}
		},
		created() {
			// 传this
			getThis(this);
			this.dialogVisible = this.isVisible;
			this.rules = change_password.rules;
		},
		watch: {
			dialogVisible(val) {
				if(!val) this.$emit('cancel', val);
			}
		},
		methods: {
			handleSave() {
				pubObj.httpRequest(this, {
					method: 'put',
					url: ['changePassword'],
					body: this.form,
					success(result) {
                        let _this = this;
						this.$message.success({
							message: result.message,
							duration: 500,
							onClose() {
                                _this.$router.push('/login');
							}
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
