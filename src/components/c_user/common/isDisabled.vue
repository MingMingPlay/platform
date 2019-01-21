<template>
	<el-button 
	    type="text" 
	    class="state-disable"
	    :disabled="disabled"
	    @click="handleDisabled" 
	    v-if="state === 'Active'">禁用</el-button>
	<el-button 
	    type="text" 
	    class="state-active"
	    :disabled="disabled"
	    @click="handleActive" 
	    v-else>启用</el-button>
</template>

<script>
	import api from '../../../assets/config/c-api.js'
	import { pubObj } from '../../../assets/unit/public.js'

	export default {
		props: ['value', 'sid', 'disabled'],
		computed: {
			state() { return this.value; },
			userSid() { return this.sid; },
		},
		methods: {
			// 禁用启用
			isDisabled(sid, url) {
				pubObj.httpRequest(this, {
					method: 'PUT',
					url: [url, sid],
					success(result) {
						this.$message.success(result.message);
						this.$emit('refresh');
					}
				})
			},
			// 禁用
			handleDisabled() {
				pubObj.showMessage(this, {
					title: '禁用提示',
					content: '确定要禁用该用户?',
					confirm() {
					    this.isDisabled(this.userSid, 'userDisable')
					}
				})
			},
			// 启用
			handleActive(sid) {
			    pubObj.showMessage(this, {
                    title: '启用提示',
                    content: '确定要启用该用户?',
                    confirm() {
                        this.isDisabled(this.userSid, 'userEnable')
                    }
                })
			}
		}
	}
</script>

<style>

</style>
