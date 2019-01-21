<template>
    <el-upload
        :ref="uploadName"
        list-type="picture-card"
        :action="action"
        :headers="headers"
        :file-list="fileList"
        :before-upload="uploadBefore"
        :on-success="uploadSuccess"
        :on-remove="uploadRemove"
        :on-error="uploadError">
        <i class="el-icon-plus"></i>
    </el-upload>
</template>

<script>

    import api from '../../assets/config/m-api.js'

    export default {
        model: {
            prop: 'imageSid',
            event: 'changed'
        },

        props: {
            name: String,
            imageSid: String,
            actionType: String,
            actionPath: String
        },

        data() {
            return {
                headers: {
                    'api-ver': '1.0.0',
                    'token': sessionStorage.token,
                    'charset': 'UTF-8'
                }
            }
        },

        computed: {
            uploadName() {
                let defaultName = 'uploader';
                const name = this.name;
                if(name) {
                    defaultName = name;
                }

                return defaultName;
            },

            fileList() {
                let ret = [];
                const path = this.actionPath;
                if(!path) return ret;
                let item = {};
                item.url = path;
                ret[0] = item;
                return ret;
            }
        },

        created() {
            this.action = api.attachment + this.actionType;
        },

        watch: {
            fileList(arr) {
                if(arr.length) this.$refs[this.uploadName].$el.lastChild.style.display = 'none';
                else this.$refs[this.uploadName].$el.lastChild.style.display = 'inline-block';
            }
        },

        methods: {
            uploadBefore(file) {
                // 图片格式是否正确
                let bool = null;
                // 获取图片的后缀名
                const dotIndex = file.name.lastIndexOf('.');
                const suffixOfImage = file.name.slice(dotIndex+1).toLowerCase();
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
            },
            uploadSuccess(res, file, fileList) {
                this.$refs[this.uploadName].$el.lastChild.style.display = 'none';
                this.$emit('changed', res.data[0].sid);
                // 激励方案3
                this.$emit('get-path', res.data[0].path);
            },
            uploadRemove(file, fileList) {
                this.$refs[this.uploadName].$el.lastChild.style.display = 'inline-block';
                this.$emit('changed', null);
                // 激励方案3
                this.$emit('get-path', null);
            },
            uploadError(err, file, fileList) {
                this.$message.error(err);
            }
        }
    }
</script>

<style>

</style>
