<template>
</template>

<script>
	import { pubObj } from '../../assets/unit/public.js'

	export const submitForm = {
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.handleSave()
					} else {
						return false;
					}
				});
			}
		}
	}

	export const getFormDetail = {
		methods: {
			getFormDetail() {
				pubObj.httpRequest(this, {
					url: this.api + (this.aSid || this.$route.query.sid || ''),
					success(result) {
						if(typeof this.interceptors === 'function') result = this.interceptors(result);
						pubObj.formValueCover(this.dialogForm, result.data);
						if(this.uploadStatus) {
							for(let i in this.uploadStatus) {
								this.$set(this.uploadStatus, i, true)
							}
						}
					}
				})
			},
		}
	}

	export const getTableList = {
		methods: {
			getTableList() {
				pubObj.httpRequest(this, {
					url: this.api,
					params: this.form,
					success(result) {
						this.tableData = this.defaultValue(result.data);
						if(result.pagination) this.pagiTotal = result.pagination.totalRow;
						else this.pagiTotal = 0;
						this.$store.commit('refresh', 0);
					}
				})
			},
			defaultValue(data) {
				data.forEach((obj) => {
					Object.keys(obj).forEach((key) => {
						if(key.slice(-3).toUpperCase() === 'SID' || key.slice(-4).toUpperCase() === 'PATH') return false;
						else {
							if(obj[key] !== '' && obj[key]) return false;
							else obj[key] = '--';
						}
					})
				});
				return data;
			}
		}
	}
</script>

<style>

</style>
