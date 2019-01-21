<template>
</template>

<script>
    import Vue from 'vue'
    import JkcBreadcrumb from './jkc-breadcrumb.vue'
    import JkcPagination from './jkc-pagination.vue'
    import Pagination from './pagination.vue'
    import { pubObj, bus } from '../../assets/unit/public.js'
    import { submitForm, getFormDetail, getTableList } from './mixin-methods.vue'


    // 1、混合-面包屑
    export const mixin_breadcrumb = {
        data() {
            return {
                crumbs: [],
            }
        },
        components: {
            JkcBreadcrumb
        }
    }

    // 2-1、混合-条件搜索（form）
    export const mixin_search_form = {
        methods: {
            // 重置表单
            // index	当前页面的第几个表单，一般是0
            // form(可选)	需要重置的表单
            resetForm(index) {
                pubObj.resetForm(index, this.form)
            },
            // 处理用户搜索
            handleSearch() {
                this.getTableList()
            }
        }
    }

    // 3-1、混合-获取当前页的列表数据（只针对标准的表格）
    export const mixin_getList_table = {
        mixins: [getTableList],
        data() {
            return {
                loading: false,
                tableData: [],
            }
        },
        computed: {
            // 刷新状态
            refreshStatus() {
                return this.$store.state.e.status;
            }
        },
        mounted() {
            this.getTableList();
        },
        watch: {
            refreshStatus(val) {
                val === 1 && this.getTableList();
            }
        },
        filters: {
            // 自动编号
            newIndex(val, index, size) {
                return(val + 1) + (index - 1) * size
            }
        }
    }
    // 3-2、混合-自定义树形表格
    export const mixin_getList_treeTable = {
        mixins: [getTableList],
        data() {
            return {
                tableData: [],
            }
        },
        computed: {
            eStatus() {
                return this.$store.state.e.status;
            }
        },
        mounted() {
            this.getTableList();
        },
        watch: {
            eStatus(val) {
                if(val === 1) this.getTableList();
            }
        },
        methods: {
            handleAdd() {
                this.$store.commit('aAdd', 1)
            }
        }
    }

    // 4、混合-collapse
    export const mixin_collapse = {
        data() {
            return {
                storeG: this.$store.state.g,
            }
        },
        computed: {
            // 操作按钮控制
            button() {
                return this.storeG.button
            }
        },
        methods: {
            // 编辑
            handleEdit(sid) {
                this.$store.commit('aEdit', [2, sid])
            },
            // 删除
            handleDel(sid) {
                pubObj.del(this, {
                    title: '删除' + this.title,
                    content: '确定删除该' + this.title + '，删除之后不可恢复?',
                    api: this.api,
                    sid: sid
                })
            }
        },
        directives: {
            stripe: {
                inserted(el, binding) {
                    const compareEl = document.getElementsByClassName('el-collapse')[0];
                    const parentEl = el.parentElement;
                    if(parentEl === compareEl) {
                        const firstLiEle = el.getElementsByClassName('number')[0];
                        const index = binding.value
                        firstLiEle.textContent = index + 1;
                        if(index % 2 !== 0) {
                            el.children[0].style.backgroundColor = '#F5F8FA' // 斑马纹
                            el.children[0].nextElementSibling.className = 'el-collapse-item__wrap bg-F5F8FA' // 给你children加同样的颜色
                        }
                    }
                }
            }
        }
    }

    // 5、混合-分页
    export const mixin_pagination = {
        data() {
            return {
                pagiTotal: 0,
            }
        },
        computed: {
            // 当用户切换分页，计算当前页
            pageIndex() {
                this.form.pageIndex = this.$store.state.c.pageIndex
                return this.$store.state.c.pageIndex
            },
            // 当用户切换显示个数，计算当前个数
            pageSize() {
                this.form.pageSize = this.$store.state.c.pageSize
                return this.$store.state.c.pageSize
            }
        },
        destroyed() {
            this.$store.commit('cRecovery', [1, 10])
        },
        watch: {
            pageIndex() {
                if(this.loading !== undefined) this.loading = true;
                this.getTableList();
            },
            pageSize() {
                if(this.loading !== undefined) this.loading = true;
                this.getTableList();
            }
        },
        components: {
            JkcPagination
        }
    }

    // 5、针对一个页面多个分页
    export const new_pagination = {
        data() {
            return {
                pagiTotal: 0
            }
        },
        mounted() {
            // 必须加点延迟，不然 Vue 会提醒 bus 实例为 undefined
            setTimeout(() => {
                bus.$on(this.eventName, (obj) => {
                    this.form.pageIndex = obj.pageIndex;
                    this.form.pageSize = obj.pageSize;
                    this.loading = true;
                    this.getTableList();
                })
            }, 10)
        },
        components: {
            Pagination
        }
    }

    export const mixin_order_pagination = {
        data() {
            return {
                pagiTotal: 0,
                storeC: this.$store.state.c,
            }
        },
        computed: {
            // 当用户切换分页，计算当前页
            pageIndex() {
                this.cForm.pageIndex = this.storeC.pageIndex;
                return this.storeC.pageIndex;
            },
            // 当用户切换显示个数，计算当前个数
            pageSize() {
                this.cForm.pageSize = this.storeC.pageSize;
                return this.storeC.pageSize;
            }
        },
        destroyed() {
            this.$store.commit('cRecovery', [1, 10])
        },
        watch: {
            pageIndex() {
                this.loading = true;
                this.getOrderData();
            },
            pageSize() {
                this.loading = true;
                this.getOrderData();
            }
        },
        components: {
            JkcPagination
        }
    }

    // 6-1、混合-dialogForm
    export const mixin_dialogForm = {
        mixins: [submitForm, getFormDetail],
        data() {
            return {
                formType: 'dialog',
                dialogVisible: true,
                storeA: this.$store.state.a,
                // form 标题
                title: null,
                // 新增确定   修改保存
                saveBtnText: null,
            }
        },
        computed: {
            aSid() {
                return this.storeA.sid
            },
            aStatus() {
                return this.storeA.status
            }
        },
        beforeMount() {
            const val = this.aStatus;
            if(val === 1) {
                this.title && (this.title = '新增' + this.title.slice(-2));
                this.saveBtnText = '确 定';
            } else if(val === 2) {
                this.title && (this.title = '编辑' + this.title.slice(-2));
                this.saveBtnText = '保 存';
                this.getFormDetail();
            }
        },
        beforeDestroy() {
            // 退出重置表单
            this.$refs.dialogForm.resetFields();
        },
        watch: {
            dialogVisible(val) {
                if(!val) this.$store.commit('aReset');
            }
        },
        methods: {
            // 保存
            handleSave() {
                pubObj.save(this);
            }
        }
    }

    // 6-2、混合-dialogTable
    export const mixin_dialogTable = {
        mixins: [submitForm],
        data() {
            return {
                formType: 'dialog',
                dialogVisible: false,
                dialogTableData: [],
                storeB: this.$store.state.b,
                // 用户是否点击过勾选
                isClickSelection: false,
            }
        },
        computed: {
            bSid() {
                return this.storeB.sid;
            },
            bStatus() {
                return this.storeB.status;
            }
        },
        beforeMount() {
            const val = this.bStatus;
            if(val === 1) {
                this.getDialogTableData();
            } else if(val === 2 || val === 3) {
                pubObj.channel(this, this.$api.channel);
                this.dialogVisible = true;
            }
            console.log("hook in beforeMount...");
        },
        watch: {
            dialogVisible(val) {
                if(!val) this.$store.commit('bReset', 0);
            }
        },
        methods: {
            getDialogTableData() {
                pubObj.httpRequest(this, {
                    url: this.api,
                    success(result) {
                        this.initSelected(result.data); // 初始化选中
                        this.dialogVisible = true;
                    }
                })
            },
            // 初始化选中的复选框
            initSelected(data) {
                this.dialogTableData = data;
                const rows = data.filter(obj => {
                    return obj.checked === true;
                });
                if(rows.length > 0) {
                    rows.forEach(row => {
                        setTimeout(() => {
                            this.$refs.multipleTable.toggleRowSelection(row, true)
                        }, 100)
                    })
                }
            },
            handleForEach(selection) {
                // 每次勾选清空
                this.selectedRole = [];
                selection.forEach((item) => {
                    this.selectedRole.push(item[this.postName])
                })
            },
            handleSelect(selection) {
                this.handleForEach(selection);
                this.isClickSelection = true;
            },
            handleSelectAll(selection) {
                this.handleForEach(selection);
                this.isClickSelection = true;
            },
            // 保存
            handleSave() {
                if(!this.isClickSelection) {
                    this.$message.info('您没有做任何操作！');
                    return;
                }
                const _this = this;
                pubObj.httpRequest(this, {
                    method: 'PUT',
                    url: typeof this.getSaveUrl === 'function' ? this.getSaveUrl() : this.api,
                    body: this.selectedRole,
                    success() {
                        this.$message.success({
                            message: '保存成功',
                            duration: 500,
                            onClose() {
                                _this.dialogVisible = false;
                            }
                        })
                    }
                })
            }
        }
    }

    // 混合-一次性上传单张图片
    export const mixin_uploadImage = {
        data() {
            return {
                headers: {
                    'api-ver': '1.0.0',
                    'token': sessionStorage.token,
                    'charset': 'UTF-8'
                },
                imageApi: null,
                imgNameArr: [],
                uploadStatus: [false], // 默认一张图片
                shadowStatus: false, // 删除时的遮罩
            }
        },
        methods: {
            // 上传前，检测图片大小不超过5MB
            handleBefore(file) {
                // 图片格式是否正确
                let bool = null;
                // 获取图片的后缀名
                const suffixOfImage = file.name.split('.')[1].toLowerCase();
                switch(suffixOfImage) {
                    case 'gif':
                        ;
                    case 'jpeg':
                        ;
                    case 'png':
                        ;
                    case 'jpg':
                        ;
                    case 'bmp':
                        bool = true;
                        break;
                    default:
                        bool = false;
                }
                if(bool) {
                    const isLt5Mb = file.size / 1024 / 1024 < 5;
                    if(isLt5Mb) return true;
                    else {
                        this.$message.error('上传图片大小不能超过 5MB!');
                        return false;
                    }
                } else {
                    this.$message.error('您上传的图片格式不正确!');
                    return false;
                }
            },
            // 成功之后回调(特殊化处理)
            handleSuccess(res) {
                const index = parseInt(res.data[0].customMessage)
                this.dialogForm[this.imgNameArr[index].imgSidName] = res.data[0].sid;
                this.dialogForm[this.imgNameArr[index].imgPathName] = res.data[0].path
                this.$set(this.uploadStatus, index, true)
            },
            // 移除图片
            handleDelLocalImg(index) {
                this.dialogForm[this.imgNameArr[index].imgPathName] = '';
                this.$set(this.uploadStatus, index, false)
            }
        }
    }
    /*export const mixin_uploadImage = {
    	data() {
    		return {
    			headers: {
    				'api-ver': '1.0.0',
    				'token': '',
    				'charset': 'UTF-8'
    			},
    			imgNameArr: [],
    			shadowStatus: false, // 删除时的遮罩
    		}
    	},
    	methods: {
    		// 上传前，检测图片大小不超过5MB
    		handleBefore(file) {
    			// 获取图片的后缀名
    			const suffixIsUrl = file.name.split('.')[1] !== 'url';
    			const isLt5Mb = file.size / 1024 / 1024 < 5;
    			if(!isLt5Mb) this.$message.error('上传图片大小不能超过 5MB!');
    			if(!suffixIsUrl) this.$message.error('您上传的图片格式不正确!');
    			return isLt5Mb ? suffixIsUrl ? true : false : false;
    		},
    		// 成功之后回调(特殊化处理)
    		handleSuccess(res) {
    			const index = parseInt(res.data[0].customMessage)
    			this.dialogForm[this.imgNameArr[index].imgSidName] = res.data[0].sid;
    			this.dialogForm[this.imgNameArr[index].imgPathName] = res.data[0].path
    			this.$set(this.uploadStatus, index, true)
    		},
    		// 移除图片
    		handleDelLocalImg(index) {
    			this.dialogForm[this.imgNameArr[index].imgPathName] = '';
    			this.$set(this.uploadStatus, index, false)
    		}
    	}
    }*/

    // 混合-添加/修改表单（page）
    export const mixin_pageForm = {
        mixins: [submitForm, getFormDetail],
        data() {
            return {
                formType: 'page',
                loading: false, // loading
                query: this.$route.query, // 缓存url参数
            }
        },
        mounted() {
            if(this.query.type === 2) {
                this.getFormDetail();
            }
        },
        methods: {
            // 保存
            handleSave() {
                pubObj.save(this)
            },
        }
    }

    // 混合-区域
    export const mixin_area = {
        data() {
            return {
                prov: [],
                city: [],
                area: [],
                provName: null,
                cityName: null,
                areaName: null,
                provIsClicked: false,
                provIsChanged: false,
                cityIsChanged: false,
                isTriggerClear: false,
                // ------yjc start------
                addressInitDone: false, // 地址初始化是否完成，任意一次联动的点击改变状态为true
                // ------yjc end------
            }
        },
        /*created() {
        	pubObj.province(this, api.area) // 预先获取省份数据
        },*/
        methods: {
            // 点击省份
            handleProv(bool, type) {
                // ------yjc start------
                if(type !== 'init') {
                    this.addressInitDone = true;
                }
                // ------yjc end------
                if(!this.provIsClicked && bool === true) {
                    this.provIsClicked = true;
                    pubObj.httpRequest(this, {
                        url: this.$api.area + 'provinces',
                        success(result) {
                            this.prov = result.data;
                        }
                    })
                }
            },
            handleProvChange(val) {
                if(val === '') {
                    // ------yjc start------
                    this.cityName = null;
                    this.areaName = null;
                    // ------yjc end------
                    return;
                }
                this.provIsChanged = true;
                if(this.dialogForm) this.dialogForm.areaSid = val;
                else this.form.areaSid = val;
                // ------yjc start------
                if(this.addressInitDone) {
                    this.city = [];
                    this.area = [];
                    this.cityName = null;
                    this.areaName = null;
                }
                // ------yjc end------
            },
            // 点击城市
            handleCity(bool, type) {
                // ------yjc start------
                if(type !== 'init') {
                    this.addressInitDone = true;
                }
                // ------yjc end------
                if(this.provIsChanged && bool === true) {
                    pubObj.httpRequest(this, {
                        url: this.$api.area + 'parent/' + this.provName,
                        success(result) {
                            this.city = result.data[0].children;
                            this.provIsChanged = false;
                        }
                    })
                }
            },
            handleCityChange(val) {
                if(!val) {
                    // ------yjc start------
                    this.areaName = null;
                    // ------yjc end------
                    if(this.dialogForm) this.dialogForm.areaSid = this.provName;
                    else this.form.areaSid = this.provName;
                    return;
                }
                this.cityIsChanged = true;
                if(this.dialogForm) this.dialogForm.areaSid = val;
                else this.form.areaSid = val;
                // ------yjc start------
                if(this.addressInitDone) {
                    this.area = [];
                    this.areaName = null;
                }
                // ------yjc end------
            },
            // 点击区县
            handleArea(bool, type) {
                // ------yjc start------
                if(type !== 'init') {
                    this.addressInitDone = true;
                }
                // ------yjc end------
                if(this.cityIsChanged && bool === true) {
                    pubObj.httpRequest(this, {
                        url: this.$api.area + 'parent/' + this.cityName,
                        success(result) {
                            this.area = result.data[0].children;
                            this.cityIsChanged = false;
                        }
                    })
                }
            },
            handleAreaChange(val) {
                if(!val) {
                    if(this.cityName) {
                        if(this.dialogForm) this.dialogForm.areaSid = this.cityName;
                        else this.form.areaSid = this.cityName;
                    } else {
                        if(this.dialogForm) this.dialogForm.areaSid = this.provName;
                        else this.form.areaSid = this.provName;
                    }
                    return;
                }
                if(this.dialogForm) this.dialogForm.areaSid = val;
                else this.form.areaSid = val;
            }
        }
    }

    // 混合-获取详情数据
    export const mixin_getDetail = {
        data() {
            return {
                detailData: {},
            }
        },
        mounted() {
            pubObj.httpInterceptor(this.complete)
            this.getDetail()
        },
        methods: {
            // 获取用户详情
            getDetail() {
                const $this = this;
                pubObj.httpRequest($this, {
                    url: $this.api + $this.$route.query.sid,
                    success(result) {
                        $this.detailData = result.data;
                    }
                })
            }
        }
    }

    // 混合-品牌和品类（特殊的表格）
    import { mapState } from 'vuex' // 在单独构建的版本中辅助函数为 Vuex.mapState

    export const mixin_treeTable = {
        data() {
            return {
                loading: false, // loading
                tableData: [], // 数据
                formType: 'dialog', // 添加修改-表单类型
                query: this.$store.state.common, // 缓存url参数
            }
        },
        mounted() {
            pubObj.getDataList(this, this.api)
        }
    }

    // dialog
    export const mixin_dialog = {
        data() {
            return {
                formType: 'dialog', // 添加修改-表单类型
                query: this.$store.state.common, // 缓存url参数
            }
        },
        methods: {
            // 提交验证
            submitForm(formName) {
                const $th = this;
                $th.$refs[formName].validate(function(valid) {
                    if(valid) {
                        $th.handleSave()
                    } else {
                        return false;
                    }
                });
            },
            // 保存
            handleSave() {
                pubObj.save(this, this.api, this.type)
            },
        }
    }

    // 用户权限控制
    export const mixin_getButton = {
        data() {
            return {
                button: {
                    create: true,
                    update: true,
                    delete: true,
                }
            }
        },
        created() {
//            const type = this.$root.platform;
//            this.getBtn(this.$route.query.btn, type, (result) => {
//                this.button = result;
//                this.$store.commit('gControl', result);
//            }, (err) => {
//                console.log(err)
//            })
        },
        methods: {
            getBtn(sid, type, success, error) {
                Vue.http.get(['newResource', type + '/' + sid]).then(function(response) {
                    if(response.body.code === 200) {
                        var obj = {
                            create: false,
                            update: false,
                            delete: false
                        };
                        let re = response.body.data;
                        for(var i = 0; i < re.length; i++) {
                            if(re[i].code.lastIndexOf('>') !== -1) {
                                obj[re[i].code.substring(re[i].code.lastIndexOf('>') + 1)] = true;
                            }
                        }
                        success(obj);
                    }
                }, function(err) {
                    error(err);
                })
            }
        }
    }
</script>

<style>

</style>
