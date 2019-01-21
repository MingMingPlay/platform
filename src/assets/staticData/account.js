import validator from '../unit/validator.js'

export const cloud_account = {
	// 面包屑
	crumbs: [{
		title: '账号管理'
	}, {
		title: '账号列表'
	}],
	// 用户状态
	userState: [{
		label: '有效',
		value: 'Active'
	}, {
		label: '禁用',
		value: 'Disabled'
	}],
	// 用户管理-列表头
	tableHead: [{
		label: '用户名',
		prop: 'loginName'
	}, {
		label: '姓名',
		prop: 'name'
	}, {
		label: '手机',
		prop: 'mobile'
	}, {
		label: '状态',
		prop: 'stateName'
	}],
	rules: {
		loginName: [{
			required: true,
			message: '请输入登录账号'
		}],
		mobile: [{
            required: true,
            message: '请输入手机号'
        }, {
			validator: validator.validCellphone,
			trigger: 'blur'
		}],
		password: [{
			required: true,
			message: '请输入密码'
		}, {
			min: 6,
			max: 30,
			message: '密码长度6~30位'
		}],
		name: [{
			required: true,
			message: '请输入姓名'
		}, {
			max: 20,
			message: '姓名最长20字'
		}]
	}
}

export const cloud_account_info = {
	crumbs: [{
		title: '个人中心'
	}, {
		title: '信息修改'
	}],
	// 添加时的表单
	dialogForm: {
		workNumber: null,
		name: null,
		nickname: null,
		avatarSid: null,
		avatarPath: null,
		gender: 'Male',
		signature: null,
		mobile: null,
		email: null,
		birthday: null,
		areaSid: null,
		address: null,
		invitationCode: null,
		referrer: null,
	},
	rules: {
		workNumber: [{
				required: true,
				message: '请填写员工工号，最多不超过20个字符'
			}, {
				max: 20,
				message: '最多不超过20个字符'
			}
			/*, {
						validator: validator.valid_isRepeat(this, 'worknum'),
						trigger: 'blur'
					}*/
		],
		name: [{
			required: true,
			message: '请填写姓名，最多不超过20个字符'
		}, {
			max: 20,
			message: '最多不超过20个字符'
		}],
		nickname: [{
			required: true,
			message: '请填写用户昵称'
		}, {
			max: 30,
			message: '最多不超过30个字符'
		}],
		gender: [{
			required: true,
			message: '请选择性别'
		}],
		mobile: [{
            required: true,
            message: '请输入手机号'
        }, {
			validator: validator.validCellphone,
			trigger: 'blur'
		}
			/*, {
						validator: validator.valid_isRepeat(this, 'mobile'),
						trigger: 'blur'
					}*/
		],
		email: [{
			type: 'email',
			message: '请输入正确的邮箱格式',
			trigger: 'blur'
		}]
	}
}