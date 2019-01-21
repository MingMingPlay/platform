<template>
	<div class="detail-item-wrap">
		<label :style="labelStyle">{{label}}</label>
		<span v-if="type === 'span'">{{value | check_null}}</span>
		<el-button type="text" v-else-if="type === 'btn'" @click="handleClick(value)">{{ value }}</el-button>
		<slot name="img"></slot>
	</div>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: 'span',
			},
			label: String,
			value: [String, Number, Boolean],
			labelWidth: {
				type: String,
				default: '64px',
			}
		},
		data() {
			return {
				labelStyle: {
					width: this.labelWidth,
				}
			}
		},
		methods: {
		    handleClick(val) { this.$emit('company-search', val); }
		},
		filters: {
			check_null(val) {
				if(!val || val === '') return '--';
				else return val;
			}
		}
	}
</script>

<style>
	.detail-item-wrap {
		padding: 6px 0;
		margin-bottom: 16px;
		overflow: hidden;
	}
	.detail-item-wrap label {
		display: inline-block;
		float: left;
		text-align: right;
	}
	.detail-item-wrap span {
		margin-left: 10px;
		line-height: 24px;
		word-break: break-word;
	}
	.detail-item-wrap .el-button--text {
        padding: 0;
        padding-top: 4px;
    }
</style>