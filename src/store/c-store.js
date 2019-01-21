import { vm } from '../pages/platform.js'
import api from '../assets/config/c-api.js'
import { pubObj } from '../assets/unit/public.js'

// moduleA：控制弹出层表单
const moduleA = {
	state: {
		status: 0,
		sid: null,
	},
	mutations: {
		aReset(state) {
			state.status = 0;
			state.sid = null;
		},
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
			if(arr[0] === 0) state.pageSize = arr[1]
			else state.pageIndex = arr[1]
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

/*const moduleI = {
	state: {
		status: 0,
	},
	mutations: {
		iGetState(state, status) {
			state.status = status;
		}
	}
}*/

/*// 订单管理
const moduleI = {
	state: {
		url: null,
		form: {},
		tableData: []
	},
	mutations: {
		getUrl(state, url) {
			state.url = url;
		},
		getForm(state, form) {
			state.form = form;
		}
	},
	actions: {
		loadOrderData(context, form) {
			context.commit('getForm', form);
			pubObj.httpRequest(vm, {
				url: context.state.url,
				params: context.state.form,
				success(result) {
					context.state.tableData = result.data;
				}
			})
		}
	}
}
// 获取动态url
const moduleJ = {
	state: {
		url: null,
	},
	mutations: {
		getActiveUrl(state, url) {
			state.url = url;
		}
	}
}*/

// 状态管理对象
export default {
	a: moduleA,
	b: moduleB,
	c: moduleC,
	d: moduleD,
	e: moduleE,
	f: moduleF,
	g: moduleG,
	h: moduleH
}
