<template>
    <div class="address-libs">

        <jkc-breadcrumb :crumbs="staticData.crumbs"></jkc-breadcrumb>

        <div style="margin: 18px 0;">
            <el-button type="primary" @click="handleAdd">新增地址</el-button>
        </div>

        <el-table :data="tableData" v-loading="loading" stripe>
            <el-table-column label="发货地址">
                <template slot-scope="scope">
                    <el-radio
                        :label="true"
                        v-model="scope.row.defaultSend"
                        @change.native.prevent="handleDefaultSend(scope.row.sid)">默认
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column label="退货地址">
                <template slot-scope="scope">
                    <el-radio
                        :label="true"
                        v-model="scope.row.defaultReceive"
                        @change.native.prevent="handleDefaultReceive(scope.row.sid)">默认</el-radio>
                </template>
            </el-table-column>
            <el-table-column label="联系人" prop="contact"></el-table-column>
            <el-table-column label="所在地区" prop="areaName"></el-table-column>
            <el-table-column label="街道地址" prop="address"></el-table-column>
            <el-table-column label="邮政编码" prop="zipCode"></el-table-column>
            <el-table-column label="电话号码" prop="phone"> </el-table-column>
            <el-table-column label="手机号码" prop="mobile"> </el-table-column>
            <el-table-column label="公司名称" prop="company"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.row.sid)">编辑</el-button>
                    <el-button type="text" class="text-btn-delete" @click="handleDel(scope.row.sid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination event-name="address-pagination" :total="pagiTotal"></pagination>

        <el-dialog :title="dialog.title" v-model="dialog.dialogVisible" :close-on-click-modal="false" @close="handleDialogClose('dialogForm')">

            <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">

                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="dialogForm.contact"></el-input>
                </el-form-item>
                <el-form-item label="所在地区" prop="areaSid">
                    <area-select
                        :default-sid="dialogForm.areaSid"
                        @get-area="handleGetArea"
                        v-if="dialog.dialogVisible">
                    </area-select>
                </el-form-item>
                <el-form-item label="街道地址" prop="address">
                    <el-input type="textarea" v-model="dialogForm.address"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码" prop="zipCode">
                    <el-input :maxlength="6" v-model="dialogForm.zipCode"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" class="landline">
                    <el-form-item prop="cityCode">
                        <el-input class="city-code" v-model="dialogForm.cityCode" :maxlength="3"></el-input>
                    </el-form-item>
                    <span style="float: left; margin: 0 5px;">-</span>
                    <el-form-item prop="phone">
                        <el-input class="phone" v-model="dialogForm.phone" :maxlength="8"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item class="is-required" label="手机号码" prop="mobile">
                    <el-input v-model="dialogForm.mobile" :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="公司名称" prop="company">
                    <el-input v-model="dialogForm.company"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input type="textarea" v-model="dialogForm.description"></el-input>
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
    import AreaSelect from '../common/area-select.vue'
    import Pagination from '../common/pagination.vue'

    import { pubObj, bus } from '../../assets/unit/public.js'
    import validator from '../../assets/unit/validator.js'
    import api from '../../assets/config/m-api.js'
    export default {
        components: { JkcBreadcrumb, AreaSelect, Pagination },
        data() {
            const rules = {
                contact: [{
                    required: true,
                    message: '请输入联系人'
                }, {
                    max: 20,
                    message: '最多不要超过20个字'
                }, {
                    validator: validator.validName,
                    message: '联系人名称只能输入中文或英文'
                }],
                areaSid: [{
                    required: true,
                    message: '请选择所在地区'
                }],
                address: [{
                    required: true,
                    message: '请输入街道地址'
                }, {
                    max: 50,
                    message: '最多不要超过50个字'
                }],
                zipCode: [{
                    required: true,
                    message: '请输入邮政编码(数字)'
                }, {
                    min: 6,
                    max: 6,
                    message: '请输入6位邮政编码'
                }, {
                    validator: validator.validNumber,
                    message: '请输入6位数字'
                }],
                cityCode: [{
                    validator: validator.validNumber,
                    message: '区号只能输入数字'
                }],
                phone: [{
                    validator: validator.validLandline,
                    message: '请输入联系电话'
                }],
                mobile: [{
                    required: true,
                    message: '请输入手机号'
                }, {
                    validator: validator.validCellphone,
                    message: '请输入格式正确的手机号码',
                    trigger: 'blur'
                }]
            }
            return {
                loading: false,
                staticData: {},
                tableData: [],
                dialog: {
                    title: '新增地址',
                    dialogVisible: false,
                    operating: 0,
                    currentSid: null
                },
                dialogForm: {
                    merchantSid: this.$root.userInfo.merchantSid
                },
                form: {},
                rules: rules,
                pagiTotal: 0
            }
        },
        created() {
            this.staticData.crumbs = [{ title: '物流管理' }, { title: '地址库' }]
        },
        mounted() {
            setTimeout(() => {
                bus.$on('address-pagination', (obj) => {
                    this.form.pageIndex = obj.pageIndex;
                    this.form.pageSize = obj.pageSize;
                    this.loading = true;
                    this.getTableList();
                })
            }, 10)
            // 获取数据
            this.getTableList();
        },
//      computed: {
//          dialogIf() { return this.dialog.dialogVisible; }
//      },
//      watch: {
//          dialogIf(val) {
//              if(!val) {
//                  this.$refs.dialogForm.resetFields();
//                  this.dialogForm.cityCode = null;
//                  this.dialogForm.phone = null;
//              }
//          }
//      },
        methods: {
            // 关闭dialog回调
            handleDialogClose(formName) {
                try {
                	this.$refs[formName].resetFields();
                } catch(e) {
                	console.log(e)
                }
            },
            handleDefaultSend(sid) {
                pubObj.httpRequest(this, {
                    url: api.address + 'default-send/' + sid,
                    method: 'PUT',
                    success(result) {
                        this.$message.success(result.message);
                        this.getTableList();
                    }
                })
            },
            handleDefaultReceive(sid) {
                pubObj.httpRequest(this, {
                    url: api.address + 'default-receive/' + sid,
                    method: 'PUT',
                    success(result) {
                        this.$message.success(result.message);
                        this.getTableList();
                    }
                })
            },
            // 获取列表
            getTableList() {
                pubObj.httpRequest(this, {
                    url: api.address,
                    params: this.form,
                    success(result) {
                        this.tableData = result.data;
                        if(result.pagination) this.pagiTotal = result.pagination.totalRow;
                        else this.pagiTotal = 0;
                    }
                })
            },
            // 添加
            handleAdd() {
                this.dialog.title = '新增地址';
                this.dialog.dialogVisible = true;
                // 新增
                this.dialog.operating = 0;
                // 重置sid
                this.dialog.currentSid = null;
            },
            // 编辑
            handleEdit(sid) {
                this.dialog.title = '编辑地址';
                this.dialog.dialogVisible = true;
                // 编辑
                this.dialog.operating = 1;
                this.dialog.currentSid = sid;
                pubObj.httpRequest(this, {
                    url: api.address + sid,
                    success(result) {
                        this.dialogForm = result.data;
//                      if(result.data.cityCode && result.data.phone) {
//                          result.data.fullPhone = result.data.cityCode + '-' + result.data.phone;
//                      } else result.data.fullPhone = null;
                    }
                })
            },
            // 删除
            handleDel(sid) {
                pubObj.showMessage(this, {
                    title: '删除地址',
                    content: '确定要删除该地址，删除之后不可恢复？',
                    confirm() {
                        pubObj.httpRequest(this, {
                            url: api.address + sid,
                            method: 'DELETE',
                            success(result) {
                                this.$message.success(result.message);
                                this.getTableList();
                            }
                        })
                    }
                })
            },
            // 获取地区
            handleGetArea(obj) { this.dialogForm.areaSid = obj.areaSid; },
            // 提交
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
            // 拆分座机 = 区号 + 号码
//          slicePhone() {
//              const fullPhone = this.dialogForm.fullPhone;
//              if(!fullPhone || fullPhone === '') {
//                  this.dialogForm.cityCode = null;
//                  this.dialogForm.phone = null;
//                  return null;
//              }
//              const index = fullPhone.indexOf('-');
//              if(index === -1) {
//                  this.dialogForm.cityCode = fullPhone.slice(0, 3);
//                  this.dialogForm.phone = fullPhone.slice(3);
//              } else {
//                  this.dialogForm.cityCode = fullPhone.slice(0, index);
//                  this.dialogForm.phone = fullPhone.slice(index + 1);
//              }
//          },
            // 发送数据
            postData() {
                pubObj.httpRequest(this, {
                    url: api.address,
                    method: 'POST',
                    body: this.dialogForm,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialog.dialogVisible = false;
                        this.getTableList();
                    }
                })
            },
            // 修改数据
            putData() {
                pubObj.httpRequest(this, {
                    url: api.address + this.dialog.currentSid,
                    method: 'PUT',
                    body: this.dialogForm,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialog.dialogVisible = false;
                        this.getTableList();
                    }
                })
            }
        }
    }
</script>

<style>
    .address-libs .area-select .el-select { width: 32%; float: left; }
    .address-libs .area-select .el-select+.el-select { margin-left: 2%; }
    .address-libs .landline { overflow: hidden; }
    .address-libs .landline .el-form-item { float: left; }
    .address-libs .city-code { width: 100px; }
    .address-libs .phone { width: auto; }
</style>
