<template>
    <div class="test-demo">
        <image-upload 
            action-name="logoSid"
            action-type="companyLogo"
            :init-path="form.path"
            @success="handleUploadSuccess"
            @remove="handleUploadRemove">
        </image-upload>
        <image-upload 
            action-name="shopSid"
            action-type="companyLogo"
            @success="handleUploadSuccess"
            @remove="handleUploadRemove">
        </image-upload>
    </div>
</template>

<script>
    
    import ImageUpload from './common/image-upload.vue'
    
    export default {
        components: { ImageUpload },
        data() {
            return {
                form: {
                    path: 'http://img.yanwei365.com/12/20171021/22020.jpg-w220'
                }
            }
        },
        methods: {
            handleUploadSuccess(obj) {
                this.form[obj.name] = obj.sid;
                console.log(this.form);
            },
            handleUploadRemove(name) {
                this.form[name] = null;
                console.log(this.form);
            }
        }
    }
    
</script>

<style>

</style>