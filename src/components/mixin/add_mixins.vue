<template>
</template>
<script>
    import api from '../../assets/config/m-api.js'
    import validator from '../../assets/unit/validator.js'
    // 校验商品标题
    export const mixin_validGoodsTitle = {
        data (){
            return {
                rules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },{
                        validator: validator.validStringLength,
                        length: 32,
                        message: '标题长度不能大于32个字符',
                        trigger: 'blur'
                    },{
                        validator: this.validGoodsTitle,
                        trigger: 'blur'
                    }],
                }
            }
        },
        methods: {
            validGoodsTitle (rule, value, callback){		// 验证商品标题是否重复
                let param = {
                    title: value,
                    merchantSid: this.merchantInfo.sid,
                    sid: this.$route.query.spuSid
                };
                this.$http.get(api.spu + 'validate', {params: param})
                    .then(result => {
                        if(result.body.code === 200 && result.body.data){
                            callback(new Error('不能添加商品标题重复的商品'))
                        } else {
                            callback();
                        }
                    }).catch(error => {
                    callback();
                    console.log(error)
                })
            },
        }
    }
    // 编辑器自定义上传图片和编辑器配置
    export const mixin_UEditor = {
        data(){
            return {
                editor: '', // 存放实例化的UEditor对象，方便this调用
                editorContent: '',
                editorUpLoading: false,
                editorConfig: {
                    toolbars: [
                        ['bold', 'italic', 'underline', 'strikethrough', 'forecolor', 'backcolor', 'justifyleft', 'justifyright', 'justifycenter', 'insertorderedlist', 'insertunorderedlist', 'blockquote', 'emotion', 'simpleupload', 'removeformat', 'rowspacingtop', 'rowspacingbottom', 'lineheight', 'paragraph', 'fontsize'],
                        ['inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols']
                    ],
                    enableAutoSave: false,
                    initialFrameWidth: 734,
                    initialFrameHeight: 400,
                    autoHeightEnabled: false,
                    imagePopup: true,
                    wordCount: false,
                },
                customUploadFiles: [],
                customUploadTimer: null,
                customUpLoading: false,
                fileList: null,     // 插件自带预览列表；存下方便上传失败时移除
            }
        },
        methods: {
            editorUpload() {		// 自定义编辑器上传图片
                let input = document.getElementById('editor-upload-img').getElementsByTagName('input')[0];
                let files = input.files;
                if(files.length > 10){
                    this.$message.warning('单次最多支持上传 10 张图片');
                    return false;
                }
                this.uploadValid(files, files => {
                    let formData = new FormData();
                    for (let i=0;i<files.length;i++){
                        formData.append('file' + i, files[i]);
                    }
                    this.editorUpLoading = true;
                    this.$http.post(this.mxUeditor.imgUploadApi, formData)
                        .then((result) =>{
                            this.editorUpLoading = false;
                            if(result.body.code === 200){
                                result.body.data.forEach(value => {
                                    this.editor.execCommand('insertimage', {
                                        src: value.path.replace('-w220','-w1080')
                                    });
                                });
                            }else {
                                this.$message.error(result.body.message);
                            }
                            input.value = null;
                        }).catch((error) => {
                        console.log(error)
                    })
                });
            },
            uploadValid(files, callback, errorCallback){  // 验证图片上传规则
                let suffixIsUrl = true;
                let isLt5Mb = true;
                let imgSize = 0;
                let types = ['png','gif','jpeg','jpg','bmp'];
                for (let i=0;i<files.length;i++){
                    if(types.indexOf(files[i].name.split('.')[1]) < 0){
                        suffixIsUrl = false;
                    }
                    if(files[i].size / 1024 / 1024 > 5){
                        isLt5Mb = false;
                    }
                    imgSize += files[i].size / 1024 / 1024;
                }
                if(!suffixIsUrl){
                    this.$message.error('您上传的图片格式不正确,请上传png,gif,jpeg,jpg,bmp格式的图片');
                    errorCallback && errorCallback();
                    return false;
                }
                if(!isLt5Mb) {
                    this.$message.error('单张图片大小不能超过 5 MB');
                    errorCallback && errorCallback();
                    return false;
                }
                if(imgSize > 10){
                    this.$message.error('单次上传图片总容量不能超过 10 MB');
                    errorCallback && errorCallback();
                    return false;
                }
                let imgNumber = 0;
                let img = new Image();
                img.src = window.URL.createObjectURL(files[imgNumber]);
                img.onload = () => {
                    if(img.width > 16300 || img.height > 16300){
                        this.$message.error('上传图片的尺寸不能超过16300像素*16300像素');
                        errorCallback && errorCallback();
                        return false;
                    }
                    imgNumber++;
                    if(imgNumber === files.length){
                        callback(files);
                        return false;
                    }
                    img.src = window.URL.createObjectURL(files[imgNumber]);
                };
                img.onerror = () => {
                    errorCallback && errorCallback();
                    this.$message.error('图片有误');
                }
            },
            beforeUpload (file){	// 上传之前，判断新增加号是否显示
                if(this.goodsBasis.spuImagesvo.length + this.customUploadFiles.length === 5){
                    this.$message.warning(`最多上传5张商品图片，还可以上传${5 - this.goodsBasis.spuImagesvo.length}张`);
                    this.uploadSwitch = true;
                    return false;
                }
                this.uploadSwitch = true;
            },
            uploadChange (file, fileList){  // 有图片上传时会触发
                this.fileList = fileList;
            },
            customUploadSelect(fileObject){     // 自定义上传选择图片后
                if(this.goodsBasis.spuImagesvo.length + this.customUploadFiles.length === 5){
                    this.$message.warning(`最多上传5张商品图片，还可以上传${5 - this.goodsBasis.spuImagesvo.length}张`);
                    return false;
                }
                this.customUploadFiles.push(fileObject.file);
                clearTimeout(this.customUploadTimer);
                this.customUploadTimer = setTimeout(() => {
                    this.customUpload(this.customUploadFiles);
                },200)
            },
            customUpload(data){     // 自定义商品图片上传
                this.uploadValid(data, files => {
                    let formData = new FormData();
                    for (let i=0;i<files.length;i++){
                        formData.append('file' + i, files[i]);
                    }
                    this.customUpLoading = true;
                    this.$http.post(api.attachment + 'product', formData)
                        .then((response) =>{
                            this.customUpLoading = false;
                            this.customUploadFiles = [];
                            if(response.body.code === 200){
                                if(this.goodsBasis.spuImagesvo.length === 0){
                                    this.$refs.basisForm2.resetFields();
                                }
                                for(let i=0;i<response.body.data.length;i++){
                                    let obj = {
                                        imgSid: response.body.data[i].sid,
                                        url: response.body.data[i].path,
                                        main: false,
                                    };
                                    this.goodsBasis.spuImagesvo.push(obj);
                                }
                                if(this.goodsBasis.spuImagesvo.length === 5){
                                    this.uploadSwitch = true;
                                }else {
                                    this.uploadSwitch = false;
                                }
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
                }, () => {
                    // 不满足上传条件时的回调
                    this.formatFileList();
                    this.customUploadFiles = [];
                });
            },
            formatFileList(){   // 方便失败或不满足条件时，及时清除没有上传的图片
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

    // 导出商品列表Excel
    export const mixin_exportExcel = {
        methods: {
            exportExcel(type){  // 导出商品列表
                let query = '';
                for (let key in this.searchForm){
                    query += '&' + key + '=' + this.searchForm[key];
                }
                window.open(this.$api.spuExcel.url + '?type=' + type + query)
            },
        }
    }
</script>
<style>

</style>
