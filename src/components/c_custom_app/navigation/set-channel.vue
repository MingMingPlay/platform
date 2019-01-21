<template>
    <el-dialog title="为导航设置渠道" v-model="dialogVisible" @close="handleClose">
        <el-table 
                :data="dialogTableData" 
                ref="multipleTable" 
                max-height="300" 
                @select="handleSelect" 
                @select-all="handleSelectAll" 
                stripe>
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="name" label="渠道名称" header-align="left"></el-table-column>
        </el-table>
        <template slot="footer">
            <div style="text-align: center;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">保 存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
    import { pubObj, bus } from '../../../assets/unit/public.js'

    export default {
        data() {
            return {
                dialogVisible: false,
                dialogTableData: [],
                // 用户是否点击过勾选
                isClickSelection: false,
                selectedRole: [],
                parentObj: {},
            }
        },
        
        created() {
            this.initData = JSON.parse(JSON.stringify(this.$data));
        },
        
        mounted() {
            this.$nextTick(() => {
                bus.$on('set-channel', (obj) => {
                    this.dialogVisible = true;
                    this.parentObj = obj;
                    this.getDialogTableData(obj.sid);
                });
            })
        },
        
        methods: {
            // 获取数据
            getDialogTableData(sid) {
                pubObj.httpRequest(this, {
                    url: this.$api.navigation + 'mall/' + sid + '/channel',
                    success(result) {
                        this.initSelected(result.data); // 初始化选中
                    }
                })
            },
            // 初始化选中的复选框
            initSelected(data) {
                this.dialogTableData = data;
                const rows = data.filter(obj => {
                    return obj.checked;
                });
                try {
                    if(rows.length) {
                        setTimeout(() => {
                            rows.forEach((row) => {
                                this.$refs.multipleTable.toggleRowSelection(row, true);
                            })
                        }, 50)
                    } else return;
                } catch(e) {
                    console.log(e);
                }
            },
            handleForEach(selection) {
                // 每次勾选清空
                this.selectedRole = [];
                selection.forEach((item) => {
                    this.selectedRole.push(item.sid)
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
                    this.$message.info('您没有做任何操作！'); return;
                }
                pubObj.httpRequest(this, {
                    method: 'PUT',
                    url: this.$api.navigation + 'mall/' + this.parentObj.sid + '/channel',
                    body: this.selectedRole,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialogVisible = false;
                    }
                })
            },
            // 关闭窗口
            handleClose() {
                for(let key in this.initData) {
                    this.$data[key] = this.initData[key];
                }
            }
        }
    }
</script>

<style>
    
</style>