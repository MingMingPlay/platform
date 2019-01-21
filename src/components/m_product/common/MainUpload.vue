<template>
    <div class="main-upload">
        <el-upload
            list-type="picture-card"
            multiple
            :action="uploadSpuApi"
            :headers="uploadHeader"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="uploadChange"
            :before-upload="beforeUpload"
            :file-list="value"
            :http-request="customUploadSelect"
            :class="{'hide-upload':uploadSwitch}"
            :style="{'display':'inline-block'}"
            v-loading="customUpLoading">
            <i class="el-icon-plus"></i>
        </el-upload>
        <div>
            <p v-for="item in images" style="width: 114px;text-align: center;display: inline-block;margin-right: 8px;">
                <span @click.prevent="changeMain(item)">
                    <el-radio v-model="item.main" :label="true">{{item.main?'主图':'设为主图'}}</el-radio>
                </span>
            </p>
        </div>
        <!-- 点击预览的dialog -->
        <el-dialog v-model="dialogVisible" size="tiny" title="商品图片">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div>默认第一张为主图，建议尺寸：1000x1000像素</div>
    </div>
</template>
<script>
    /**
     * @name    商品主图上传组件
     * */
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        props: {
            value: ''
        },
        data() {
            return {
                uploadSpuApi: this.$api.attachment + 'Product',
                uploadHeader: pubObj.getHttpHeader(),
                uploadSwitch: false,
                dialogVisible: false,
                dialogImageUrl: '',
                customUploadFiles: [],
                customUploadTimer: null,
                customUpLoading: false,
                fileList: null,     // 插件自带预览列表；存下方便上传失败时移除
                images: []
            }
        },
        watch: {
            value(){
                this.images = this.value;
                if(this.value.length === 5){
                    this.uploadSwitch = true;
                }
            }
        },
        methods: {
            handlePictureCardPreview (file){
                // 点击已上传图片的预览按钮
                this.dialogVisible = true;
                this.dialogImageUrl = file.url;
            },
            handleRemove (file, fileList){
                // 点击已上传图片的删除按钮
                if(!file){
                    return false;
                }
                for(let i=0;i<this.images.length;i++){
                    if(file && this.images[i].imgSid === file.imgSid){
                        this.images.splice(i,1);
                    }
                }
                setTimeout(() => {
                    this.uploadSwitch = false;
                },600)
                this.$emit('input', this.images);
            },
            changeMain (item){
                // 切换主图
                this.images.forEach(value => {
                    if(value.imgSid === item.imgSid){
                        value.main = true;
                    }else {
                        value.main = false;
                    }
                });
                let mainIndex = 0;
                for(let i=0;i<this.images.length;i++){
                    if(this.images[i].main && i != 0){
                        mainIndex = i;
                        break;
                    }
                }
                if(mainIndex){
                    setTimeout(() => {
                        let a = this.images.splice(mainIndex, 1)[0];
                        this.images.unshift(a);
                        console.log(this.images)
                        this.$emit('input', this.images);
                    },150);
                }
            },
            beforeUpload (file){
                // 上传之前，判断新增加号是否显示
                if(this.images.length + this.customUploadFiles.length === 5){
                    this.$message.warning(`最多上传5张商品图片，还可以上传${5 - this.images.length}张`);
                    this.uploadSwitch = true;
                    return false;
                }
                this.uploadSwitch = true;
            },
            uploadChange (file, fileList){
                // 有图片上传时会触发
                this.fileList = fileList;
            },
            customUploadSelect(fileObject){
                // 自定义上传选择图片后
                if(this.images.length + this.customUploadFiles.length === 5){
                    this.$message.warning(`最多上传5张商品图片，还可以上传${5 - this.images.length}张`);
                    return false;
                }
                this.customUploadFiles.push(fileObject.file);
                clearTimeout(this.customUploadTimer);
                this.customUploadTimer = setTimeout(() => {
                    this.customUpload(this.customUploadFiles);
                },200)
            },
            customUpload(data){
                // 自定义商品图片上传
                pubObj.uploadValid(data, files => {
                    let formData = new FormData();
                    for (let i=0;i<files.length;i++){
                        formData.append('file' + i, files[i]);
                    }
                    this.customUpLoading = true;
                    this.$http.post(this.$api.attachment + 'product', formData)
                        .then((response) =>{
                            this.customUpLoading = false;
                            this.customUploadFiles = [];
                            if(response.body.code === 200){
                                if(this.images.length === 0){
//                                    this.$refs.basisForm2.resetFields();
                                }
                                for(let i=0;i<response.body.data.length;i++){
                                    let obj = {
                                        imgSid: response.body.data[i].sid,
                                        url: response.body.data[i].path,
                                        main: false,
                                    };
                                    this.images.push(obj);
                                }
                                if(this.images.length === 5){
                                    this.uploadSwitch = true;
                                }else {
                                    this.uploadSwitch = false;
                                }
                                console.log(this.images)
                                this.$emit('input', this.images);
                            }else {
                                this.formatFileList();
                                this.$message({type:'warning',message: '上传失败！'});
                            }
                        }).catch((error) => {
                        this.customUploadFiles = [];
                        this.customUpLoading = false;
                        this.formatFileList();
                        this.$message({type:'warning',message: '上传失败！'});
                    })
                }, error => {
                    // 不满足上传条件时的回调
                    this.$message.error(error.msg);
                    this.formatFileList();
                    this.customUploadFiles = [];
                });
            },
            formatFileList(){
                // 方便失败或不满足条件时，及时清除没有上传的图片
                for(let i=0;i<this.fileList.length;i++){
                    if(!this.fileList[i].imgSid){
                        this.fileList.splice(i, 1);
                        i--;
                    }
                }
                if(this.fileList.length < 5){
                    this.uploadSwitch = false;
                }
            }
        }
    }
</script>
<style>
.main-upload {

}
</style>
