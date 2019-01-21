<template>
	<div class="nt-home">
		<jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>
		<router-view></router-view>
		<el-dialog title="公告预览" :visible.sync="dialogFormVisible">
			 <div class="content-con">
                <p>
                	<img v-if="someNotice.haveRead!==undefined&&!someNotice.haveRead" 
                		src="../../../assets/img/new.png" height="18">
                    <span>发布时间：{{someNotice.createdTime}}</span>
                    <span>公告名称：{{someNotice.name}}</span>
                    <span>发布人：{{someNotice.publisher}}</span>
                    <a v-if="someNotice.existFile" :href="someNotice.attachmentPath" 
                    	download="" target="_blank">
                    	<el-button type="primary">下载附件</el-button>
                    </a>
                </p>
                <div>
					{{someNotice.content}}
                </div>
            </div>
			<div v-if="visibleFooter" slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">返回修改</el-button>
			    <el-button @click="commitRelease">确认发布</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import JkcBreadcrumb from '../../common/jkc-breadcrumb.vue';
	import {bus} from '../../../assets/unit/public.js';
	import {formatDate} from '../../../assets/unit/formatDate.js';
	export default {
		components: {
			JkcBreadcrumb,
		},
		data(){
			return {
				crumbs: [{
						title: '多版本管理',
					},
					{
						title: '发布公告',
					},
				],
        		dialogFormVisible: false,
        		visibleFooter:true,
        		someNotice:{},
        		releaseNOtice:{},
				form: {
		          	name: '',
		          	region: '',
		          	date1: '',
		          	date2: '',
		          	delivery: false,
		          	type: [],
		          	resource: '',
		          	desc: ''
		        },
		        formLabelWidth: '120px'
			}
		},
		created(){
			console.log('abc');
		},
		mounted(){
			bus.$on('notice-dialog',(val)=>{
				console.dir(val.sid);
				this.visibleFooter=val.visibleFooter;
				this.dialogFormVisible=true;

				//判断是列表预览还是新增预览
				if(val.nType==='listPre'){
					this.$http.get(['previewNotice',val.sid])
					.then(res=>{
						let ntdata=res.status===200?res.data.data:[];
						this.someNotice=ntdata;
					},err=>{
						console.log(err);
					})
				//新增预览
				}else if(val.nType==='addPre'){
					this.releaseNOtice=val;
					let previewNotice={
						createdTime:formatDate(new Date()),
						name:val.name,
						publisher:val.publisher,
						attachmentPath:val.attachmentSid[0].path,
						existFile:val.attachmentSid.length>0?true:false,
						haveRead:false,
						content:val.content,
					}
					console.log(previewNotice,'------')
					this.someNotice=previewNotice;
				}
				
			})
		},
		beforeDestroy(){
			console.log('bcd');
			bus.$off('notice-dialog')
		},
		methods:{
			commitRelease(){
				const param=this.releaseNOtice;
				param.startTime=formatDate(param.showTime[0]);
				param.endTime=formatDate(param.showTime[1]);
				param.attachmentSid=param.attachmentSid?param.attachmentSid[0].sid:'';
				const params=JSON.parse(JSON.stringify(param));
				delete params.showTime;
				//以上构造请求数据
				this.$http.post(['creatNotice'],params).then(res=>{
					if(res.status===200){
						this.dialogFormVisible=false;
						this.$message({
							showClose: true,
					        message: '公告发布成功！',
					        type: 'success'
						})
						setTimeout(()=>{
							this.$router.push({path: '/c_custom_app/release-notice'})
						},300)
					}else{
						this.$message({
							showClose: true,
					        message: '公告发布失败！',
					        type: 'warning'
						})
					}
				},err=>{
					console.log(err);
				})
			}
		},
	}
</script>
<style>
	.nt-home .el-dialog--small,.nt-home .el-dialog--small .el-dialog__body{
		width: 900px;
	}
	.nt-home .el-dialog__wrapper{
		overflow-x: hidden;
	}
	.content-con{
        background: #f4dcdc;
        margin-top: 10px;
        margin-bottom: 25px;
    }
    .content-con>p{
        padding: 5px 15px;
        border: 1px solid #f2a4a4;
        height: 35px;
    }
    .content-con>p>span{
        margin-right: 55px;
    }
    .content-con button{
        float: right;
        margin-top: -2.5px;
    }
    .content-con>div{
        border: 1px solid #f2a4a4;
        border-top: none;
        padding: 10px 15px;
    }
    .dialog-footer{
    	text-align: center;
    }
    .dialog-footer button{
    	width: 150px;
    	margin-right: 50px;
    }
</style>