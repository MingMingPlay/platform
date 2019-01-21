<template>
	<el-dialog title="为导航配置商品" v-model="dialogVisible">
		<!--为导航配置产品-->
		<el-form ref="tableForm" :model="tableForm" :rules="rules" label-width="80px" class="formCenter">
			<el-form-item label="渠道名称" prop="channelSid">
				<el-select v-model="tableForm.channelSid" placeholder="请选择渠道">
					<el-option v-for="(item,index) in channels" :key="index" :label="item.name" :value="item.sid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="nextProduct">下一步</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script>
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
		data() {
			return {
			    dialogVisible: false,
			    parentObj: {},
				tableForm: {
					channelSid: null
				},
				rules: {
					channelSid: [{
						required: true,
						message: '请选择渠道名称',
						trigger: 'blur'
					}]
				},
				channels: [],
			}
		},
		methods: {
			nextProduct() {
				this.$refs.tableForm.validate((valid) => {
					if(valid) {
					    this.dialogVisible = false;
					    // 延迟10s，确保弹窗关闭
					    setTimeout(() => {
					        this.$router.push({
                                path: '/c_custom_app/navigation/set_product',
                                query: {
                                    navigationSid: this.parentObj.sid,
                                    channelSid: this.tableForm.channelSid
                                }
                            })
					    }, 10)
					} else {
						return false;
					}
				})
			},
		},
		beforeMount() {
		    pubObj.httpRequest(this, {
                url: this.$api.channel,
                success(result) {
                    this.channels = result.data;
                }
            })
		},
		mounted() {
            this.$nextTick(() => {
                bus.$on('set-production', (obj) => {
                    this.parentObj = obj;
                    this.dialogVisible = true;
                });
            })
        }
	}
</script>

<style scoped>
	.formCenter { width: 300px; margin: auto; }
</style>
