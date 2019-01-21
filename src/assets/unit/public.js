import Vue from 'vue'
//import { m_router } from '../../pages/merchant.js'
//import { c_router } from '../../pages/platform.js'

// 中央事件总线 bus
export const bus = new Vue();

// 导出一个公共方法对象
export const pubObj = {
    // time可以是时间字符串，时间戳（Number），或者不传
    getLocaleTime(time) {
        var date = time ? new Date(time) : new Date(); // 实例化一个日期对象
        var now = date.toLocaleString(); // 获取本地时间字符串
        // 标准化月日
        now = now.replace(/(\/)(\d{1,2})/g, function (match, $1, $2) {
            if(match.length > 2) {
                return match;
            } else {
                return ($1+'0'+$2);
            }
        });
        // 替换汉字（上午、下午）
        now = now.replace(/(\u4e0a\u5348|\u4e0b\u5348)(\d+)/, function (match, $1, $2) {
            if($1 === '上午') {
                return ($2.length > 1) ? $2 : '0'+$2;
            } else {
                return (parseInt($2)+12);
            }
        });
        return now;
    },
    // 返回日期
    // 参数说明(隐式)：(datetime：日期时间；separator：分隔符(/、-、.))
    getDateStr() {
        var args = arguments;  // 函数参数
        var datetime = null, separator = null;

        if(args.length === 2) {
            datetime = args[0];
            separator = args[1];
        } else if(args.length === 1) {
            args[0].match(/^[^0-9]$/) ? separator = args[0] : datetime = args[0];
        } else ;

        datetime = this.getLocaleTime(datetime);  // 获取待操作时间
        var matchDate = datetime.match(/^[^\s]+/)[0];  // 截取日期部分
        var targetDate = matchDate.replace(/([^0-9])/g, separator || '$1');  // 替换分隔符
        return targetDate;
    },
    // 对象序列化
    getQueryString(obj) {
        obj.token = sessionStorage.token;
        let queryString = '';
        Object.keys(obj).forEach((key) => {
            if(obj[key] == undefined || obj[key] == null) return false;
            else queryString += key + '=' + obj[key] + '&';
        });
        return queryString.slice(0, -1);
    },
    /**
     * @description 解析url查询参数为对象
     * @param {searchStr} 查询参数(通过location.search获取)
     * @return {object} 返回解析后的对象
     */
    parseQueryDefault(searchStr) {
        var queryObj = {};  // 定义一个目标对象
        try {
            searchStr = searchStr.slice(1);  // 截取？之后的字符串
            searchStr.split('&').forEach(function(item) {
                var match = item.match(/^(\w+)=(.+)/);
                queryObj[match[1]] = match[2];
            });
        } catch(e) {
            console.log(e);
            queryObj = this.parseQueryReplace(searchStr);
        };
        return queryObj;
    },
    // 上一种方法的替代方案（当第一种方案报错时执行）
    parseQueryReplace(searchStr) {
        var queryObj = {};  // 定义一个目标对象
        searchStr = searchStr.slice(1);  // 截取？之后的字符串
        searchStr.split('&').forEach(function(item) {
            var index = item.indexOf('=');
            var key = item.slice(0, index).trim();
            var value = item.slice(index+1).trim();
            queryObj[key] = value;
        });
        return queryObj;
    },
    /*end*/
	// 1、Ajax请求
	httpRequest(_this, obj) {
		_this.$http({
		    headers: obj.headers,
			method: obj.method || 'GET',
			url: obj.url,
			timeout: 30000,
			params: obj.params,
			body: obj.body
		}).then(function(res) {
			if(res.body.code === 200) {
				obj.success.call(_this, res.body);
				_this.loading = false;
			} else {
			    if(obj.complete) {
			        obj.complete.call(_this, res.body);
                    _this.loading = false;
			    } else {
			        _this.$message.warning(res.body.message);
			        _this.loading = false;
			    }
			}
		}).catch(function(err) {
		    _this.$message.error(err)
		})
	},
	// 拦截器
	/*httpInterceptor(complete) {
		Vue.http.interceptors.push(function(request, next) {
			// 完成之后的回调，执行完毕去success
			next(function(response) {
				response.body.data = complete(response)
				return response
			});
		});
	},*/
	// 2、重置表单
	reset(form, arr) {
		const len = arr.length;
		if(len === 0) {
			for(let i in form) {
				if(i === 'rank') {
					form[i] = 1;
				} else {
					form[i] = '';
				}
			}
		} else {
			for(let i in form) {
				if(arr.indexOf(i) === -1) form[i] = '';
				else continue;
			}
		}
	},
	resetForm(index, form, arr) { // arr表示需要屏蔽重置的item
		arr = arr ? arr : [];
		document.getElementsByClassName('el-form')[index].reset(); // 重置表单值
		if(form) this.reset(form, arr); // 重置响应式form对象
	},
	// 4、增删改
	// 获取用户列表
	getDataList($this, api) {
		this.httpRequest($this, {
			url: api,
			params: $this.form,
			success(result) {
				$this.tableData = result.data; // 赋值
				if(result.pagination) $this.pagiTotal = result.pagination.totalRow; // 分页
				$this.$store.commit('refresh', 0) // 复位刷新
			}
		})
	},
	//	add($th, title) {
	//		$th.title = '添加' + title // 设置标题
	//		$th.dialogVisible = true // 显示dialog
	//		this.resetForm(1, $th.dialogForm) // 重置dialogForm
	//	},
	del(_this, obj) {
		this.messageBox(_this, obj, () => {
			this.httpRequest(_this, {
				method: 'DELETE',
				url: obj.api + obj.sid,
				success(result) {
					this.$message.success('成功');
					this.$store.commit('refresh', 1) // 复位刷新
				}
			})
		})
	},
	edit(_this, api, sid, callback) {
		const curThis = this;
		curThis.httpRequest(_this, {
			url: api + (sid || ''),
			success(result) {
				curThis.formValueCover(_this.dialogForm, result.data)
				// 有回调就执行
				if(callback) {
					for(let i in callback) {
						callback[i](_this, curThis) // 执行回调函数
					}
				}
			}
		})
	},
	getMethod(_this) {
		const status = _this.aStatus || _this.query.type;
		if(status == 1) return 'POST';
		else if(status == 2) return 'PUT';
	},
	save(_this, body) {
		const curThis = this;
		this.httpRequest(_this, {
			method: curThis.getMethod(_this),
			url: _this.api + (_this.aSid || _this.$route.query.sid || ''),
			body: body || _this.dialogForm,
			success(result) {
				if(this.formType === 'page') {
					setTimeout(() => {
                        this.$router.go(-1)
                    }, 100)
				} else {
					this.$message.success({
						message: '保存成功',
						duration: 2000,
						onClose() {
							_this.dialogVisible = false;
							_this.$store.commit('refresh', 1);
						}
					})
				}
			}
		})
	},
	// 5、省市区
	/*province(_this, api) {
		this.httpRequest(_this, {
			url: api + 'provinces',
			success(result) {
				_this.pro = result.data;
			}
		});
	},*/
	/*city(_this, api, val) {
		// 当前areaSid
		_this.dialogForm.areaSid = val;
		this.httpRequest(_this, {
			url: api + 'parent/' + val,
			success(result) {
				_this.city = result.data[0].children;
			}
		})
	},*/
	/*area(_this, api, val) {
		// 当前areaSid
		_this.dialogForm.areaSid = val;
		this.httpRequest(_this, {
			url: api + 'parent/' + val,
			success(result) {
				_this.area = result.data[0].children;
			}
		})
	},*/
	// 6、区域返回值-数据转换
	area_map(_this, sid) {
		this.httpRequest(_this, {
			url: _this.$api.chain + sid,
			success(result) {
				if(result.data[0]) {
					this.provName = result.data[0].sid;
					// ------yjc start------
					this.handleProv(true, 'init');
					// ------yjc end------
				}
				if(result.data[1]) {
					this.cityName = result.data[1].sid;
					// ------yjc start------
					this.provIsChanged = true;
					this.handleCity(true, 'init');
					// ------yjc end------
				}
				if(result.data[2]) {
					this.areaName = result.data[2].sid;
					// ------yjc start------
					this.cityIsChanged = true;
					this.handleArea(true, 'init');
					// ------yjc end------
				}
			}
		})
	},
	// 7、获取所属渠道
	channel($th, api) {
		this.httpRequest($th, {
			url: api,
			success(result) {
				$th.channel = result.data;
			}
		});
	},
	// 8、这是封装的一个路由跳转的方法
	route_push(_this, path, query) {
        _this.$router.push({ path: path, query: query })
//      if(sessionStorage.backstage === 'c') c_router.push({ path: path, query: query })
//      else m_router.push({ path: path, query: query })
    },
	// 9、封装消息提示框
	messageBox(_this, obj, callback, params) {
		params = params || [];
		_this.$confirm(obj.content, obj.title, {
			confirmButtonText: obj.comfirmText || '确定',
			cancelButtonText: obj.cancelText || '取消',
			type: 'warning'
		}).then(() => {
			callback(...params);
		}).catch(err => {
			console.log(err)
		});
	},
	showMessage(_this, obj) {
        obj.params = obj.params || [];
        _this.$confirm(obj.content, obj.title, {
            showCancelButton: obj.showCancelButton === false ? false : true,
            showConfirmButton: obj.showConfirmButton === false ? false : true,
            confirmButtonText: obj.confirmText || '确定',
            cancelButtonText: obj.cancelText || '取消',
            type: 'warning'
        }).then(() => {
            obj.confirm.call(_this, ...obj.params);
        }).catch(err => {
            if(obj.cancel) obj.cancel.call(_this);
            else console.log(err);
        });
    },
	// 10、编辑有图片的表单
	pushImgPath($th, data) {
		$th.fileList1.length = 0; // 每次编辑，重置 fileList
		$th.fileList1.push({
			url: 'http://img.yanwei365.com' + data[$th.pathName]
		});
		$th.dialogForm = data
	},
	// 11、点击空白，隐藏自定义树形选择
	display(_this, event) {
		const classname = event.target.className;
		if(classname !== 'jkc-input el-input__inner') {
			_this.$store.commit('dDisplay', 1)
		}
	},
	// 12、表单赋值（避免全部覆盖）
	formValueCover(form, dataForm) {
		for(let i in form) {
			for(let j in dataForm) {
				if(i === j) form[i] = dataForm[j];
			}
		}
	},
	// 数据为空，加横杠
	addPlaceholder(data) {
		data.forEach((obj) => {
			Object.keys(obj).forEach((key) => {
				if(key.slice(-3).toUpperCase() === 'SID') return false;
				if(!obj[key] || obj[key] === '') obj[key] = '--';
			})
		})
		return data;
	},
	// 获取cookie信息
	getCookie(cookieName) {
		let cookieString = document.cookie;
		let arr = cookieString.split(';');
		let obj = {};
		for(let i = 0; i < arr.length; i++) {
			let a = arr[i].split('=');
			obj[a[0].trim()] = a[1];
		}
		return obj[cookieName] || '';
	},
	Base64() {

		// private property
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		// public method for encoding
		this.encode = function(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = _utf8_encode(input);
			while(i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if(isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if(isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		}

		// public method for decoding
		this.decode = function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while(i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if(enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if(enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		}

		// private method for UTF-8 encoding
		var _utf8_encode = function(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for(var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if(c < 128) {
					utftext += String.fromCharCode(c);
				} else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}
			return utftext;
		}

		// private method for UTF-8 decoding
		var _utf8_decode = function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while(i < utftext.length) {
				c = utftext.charCodeAt(i);
				if(c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	},
	validNum(data) { // 主要针对为0的数据返回真
		if(data === null || data === '' || data === undefined) {
			return false;
		} else {
			return true;
		}
	},
    getHttpHeader(){
	    return {
            'api-ver': '1.0.0',
            'token': sessionStorage.token,
            'charset': 'UTF-8'
        }
    },
    // 以下两个方法的调用方式：@keyup.native="data = pubObj.formatFloat($event)"；data为当前input绑定的数据
    formatInt(ev){
        let reg = /^[1-9](\d+)?$/;
        if(!reg.test(ev.target.value)){
            let reg2 = /^[1-9](\d+)?/;
            if(ev.target.value.match(reg2)){
                ev.target.value = ev.target.value.match(reg2)[0];
            }else {
                ev.target.value = '';
            }
            ev.target._value = ev.target.value;
        }
        return ev.target.value;
    },
    formatFloat(ev){
        let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)|(^(0){1}$)/;
        let reg1 = /^[0-9]+\.{1}$/;
        if(!reg.test(ev.target.value) && !reg1.test(ev.target.value)){
            let reg2 = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?)|(^[0-9]\.[0-9]([0-9])?)|(^(0){1})/;
            if(ev.target.value.match(reg2)){
                ev.target.value = ev.target.value.match(reg2)[0];
            }else {
                ev.target.value = '';
            }
            ev.target._value = ev.target.value;
        }
        return ev.target.value;
    },
    isEmpty(data){  // 数据为0的时候返回真
        if(data === '0' || data === 0){
            return true;
        }else {
            return !!data;
        }
    },
    refactorData(attrData, skuData){
        // 把规格数据组合成库存表格需要的数据
        let sku = {};
        if(skuData){
            for(let i=0;i<skuData.length;i++){
                sku[skuData[i].attrCode] = skuData[i];
            }
        }
        let result = [];
        // 因为每个td里面的对象都是独立的，所以这里需要用到深拷贝
        function deepCopyObj(data){
            return JSON.parse(JSON.stringify(data));
        }
        function format(data) {
            let newData = [];
            if(result.length === 0){
                data.forEach(value => {
                    let arrRow = [deepCopyObj(value)];
                    newData.push(arrRow);
                });
            }else {
                result.forEach(value => {
                    data.forEach(item => {
                        let arrRow = deepCopyObj(value);
                        arrRow.push(deepCopyObj(item));
                        newData.push(arrRow);
                    })
                });
            }
            // 每次调用format，把新组合的值给result，起到舍弃原值的作用，这样循环调用下来，剩下的都是最后需要的值。
            result = newData;
        }
        attrData.forEach(value => {
            if(value.children && value.children.length > 0){
                format(value.children)
            }
        });
        // result初步组合好后，对td的显隐和合并的行进行处理
        // 如果有库存数据，把库存处理到一起
        result.forEach((value, index) => {
            let codes = '';
            value.forEach((item, _index) => {
                // 自己和自己左边的列所占行的乘积
                let row = 1;
                while(_index >= 0){
                    row *= attrData[_index].children.length;
                    _index--;
                }
                // 合并的行     总长/自己和自己左边的列所占行的乘积 = 自己所在列该合并的行
                let divisor = result.length/row;
                item.rowspan = divisor;
                // index为当前行表示的数，当前行除以所需合并的行如果能整除，表示当前行该显示；
                let cRow = index/divisor;
                if(cRow === parseInt(cRow)){
                    item.isShow = true;
                }else{
                    item.isShow = false;
                }
                // 处理库存部分
                codes += '|' + item.code;
            });
            if(skuData){
                let obj = sku[codes.substr(1)];
                obj.isShow = true;
                value.push(obj);
            }
        });
        sku = null;
        return result;
    },
    uploadValid(files, callback, errorCallback){  // 验证图片上传规则
        let suffixIsUrl = true;
        let isLt5Mb = true;
        let imgSize = 0;
        let types = ['png','gif','jpeg','jpg','bmp'];
        let result = {
            pass: true,
            msg: ''
        };
        for (let i=0;i<files.length;i++){
            if(types.indexOf(files[i].name.split('.')[1].toLowerCase()) < 0){
                suffixIsUrl = false;
            }
            if(files[i].size / 1024 / 1024 > 5){
                isLt5Mb = false;
            }
            imgSize += files[i].size / 1024 / 1024;
        }
        if(!suffixIsUrl){
            result.pass = false;
            result.msg = '您上传的图片格式不正确,请上传png,gif,jpeg,jpg,bmp格式的图片';
            errorCallback && errorCallback(result);
            return false;
        }
        if(!isLt5Mb) {
            result.pass = false;
            result.msg = '单张图片大小不能超过 5 MB';
            errorCallback && errorCallback(result);
            return false;
        }
        if(imgSize > 10){
            result.pass = false;
            result.msg = '单次上传图片总容量不能超过 10 MB';
            errorCallback && errorCallback(result);
            return false;
        }
        let imgNumber = 0;
        let img = new Image();
        img.src = window.URL.createObjectURL(files[imgNumber]);
        img.onload = () => {
            if(img.width > 16300 || img.height > 16300){
                result.pass = false;
                result.msg = '上传图片的尺寸不能超过16300像素*16300像素';
                errorCallback && errorCallback(result);
                return false;
            }
            imgNumber++;
            if(imgNumber === files.length){
                callback(files);
                return false;
            }
            img.src = window.URL.createObjectURL(files[imgNumber]);
        };
        img.onerror = () => {
            result.pass = false;
            result.msg = '图片有误';
            errorCallback && errorCallback(result);
        }
    },
};

// 全局变量
//export const GLOBAL_TYPE_MALL = 'cloud';
//export const GLOBAL_TYPE_MERCHANT = 'merchant';

// 获取按钮的公共方法
//export var getButton = function(sid, type, success, error) {
//	Vue.http.get(api.resource + type + '/' + sid).then(function(response) {
//		if(response.body.code == 200) {
//			var obj = {
//				create: false,
//				update: false,
//				delete: false
//			};
//			let re = response.body.data;
//			for(var i = 0; i < re.length; i++) {
//				if(re[i].code.lastIndexOf('>') != -1) {
//					obj[re[i].code.substring(re[i].code.lastIndexOf('>') + 1)] = true;
//				}
//			}
//			success(obj);
//		}
//	}, function(error) {
//		error(error);
//	})
//}
