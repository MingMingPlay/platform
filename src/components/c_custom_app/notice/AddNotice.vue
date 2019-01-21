<template>
	<div class="nt-addCon">
		<p style="text-align: right;padding-right: 55px;"><a href="#/c_custom_app/release-notice">
			<el-button @click="backRelease" type="text"><<返回</el-button>
		</a></p>
		<div class="nt-add">
			<h4>新增公告</h4>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="nt-addform">
				<el-col :span="8">
					<el-form-item label="公告名称" prop="name">
					    <el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="展示期" prop="showTime">
					    <el-date-picker
					      	v-model="ruleForm.showTime"
					      	type="datetimerange"
					      	:picker-options="pickerOptions"
					      	placeholder="选择时间范围"
					      	align="right">
					    </el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="公告内容" prop="content">
					    <el-input type="textarea" :rows="5" v-model="ruleForm.content"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item label="可见角色" prop="roleSids">
					    <el-select v-model="ruleForm.roleSids" multiple placeholder="请选择" 
					    	style="width: 80%;">
						    <el-option
						      v-for="item in options"
						      :key="item.sid"
						      :label="item.name"
						      :value="item.sid">
						    </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="发布人" prop="publisher">
					    <el-input v-model="ruleForm.publisher"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="上传附件" prop="attachmentSid">
						<el-upload
						  	:action="fileUp"
						  	:headers="headers"
						  	:on-success="successUpfile"
						  	:on-remove="handleRemove"
						  	:file-list="fileList">
						  	<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
				</el-col>
				<el-col :span="24" style="margin-top: 25px;">
					<el-form-item class="nt-preRelease">
					    <el-button type="primary" @click="previews">预览</el-button>
					    <el-button type="primary" @click="release">发布</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</div>
	</div>
</template>
<script>
	import {bus} from '../../../assets/unit/public.js';
	import {formatDate} from '../../../assets/unit/formatDate.js';
	export default {
		data(){
			return {
				headers: {
                    'api-ver': '1.0.0',
                    'token': sessionStorage.token,
                    'charset': 'UTF-8'
                },
				ruleForm:{
					name: '',
					showTime:[],
			        content:'',
			        roleSids:[],
			        publisher:'惠汇管理员',
			        attachmentSid:'',			          
				},
				rules: {
			        name: [
			            { required: true, message: '请输入公告名称', trigger: 'blur' },            
			       	],
			       	showTime: [
			            {type: 'array',required: true, message: '请输入公告展示期', trigger: 'change' },
			       	],
			       	roleSids: [
			            {type: 'array',required: true, message: '请输入可见角色', trigger: 'change' }
			       	],
			       	publisher: [
			            { required: true, message: '请输入发布人', trigger: 'blur' },            
			       	],
			        content: [
			            { required: true, message: '请填写公告内容', trigger: 'blur' }
			        ]
		        },
		        fileUp:this.$api.fileUp.url,
		        fileList: [],
		        options: [],
		        pickerOptions: {
			        shortcuts: [{
			            text: '最近一周',
			            onClick(picker) {
			            	const start = new Date();
			              	const end = new Date();
			              	end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
			              	picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近一个月',
			            onClick(picker) {
			            	const start = new Date();
			              	const end = new Date();
			              	end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
			              	picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近三个月',
			            onClick(picker) {
			            	const start = new Date();
			              	const end = new Date();
			              	end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
			              	picker.$emit('pick', [start, end]);
			            }
			        }]
        		},
			}
		},
		created(){
			//获取权限角色数据
			this.$http.get(['roleList']).then(res=>{
				console.log(res);
				const options=res.status===200?res.data.data:[];
				this.options=options;
			},err=>{
				console.log(err);
			})
		},
		methods:{
			//预览上传附件
			successUpfile(response, file, fileList){
				console.log(response,fileList);
				this.fileList=[
						Object.assign(response.data[0],{name:fileList[fileList.length-1].name}),
					];
			},
			//删除附件
			handleRemove(file, fileList){
				console.log(file,fileList);
				this.fileList=fileList;
			},
			//预览公告
			previews(){
				this.$refs.ruleForm.validate((valid) => {
					console.log(this.fileList,'bbbbbbbbbbbbbbb')
					if (valid) {
						//let attachmentSid=this.fileList[0]?this.fileList[0].sid:'';
						let param=Object.assign(this.ruleForm,{
								visibleFooter:true,
								nType:'addPre',
								attachmentSid:this.fileList,
							});
						console.log(param,'aaaaaaaaaaaa');
						bus.$emit('notice-dialog',param);
					}else{
						this.$message({
							showClose: true,
					        message: '请检查必填信息哦！',
					        type: 'warning'
						})
					}
				})
			},
			//发布公告
			release(){
				//验证信息是否完善
				this.$refs.ruleForm.validate((valid) => {
			        if (valid) {
			            const param=this.ruleForm;
						param.startTime=formatDate(param.showTime[0]);
						param.endTime=formatDate(param.showTime[1]);
						param.attachmentSid=this.fileList[0]?this.fileList[0].sid:'';
						let params=JSON.parse(JSON.stringify(param));
						delete params.showTime;
						console.log(params,'------------------')
						//以上构造请求数据
						this.$http.post(['creatNotice'],params).then(res=>{
							if(res.status===200){
								this.$message({
									showClose: true,
							        message: '公告发布成功！',
							        type: 'success'
								})
								setTimeout(()=>{
									this.$router.push({path: '/c_custom_app/release-notice'})
								},300)
							}
						},err=>{
							console.log(err);
						})
			        } else {
			            this.$message({
							showClose: true,
					        message: '请检查必填信息哦！',
					        type: 'warning'
						})
			        }
		        })
				
			},
			//返回公告列表页
			backRelease(){
				this.$router.push({
					path: '/c_custom_app/release-notice',
				})
			}
		}
	}
</script>
<style>
	.nt-addCon{
		position: relative;
	}
	.nt-add{
		width: 900px;
		margin: auto;
		padding: 15px;
	}
	.nt-add>h4{
		padding: 5px 15PX;
		border-bottom: 1px solid #DDDDDD;
	}
	.nt-addform{
		margin-top: 15px;
		padding: 15px;
		overflow: hidden;
	}
	.nt-preRelease{
		text-align: center;
	}
	.nt-preRelease button{
		width: 150px;
		margin-right: 50px;
	}
</style>