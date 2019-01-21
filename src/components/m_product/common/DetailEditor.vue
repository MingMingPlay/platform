<template>
    <div class="ueditor" v-loading="editorUpLoading">
        <div class="editor-upload-img" id="editor-upload-img">
            <label class="button-img">
                <input
                    style="display: none;"
                    type="file"
                    multiple
                    ref="editorImageFile"
                    @change="editorUpload">
            </label>
        </div>
        <VueUeditor
            ueditorPath="/static/ueditor1_4_3_3/"
            @ready="editorReady"
            :ueditorConfig="editorConfig">
        </VueUeditor>
    </div>
</template>
<script>
    /**
     * @name    双向绑定编辑器组件
     * */
    import VueUeditor from 'vue-ueditor'
    import { pubObj } from '../../../assets/unit/public.js'
    export default {
        props: {
            value: ''
        },
        data() {
            return {
                editor: '', // 存放实例化的UEditor实例，方便this调用
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
            }
        },
        components: {
            VueUeditor
        },
        watch: {
            value(){
                if(this.value && this.editor && this.value !== this.editorContent){
                    this.editor.setContent(this.value);
                }
            }
        },
        methods: {
            editorUpload() {
                // 自定义编辑器上传图片
                let input = document.getElementById('editor-upload-img').getElementsByTagName('input')[0];
                let files = input.files;
                if(files.length > 10){
                    this.$message.warning('单次最多支持上传 10 张图片');
                    return false;
                }
                pubObj.uploadValid(files, files => {
                    let formData = new FormData();
                    for (let i=0;i<files.length;i++){
                        formData.append('file' + i, files[i]);
                    }
                    this.editorUpLoading = true;
                    this.$http.post(this.$api.attachment + 'ProductDetail', formData)
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
                }, error => {
                    this.$message.error(error.msg)
                });
            },
            editorReady (editor) { // 编辑器相关
                // 初始化后把自定义的上传按钮移动的编辑器的DOM内部
                let uploadButton = document.getElementById('editor-upload-img');
                uploadButton.style.display = 'block';
                let eduiToolbar = document.getElementsByClassName('edui-toolbar')[0];
                eduiToolbar.appendChild(uploadButton);

                this.editor = editor;
                if(this.value){
                    this.editor.setContent(this.value);
                }
                this.editor.addListener('contentChange',() => {
                    this.editorContent = this.editor.getContent();
                    this.$emit('input', this.editorContent);
                });
                // 监听插入图片之前，如果需要做什么事
                // this.editor.addListener('beforeinsertimage',(a, b) => {});
            },
        }
    }
</script>
<style>

</style>
