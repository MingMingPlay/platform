// 定义一个接收thisd的变量
let _this = null;
// 获取页面回调this
export const getThis = (th) => {
	_this = th;
}
// 验证密码是否相等
const isPasswordEqual = (rule, value, callback) => {
	if(value !== _this.form.password) {
		callback(new Error('两次输入密码不一致!'));
	} else {
		callback();
	}
};
export const change_password = {
	rules: {
		oldPassword: [{
			required: true,
			message: '请输入原密码'
		}],
		password: [{
			required: true,
			message: '请输入新密码'
		}, {
			min: 6,
			max: 30,
			message: '密码长度6~30位'
		}],
		repassword: [{
			required: true,
			message: '请再次输入新密码'
		}, {
			validator: isPasswordEqual,
			trigger: 'blur'
		}],
	}
}