import validator from '../unit/validator.js'

export const bannerForm = {
	dialogForm: {
	    rank: 0,
	    url: null,
	    title: null,
	    endTime: null,
	    goodName: null,
	    imageSid: null,
	    startTime: null,
	    imagePath: null,
	    type: 'OutLine', // 默认是外部链接
	    channelSid: null,
		businessSid: null,
		navigationSid: null,
		navigationName: null,
	},
	rules: {
		navigationSid: [{
			required: true,
			message: '请选择导航栏目'
		}],
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
		}],
		type: [{
			required: true,
			message: '请选择链接类型'
		}],
		rank: [{
			required: true,
			message: '请填写排序值'
		}, {
			type: 'number',
			message: '只能输入数字'
		}, {
			validator: validator.range_number(0, 99),
			trigger: 'change'
		}],
	},
}