<template>
	<div @click="handleDisplay">
		<el-dialog :title="parentObj.title" v-model="dialogVisible" :close-on-click-modal="false" @close="dialogClose('dialogForm')">
			<el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
				<el-form-item label="品类等级" v-if="parentObj.type == 1">
					<el-select v-model="categoryGrade" @change="handleChangeGrade">
						<el-option label="一级品类" :value="1"></el-option>
						<el-option label="二级品类" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属品类" v-if="categoryGrade === 2 || dialogForm.parentName">
				    <el-select v-model="dialogForm.parentSid" placeholder="请输入并选择" :remote-method="handleSearchCategory" clearable filterable remote>
                        <el-option
                            v-for="(item,index) in selectData"
                            :key="index"
                            :label="item.name"
                            :value="item.sid">
                        </el-option>
                    </el-select>
					<!--<tree-input 
					    :selectData="treeData" 
					    :defaultVal="dialogForm.parentName" 
					    @nodeClick="handleNodeClick">
					</tree-input>-->
				</el-form-item>
				<el-form-item label="品类名称" prop="name">
					<el-input v-model="dialogForm.name"></el-input>
				</el-form-item>
				<el-form-item label="品类图片" prop="logoSid">
				    <image-upload 
				        v-if="dialogVisible"
                        v-model="dialogForm.logoSid"
                        action-type="CategoryLogo"
                        :action-path="dialogForm.logoPath">
                    </image-upload>
					<div style="font-size: 12px;color: #F43838;margin-top: 4px;">建议图片尺寸148*148</div>
				</el-form-item>
				<el-form-item label="排序" prop="rank">
					<el-slider v-model="dialogForm.rank" show-input :max="99" :show-tooltip="false"></el-slider>
					<div style="font-size: 12px;">数字越大排序越靠前</div>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input type="textarea" v-model="dialogForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogSubmit('dialogForm')" v-text="parentObj.saveText"></el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	// child
	import TreeInput from '../../common/jkc-treeInput.vue'
    import ImageUpload from '../../common/image-upload.vue'
    // mixin
    import DialogForm from '../../mixin/dialog-form.vue'
    // js
	import api from '../../../assets/config/c-api.js'
	import { pubObj, bus } from '../../../assets/unit/public.js'

	export default {
	    components: { TreeInput, ImageUpload },
		mixins: [DialogForm],
		data() {
		    const rules = {
                name: [{
                    required: true,
                    message: '品类名称不能为空',
                    trigger: 'blur'
                }, {
                    validator: this.validName,
                    message: '该品类名称已被占用',
                    trigger: 'blur'
                }],
                logoSid: [{
                    required: true,
                    message: '请上传品类图片',
                    trigger: 'blur'
                }],
                rank: [{
                    required: true,
                    type: 'number',
                    message: '排序值不能为空',
                    trigger: 'blur'
                }],
                description: [{
                    max: 500,
                    message: '品类描述不能超过500字',
                    trigger: 'blur'
                }]
            };
			return {
			    selectData: [],
				dialogForm: {
				    rank: 1,
				    sid: null,
                    name: null,
                    logoSid: null,
                    logoPath: null,
                    parentSid: null,
                    parentName: null,
                    description: null,
                },
				rules: rules,
				categoryGrade: 1, // 默认一级品类
				treeData: [],
				mxDialogForm: {
				    url: api.category,
                    name: 'category-dialog',
                }
			}
		},
		
		created() {
		    this.$nextTick(() => {
		        this.handleSearchCategory();
		    })
		},
		
		methods: {
		    handleSearchCategory(val) {
		        pubObj.httpRequest(this, {
                    url: this.$api.category,
                    params: { q: val },
                    success(result) {
                        this.selectData = result.data;
                    }
                })
		    },
			// 拦截返回数据
//			interceptors(result) {
//				if(!result.parentName) this.sliceSelectData(2);
//				else return result;
//				return result;
//			},
			// 隐藏自定义的树形选择框
			handleDisplay(event) {
				pubObj.display(this, event)
			},
			// 选择所属分类，添加属性
			handleNodeClick(sid) {
				this.dialogForm.parentSid = sid;
			},
			handleChangeGrade(val) {
				this.sliceSelectData(val)
			},
			sliceSelectData(val) {
				// 防止子组件，无意修改父组件的数据；
				// 通过临时拷贝一份数据，通过Object.assign()移除数据的getter和setter
				var tempData = [];
				this.selectData.forEach((item) => {
					tempData.push(Object.assign({}, item));
				})
				if(val === 1) return;
				else if(val === 2) {
					tempData.forEach((item) => {
						item.children = null;
					})
					this.treeData = tempData;
				}
			},
			// ------yjc start------
			validName(rule, value, callback) { // 验证名称是否重复
				let param = {
					name: value,
					sid: this.dialogForm.sid
				};
				this.$http.get(api.category + 'duplicate', {
						params: param
					})
					.then(result => {
						if(result.body.code === 200 && result.body.data) {
							callback(new Error(rule.message))
						} else {
							callback();
						}
					}).catch(error => {
						callback();
					})
			},
			// ------yjc end------
		}
	}
</script>

<style>

</style>
