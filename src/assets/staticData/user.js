import validator from '../unit/validator.js'

export const cloud_user = {
	// 面包屑
	crumbs: [{
		title: '用户管理'
	}, {
		title: '用户列表'
	}],
	// 用户状态
	userState: [{
		label: '有效',
		value: 'Active'
	}, {
		label: '禁用',
		value: 'Disabled'
	}],
	// 搜索
	form: {
		name: null,
		mobile: null,
		channel: null,
		state: null,
		pageIndex: 1,
		pageSize: 10,
	},
	// 用户管理-列表头
	tableHead: [{
		label: '昵称',
		prop: 'nickname'
	}, {
		label: '姓名',
		prop: 'name'
	}, {
		label: '性别',
		prop: 'genderName'
	}, {
		label: '商家名称',
		prop: 'merchantName'
	}, {
		label: '渠道名称',
		prop: 'channelName'
	}, {
		label: '邮箱',
		prop: 'email'
	}, {
		label: '状态',
		prop: 'stateName'
	}, {
		label: '手机号',
		prop: 'mobile'
	}]
}

export const cloud_user_detail = {
	crumbs: [{
		title: '用户管理'
	}, {
		title: '用户列表',
		to: '/c_user/list'
	}, {
		title: '用户详情'
	}],
	detailList: [{
		label: '姓名',
		prop: 'name',
	}, {
		label: '首字母',
		prop: 'initial',
	}, {
		label: '昵称',
		prop: 'nickname',
	}, {
		label: '手机',
		prop: 'mobile',
	}, {
		label: '邮箱',
		prop: 'email',
	}, {
		label: '头像',
		prop: 'avatarPath',
	}, {
		label: '个性签名',
		prop: 'signature',
	}, {
		label: '性别',
		prop: 'genderName',
	}, {
		label: '生日',
		prop: 'birthday',
	}, {
		label: '区域名称',
		prop: 'areaName',
	}, {
		label: '详细地址',
		prop: 'address',
	}, {
		label: '邀请码',
		prop: 'invitationCode',
	}, {
		label: '推荐人',
		prop: 'referrer',
	}, {
		label: '渠道名称',
		prop: 'channelName',
	}, {
		label: '工号',
		prop: 'workNumber',
	}, {
		label: '商家名称',
		prop: 'merchantName',
	}, {
		label: '组织机构',
		prop: 'organizationName',
	}]
}
