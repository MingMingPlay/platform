import validator from '../unit/validator.js'

// 2、logo-form.vue
export const logoForm = {
	dialogForm: {
		nameFull: '',
		nameAbbr: '',
		nameEn: '',
		logoSid: '',
		logoPath: "",
		rank: '',
		description: ''
	},
	rules: {
		nameFull: [{
			required: true,
			message: '请填写品牌名称'
		}, {
			max: 20,
			message: '品牌名称不能超过20个字'
		}],
		nameAbbr: [{
			required: true,
			message: '请填写品牌简称'
		}, {
			max: 20,
			message: '品牌简称不能超过20个字'
		}],
		nameEn: [{
			validator: validator.valid_isChar
		}, {
			max: 40,
			message: '品牌简称不能超过40个字'
		}],
		logoSid: [{
			required: true,
			message: '请上传图片'
		}],
		rank: [{
			required: true,
			message: '排序值不能为空'
		}, {
			type: 'number',
			message: '请输入数字'
		}, {
			validator: validator.range_number(0, 99)
		}],
		description: [{
			max: 100,
			message: '最多不超过100个字符'
		}]
	}
}