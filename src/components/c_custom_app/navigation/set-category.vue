<template>
    <el-dialog title="为导航设置分类" v-model="dialogVisible" @close="handleClose">
        <el-steps space="50%" :active="activeStep" :align-center="true" :center="true" style="margin-bottom: 20px;">
            <el-step title="选择渠道"></el-step>
            <el-step title="勾选分类"></el-step>
        </el-steps>

        <el-form ref="tableForm" :model="tableForm" :rules="rules" v-show="isChannel" class="formCenter">
            <el-form-item label="渠道名称" prop="channelSid">
                <el-select v-model="tableForm.channelSid" placeholder="请选择渠道" @visible-change="getChannelData">
                    <el-option v-for="(item,index) in channels" :key="index" :label="item.name" :value="item.sid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="text-align: center;">
                <el-button type="primary" @click="handleNext('tableForm')">下一步</el-button>
            </el-form-item>
        </el-form>

        <div v-show="!isChannel">
            <el-tree
                ref="multipleTree"
                :data="dialogTableData"
                node-key="sid"
                :default-checked-keys="defaultCheckeds"
                :props="defaultProps"
                :accordion="true"
                @check-change="handleCheckChange"
                show-checkbox>
            </el-tree>
            <div class="center marginTop">
                <el-button type="primary" @click="activeStep--; isChannel = true">上一步</el-button>
                <el-button type="primary" @click="handleSave">修改</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import { pubObj, bus } from '../../../assets/unit/public.js'

    export default {
        data() {
            return {
                // step
                activeStep: 1,
                // form
                isChannel: true,
                channels: [],
                tableForm: {},
                rules: {
                    channelSid: [{
                        required: true,
                        message: '请选择渠道',
                        trigger: 'blur'
                    }]
                },
                // tree
                defaultCheckeds: [],
                defaultProps: {
                    label: 'name',
                    children: 'children',
                },
                // dialog
                dialogVisible: false,
                dialogTableData: [],
                isClickSelection: false, // 用户是否点击过勾选
                selectedRole: [],
                parentObj: {},
            }
        },

        created() {
            this.initData = JSON.parse(JSON.stringify(this.$data));
        },

        mounted() {
            this.$nextTick(() => {
                bus.$on('set-category', (obj) => {
                    this.parentObj = obj;
                    this.dialogVisible = true;
                });
            })
        },
        methods: {
            // 获取渠道
            getChannelData() {
                // 取到一次，返回
                if(this.channels.length) return;
                pubObj.httpRequest(this, {
                    url: this.$api.channel,
                    success(result) {
                        this.channels = result.data;
                    }
                })
            },
            // 下一步
            handleNext(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.activeStep++;
                        this.isChannel = false;
                        // 取到一次，返回
                        if(this.dialogTableData.length) return;
                        this.getDialogTableData(this.tableForm.channelSid);
                    } else {
                        return false;
                    }
                });
            },
            // 获取数据
            getDialogTableData(channelSid) {
                pubObj.httpRequest(this, {
                    url: this.$api.navigation + this.parentObj.sid + '/' + channelSid + '/catalog',
                    success(result) {
                        try {
                            this.initSelected(result.data); // 初始化选中
                        } catch(e) {
                            console.log(e)
                        }
                    }
                })
            },
            // 初始化选中的复选框
            initSelected(data) {
                let rows = [];
                this.dialogTableData = data;
                data.forEach(obj => {
                    if(obj.children) rows = this.traversal(obj.children, rows);
                    else if(obj.checked === true) rows.push(obj);
                });
                if(rows.length) {
                    rows.forEach(row => {
                        this.defaultCheckeds.push(row.sid);
                    })
                }
            },
            traversal(data, rows) {
                data.forEach(obj => {
                    if(obj.children) rows = this.traversal(obj.children, rows);
                    else if(obj.checked === true) rows.push(obj);
                });
                return rows;
            },
            // tree
            handleCheckChange() {
                this.selectedRole = this.$refs.multipleTree.getCheckedKeys(true);
                this.isClickSelection = true;
            },
            // 保存
            handleSave() {
                if(!this.isClickSelection) {
                    this.$message.info('您没有做任何操作！'); return;
                }
                pubObj.httpRequest(this, {
                    method: 'PUT',
                    url: this.$api.navigation + this.parentObj.sid + '/' + this.tableForm.channelSid + '/catalog',
                    body: this.selectedRole,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialogVisible = false;
                    }
                })
            },
            // 关闭窗口
            handleClose() {
                this.$refs.tableForm.resetFields();
                for(let key in this.initData) {
                    this.$data[key] = this.initData[key];
                }
            }
        }
    }
</script>

<style scoped>
    .formCenter { width: 300px; margin: auto; }
</style>
