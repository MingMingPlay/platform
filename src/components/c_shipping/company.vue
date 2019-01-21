<template>
    <div class="shipping-company">

        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div style="margin: 18px 0;">
            <el-button type="primary" @click="handleAdd">新增快递公司</el-button>
            <el-button type="success" @click="handleRefresh">刷新缓存</el-button>
        </div>

        <el-table :data="tableData" v-loading="loading" stripe>
            <el-table-column label="快递公司名称" prop="name" width="240"></el-table-column>
            <el-table-column label="快递公司编号" prop="code" width="240"></el-table-column>
            <el-table-column label="快递公司电话" prop="phone" width="240"></el-table-column>
            <el-table-column label="排序" prop="rank" width="120" align="center"></el-table-column>
            <el-table-column label="操作" header-align="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row.sid)">编辑</el-button>
                    <el-button type="text" @click="handleDele(scope.row.sid)" style="color: #ff4949;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialog.title" v-model="dialog.dialogVisible" :close-on-click-modal="false">

            <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="120px">

                <el-form-item label="快递公司编码" prop="code">
                    <el-input v-model="dialogForm.code"></el-input>
                </el-form-item>
                <el-form-item label="快递公司名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="快递公司电话" prop="phone">
                    <el-input v-model="dialogForm.phone" placeholder="如：028(-)9999999(9)"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="rank">
                    <el-slider v-model.number="dialogForm.rank" show-input :max="99" :show-tooltip="false"></el-slider>
                    <div style="font-size: 12px;">数字越大排序越靠前</div>
                </el-form-item>

            </el-form>

            <div slot="footer" style="text-align: center;">
                <el-button @click="dialog.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit('dialogForm')">保 存</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    import JkcBreadcrumb from '../common/jkc-breadcrumb.vue'
    // mixin
    import TableList from '../mixin/table-list.vue'
    // js
    import validator from '../../assets/unit/validator.js'
    import { pubObj } from '../../assets/unit/public.js'
    import api from '../../assets/config/c-api.js'
    export default {
        components: { JkcBreadcrumb },
        
        mixins: [TableList],
        
        data() {
            const rules = {
                code: [{
                    required: true,
                    message: '请输入快递公司编码'
                }, {
                    max: 32,
                    message: '最多支持输入32个字符'
                }],
                name: [{
                    required: true,
                    message: '请输入快递公司名称'
                }, {
                    max: 32,
                    message: '最多支持输入32个字符'
                }],
                phone: [{
                    required: true,
                    message: '请输入快递公司电话'
                }, {
                    validator: validator.validLandline,
                    message: '请输入格式正确的电话',
                    trigger: 'change'
                }],
                rank: [{
                    required: true,
                    message: '排序值必填'
                }]
            }
            return {
                crumbs: [],
                mxTableList: {
                    url: this.$api.shippingCompany,
                    pagiTotal: 0
                },
                dialog: {
                    title: '新增快递公司',
                    dialogVisible: false,
                    operating: 0,
                    currentSid: null
                },
                dialogForm: { rank: 0 },
                rules: rules,
            }
        },
        created() {
            this.crumbs = [{ title: '物流' }, { title: '快递公司' }];
        },
        mounted() {
            this.$watch('dialog.dialogVisible', (val) => {
                if(!val) this.$refs.dialogForm.resetFields();
            })
        },
        methods: {
            // 刷新后台缓存
            handleRefresh() {
                pubObj.httpRequest(this, {
                    url: api.shippingCompany + 'refresh',
                    success(result) {
                        this.$message.success(result.message)
                    }
                })
            },
            handleAdd() {
                this.dialog.title = '新增快递公司';
                this.dialog.dialogVisible = true;
                // 新增
                this.dialog.operating = 0;
                // 重置sid
                this.dialog.currentSid = null;
            },
            handleEdit(sid) {
                this.dialog.title = '编辑快递公司';
                this.dialog.dialogVisible = true;
                // 编辑
                this.dialog.operating = 1;
                this.dialog.currentSid = sid;
                pubObj.httpRequest(this, {
                    url: api.shippingCompany + sid,
                    success(result) {
                        this.dialogForm = result.data;
                    }
                })
            },
            handleDele(sid) {
                pubObj.showMessage(this, {
                    title: '删除快递公司',
                    content: '确定要删除该快递公司，删除之后不可恢复？',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: api.shippingCompany + sid,
                            method: 'DELETE',
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                })
            },
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        if(this.dialog.operating === 0) this.postData();
                        else this.putData();
                    } else {
                        return false;
                    }
                });
            },
            postData() {
                pubObj.httpRequest(this, {
                    url: this.$api.shippingCompany,
                    method: 'POST',
                    body: this.dialogForm,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialog.dialogVisible = false;
                        this.getTableList();
                    }
                })
            },
            putData() {
                pubObj.httpRequest(this, {
                    url: this.$api.shippingCompany + this.dialog.currentSid,
                    method: 'PUT',
                    body: this.dialogForm,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialog.dialogVisible = false;
                        this.getTableList();
                    }
                })
            },
        }
    }
</script>

<style>
</style>
