import validator from '../unit/validator.js'

// 1、logo.vue
export const category = {
	crumbs: [{
		title: '品类管理'
	}, {
		title: '品类列表'
	}],
}

// 2、logo-form.vue
export const categoryForm = {
	imgNameArr: [{
		imgSidName: 'logoSid',
		imgPathName: 'logoPath',
	}],
	dialogForm: {
		name: null,
		parentSid: null,
		parentName: null,
		logoSid: null,
		logoPath: null,
		rank: 1,
		description: null,
		sid: ''
	},
	rules: {
		name: [{
			required: true,
			message: '品类名称不能为空'
		}, {
			validator: validator.valid_isChinese,
			trigger: 'blur'
		}],
		logoSid: [{
			required: true,
			message: '请上传品类图片'
		}],
		rank: [{
			required: true,
			type: 'number',
			message: '排序值不能为空'
		}],
		description: [{
			max: 500,
			message: '品类描述不能超过500字'
		}]
	}
}