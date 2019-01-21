import { vm } from '../pages/merchant.js'
import api from '../assets/config/m-api.js'
import { pubObj } from '../assets/unit/public.js'

// moduleA：控制弹出层表单
const moduleA = {
	state: {
		status: 0,
		sid: null,
	},
	mutations: {
		aAdd(state, status) {
			state.status = status;
		},
		aEdit(state, arr) {
			state.status = arr[0];
			state.sid = arr[1];
		}
	}
}

// moduleB：弹出层表格
const moduleB = {
	state: {
		status: 0,
		sid: null,
	},
	mutations: {
		bReset(state, status) {
			state.status = status;
		},
		bEdit(state, arr) {
			state.status = arr[0];
			state.sid = arr[1];
		}
	}
}

// moduleC：分页
const moduleC = {
	state: {
		pageIndex: 1,
		pageSize: 10,
	},
	mutations: {
		cPage(state, arr) {
			if(arr[0] === 0) state.pageSize = arr[1];
			else state.pageIndex = arr[1];
		},
		// 复原
		cRecovery(state, arr) {
			state.pageIndex = arr[0];
			state.pageSize = arr[1];
		}
	},
}

// moduleD：点击空白消失下拉框
const moduleD = {
	state: {
		status: 0,
	},
	mutations: {
		dDisplay(state, status) {
			state.status = status
		},
	},
}

// 刷新
const moduleE = {
	state: {
		status: 0
	},
	mutations: {
		refresh(state, status) {
			state.status = status
		}
	},
}

// 自定义表格(brand、category)-通过自定义指令来控制内容可变的数据左对齐
const moduleF = {
	state: {
		offsetLeft: [],
	},
	mutations: {
		fAdd(state, arr) {
			state.offsetLeft = arr;
		}
	}
}

// 用户权限控制（自定义表格-操作按钮显示控制）
const moduleG = {
	state: {
		button: {},
	},
	mutations: {
		gControl(state, obj) {
			state.button = obj;
		}
	}
}

// 详情
const moduleH = {
	state: {
		sid: '',
	},
	mutations: {
		hShow(state, sid) {
			state.sid = sid;
		}
	}
}

// 阅商机——自营订单
const selfOrder = {
	state: {
		selfForm: {}
	},
	mutations: {
		getSelfForm(state, form) {
			state.selfForm = form;
		}
	}
}
// 阅商机——行销品订单
const specialOrder = {
	state: {
		typeName: null,
		specialForm: {}
	},
	mutations: {
		getSpecialType(state, typeName) {
			state.typeName = typeName;
		},
		getSpecialForm(state, form) {
			state.specialForm = form;
		}
	}
}
// 阅商机——退款订单
const refundOrder = {
	state: {
		typeName: 'general',
		refundForm: {}
	},
	mutations: {
		getRefundType(state, typeName) {
			state.typeName = typeName;
		},
		getRefundForm(state, form) {
			state.refundForm = form;
		}
	}
}

// 状态管理对象
export default {
	a: moduleA,
	b: moduleB,
	c: moduleC,
	d: moduleD,
	e: moduleE,
	f: moduleF,
	g: moduleG,
	h: moduleH,
	i: selfOrder,
	j: specialOrder,
	k: refundOrder,
}
