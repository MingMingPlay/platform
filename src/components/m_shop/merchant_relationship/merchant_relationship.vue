<template>
    <div class="mer-channel">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
        <el-tabs v-model="userIdent" type="card" @tab-click="typeClick">
            <el-tab-pane label="我是代理商" name="Agent"></el-tab-pane>
            <el-tab-pane label="我是供货商" name="Supplier"></el-tab-pane>
        </el-tabs>
        <div class="assist-btn-wrap clear">
            <el-button type="primary" @click="addSupplier" v-if="userIdent == 'Agent'">添加供货商</el-button>
            <!--<div class="mer-number">我的商家编号是：{{merchantInfo.code}}</div>-->
        </div>

        <el-table :data="dataList.Agent" :stripe="true" v-loading="tableLoading" v-if="userIdent == 'Agent'">
            <el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
            <el-table-column prop="supplierName" label="我的供应商"
                             label-class-name="first-col-no-padding"
                             class-name="first-col-no-padding"></el-table-column>
            <el-table-column prop="supplierDescription" label="供应商简介" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="supplierPhone" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="supplierCode" label="供货商编号" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span :class="{'state-active': scope.row.state === 'Active', 'state-disabled': scope.row.state === 'Disabled'}">
                        {{scope.row.stateName}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-table :data="dataList.Supplier" :stripe="true" v-loading="tableLoading" v-if="userIdent == 'Supplier'">
            <el-table-column type="index" label="序号" width="70" align="center" label-class-name="table-index-title"></el-table-column>
            <el-table-column prop="agentName" label="我的代理商"
                             label-class-name="first-col-no-padding"
                             class-name="first-col-no-padding"></el-table-column>
            <el-table-column prop="agentDescription" label="商家简介" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="agentPhone" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="agentCode" label="代理商编号" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span :class="{'state-active': scope.row.state === 'Active', 'state-disabled': scope.row.state === 'Disabled'}">
                        {{scope.row.stateName}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog -->
        <el-dialog title="添加供应商" v-model="dialogSwitch" size="tiny" @close="dialogClose">
            <el-form :model="addForm" :rules="rules" ref="addForm">
                <el-form-item label="供应商名称" label-width="100px" prop="supplierSid">
                    <el-input v-model="addForm.supplierSid" placeholder="请输入商家名称或商家编号"></el-input>
                    <el-popover
                            ref="popover"
                            placement="bottom-start"
                            title="如何与供应商建立合作关系？"
                            width="350"
                            trigger="hover">
                        <template>
                            <p>• 您可以与供应商线下沟通合作细节，并邀请Ta进驻平台。</p>
                            <p>• 输入正确的供应商编码或商户名称，即可添加成功。</p>
                            <p>• 已建立合作关系的供应商可以为您发布行销商品。</p>
                        </template>
                    </el-popover>
                    <el-button type="text" icon="warning" v-popover:popover>如何添加供应商？</el-button>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button @click="dialogSwitch = false">取消</el-button>
                <el-button type="primary" @click="addSupplierConfirm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
    import api from '../../../assets/config/m-api.js'
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import { router,vm } from '../../../pages/merchant.js'
    export default {
        data() {
            return {
                router,
//                merchantInfo: vm.merchantInfo,
                crumbs: [
                    {
                        title:'商品管理',
                    },
                    {
                        title:'供应商管理',
                    }
                ],
                userIdent: this.$route.query.agent || 'Agent',       // 切换代理商品和供货商品，agency代理的，supply供货的
                searchForm: {
                    title: '',
                },
                tableLoading: false,
                dialogSwitch: false,
                addForm: {
                    supplierSid: null,
                },
                rules: {
                    supplierSid: [
                        {
                            required: true,
                            message: '请输入商家名称或编号',
                            target: 'blur'
                        }
                    ]
                },
                dataList: {
                    Agent: [],
                    Supplier: [],
                },
                pagination: {},

            };
        },
        components: {
            jkcBreadcrumb,
        },
        created (){
            let query = JSON.parse(JSON.stringify(this.$route.query));
            if(!this.$route.query.pageIndex){
                query.pageIndex = 1;
            }
            if(!this.$route.query.agent){
                query.agent = this.userIdent = 'Agent';
            }
            router.replace({path: this.$route.path, query: query})
            this.getDataList(this.$route.query.agent, this.$root.userInfo.merchantSid);
        },
        methods: {
            typeClick(tab, event) {     // 切换代理商或供货商
                // 1.Agent查找自己的供货商 2.Supplier查找代理商
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.agent = tab.name;
                query.pageIndex = '1';
                router.replace({path: this.$route.path, query: query})
                this.getDataList(this.$route.query.agent, this.$root.userInfo.merchantSid);
            },
            searchInfo (type){			// 搜索
                var data = {};
                for(let key in this.searchForm){
                    if(this.searchForm[key]){
                        data[key] = this.searchForm[key];
                    }
                }
                if(JSON.stringify(data) == '{}'){
                    this.$message({type: 'warning', message: '请设置查询条件！'});
                    return false;
                }
                for(let key in this.$route.query){
                    data[key] = this.$route.query[key];
                }
                // this.getDataList(this.$route.query.agent, this.$root.userInfo.merchantSid);
            },
            getDataList (type, sid){        // 获取供应商或代理商列表
                this.tableLoading = true;
                this.$http.get(['relationship', type, '/' + sid])
                .then((result) => {
                    if(result.body.code === 200){
                        this.dataList[type] = result.body.data;
                    }else {
                        this.$message({type:'warning', message: result.body.message})
                    }
                    this.tableLoading = false;
                }).catch((error) => {
                    console.log(error)
                })
            },
            addSupplier (){
                this.dialogSwitch = true;
            },
            addSupplierConfirm (){
                this.$refs.addForm.validate((valid) => {
                    if(valid){
                        this.$http.post(['relationshipAdd', this.addForm.supplierSid])
                        .then((reuslt) => {
                            if(reuslt.body.code === 200){
                                this.$message({type:'info', message: reuslt.body.message})
                                this.dialogSwitch = false;
                                this.getDataList(this.$route.query.agent, this.$root.userInfo.merchantSid);
                            }else {
                                this.$message({type:'warning', message: reuslt.body.message})
                            }
                        }).catch((error) => {

                        })
                    }
                })
            },
            dialogClose (){
                this.$refs.addForm.resetFields();
            },
            handleSizeChange(val) {		// 切换每页多少条数据
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.pageSize = val;
                router.push({path: this.$route.path, query: query})
            },
            handleCurrentChange(val) {		// 当前在哪一页
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.pageIndex = val;
                router.push({path: this.$route.path, query: query})
            }
        }
    };
</script>
<style>
    .mer-channel .mer-number{
        float: right;
        font-size: 14px;
        line-height: 28px;
    }
</style>
