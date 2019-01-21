<template>
	<el-dialog title="用户授权" v-model="dialogVisible" size="tiny">
		<el-table :data="dialogTableData" ref="multipleTable" max-height="300" @select="handleSelect" @select-all="handleSelectAll">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column prop="roleName" label="角色名称" header-align="left"></el-table-column>
		</el-table>
		<template slot="footer">
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="handleSave">修改</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import api from '../../../assets/config/m-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
		data() {
			return {
                dialogVisible: false,
                dialogTableData: [],
                // 用户是否点击过勾选
                isClickSelection: false,
				selectedRole: [],
				currentSid: null,
			}
		},
		mounted() {
		    this.$nextTick(() => {
		        bus.$on('user-table', (obj) => {
		            this.currentSid = obj.sid;
                    this.getDialogTableData(obj.sid);
                });
		    })
		},
		methods: {
		    // 获取数据
		    getDialogTableData(sid) {
                pubObj.httpRequest(this, {
                    url: ['roleBiz', 'user/' + sid],
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
                    return obj.checked;
                });
                if(rows.length > 0) {
                    setTimeout(() => {
                        rows.forEach((row) => {
                            this.$refs.multipleTable.toggleRowSelection(row, true)
                        })
                    }, 50)
                }
            },
            handleForEach(selection) {
                // 每次勾选清空
                this.selectedRole = [];
                selection.forEach((item) => {
                    this.selectedRole.push(item.roleSid)
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
                    url: ['roleBiz', 'user/' + this.currentSid],
                    body: this.selectedRole,
                    success(result) {
                        this.$message.success(result.message);
                        this.dialogVisible = false;
                    }
                })
            }
		}
	}
</script>

<style>

</style>
