export const shop = {
	crumbs: [{
		title: '店铺管理'
	}, {
		title: '店铺列表'
	}],
	tableHead: [{
		prop: 'nameFull',
		label: '店铺名称',
	}, {
        prop: 'organName',
        label: '组织机构',
	}, {
		prop: 'merchantName',
		label: '商家名称',
	}, {
		prop: 'servicePhone',
		label: '客服电话',
	}, {
		prop: 'serviceQQ',
		label: '客服QQ',
	}, {
		prop: 'serviceMail',
		label: '客服邮箱',
	}, {
        prop: 'address',
        label: '店铺地址',
	}, {
		prop: 'description',
		label: '店铺简介',
	}],
}

export const shopForm = {
	dialogForm: {
		nameFull: "",
		nameAbbr: "",
		nameEn: "",
		description: "",
		logoSid: "",
		logoPath: "",
		mainCategorySid: "",
		exemption: "",
		servicePhone: "",
		serviceQQ: "",
		serviceMail: "",
        merchantSid: "",
        areaSid: "",
        organCode: ""
	},
	rules: {
		nameFull: [{
			required: true,
			message: '请填写店铺名称'
		}, {
			max: 30,
			message: '店铺名称不能超过30个字'
		}],
		logoSid: [{
			required: true,
			message: '请上传店铺LOGO'
		}],
		mainCategorySid: [{
			required: true,
			message: '请选择主营品类',
			trigger: 'blur'
		}],
		serviceMail: [{
			type: 'email',
			message: '请输入正确的邮箱格式',
			trigger: 'blur'
		}]
	}
}