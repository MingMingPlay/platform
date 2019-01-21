<template>
    <div class="brush-detail">
        <jkc-breadcrumb :crumbs="crumbs"></jkc-breadcrumb>

        <div class="detail-title">评价刷单</div>

        <div class="detail-wrap" v-loading="loading">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="124px">
                <el-form-item label="商品编号" v-if="isAdd">
                    <el-input v-model="searchCode" placeholder="请输入商品编号"></el-input>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
                <el-form-item label="商品编号">
                    <span>{{goodsDetail.code || '--'}}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                    <span>{{goodsDetail.title || '--'}}</span>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <span>{{goodsDetail.shopName || '--'}}</span>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" :disabled="!isAdd" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="商品评分">
                    <el-rate
                        v-model="form.productScore"
                        :disabled="!isAdd">
                    </el-rate>
                </el-form-item>
                <el-form-item label="卖家服务态度评分">
                    <el-rate
                        v-model="form.serverScore"
                        :disabled="!isAdd">
                    </el-rate>
                </el-form-item>
                <el-form-item label="卖家发货速度评分">
                    <el-rate
                        v-model="form.sendScore"
                        :disabled="!isAdd">
                    </el-rate>
                </el-form-item>
                <el-form-item label="物流公司服务评分">
                    <el-rate
                        v-model="form.logisticsScore"
                        :disabled="!isAdd">
                    </el-rate>
                </el-form-item>
                <el-form-item label="评价内容" prop="content">
                    <el-input type="textarea" :rows="7" v-model="form.content" resize="none" :disabled="!isAdd" :maxlength="250"></el-input>
                </el-form-item>
                <el-form-item label="晒单" v-if="isAdd || (!isAdd && this.form.commentPic.length > 0)">
                    <el-upload
                        :class="{'upload-show': uploadIsShow, 'show-img': !isAdd}"
                        :action="uploadApi"
                        :headers="uploadHeader"
                        list-type="picture-card"
                        :on-success="handleSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :before-upload="beforeAvatarUpload"
                        :file-list="fileList"
                        v-loading="customUpLoading">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" size="tiny">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item v-if="isAdd">
                    <el-button type="primary"  @click="submitForm" :loading="submitLoading">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import jkcBreadcrumb from '../../common/jkc-breadcrumb.vue'
    import { detailCrumbs } from './page-config.js'
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        data() {
            return {
                //面包屑
                crumbs: detailCrumbs,
                isAdd: this.$route.query.type === 'add',
                // 可查询的商品编号
                searchCode: '',
                goodsDetail: {
                    code: '',
                    title: '',
                    shopName: ''
                },
                //表单
                form:{
                    // 商品sid
                    productId: '',
                    // 商品code
                    productCode: '',
                    // 用户名
                    userName: '',
                    // 商品评分
                    productScore: 5,
                    // 卖家服务态度评分
                    serverScore: 5,
                    // 卖家发货速度
                    sendScore: 5,
                    // 物流公司评分
                    logisticsScore: 5,
                    // 评价内容
                    content: '',
                    // 评价晒图
                    commentPic: [],
                },
                rules:{
                    userName: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }]
                },
                uploadApi: this.$api.attachment + 'Comment',
                customUpLoading: false,
                dialogImageUrl: '',
                dialogVisible: false,
                uploadHeader: pubObj.getHttpHeader(),
                uploadIsShow: false,
                fileList: [],
                submitLoading: false,
                // 页面加载 loading
                loading: false
            }
        },
        components:{
            jkcBreadcrumb,
        },
        created(){
            if(!this.isAdd){
                this.uploadIsShow = true;
                this.crumbs[2].title = '刷单详情';
                this.getData();
            }else {
                this.crumbs[2].title = '新增刷单';
            }
        },
        methods: {
            //获取数据
            getData(){
                this.loading = true;
                this.$http.get(['memberProCommentDetail', this.$route.query.id])
                    .then((result) => {
                        this.loading = false;
                        if (result.body.code === 200) {
                            this.form = result.body.data;
                            for(let key in this.goodsDetail) {
                                this.goodsDetail[key] = this.form[key];
                            }
                            this.fileList = this.form.listPic.map(value => {
                                return {
                                    url: value
                                };
                            });
                        } else {
                            this.$message({type: 'warning', message: result.body.message})
                        }
                    }).catch((err) => {
                    console.log(err)
                })
            },
            // 查询商品
            handleSearch(){
                this.searchCode.trim();
                this.$http.get(this.$api.spu + 'coin/code/' + this.searchCode.trim())
                    .then(result => {
                        if(result.body.code === 200){
                            let data = result.body.data;
                            for(let key in this.goodsDetail){
                                this.goodsDetail[key] = data[key];
                            }
                            this.form.productId = data.sid;
                            this.form.productCode = data.code;
                        }else {
                            this.$message.warning(result.body.message)
                        }
                    })
            },
            handleSuccess(res, file, fileList) {
                if(res.code === 200){
                    this.fileList = fileList;
                    if(this.fileList.length >= 5){
                        this.uploadIsShow = true;
                    }
                }
            },
            handleRemove(file,fileList) {
                this.fileList = fileList;
                if(this.fileList.length < 5){
                    this.uploadIsShow = false;
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeAvatarUpload(file) {
                // 图片格式是否正确
                let bool = null;
                // 获取图片的后缀名
                const suffixOfImage = file.name.split('.')[1].toLowerCase();
                switch(suffixOfImage) {
                    case 'gif': ;
                    case 'jpeg': ;
                    case 'png': ;
                    case 'jpg': ;
                    case 'bmp': bool = true; break;
                    default: bool = false;
                }
                if(bool) {
                    const isLt5Mb = file.size / 1024 / 1024 < 5;
                    if(isLt5Mb) return true;
                    else {
                        this.$message.warning('上传图片大小不能超过 5MB!');
                        return false;
                    }
                } else {
                    this.$message.warning('您上传的图片格式不正确!');
                    return false;
                }
                if(this.fileList.length >= 4){
                    this.uploadIsShow = true;
                }
            },
            submitForm(){
                this.form.commentPic = [];
                if(this.fileList.length > 0){
                    this.fileList.forEach(value => {
                        this.form.commentPic.push(value.response.data[0].path)
                    })
                }
                if(!this.form.productId){
                    this.$message.warning('请输入商品编号来查询你需要评价的商品');
                    return false;
                }
                this.$refs.ruleForm.validate(valid => {
                    if(valid){
                        this.submitLoading = true;
                        this.$http.post(['memberProCommentBrush'], this.form)
                            .then(result => {
                                this.submitLoading = false;
                                if(result.body.code === 200){
                                    this.isAdd = false;
                                    this.uploadIsShow = true;
                                    this.$message.success(result.body.data);
                                }else {
                                    this.$message.error(result.body.message);
                                }
                            })
                    }
                })
            }
        }
    }
</script>
<style>
    .brush-detail .detail-wrap .el-input,.el-textarea{
        width: 300px;
    }
    .brush-detail .upload-show .el-upload--picture-card{
        display: none !important;
    }
    .brush-detail .show-img .el-upload-list__item-delete{
        display: none !important;
    }
</style>
