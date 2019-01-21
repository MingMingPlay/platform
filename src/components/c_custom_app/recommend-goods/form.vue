<template>
	<el-dialog :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
		<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
			<el-form-item label="商品编码" prop="code">
			    <el-input v-model="dialogForm.code" disabled></el-input>
			</el-form-item>
			<el-form-item label="商品名称" prop="title">
                <el-input v-model="dialogForm.title" disabled></el-input>
            </el-form-item>
			<el-form-item label="商品图片" prop="mainImagePath">
				<img :src="dialogForm.mainImagePath" alt="图片" style="width: 100px; height: 100px; vertical-align: top;" />
			</el-form-item>
			<el-form-item label="商品售价" prop="sellingPrice">
                <el-input v-model="dialogForm.sellingPrice" disabled></el-input>
            </el-form-item>
            <el-form-item label="渠道" prop="channelSid">
                <el-select v-model="dialogForm.channelSid" placeholder="请选择">
                    <el-option
                        v-for="item in channels"
                        :key="item.sid"
                        :label="item.name"
                        :value="item.sid">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="rank">
                <el-input v-model.number="dialogForm.rank" placeholder="排序"></el-input>
            </el-form-item>
		</el-form>
		<div slot="footer">
		    <div style="text-align: center;">
		        <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSubmit('dialogForm')" v-text="parentObj.saveText"></el-button>
		    </div>
		</div>
	</el-dialog>
</template>

<script>
    // mixin
    import DialogForm from '../../mixin/dialog-form.vue'
    // js
	import { pubObj, bus } from '../../../assets/unit/public.js'
	
	export default {
		mixins: [DialogForm],
		
		data() {
		    const rules = {
		        channelSid: [{
                    required: true,
                    message: '请选择渠道',
                    trigger: 'blur'
                }],
                rank: [{
                    required: true,
                    message: '请输入排序'
                }, {
                    type: 'number',
                    max: 500,
                    message: '请输入0-500的数字'
                }]
            };
			return {
				dialogForm: {
				    channelSid: null,
				    rank: 0
				},
				rules: rules,
				channels: {},
				mxDialogForm: {
                    name: 'recommend-dialog',
                    url: ['recommendGoods'],
                }
			}
		},
		
		watch: {
		    'parentObj.row': function(obj) {
		        Object.assign(this.dialogForm, obj);
		    }
		},
		
		methods: {
		    // 重置mixin的方法
		    dialogDetail() {}
		},
		
		beforeMount() {
			pubObj.httpRequest(this, {
                url: this.$api.channel,
                success(result) {
                    this.channels = result.data;
                }
            })
		}
		
	}
</script>
