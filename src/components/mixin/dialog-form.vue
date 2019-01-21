<script>
    import api from '../../assets/config/m-api.js'
    import { pubObj, bus } from '../../assets/unit/public.js'

    export default {
        data() {
            return {
                dialogVisible: false,
                parentObj: {},
                dialogForm: {},
                rules: {},
            }
        },
        created() {
            // 初始化表单，关闭dialog时，把当前表单设置为初始表单
            this.initialForm = JSON.parse(JSON.stringify(this.dialogForm));
        },
        mounted() {
            this.$nextTick(() => {
                bus.$on(this.mxDialogForm.name, (obj) => {
                    // 初始化form就执行的函数
                    /*const doFun = this.mxDialogForm.initFormFun;
                    if(doFun) doFun({ organCode: this.$root.userInfo.organCode });*/
                    if(obj.type === 2) this.dialogDetail(obj.sid);
                    this.parentObj = obj;
                    this.dialogVisible = true;
                });
            })
        },
        methods: {
            handleUrl(url, sid = "") {
                if(url) {
                    if(typeof(url) == 'string') {
                        return url + sid;
                    } else {
                        return url.concat([sid]);
                    }
                } else return;
            },
            interceptors(data, callback) { callback(data); },
            dialogDetail(sid) {
                const url = this.handleUrl(
                    this.mxDialogForm.url ||
                    this.mxDialogForm.detailUrl, sid
                );
                if(!url) return;
                pubObj.httpRequest(this, {
                    url: url,
                    success(result) {
                        this.interceptors(result.data, (data) => {
                            result.data = data;
                            let tempObj = {};
                            for(let key in result.data) {
                                if(key in this.dialogForm) tempObj[key] = result.data[key];
                                else continue;
                            }
                            this.dialogForm = tempObj;
                        });
                    }
                })
            },
            dialogSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.handleSubmitForm();
                    } else {
                        return false;
                    }
                })
            },
            handleSubmitForm() {
                const obj = this.handleOptions(this.parentObj.type);
                pubObj.httpRequest(this, {
                    url: obj.url,
                    method: obj.method,
                    body: this.dialogForm,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialogVisible = false;
                        this.$emit('refresh');
                    }
                })
            },
            handleOptions(type) {
                if(type === 1) {
                    return {
                        url: this.handleUrl(
                            this.mxDialogForm.url ||
                            this.mxDialogForm.postUrl, this.parentObj.sid
                        ),
                        method: 'POST'
                    }
                } else {
                    return {
                        url: this.handleUrl(
                            this.mxDialogForm.url ||
                            this.mxDialogForm.putUrl, this.parentObj.sid
                        ),
                        method: 'PUT'
                    }
                }
            },
            dialogClose(formName) {
                try {
                    for(let key in this[formName]) {
                    	this[formName][key] = this.initialForm[key];
                    }
//                  this[formName] = this.initialForm;
//                  this.$refs[formName].resetFields();
                } catch(error) {
                    console.log(error);
                }
            }
        }
    }
</script>
