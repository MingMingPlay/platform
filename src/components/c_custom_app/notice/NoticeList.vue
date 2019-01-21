<template>
	<div class="nt-contai">
		<div class="nt-noticeBtn">
			<el-button @click="releaseNotice" type="primary">发布公告</el-button>
		</div>
		<div class="nt-table">
			<el-table v-loading.body="loading" :data="tableData" stripe>
				<el-table-column v-for="(im,index) in tColumn" :key="index" 
					:prop="im.prop" :label="im.label" :width="im.width">		
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="previewNotice(scope.row)" type="text">预览</el-button>
						<el-button @click="diaDelete(scope.row)" type="text">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<list-pagination
                v-if="true"
                :pagination="pagination"
                @paginationChange="paginationChange">
            </list-pagination>			
		</div>
		<el-dialog title="提示" size="tiny" :visible.sync="dialogDelete">
			<p>
				<span v-if="showRed.show" style="color: red;">该公告正在展示,</span> 确定删除该公告吗？
			</p>
			<div slot="footer">
			    <el-button @click="dialogDelete = false">取 消</el-button>
			    <el-button type="primary" @click="comfirmDeleteNotice(showRed.nSid)">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import {bus} from '../../../assets/unit/public.js';
	import listPagination from '../../common/list-pagination.vue';
	import api from '@/assets/config/c-api.js';
	export default {
		components:{
			listPagination
		},
		data(){
			return {
				loading:true,
				tColumn:[
					{label:'序号',prop:'index',width:80},
					{label:'公告名称',prop:'name'},
					{label:'展示期',prop:'showTime'},
					{label:'可见角色',prop:'roleNames'},
					{label:'附件状态',prop:'existFile',width:100},
					{label:'下载次数',prop:'downloadNumber',width:100},					
				],
				tableData:[],
				pagination:{
			        pageIndex: 1,
			        pageSize: 10,
			        totalRow:0
			    },
				showRed:{show:false,nSid:''},
				dialogDelete:false,
			}
		},
		created(){
			//请求公告列表初始数据
			this.initTableData(this.pagination);
		},
		methods:{
			//初始化公告列表数据
			initTableData(pagination){
				const param={
					pageIndex:pagination.pageIndex,
					pageSize:pagination.pageSize
				}
				this.$http.get(['noticeList'],{params:param}).then(res=>{
					let tdata=res.status===200?res.data.data:[];
					let tableData=tdata.map((item,index)=>{
						item.index=(index+1)+(pagination.pageIndex-1)*10;
						item.roleNames=Array.isArray(item.roleNames)
							?item.roleNames.join('，'):item.roleNames;
						item.existFile=item.existFile?'有':'无';
						return item;
					})
					this.tableData=tableData;
					this.pagination=res.data.pagination||this.pagination;
					this.loading=false;
				},err=>{
					console.log(err)
				})
			},
			//列表预览公告
			previewNotice(val){
				let param=Object.assign(val,{visibleFooter:false,nType:'listPre'});
				bus.$emit('notice-dialog',param);
			},
			//删除公告
			diaDelete(row){
				this.showRed={show:this.isValid(row.showTime),nSid:row.sid};
				this.dialogDelete=true;
			},
			//发布公告
			releaseNotice(){
				this.$router.push({
					path: '/c_custom_app/release-notice/addNotice',
				})
			},
			//分页
			paginationChange(pagination){
				console.log(pagination);
				this.loading=true;
				this.initTableData(pagination);
			},
			//删除公告确认
			comfirmDeleteNotice(sid){
				this.$http.delete(['removeNotice',sid]).then(res=>{
					console.log(res);
					if(res.status===200){
						this.$message({
							showClose: true,
					        message: '公告删除成功！',
					        type: 'success'
						})
						this.dialogDelete=false;
						let pagination=this.tableData.length>1?this.pagination:{
							pageIndex:(this.pagination.pageIndex-1)||1,
							pageSize:this.pagination.pageSize
						};
						this.initTableData(pagination);
					}else{
						this.$message({
							showClose: true,
					        message: '公告删除失败！',
					        type: 'warning'
						})
					}					
				},err=>{
					console.log(err);
				})
			},
			//判断公告是否有效
			isValid(date){
				let d=new Date();
				let valid=date.split('至')[1].match(/\d+/g).join('');
				let now=[
					d.getMonth()+1,
					d.getDate(),
					d.getHours(),
					d.getMinutes(),
					d.getSeconds()
				].join('');
				if(parseInt(now)<=parseInt(valid)){
					return true;
				}else{
					return false;
				}
			},
		},
	}
</script>
<style>
	.nt-contai .el-dialog--tiny{
		width: 450px;
	}
	.nt-noticeBtn{
		padding-right: 15px;
		overflow: hidden;
	}
	.nt-noticeBtn button{
		float: right;
	}
	.nt-table{
		padding-top: 15px;
	}
</style>