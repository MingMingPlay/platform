export const brand = {
	crumbs: [{
		title: '品牌管理'
	}, {
		title: '品牌列表'
	}],
}

import validator from '../unit/validator.js'

export const brandForm = {
	imgNameArr: [{
		imgSidName: 'logoSid', // 当前页面上传什么图片，头像?logo?
		imgPathName: 'logoPath', // 编辑时，返回回来的图片路径名
	}],
	dialogForm: {
		nameFull: null,
		nameAbbr: null,
		nameEn: null,
		logoSid: null,
		logoPath: null,
		rank: 1,
		description: null,
		sid: ''
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
			type: 'number',
			message: '排序值不能为空'
		}],
		description: [{
			max: 100,
			message: '最多不超过100个字符'
		}]
	}
}